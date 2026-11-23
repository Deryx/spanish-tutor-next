import Logo from "@/components/logo";

const StatsLayout = ({
    children
}: React.PropsWithChildren) => {
    return (
        <div className="w-full flex flex-col md:w-3/5 lg:w-3/5 md:m-0 md:m-auto lg:m-0 lg:m-auto text-black h-full bg-[#FFF8EB]">
            <header
                className="p-4 w-full flex place-items-center justify-between"
            >
                <Logo />
                <div
                    className="text-[1rem] text-[#84929f] font-bold"
                >
                    PRACTICE LIBRARY
                </div>
            </header>
            { children }
        </div>
    );
};

export default StatsLayout;
