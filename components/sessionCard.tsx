"use client";

import SessionButton from "./sessionButton";

type SessionCardProps = {
    children: React.ReactNode;
    onSessionButtonClick: () => void;
    onPracticeClick: () => void;
    sessionSelected: string;
};

const SessionCard = ({ children, onPracticeClick, onSessionButtonClick, sessionSelected }: SessionCardProps) => {
    return (
        <section
            className="p-4 w-full md:m-auto lg:m-auto md:w-3/5 lg:w-3/5 flex flex-col border-[0.5px] border-gray-300 bg-[#FFFDF7]"
        >
            <h2
                className="text-[1.5rem] mb-5 font-bold"
            >
                Set up your session
            </h2>

            {children}

            <div className="mb-4 mt-4">
                <label
                    className="text-[1.25rem] font-bold"
                >
                    Rounds
                </label>
                <div className="grid grid-cols-4 gap-1">
                    <SessionButton
                        label="5"
                        onClick={onSessionButtonClick}
                        sessionSelected={sessionSelected}
                    />
                    <SessionButton
                        label="10"
                        onClick={onSessionButtonClick}
                        sessionSelected={sessionSelected}
                    />
                    <SessionButton
                        label="15"
                        onClick={onSessionButtonClick}
                        sessionSelected={sessionSelected}
                    />
                    <SessionButton
                        label="20"
                        onClick={onSessionButtonClick}
                        sessionSelected={sessionSelected}
                    />
                </div>
            </div>

            <button
                type="button"
                onClick={onPracticeClick}
                className="bg-[#C9362B] text-[#FFFDF7] text-[1.25rem] rounded-[6px] py-2 mt-4"
            >
                Begin practice &#8594;
            </button>
        </section>
    );
};

export default SessionCard;