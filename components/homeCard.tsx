"use client";

import Link from 'next/link';

type buttonColorType = "red" | "yellow";
type hrefColorType = "red" | "black";

type HomeCardProps = {
    buttonColor: buttonColorType;
    buttonText: string;
    title: string;
    tagline: string;
    hrefColor: hrefColorType;
    href: string;

}

const HomeCard = ({
    buttonColor,
    buttonText,
    title,
    tagline,
    hrefColor,
    href
}: HomeCardProps) => {
    return (
        <div
            className="flex flex-col h-full border border-[0.5px] border-gray-300 bg-[#fffaf2] text-[0.625rem]"
            style={{ padding: "10px" }}
        >
            <div
                className="flex place-items-center justify-between"
            >
                <div
                    className="grid justify-center place-items-center w-4 h-4 text-[0.4rem] font-bold rounded-[3px] tracking-[1px]"
                    style={{
                        backgroundColor: buttonColor === "red" ? "#c9362b" : "#f2b441",
                        color: buttonColor === "red" ? "#ffffff" : "#000000"
                    }}
                >
                    {buttonText}
                </div>
                <div className="text-[6px] text-[#84929f]">DRILL</div>
            </div>
            <section
                className=""
                style={{ marginTop: "10px", marginBottom: "10px" }}
            >
                <h3 className="font-semibold">{title}</h3>
                <p
                    className="text-[7px] text-[#84929f] h-6"
                    style={{ marginTop: "5px"}}
                >
                    {tagline}
                </p>
            </section>
            <div className="mt-auto">
                <Link
                    href={href}
                    className="text-[8px] font-semibold"
                    style={{
                        color: hrefColor === "red" ? "#C9362B" : "#000000"
                    }}
                >
                    Practice &#8594;
                    </Link>
            </div>
        </div>
    );
};

export default HomeCard;