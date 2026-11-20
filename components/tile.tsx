import { ButtonHTMLAttributes, Ref } from "react";
import SlideButton from "./slildeButton";

type TileType = "static" | "dynamic";

type TileProps = {
    type: TileType;
    label: string;
    handleRef?: Ref<HTMLButtonElement>;
    handleProps?: ButtonHTMLAttributes<HTMLButtonElement>;
};

const Tile = ({ type, label, handleRef, handleProps }: TileProps) => {
    return (
        <div
            key={label}
            className="flex w-full h-8 bg-[#FFF8EB] border-[0.5px] border-gray-300 rounded-[6px] text-[1rem] pl-2 py-8 mb-4 text-[#000000] place-items-center"
        >
            {
                type === "static" ? (
                    <div className="flex place-items-center">
                        <span className="ml-2">{label}</span>
                    </div>
                ) : (
                    <div
                        className="flex font-bold place-items-center"
                    >
                        <span>
                            <SlideButton ref={handleRef} {...handleProps} />
                        </span>
                        <span className="ml-2">{label}</span>
                    </div>
                )
            }
        </div>
    );
};

export default Tile;