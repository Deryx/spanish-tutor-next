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
    label?: string;
    cta?: string;
}

const HomeCard = ({
    buttonColor,
    buttonText,
    title,
    tagline,
    hrefColor,
    href,
    label = "DRILL",
    cta = "Practice"
}: HomeCardProps) => {
    return (
        <div
            className="flex flex-col h-full border border-[0.5px] border-gray-300 bg-[#fffaf2] text-[1.25rem] p-6"
        >
            <div
                className="flex place-items-center justify-between"
            >
                <div
                    className="grid justify-center place-items-center w-8 h-8 text-[1rem] font-bold rounded-[6px] tracking-[1px]"
                    style={{
                        backgroundColor: buttonColor === "red" ? "#c9362b" : "#f2b441",
                        color: buttonColor === "red" ? "#ffffff" : "#000000"
                    }}
                >
                    {buttonText}
                </div>
                <div className="text-[0.8rem] text-[#84929f]">{label}</div>
            </div>
            <section
                className="mt-2 mb-2"
            >
                <h3 className="font-bold">{title}</h3>
                <p
                    className="text-[0.8rem] text-[#84929f] h-10 mt-2"
                >
                    {tagline}
                </p>
            </section>
            <div className="mt-3">
                <Link
                    href={href}
                    className="text-[1rem] font-semibold"
                    style={{
                        color: hrefColor === "red" ? "#C9362B" : "#000000"
                    }}
                >
                    {cta} &#8594;
                    </Link>
            </div>
        </div>
    );
};

export default HomeCard;