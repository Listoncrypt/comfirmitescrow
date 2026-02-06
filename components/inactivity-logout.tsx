"use client";

import { useEffect, useCallback } from "react";
import { signOut } from "@/lib/actions/auth";

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

export function InactivityLogout() {
    const handleLogout = useCallback(async () => {
        await signOut();
    }, []);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const resetTimer = () => {
            // Clear existing timeout
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            // Set new timeout
            timeoutId = setTimeout(() => {
                handleLogout();
            }, INACTIVITY_TIMEOUT);
        };

        // Events that indicate user activity
        const activityEvents = [
            "mousedown",
            "mousemove",
            "keydown",
            "scroll",
            "touchstart",
            "click",
        ];

        // Add event listeners for user activity
        activityEvents.forEach((event) => {
            document.addEventListener(event, resetTimer, { passive: true });
        });

        // Start the initial timer
        resetTimer();

        // Cleanup on unmount
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            activityEvents.forEach((event) => {
                document.removeEventListener(event, resetTimer);
            });
        };
    }, [handleLogout]);

    // This component doesn't render anything visible
    return null;
}

