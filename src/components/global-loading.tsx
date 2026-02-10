"use client";

import { useAtom } from "jotai";
import { globalLoadingAtom } from "@/store/loading";
import Lottie from "lottie-react";
import loadingAnimation from "../../public/assestLoading.json";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export function GlobalLoading() {
    const [isLoading] = useAtom(globalLoadingAtom);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-md bg-black/20"
                >
                    <div className="relative flex items-center justify-center bg-transparent">
                        <Lottie
                            animationData={loadingAnimation}
                            loop={true}
                            style={{
                                width: 250,
                                height: 250,
                                backgroundColor: 'transparent',
                            }}
                            className="relative z-10 overflow-hidden rounded-full"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export function NavigationWatcher() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [, setIsLoading] = useAtom(globalLoadingAtom);

    useEffect(() => {
        // Navigation started (conceptually when pathname changes, 
        // though in Next.js this happens after the new page is fetched if not using Suspense).
        // For actual "fetching" delays, components should trigger the atom manually.

        // We can hide it when the pathname/params have fully changed
        setIsLoading(false);
    }, [pathname, searchParams, setIsLoading]);

    return null;
}
