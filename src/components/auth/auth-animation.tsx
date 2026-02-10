"use client";

import { useRef, useEffect } from "react";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import loadingAnimation from "../../../public/Server Error.json";

export const AuthAnimation = () => {
    const lottieRef = useRef<LottieRefCurrentProps>(null);

    useEffect(() => {
        // Set animation speed to 2x for faster, smoother playback
        if (lottieRef.current) {
            lottieRef.current.setSpeed(2);
        }
    }, []);

    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-white dark:bg-[#020617]">
            <div className="w-full max-w-2xl h-full flex items-center justify-center">
                <Lottie
                    lottieRef={lottieRef}
                    animationData={loadingAnimation}
                    loop={true}
                    autoplay={true}
                    style={{
                        width: "100%",
                        height: "100%",
                        maxWidth: "600px",
                        maxHeight: "600px",
                    }}
                    rendererSettings={{
                        preserveAspectRatio: "xMidYMid slice",
                        progressiveLoad: false,
                        hideOnTransparent: true,
                    }}
                />
            </div>
        </div>
    );
};
