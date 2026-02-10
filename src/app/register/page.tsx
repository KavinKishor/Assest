"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Building, ArrowRight, ArrowLeft, ShieldCheck, Briefcase, ChevronDown, Loader2 } from "lucide-react";

import { AuthAnimation } from "@/components/auth/auth-animation";

function RegisterContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [emailForVerification, setEmailForVerification] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        userId: "",
        email: "",
        department: "",
        password: "",
        confirmPassword: "",
        role: "IT_Associate",
    });

    const [otp, setOtp] = useState("");

    useEffect(() => {
        const verifyEmail = searchParams.get("verify");
        if (verifyEmail) {
            setEmailForVerification(verifyEmail);
            setStep(2);
        }
    }, [searchParams]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return toast.error("Passwords do not match");
        }

        setLoading(true);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Registration successful! Check your email.");
                setEmailForVerification(formData.email);
                setStep(2);
            } else {
                toast.error(data.error || "Registration failed");
            }
        } catch {
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: emailForVerification, otp }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Email verified! You can now login.");
                router.push("/login");
            } else {
                toast.error(data.error || "Verification failed");
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
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 z-10 bg-white dark:bg-[#020617] overflow-y-auto py-6">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-[500px] w-full mx-auto"
                >
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="register"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className="space-y-1 mb-4" >
                                    <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
                                        Create Account
                                    </h1>
                                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                                        Join the Asset Management System.
                                    </p>
                                </div>

                                <form onSubmit={handleRegister} className="space-y-3">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label className="text-xs font-bold uppercase tracking-wider text-gray-400">Full Name</Label>
                                            <Input
                                                placeholder="John Doe"
                                                leftIcon={<User size={18} />}
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                                className="rounded-2xl h-10 bg-gray-50 dark:bg-gray-900/50 border-transparent transition-all font-bold placeholder:font-medium"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs font-bold uppercase tracking-wider text-gray-400">AMS ID</Label>
                                            <Input
                                                placeholder="AMS1000"
                                                leftIcon={<ShieldCheck size={18} />}
                                                value={formData.userId}
                                                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                                                required
                                                className="rounded-2xl h-10 bg-gray-50 dark:bg-gray-900/50 border-transparent transition-all font-bold placeholder:font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-gray-400">Email Address</Label>
                                        <Input
                                            type="email"
                                            placeholder="kavinkumar.e@amshealthcare.com"
                                            leftIcon={<Mail size={18} />}
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                            className="rounded-2xl h-10 bg-gray-50 dark:bg-gray-900/50 border-transparent transition-all font-bold placeholder:font-medium"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-gray-400">Department</Label>
                                        <Input
                                            placeholder="IT / HR / Operations"
                                            leftIcon={<Building size={18} />}
                                            value={formData.department}
                                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                            required
                                            className="rounded-2xl h-10 bg-gray-50 dark:bg-gray-900/50 border-transparent transition-all font-bold placeholder:font-medium"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-gray-400">Account Role</Label>
                                        <div className="relative flex items-center group">
                                            <div className="absolute left-3 text-gray-400 group-focus-within:text-blue-500 transition-colors pointer-events-none">
                                                <Briefcase size={18} />
                                            </div>
                                            <select
                                                value={formData.role}
                                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                className="w-full h-10 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border-transparent pl-11 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer transition-all border border-transparent focus:border-blue-500/50 font-bold"
                                                required
                                            >
                                                <option value="IT_Associate" className="bg-white dark:bg-gray-950">IT Associate</option>
                                                <option value="IT_Admin" className="bg-white dark:bg-gray-950">IT Admin</option>
                                                <option value="Manager" className="bg-white dark:bg-gray-950">Manager</option>
                                                <option value="VP" className="bg-white dark:bg-gray-950">Vice President</option>
                                                <option value="CEO" className="bg-white dark:bg-gray-950">CEO</option>
                                                <option value="employee" className="bg-white dark:bg-gray-950">Employee</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-blue-500 transition-colors">
                                                <ChevronDown size={14} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label className="text-xs font-bold uppercase tracking-wider text-gray-400">Password</Label>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                leftIcon={<Lock size={18} />}
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                required
                                                className="rounded-2xl h-10 bg-gray-50 dark:bg-gray-900/50 border-transparent transition-all font-bold"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs font-bold uppercase tracking-wider text-gray-400">Confirm</Label>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                leftIcon={<Lock size={18} />}
                                                value={formData.confirmPassword}
                                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                required
                                                className="rounded-2xl h-10 bg-gray-50 dark:bg-gray-900/50 border-transparent transition-all font-bold"
                                            />
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full h-11 mt-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-2xl shadow-xl shadow-blue-500/10 group" disabled={loading}>
                                        {loading ? <Loader2 className="animate-spin" /> : (
                                            <span className="flex items-center justify-center">
                                                Create Account <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        )}
                                    </Button>
                                </form>

                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-900 text-center">
                                    <p className="text-sm text-gray-500 font-medium">
                                        Already have an account?{" "}
                                        <button onClick={() => router.push("/login")} className="text-blue-600 font-bold hover:underline">Sign In</button>
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="otp"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                                className="text-center"
                            >
                                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                                    <Mail size={40} />
                                </div>
                                <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Verify Email</h1>
                                <p className="text-gray-500 dark:text-gray-400 mb-10 leading-relaxed font-medium">
                                    We&apos;ve sent a code to <br /><span className="text-gray-900 dark:text-white font-bold">{emailForVerification}</span>
                                </p>

                                <form onSubmit={handleVerifyOtp} className="space-y-8">
                                    <div className="flex justify-center">
                                        <Input
                                            placeholder="000000"
                                            className="text-center text-4xl tracking-[0.5em] font-black h-24 max-w-[300px] bg-gray-50 dark:bg-gray-900/50 border-transparent rounded-[32px] shadow-inner"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-2xl" disabled={loading}>
                                        {loading ? <Loader2 className="animate-spin" /> : "Verify Identity"}
                                    </Button>
                                </form>

                                <div className="mt-10 flex flex-col gap-4">
                                    <button onClick={() => setStep(1)} className="text-sm font-bold text-gray-500 hover:text-gray-900 flex items-center justify-center gap-2 transition-colors">
                                        <ArrowLeft size={16} /> Edit details
                                    </button>
                                    <p className="text-xs text-gray-400 font-medium">
                                        Didn&apos;t get the code? <button className="text-blue-600 font-bold">Resend</button>
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Right Column: Animation */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden">
                <AuthAnimation />
            </div>
        </div>
    );
}


export default function RegisterPage() {
    return (
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
            <RegisterContent />
        </Suspense>
    );
}
