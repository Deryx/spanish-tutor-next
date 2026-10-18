import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";

import {
    useSortable,
} from "@dnd-kit/sortable";

import Tile from "../components/tile";

type SortableTileProps = {
    id: number;
    label: string;
    disabled: boolean;
};

const SortableTile = ({ id, label, disabled }: SortableTileProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id, disabled });

    return (
        <div
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
                position: "relative",
                zIndex: isDragging ? 10 : undefined,
                opacity: isDragging ? 0.85 : 1,
            }}
        >
            <Tile
                type="dynamic"
                label={label}
                handleRef={setActivatorNodeRef}
                handleProps={disabled ? { disabled: true } : { ...attributes, ...listeners }}
            />
        </div>
    );
};

export default SortableTile;