"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, leftIcon, rightIcon, ...props }, ref) => {
        const [showPassword, setShowPassword] = React.useState(false);
        const isPassword = type === "password";

        const togglePasswordVisibility = () => {
            setShowPassword(!showPassword);
        };

        const inputType = isPassword ? (showPassword ? "text" : "password") : type;

        return (
            <div className="relative flex items-center w-full group">
                {leftIcon && (
                    <div className="absolute left-3 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                        {leftIcon}
                    </div>
                )}
                <input
                    type={inputType}
                    className={cn(
                        "flex h-12 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
                        leftIcon && "pl-11",
                        (rightIcon || isPassword) && "pr-11",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {isPassword ? (
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                ) : (
                    rightIcon && (
                        <div className="absolute right-3 text-gray-400">
                            {rightIcon}
                        </div>
                    )
                )}
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };
