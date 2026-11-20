"use client";

import Link from "next/link";
import React from "react";

type SummaryCardProps = {
    children: React.ReactNode;
    practiceHref: string;
    chooseHref: string;
};

const SummaryCard = ({ children, practiceHref, chooseHref }: SummaryCardProps) => {
    const handleRefresh = (e: React.MouseEvent) => {
        e.preventDefault();
        window.location.reload();
    };

    return (
        <div
            className="w-full p-4 md:w-3/5 lg:w-3/5 border-[0.5px] border-gray-300 bg-[#FFFDF7] m-0 m-auto p-4"
        >
            { children }

            <div
                className="flex justify-start text-[1rem] mt-4"
            >
                <Link
                    className="bg-[#C9362B] px-4 py-2 text-[1rem] mr-2 rounded-[6px]"
                    href={practiceHref}
                    onClick={handleRefresh}
                >
                    <span className="text-[1rem] text-[#FFF8EB]">&#10226;</span> <span className="text-[#FFF8EB]">Practice again</span>
                </Link>
                <Link
                    className="bg-[#FFF8EB] border-[0.5px] rounded-[6px] border-gray-300 px-4 py-2 text-[1rem] text-[#000000]"
                    href={chooseHref}
                >
                    Choose activity
                </Link>
            </div>
        </div>
    );
};

export default SummaryCard;