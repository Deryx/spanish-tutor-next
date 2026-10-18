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
            className="flex w-full h-8 bg-[#FFF8EB] border-[0.5px] border-gray-300 rounded-[3px] text-[0.5rem] "
            style={{ paddingLeft: "10px", marginBottom: "7px" }}
        >
            {
                type === "static" ? (
                    <div className="flex font-bold place-items-center">
                        <span>{label}</span>
                    </div>
                ) : (
                    <div
                        className="flex font-bold place-items-center"
                    >
                        <span>
                            <SlideButton ref={handleRef} {...handleProps} />
                        </span>
                        <span style={{ marginLeft: "5px" }}>{label}</span>
                    </div>
                )
            }
        </div>
    );
};

export default Tile;