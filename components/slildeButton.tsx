"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";

const SlideButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
    (props, ref) => {
        return (
            <button
                ref={ref}
                type="button"
                aria-label="Drag to reorder"
                {...props}
                className="flex flex-col items-center justify-center gap-0 w-4 h-5 mt-[2px] mr-[5px] rounded-[3px] text-[#637789] cursor-grab active:cursor-grabbing touch-none transition-colors hover:bg-[#17324D] hover:text-[#FFFAF2] focus-visible:bg-[#17324D] focus-visible:text-[#FFFAF2] focus-visible:outline-none"
            >
                {[0, 1, 2].map((i) => (
                    <div key={i} className="flex gap-[1px] text-[0.35rem] leading-[3px] h-[3px]">
                        <span>&#8226;</span>
                        <span>&#8226;</span>
                    </div>
                ))}
            </button>
        );
    }
);

SlideButton.displayName = "SlideButton";

export default SlideButton;