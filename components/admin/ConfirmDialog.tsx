"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ConfirmVariant = "danger" | "warning";

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Dialog title */
    title: string;
    /** Main description — shown prominently */
    description: string;
    /** Optional extra detail lines rendered as a bullet list */
    consequences?: string[];
    /** Label for the confirm button */
    confirmLabel?: string;
    /** Variant controls colour scheme */
    variant?: ConfirmVariant;
    /** Whether the confirm action is in-flight */
    loading?: boolean;
    onConfirm: () => void;
}

export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    consequences,
    confirmLabel = "Confirm",
    variant = "danger",
    loading = false,
    onConfirm,
}: ConfirmDialogProps) {
    const isDanger = variant === "danger";

    return (
        <Dialog
            open={open}
            onOpenChange={(v) => {
                if (loading) return; // prevent closing while in-flight
                onOpenChange(v);
            }}
        >
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div
                        className={cn(
                            "mb-3 flex h-12 w-12 items-center justify-center rounded-full",
                            isDanger ? "bg-destructive/15" : "bg-amber-500/15"
                        )}
                    >
                        <AlertTriangle
                            className={cn(
                                "h-6 w-6",
                                isDanger ? "text-destructive" : "text-amber-500"
                            )}
                        />
                    </div>
                    <DialogTitle className="text-lg">{title}</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                {consequences && consequences.length > 0 && (
                    <div
                        className={cn(
                            "rounded-lg border p-3",
                            isDanger
                                ? "border-destructive/20 bg-destructive/5"
                                : "border-amber-500/20 bg-amber-500/5"
                        )}
                    >
                        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            This will permanently:
                        </p>
                        <ul className="space-y-1">
                            {consequences.map((c, i) => (
                                <li
                                    key={i}
                                    className={cn(
                                        "flex items-start gap-2 text-sm",
                                        isDanger ? "text-destructive" : "text-amber-600 dark:text-amber-400"
                                    )}
                                >
                                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
                                    {c}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <p className="text-xs text-muted-foreground">
                    ⚠️ This action <strong>cannot be undone</strong>. Please make sure before proceeding.
                </p>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant={isDanger ? "destructive" : "default"}
                        onClick={onConfirm}
                        disabled={loading}
                        className={cn(
                            "gap-2",
                            !isDanger && "bg-amber-600 hover:bg-amber-700 text-white"
                        )}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Working…
                            </>
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4" />
                                {confirmLabel}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
