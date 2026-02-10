import { useSetAtom } from "jotai";
import { globalLoadingAtom } from "@/store/loading";
import { useCallback } from "react";

export function useLoading() {
    const setIsLoading = useSetAtom(globalLoadingAtom);

    const withLoading = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
        setIsLoading(true);
        try {
            return await fn();
        } finally {
            setIsLoading(false);
        }
    }, [setIsLoading]);

    return { setIsLoading, withLoading };
}
