"use client";

import { useState } from "react";
import { signIn } from "@/lib/admin-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gem, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);
        const result = await signIn(formData);
        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f9f5f0] via-background to-[#fdf8f3] px-4">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground shadow-md">
                        <Gem className="h-6 w-6" />
                    </div>
                    <h1 className="font-serif text-2xl font-semibold tracking-tight italic">
                        Sajawat Designs
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">Admin Panel</p>
                </div>

                {/* Login Card */}
                <div className="rounded-2xl border border-border/30 bg-card p-6 shadow-lg shadow-primary/5">
                    <h2 className="mb-6 text-center text-lg font-semibold">Sign In</h2>

                    <form action={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                Email
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="admin@sajawatdesigns.com"
                                required
                                className="h-11"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                Password
                            </label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    required
                                    className="h-11 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="h-11 w-full rounded-xl text-sm font-medium"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>
                </div>

                <p className="mt-6 text-center text-xs text-muted-foreground">
                    Contact your administrator for access credentials.
                </p>
            </div>
        </div>
    );
}
