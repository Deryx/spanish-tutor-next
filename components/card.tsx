type CardProps = {
    children: React.ReactNode;
    rightButtonLabel: string;
    leftButtonLabel: string;
    onLeftButtonClick: () => void;
    onRightButtonClick: () => void;
};

const Card = ({
    children,
    onLeftButtonClick,
    onRightButtonClick,
    leftButtonLabel,
    rightButtonLabel
}: CardProps) => {

    return (
        <div
            className="w-3/5 border-[0.5px] border-gray-300 bg-[#FFFDF7]"
            style={{ padding: "15px", margin: "0 auto" }}
        >
            {children}

            <div className="flex justify-between">
                <button
                    className="bg-[#F2B441] text-[0.4rem] rounded-[3px] font-semibold text-[#000000]"
                    style={{ padding: "4px 8px" }}
                    onClick={onLeftButtonClick}>
                        {leftButtonLabel}
                    </button>
                <button
                    className="bg-[#C9362B] text-[0.4rem] rounded-[3px] font-semibold text-[#FFFDF7]"
                    style={{ padding: "4px 8px" }}
                    onClick={onRightButtonClick}>
                        {rightButtonLabel}
                    </button>
            </div>
        </div>
    );
};

export default Card;