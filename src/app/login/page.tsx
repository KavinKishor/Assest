"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Logo } from "@/components/logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Lock, User, ArrowRight, Loader2 } from "lucide-react";

import { AuthAnimation } from "@/components/auth/auth-animation";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Welcome back!");
                router.push("/");
                router.refresh();
            } else {
                toast.error(data.error || "Login failed");
            }
        } catch {
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full bg-white dark:bg-[#020617] overflow-hidden">
            {/* Left Column: Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-24 z-10 bg-white dark:bg-[#020617]">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-[400px] w-full mx-auto"
                >
                    <div className="mb-12">
                        <Logo className="scale-110 origin-left" />
                    </div>

                    <div className="space-y-2 mb-10">
                        <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">
                            Welcome back
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">
                            Start managing your assets with precision.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="identifier" className="text-xs font-bold uppercase tracking-wider text-gray-400">AMS ID or Email</Label>
                            <Input
                                id="identifier"
                                placeholder="AMS1352 / admin@ams.com"
                                leftIcon={<User size={18} />}
                                value={formData.identifier}
                                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                                required
                                className="rounded-2xl h-14 bg-gray-50 dark:bg-gray-900/50 border-transparent focus:border-blue-500 transition-all font-bold placeholder:font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-gray-400">Password</Label>
                                <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-500">
                                    Forgot?
                                </button>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                leftIcon={<Lock size={18} />}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                className="rounded-2xl h-14 bg-gray-50 dark:bg-gray-900/50 border-transparent focus:border-blue-500 transition-all font-bold"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-2xl transition-all shadow-xl shadow-blue-500/20 group"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : (
                                <span className="flex items-center justify-center">
                                    Sign In <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-900 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                            Don&apos;t have an account?{" "}
                            <button
                                onClick={() => router.push("/register")}
                                className="text-blue-600 font-bold hover:underline"
                            >
                                Request Access
                            </button>
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Right Column: Animation */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden">
                <AuthAnimation />
            </div>
        </div>
    );
}

