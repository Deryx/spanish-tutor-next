import SessionButton from "./sessionButton";

type SessionCardProps = {
    children: React.ReactNode;
    onSessionButtonClick: () => void;
    onPracticeClick: () => void;
};

const SessionCard = ({ children, onPracticeClick, onSessionButtonClick }: SessionCardProps) => {
    return (
        <section
            className="w-1/2 flex flex-col border-[0.5px] border-gray-300 bg-[#FFFDF7]"
            style={{ padding: "15px", margin: "0 auto" }}
        >
            <h2
                className="text-[0.75rem] font-bold"
                style={{ marginBottom: "10px" }}
            >
                Set up your session
            </h2>

            {children}

            <div style={{ marginBottom: "5px" }}>
                <label
                    className="text-[0.5rem] font-bold"
                >
                    Rounds
                </label>
                <div className="grid grid-cols-4 gap-1">
                    <SessionButton
                        label="5"
                        onClick={onSessionButtonClick}
                    />
                    <SessionButton
                        label="10"
                        onClick={onSessionButtonClick}
                    />
                    <SessionButton
                        label="15"
                        onClick={onSessionButtonClick}
                    />
                    <SessionButton
                        label="20"
                        onClick={onSessionButtonClick}
                    />
                </div>
            </div>

            <button
                type="button"
                onClick={onPracticeClick}
                className="bg-[#C9362B] text-[#FFFDF7] text-[0.4375rem] rounded-[3px]"
                style={{ padding: "4px 0" }}
            >
                Begin practice &#8594;
            </button>
        </section>
    );
};

export default SessionCard;