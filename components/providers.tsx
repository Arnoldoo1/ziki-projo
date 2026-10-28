"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  handshakeReducer,
  seedState,
  type HandshakeState,
  type HandshakeAction,
} from "@/lib/handshake";

const STORAGE_KEY = "ziki-handshake-v1";

type ApproveOptions = { remember?: boolean; conditions?: string[] };

type Store = HandshakeState & {
  hydrated: boolean;
  now: number;
  pendingCount: number;
  waitingCount: number;
  approve: (id: string, options?: ApproveOptions) => void;
  undo: (id: string) => void;
  decline: (id: string, reasons: string[], note?: string) => void;
  requestChanges: (id: string, reasons: string[], note?: string) => void;
  nudge: (id: string) => void;
  revokeGrant: (id: string) => void;
  simulateGrant: () => void;
  expireAll: () => void;
  reset: () => void;
  toast: (message: string, options?: ToastOptions) => void;
};

type ToastOptions = { tone?: "info" | "ok" | "bad"; action?: { label: string; onClick: () => void } };
type Toast = { id: number; message: string; tone: "info" | "ok" | "bad"; action?: ToastOptions["action"] };

const HandshakeContext = createContext<Store | null>(null);
const ToastContext = createContext<((message: string, options?: ToastOptions) => void) | null>(null);

function loadState(): HandshakeState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as HandshakeState;
    if (!Array.isArray(parsed.handshakes) || !Array.isArray(parsed.grants)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function Providers({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(handshakeReducer, {
    handshakes: [],
    grants: [],
    events: [],
  });
  const [hydrated, setHydrated] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);
  const timers = useRef<number[]>([]);

  // Hydrate from localStorage, or seed a fresh demo. The seed uses the client
  // clock so countdowns always start in the future.
  useEffect(() => {
    const stored = loadState();
    dispatch({ type: "hydrate", state: stored ?? seedState(Date.now()) });
    const handle = window.setTimeout(() => setHydrated(true), 0);
    return () => window.clearTimeout(handle);
  }, []);

  // A single shared clock drives every countdown and the state machine.
  useEffect(() => {
    const id = window.setInterval(() => {
      const tick = Date.now();
      setNow(tick);
      dispatch({ type: "tick", now: tick });
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  // Persist only after hydration, so the empty initial state never overwrites.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage full or blocked: the demo still works in memory.
    }
  }, [state, hydrated]);

  useEffect(() => {
    const handles = timers.current;
    return () => {
      handles.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const toast = useCallback((message: string, options?: ToastOptions) => {
    const id = ++toastId.current;
    const next: Toast = {
      id,
      message,
      tone: options?.tone ?? "info",
      action: options?.action,
    };
    setToasts((prev) => [...prev.slice(-2), next]);
    const handle = window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, options?.action ? 9000 : 4200);
    timers.current.push(handle);
  }, []);

  const run = useCallback(
    (action: HandshakeAction) => {
      const at = Date.now();
      setNow(at);
      dispatch(action.type === "tick" ? action : { ...action, now: at } as HandshakeAction);
    },
    [],
  );

  const store = useMemo<Store>(() => {
    const busy = (h: { phase: string }) => h.phase === "pending" || h.phase === "holding" || h.phase === "revising";
    return {
      ...state,
      hydrated,
      now,
      pendingCount: state.handshakes.filter((h) => h.phase === "pending").length,
      waitingCount: state.handshakes.filter(busy).length,
      approve: (id, options) => {
        run({ type: "approve", id, now: 0, remember: options?.remember, conditions: options?.conditions });
        toast("Approval staged — 10 seconds to undo", {
          tone: "ok",
          action: { label: "Undo", onClick: () => run({ type: "undo", id, now: 0 }) },
        });
      },
      undo: (id) => {
        run({ type: "undo", id, now: 0 });
        toast("Stopped before anything was sent", { tone: "info" });
      },
      decline: (id, reasons, note) => {
        run({ type: "decline", id, now: 0, reasons, note });
        toast("Declined — the agent was told, nothing was dispatched", { tone: "bad" });
      },
      requestChanges: (id, reasons, note) => {
        run({ type: "request_changes", id, now: 0, reasons, note });
        toast("Sent to the agent — the offer clock is paused", { tone: "info" });
      },
      nudge: (id) => {
        run({ type: "nudge", id, now: 0 });
        toast("Agent re-checked the issue — fresh offer in", { tone: "info" });
      },
      revokeGrant: (id) => {
        run({ type: "revoke_grant", id, now: 0 });
        toast("Standing grant revoked", { tone: "info" });
      },
      simulateGrant: () => {
        if (state.grants.length === 0) {
          toast("Create a standing grant first — approve a low-risk ask with “Remember this”", {
            tone: "info",
          });
          return;
        }
        run({ type: "simulate_grant", now: 0 });
        toast("A standing grant matched a new ask — 12 seconds to undo", { tone: "ok" });
      },
      expireAll: () => {
        run({ type: "expire_all", now: 0 });
        toast("Demo: open offers expired. No action was taken.", { tone: "info" });
      },
      reset: () => {
        const fresh = seedState(Date.now());
        dispatch({ type: "hydrate", state: fresh });
        toast("Demo reset", { tone: "info" });
      },
      toast,
    };
  }, [state, hydrated, now, run, toast]);

  return (
    <ToastContext.Provider value={toast}>
      <HandshakeContext.Provider value={store}>
        {children}
        <div
          aria-live="polite"
          aria-atomic="false"
          className="pointer-events-none fixed inset-x-0 bottom-5 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-6"
        >
          {toasts.map((t) => (
            <div
              key={t.id}
              className="animate-toast pointer-events-auto flex max-w-md items-center gap-3 rounded-full border border-zk-border bg-zk-text px-4 py-2.5 text-sm font-medium text-zk-surface shadow-xl"
            >
              <span
                aria-hidden="true"
                className={`h-2 w-2 shrink-0 rounded-full ${
                  t.tone === "ok" ? "bg-[#6ee7a8]" : t.tone === "bad" ? "bg-[#fca5a0]" : "bg-sky-tint"
                }`}
              />
              <span>{t.message}</span>
              {t.action ? (
                <button
                  type="button"
                  onClick={() => {
                    t.action?.onClick();
                    setToasts((prev) => prev.filter((x) => x.id !== t.id));
                  }}
                  className="ml-1 shrink-0 rounded-full border border-white/25 px-2.5 py-1 text-xs font-bold text-white transition hover:bg-white/10"
                >
                  {t.action.label}
                </button>
              ) : null}
            </div>
          ))}
        </div>
      </HandshakeContext.Provider>
    </ToastContext.Provider>
  );
}

export function useHandshake(): Store {
  const ctx = useContext(HandshakeContext);
  if (!ctx) throw new Error("useHandshake must be used inside Providers");
  return ctx;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside Providers");
  return ctx;
}
