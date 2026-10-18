type AnswerButtonProps = {
    answer: string;
    onClick: () => void;
}

const AnswerButton = ({ answer, onClick }: AnswerButtonProps) => {
    return (
        <button
            id={answer}
            name={answer}
            onClick={onClick}
            className="w-full border-[0.5px] border-gray-300 bg-[#FFF8EB] text-[0.5rem] rounded-[3px]"
            style={{ padding: "5px 0" }}
        >
            {answer}
        </button>
    );
};

export default AnswerButton;