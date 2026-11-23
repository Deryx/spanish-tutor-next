"use client";

import { useMemo, useSyncExternalStore } from "react";

import { CHANGE_EVENT, parseProgress, ProgressMap, readRaw } from "./progress";

const subscribe = (callback: () => void) => {
    window.addEventListener("storage", callback);
    window.addEventListener(CHANGE_EVENT, callback);

    return () => {
        window.removeEventListener("storage", callback);
        window.removeEventListener(CHANGE_EVENT, callback);
    };
};

export const useProgress = (): ProgressMap => {
    const raw = useSyncExternalStore(subscribe, readRaw, () => null);

    return useMemo(() => parseProgress(raw), [raw]);
};

const subscribeNever = () => () => {};

export const useHydrated = (): boolean =>
    useSyncExternalStore(subscribeNever, () => true, () => false);
