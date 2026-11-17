"use client";

type SessionButtonProps = {
    label: string;
    onClick: () => void;
    sessionSelected: string;
};

const SessionButton = ({ label, onClick, sessionSelected }: SessionButtonProps) => {
    const isSelected = sessionSelected === label;
    return (
        <button
            type="button"
            name={label}
            onClick={onClick}
            aria-selected={isSelected}
            className={`flex w-full text-[0.5rem] justify-center ${isSelected ? 'bg-[#C9362B] text-[#FFFDF7]' : 'bg-[#FFF8EB] border-[0.5px] border-gray-300'} rounded-[3px] hover:bg-[#F2B441]`}
            style={{ padding: "5px 0" }}
        >
            {label}
        </button>
    );
};

export default SessionButton;