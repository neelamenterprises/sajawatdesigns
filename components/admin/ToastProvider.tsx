"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    useRef,
    useEffect,
} from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastOptions {
    /** Human-readable message for the admin */
    message: string;
    /** Technical detail shown in parentheses for devs (optional) */
    detail?: string;
    variant?: ToastVariant;
    /** Duration in ms before auto-dismiss (default 5000) */
    duration?: number;
}

interface Toast extends ToastOptions {
    id: string;
    /** Whether toast is animating out */
    exiting: boolean;
}

interface ToastContextValue {
    toast: (opts: ToastOptions) => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
    return ctx;
}

// ─── Config ──────────────────────────────────────────────────────────────────

const VARIANT_CONFIG: Record<
    ToastVariant,
    { icon: React.ElementType; classes: string; iconClass: string }
> = {
    success: {
        icon: CheckCircle2,
        classes:
            "border-emerald-500/30 bg-emerald-950/80 text-emerald-50",
        iconClass: "text-emerald-400",
    },
    error: {
        icon: XCircle,
        classes:
            "border-red-500/30 bg-red-950/80 text-red-50",
        iconClass: "text-red-400",
    },
    warning: {
        icon: AlertTriangle,
        classes:
            "border-amber-500/30 bg-amber-950/80 text-amber-50",
        iconClass: "text-amber-400",
    },
    info: {
        icon: Info,
        classes:
            "border-blue-500/30 bg-blue-950/80 text-blue-50",
        iconClass: "text-blue-400",
    },
};

// ─── Single Toast Card ────────────────────────────────────────────────────────

function ToastCard({
    toast,
    onDismiss,
}: {
    toast: Toast;
    onDismiss: (id: string) => void;
}) {
    const cfg = VARIANT_CONFIG[toast.variant ?? "info"];
    const Icon = cfg.icon;

    return (
        <div
            className={cn(
                // Layout
                "flex w-80 items-start gap-3 rounded-xl border p-4 shadow-2xl",
                // Glass backdrop
                "backdrop-blur-md",
                // Variant colours
                cfg.classes,
                // Slide-in / slide-out animation
                "transition-all duration-300",
                toast.exiting
                    ? "translate-x-full opacity-0"
                    : "translate-x-0 opacity-100"
            )}
            role="alert"
            aria-live="assertive"
        >
            {/* Icon */}
            <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", cfg.iconClass)} />

            {/* Text */}
            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-snug">{toast.message}</p>
                {toast.detail && (
                    <p className="mt-1 text-xs opacity-60">({toast.detail})</p>
                )}
            </div>

            {/* Close */}
            <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                className="shrink-0 rounded-md p-0.5 opacity-60 transition-opacity hover:opacity-100"
                aria-label="Dismiss notification"
            >
                <X className="h-3.5 w-3.5" />
            </button>
        </div>
    );
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

    const dismiss = useCallback((id: string) => {
        // Start exit animation
        setToasts((prev) =>
            prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
        );
        // Remove after animation completes
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 300);
    }, []);

    const toast = useCallback(
        (opts: ToastOptions) => {
            const id = Math.random().toString(36).slice(2);
            const duration = opts.duration ?? 5000;

            setToasts((prev) => [
                ...prev,
                { ...opts, id, exiting: false, variant: opts.variant ?? "info" },
            ]);

            // Auto-dismiss
            const timer = setTimeout(() => dismiss(id), duration);
            timersRef.current.set(id, timer);
        },
        [dismiss]
    );

    // Cleanup timers on unmount
    useEffect(() => {
        const timers = timersRef.current;
        return () => timers.forEach((t) => clearTimeout(t));
    }, []);

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}

            {/* Portal-like fixed container — top-right */}
            <div
                className="fixed right-4 top-4 z-[9999] flex flex-col gap-2"
                aria-label="Notifications"
            >
                {toasts.map((t) => (
                    <ToastCard key={t.id} toast={t} onDismiss={dismiss} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}
