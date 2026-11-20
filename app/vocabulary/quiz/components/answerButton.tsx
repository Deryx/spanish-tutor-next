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
            className="w-full border-[0.5px] border-gray-300 bg-[#FFF8EB] text-[1rem] rounded-[6px] py-2 px-4 mb-4 text-[#000000]"
        >
            {answer}
        </button>
    );
};

export default AnswerButton;