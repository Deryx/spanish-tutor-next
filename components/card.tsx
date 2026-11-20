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
            className="p-6 w-full md:m-auto lg:m-auto md:w-3/5 lg:w-3/5 border-[0.5px] border-gray-300 bg-[#FFFDF7]"
        >
            {children}

            <div className="flex justify-between mt-20">
                <button
                    className="bg-[#F2B441] text-[1rem] rounded-[6px] font-semibold text-[#000000]"
                    style={{ padding: "4px 8px" }}
                    onClick={onLeftButtonClick}>
                        {leftButtonLabel}
                    </button>
                <button
                    className="bg-[#C9362B] text-[1rem] rounded-[6px] font-semibold text-[#FFFDF7]"
                    style={{ padding: "4px 8px" }}
                    onClick={onRightButtonClick}>
                        {rightButtonLabel}
                    </button>
            </div>
        </div>
    );
};

export default Card;