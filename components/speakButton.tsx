"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import { speak, speechSupported, warmUp } from "@/lib/speech";

type SpeakButtonProps = {
    text: string;
    label?: string;
    className?: string;
};

const subscribe = () => () => {};

const SpeakButton = ({ text, label = "Listen", className = "" }: SpeakButtonProps) => {
    const supported = useSyncExternalStore(subscribe, speechSupported, () => false);
    const [missingVoice, setMissingVoice] = useState<boolean>(false);

    useEffect(() => {
        if (supported) warmUp();
    }, [supported]);

    if (!supported || !/\p{L}/u.test(text)) return null;

    const handleClick = async () => {
        const spoke = await speak(text);
        setMissingVoice(!spoke);
    };

    return (
        <span className="inline-flex items-center">
            <button
                type="button"
                onClick={handleClick}
                aria-label={`${label}: ${text}`}
                title={label}
                className={`inline-flex items-center justify-center w-9 h-9 shrink-0 rounded-[6px] border-[0.5px] border-gray-300 bg-[#FFF8EB] text-[#C9362B] hover:bg-[#F2B441] ${className}`}
            >
                <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                    <path d="M19 5a10 10 0 0 1 0 14" />
                </svg>
            </button>
            {missingVoice ? (
                <span role="status" className="ml-2 text-[0.8rem] text-[#C9362B]">
                    No Spanish voice installed on this device
                </span>
            ) : null}
        </span>
    );
};

export default SpeakButton;