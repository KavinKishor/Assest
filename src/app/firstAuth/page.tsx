"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Logo } from "@/components/logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { ArrowRight, ShieldAlert, Loader2 } from "lucide-react";

import { AuthAnimation } from "@/components/auth/auth-animation";

export default function FirstAuthPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            toast.success("Identity verified! Welcome to AMS Assets.");
            router.push("/");
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="flex h-screen w-full bg-white dark:bg-[#020617] overflow-hidden">
            {/* Left Column: Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-24 z-10 bg-white dark:bg-[#020617]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-[420px] w-full mx-auto"
                >
                    <div className="mb-12">
                        <Logo className="scale-110 origin-left" />
                    </div>

                    <div className="mb-10 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                            <ShieldAlert size={14} /> Security Protocol
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white mb-3">
                            Authorize Device
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                            To ensure your account safety, please enter your secondary employee passcode.
                        </p>
                    </div>

                    <form onSubmit={handleVerify} className="space-y-8">
                        <div className="space-y-3">
                            <Label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Employee Passcode</Label>
                            <Input
                                id="code"
                                type="password"
                                placeholder="••••••••"
                                className="text-center text-4xl tracking-[0.6em] font-black h-24 bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 rounded-[32px] shadow-sm focus:ring-blue-500/20"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-16 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 font-black text-xl rounded-2xl transition-all shadow-2xl flex items-center justify-center group"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <>
                                    Authenticate
                                    <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>
                    </form>

                    <button onClick={() => router.push("/login")} className="mt-10 w-full text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors">
                        Switch Account
                    </button>
                </motion.div>
            </div>

            {/* Right Column: Animation */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden">
                <AuthAnimation />
            </div>
        </div>
    );
}

