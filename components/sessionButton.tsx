"use client";

type SessionButtonProps = {
    label: string;
    onClick: () => void;
};

const SessionButton = ({ label, onClick }: SessionButtonProps) => {
    return (
        <button
            type="button"
            name={label}
            onClick={onClick}
            className="flex w-full text-[0.5rem] justify-center bg-[#FFF8EB] border-[0.5px] border-gray-300 rounded-[3px] hover:bg-[#F2B441]"
            style={{ padding: "5px 0" }}
        >
            {label}
        </button>
    );
};

export default SessionButton;