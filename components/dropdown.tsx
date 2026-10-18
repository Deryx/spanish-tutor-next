type Category = { categoryId: number; categoryText: string };
type Tense = { tenseId: number; tenseText: string };
type Verb = { verbId: number; infinitive: string, translation: string, pronunciation: string };

type OptionMap = {
    category: Category[];
    tense: Tense[];
    verb: Verb[];
};

type OptionType = keyof OptionMap;

type DropdownProps<K extends OptionType> = {
    id?: string;
    type: K;
    label: string;
    options: OptionMap[K];
    firstOption?: string;
    value: number;
    onChange: (value: number) => void;
};

const Dropdown = <K extends OptionType>({
    id,
    type,
    label,
    options,
    firstOption,
    value,
    onChange,
}: DropdownProps<K>) => {
    const idKey = `${type}Id`;
    const textKey = `${type}Text`;
    const items = options as unknown as Record<string, string | number>[];

    return (
        <label 
            className="text-[0.45rem] flex flex-col font-semibold text-[#17324D]"
            style={{ marginBottom: "10px" }}
        >
            {label}
            <select
                id={id}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="text-[#17324D] bg-[#FFFDF7] text-[0.45rem] border-[0.5px] border-gray-300 rounded-[3px] font-semibold"
                style={{ padding: "5px 5px" }}
            >
                {firstOption && <option value={0}>{firstOption}</option>}
                {items.map((item) => (
                    <option
                        key={item[idKey]}
                        value={item[idKey]}
                    >
                        {type === 'verb' ? item.infinitive : item[textKey]}
                    </option>
                ))}
            </select>
        </label>
    );
};

export default Dropdown;