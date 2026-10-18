import Logo from "../../components/logo"

const VocabularyLayout = ({
    children
}: React.PropsWithChildren) => {
    return (
        <div className="flex flex-col w-3/5 bg-[#fff8eb] text-black">
            <header
                className="w-full flex place-items-center justify-between"
                style={{ padding: "8px 0"}}
            >
                <Logo />
                <div
                    className="text-[0.375rem] text-[#84929f] font-bold"
                >
                    PRACTICE LIBRARY
                </div>
            </header>
            { children }
        </div>
    );
};

export default VocabularyLayout;