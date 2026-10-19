import React from "react";

import Logo from "@/components/logo"

const VerbsLayout = ({
    children
}: React.PropsWithChildren) => {
    return (
        <div
            className="flex flex-col w-3/5 text-black"
            style={{ backgroundColor: "#FFF8EB" }}
        >
            <header
                className="w-full flex place-items-center justify-between"
                style={{
                    padding: "8px 0"
                }}
            >
                <Logo />
                <div
                    className="text-[0.375rem] text-[#84929f] font-bold"
                >
                    PRACTICE LIBRARY
                </div>
            </header>
            { children }
        </div>
    );
};

export default VerbsLayout;