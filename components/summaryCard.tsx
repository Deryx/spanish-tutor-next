import React from "react";

type SummaryCardProps = {
    children: React.ReactNode;
};

const SummaryCard = ({ children }: SummaryCardProps) => {
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
                <button
                    className="bg-[#C9362B]"
                    style={{ padding: "5px 8px" }}
                >
                    Practice again
                </button>
                <button
                    className="bg-[#FFF8EB]"
                    style={{ padding: "5px 8px" }}
                >
                    Choose activity
                </button>
            </div>
        </div>
    );
};

export default SummaryCard;