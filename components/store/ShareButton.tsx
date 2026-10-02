"use client";

import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
    title: string;
    /** Optional description for the share sheet */
    text?: string;
    /** URL to share — defaults to current page URL */
    url?: string;
    className?: string;
}

export function ShareButton({ title, text, url, className }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    async function handleShare() {
        const shareUrl = url ?? window.location.href;

        // Use native Web Share API if available (Android, iOS, some desktops)
        if (typeof navigator !== "undefined" && navigator.share) {
            try {
                await navigator.share({ title, text: text ?? title, url: shareUrl });
                return;
            } catch (err) {
                // User cancelled or share failed — fall through to clipboard
                if ((err as Error)?.name === "AbortError") return;
            }
        }

        // Fallback: copy to clipboard
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            // Last resort: prompt
            window.prompt("Copy this link:", shareUrl);
        }
    }

    return (
        <button
            type="button"
            onClick={handleShare}
            aria-label="Share this product"
            className={cn(
                "inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 hover:text-primary",
                copied && "border-green-500/40 bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400",
                className
            )}
        >
            {copied ? (
                <>
                    <Check className="h-3.5 w-3.5" />
                    Link Copied!
                </>
            ) : (
                <>
                    <Share2 className="h-3.5 w-3.5" />
                    Share
                </>
            )}
        </button>
    );
}
