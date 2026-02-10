"use client";

import { Provider as JotaiProvider } from "jotai";
import { ChartThemeProvider } from "@/components/providers/chart-theme-provider";
import { ModeThemeProvider } from "@/components/providers/mode-theme-provider";

import { Toaster } from "react-hot-toast";
import { GlobalLoading, NavigationWatcher } from "@/components/global-loading";
import { Suspense } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <JotaiProvider>
      <ModeThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ChartThemeProvider>
          <GlobalLoading />
          <Suspense fallback={null}>
            <NavigationWatcher />
          </Suspense>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: '16px',
                background: '#333',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '22px',
              },
              success: {
                style: {
                  background: '#10B981',
                },
              },
              error: {
                style: {
                  background: '#EF4444',
                },
              },
            }}
          />
        </ChartThemeProvider>
      </ModeThemeProvider>
    </JotaiProvider>
  );
}

