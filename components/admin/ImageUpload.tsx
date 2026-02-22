"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
    /** Current image URLs */
    value: string[];
    /** Called when images change */
    onChange: (urls: string[]) => void;
    /** Cloudinary folder path (e.g. "products", "categories") */
    folder?: string;
    /** Max number of images allowed */
    maxImages?: number;
    /** Class name for the container */
    className?: string;
}

export function ImageUpload({
    value = [],
    onChange,
    folder = "general",
    maxImages = 5,
    className,
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const uploadFile = useCallback(
        async (file: File) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("folder", folder);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            return data.url as string;
        },
        [folder]
    );

    const handleFiles = useCallback(
        async (files: FileList | File[]) => {
            const fileArray = Array.from(files);
            const remaining = maxImages - value.length;

            if (remaining <= 0) {
                setError(`Maximum ${maxImages} images allowed`);
                return;
            }

            const toUpload = fileArray.slice(0, remaining);
            setUploading(true);
            setError(null);

            try {
                const urls = await Promise.all(toUpload.map((f) => uploadFile(f)));
                onChange([...value, ...urls]);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Upload failed");
            } finally {
                setUploading(false);
            }
        },
        [value, onChange, maxImages, uploadFile]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files.length > 0) {
                handleFiles(e.dataTransfer.files);
            }
        },
        [handleFiles]
    );

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
    };

    const removeImage = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    return (
        <div className={className}>
            {/* Uploaded images grid */}
            {value.length > 0 && (
                <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
                    {value.map((url, i) => (
                        <div
                            key={i}
                            className="group relative aspect-square overflow-hidden rounded-lg border border-border/30 bg-secondary/20"
                        >
                            <Image
                                src={url}
                                alt={`Upload ${i + 1}`}
                                fill
                                sizes="120px"
                                className="object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(i)}
                                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white opacity-0 transition-opacity group-hover:opacity-100"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Drop zone */}
            {value.length < maxImages && (
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => inputRef.current?.click()}
                    className={cn(
                        "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors",
                        dragActive
                            ? "border-primary bg-primary/5"
                            : "border-border/50 hover:border-primary/50 hover:bg-secondary/30",
                        uploading && "pointer-events-none opacity-60"
                    )}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files) handleFiles(e.target.files);
                            e.target.value = "";
                        }}
                    />

                    {uploading ? (
                        <>
                            <Loader2 className="mb-2 h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm font-medium">Uploading...</p>
                        </>
                    ) : (
                        <>
                            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                {dragActive ? (
                                    <Upload className="h-5 w-5 text-primary" />
                                ) : (
                                    <ImagePlus className="h-5 w-5 text-primary" />
                                )}
                            </div>
                            <p className="text-sm font-medium">
                                {dragActive ? "Drop images here" : "Click or drag images here"}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                JPEG, PNG, WebP • Max 5MB • {maxImages - value.length} remaining
                            </p>
                        </>
                    )}
                </div>
            )}

            {error && (
                <p className="mt-2 text-sm text-destructive">{error}</p>
            )}
        </div>
    );
}
