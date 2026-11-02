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
            className="w-3/5 border-[0.5px] border-gray-300 bg-[#FFFDF7]"
            style={{ padding: "15px", margin: "0 auto" }}
        >
            { children }

            <div
                className="flex justify-start text-[0.435rem]"
                style={{ marginTop: "15px" }}
            >
                <Link
                    className="bg-[#C9362B] rounded-[3px]"
                    style={{ padding: "5px 8px", marginRight: "5px" }}
                    href={practiceHref}
                    onClick={handleRefresh}
                >
                    <span className="text-[0.5rem] text-[#FFF8EB]">&#10226;</span> <span className="text-[#FFF8EB]">Practice again</span>
                </Link>
                <Link
                    className="bg-[#FFF8EB] border-[0.5px] rounded-[3px] border-gray-300"
                    style={{ padding: "5px 8px", marginLeft: "5px" }}
                    href={chooseHref}
                >
                    Choose activity
                </Link>
            </div>
        </div>
    );
};

export default SummaryCard;