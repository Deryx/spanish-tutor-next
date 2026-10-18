import Link from 'next/link';

const Logo = () => {
  return (
    <Link
      href="/"
      className="flex place-items-center"
    >
        <div className="grid justify-center place-items-center w-4 h-4 text-[0.625rem] font-bold rounded-[3px] tracking-[1px] bg-[#c9362b] text-[#fff8eb]">
            S
        </div>
        <div
          className="font-bold text-[0.625rem]"
          style={{ marginLeft: "5px" }}
        >
            Spanish Tutor
        </div>
    </Link>
  );
}

export default Logo;