type AnswerButtonProps = {
    answer: string;
    onClick: () => void;
    answerSelected?: string;
};

const AnswerButton = ({ answer, onClick, answerSelected }: AnswerButtonProps) => {
    const isSelected = answerSelected === answer;

    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={isSelected}
            className={`w-full border-[0.5px] border-gray-300 text-[1rem] rounded-[6px] py-2 px-4 mb-4 ${
                isSelected
                    ? 'bg-[#C9362B] text-white'
                    : 'bg-[#FFF8EB] hover:bg-[#F2B441] text-[#000000]'
            }`}
        >
            {answer}
        </button>
    );
};

export default AnswerButton;