"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Building, ArrowRight, ArrowLeft, ShieldCheck, Briefcase, ChevronDown, Loader2, X } from "lucide-react";

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const initialFormData = {
    name: "",
    userId: "",
    email: "",
    department: "",
    password: "",
    confirmPassword: "",
    role: "IT_Associate",
};

export function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [emailForVerification, setEmailForVerification] = useState("");
    const [formData, setFormData] = useState(initialFormData);
    const [otp, setOtp] = useState("");

    const resetForm = () => {
        setFormData(initialFormData);
        setOtp("");
        setStep(1);
        setEmailForVerification("");
    };

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
                toast.success("Email verified! User is now active.");
                resetForm();
                window.dispatchEvent(new Event("refresh-data"));
                onClose();
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
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Modal Overlay Wrapper */}
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 md:p-10 pointer-events-none">
                        {/* Backdrop inside wrapper to catch clicks but allow content to be centered */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="absolute inset-0 bg-white/10 backdrop-blur-md pointer-events-auto"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            className="relative w-full max-w-lg overflow-y-auto max-h-full rounded-[30px] bg-white p-6 shadow-2xl dark:bg-[#020617] lg:p-8 scrollbar-hide pointer-events-auto"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute right-6 top-6 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-white/10 dark:hover:text-white transition-all z-10"
                            >
                                <X size={18} />
                            </button>

                            <AnimatePresence mode="wait">
                                {step === 1 ? (
                                    <motion.div
                                        key="register-form"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="mb-4">
                                            <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                                                Register New User
                                            </h2>
                                            <p className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                                                Fill in the details to create a new system account.
                                            </p>
                                        </div>

                                        <form onSubmit={handleRegister} className="space-y-2.5">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">Full Name</Label>
                                                    <Input
                                                        placeholder="John Doe"
                                                        leftIcon={<User size={16} />}
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        required
                                                        className="h-9 rounded-xl bg-gray-50 dark:bg-white/5 border-transparent transition-all font-bold placeholder:font-medium text-sm"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">AMS ID</Label>
                                                    <Input
                                                        placeholder="AMS1000"
                                                        leftIcon={<ShieldCheck size={16} />}
                                                        value={formData.userId}
                                                        onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                                                        required
                                                        className="h-9 rounded-xl bg-gray-50 dark:bg-white/5 border-transparent transition-all font-bold placeholder:font-medium text-sm"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">Email Address</Label>
                                                <Input
                                                    type="email"
                                                    placeholder="user@amshealthcare.com"
                                                    leftIcon={<Mail size={16} />}
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    required
                                                    className="h-9 rounded-xl bg-gray-50 dark:bg-white/5 border-transparent transition-all font-bold placeholder:font-medium text-sm"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">Department</Label>
                                                <Input
                                                    placeholder="IT / HR / Operations"
                                                    leftIcon={<Building size={16} />}
                                                    value={formData.department}
                                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                                    required
                                                    className="h-9 rounded-xl bg-gray-50 dark:bg-white/5 border-transparent transition-all font-bold placeholder:font-medium text-sm"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">Account Role</Label>
                                                <div className="relative group">
                                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors pointer-events-none">
                                                        <Briefcase size={16} />
                                                    </div>
                                                    <select
                                                        value={formData.role}
                                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                        className="w-full h-9 rounded-xl bg-gray-50 dark:bg-white/5 border-transparent pl-10 pr-10 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer transition-all border border-transparent focus:border-blue-500/50 font-bold"
                                                        required
                                                    >
                                                        <option value="IT_Associate" className="bg-white dark:bg-gray-950">IT Associate</option>
                                                        <option value="IT_Admin" className="bg-white dark:bg-gray-950">IT Admin</option>
                                                        <option value="Manager" className="bg-white dark:bg-gray-950">Manager</option>
                                                        <option value="VP" className="bg-white dark:bg-gray-950">Vice President</option>
                                                        <option value="CEO" className="bg-white dark:bg-gray-950">CEO</option>
                                                        <option value="employee" className="bg-white dark:bg-gray-950">Employee</option>
                                                    </select>
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                        <ChevronDown size={14} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">Password</Label>
                                                    <Input
                                                        type="password"
                                                        placeholder="••••••••"
                                                        leftIcon={<Lock size={16} />}
                                                        value={formData.password}
                                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                        required
                                                        className="h-9 rounded-xl bg-gray-50 dark:bg-white/5 border-transparent transition-all font-bold placeholder:font-medium text-sm"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">Confirm</Label>
                                                    <Input
                                                        type="password"
                                                        placeholder="••••••••"
                                                        leftIcon={<Lock size={16} />}
                                                        value={formData.confirmPassword}
                                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                        required
                                                        className="h-9 rounded-xl bg-gray-50 dark:bg-white/5 border-transparent transition-all font-bold placeholder:font-medium text-sm"
                                                    />
                                                </div>
                                            </div>

                                            <Button
                                                type="submit"
                                                className="w-full h-10 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 group transition-all text-sm"
                                                disabled={loading}
                                            >
                                                {loading ? <Loader2 className="animate-spin" /> : (
                                                    <span className="flex items-center justify-center">
                                                        Create account <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                    </span>
                                                )}
                                            </Button>
                                        </form>
                                    </motion.div>

                                ) : (
                                    <motion.div
                                        key="otp-step"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="text-center py-4"
                                    >
                                        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                                            <Mail size={40} />
                                        </div>
                                        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Verify Email</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed font-medium">
                                            We&apos;ve sent a verification code to <br />
                                            <span className="text-gray-900 dark:text-white font-bold">{emailForVerification}</span>
                                        </p>

                                        <form onSubmit={handleVerifyOtp} className="space-y-8">
                                            <div className="flex justify-center">
                                                <Input
                                                    placeholder="000000"
                                                    className="text-center text-4xl tracking-[0.5em] font-black h-20 max-w-[280px] bg-gray-50 dark:bg-white/5 border-transparent rounded-[24px] shadow-inner"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                                    required
                                                />
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <Button
                                                    type="submit"
                                                    className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-2xl shadow-lg shadow-blue-500/20"
                                                    disabled={loading}
                                                >
                                                    {loading ? <Loader2 className="animate-spin" /> : "Verify & Complete"}
                                                </Button>

                                                <button
                                                    type="button"
                                                    onClick={() => setStep(1)}
                                                    className="text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center justify-center gap-2 transition-colors py-2"
                                                >
                                                    <ArrowLeft size={16} /> Edit details
                                                </button>
                                            </div>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}

