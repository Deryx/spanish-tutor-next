import Link from 'next/link';

const Logo = () => {
  return (
    <Link
      href="/"
      className="flex place-items-center"
    >
        <div className="grid justify-center place-items-center w-8 h-8 text-[1.25rem] font-bold rounded-[6px] tracking-[2px] bg-[#c9362b] text-[#fff8eb]">
            S
        </div>
        <div
          className="ml-2 font-bold text-[1.25rem]"
        >
            Spanish Tutor
        </div>
    </Link>
  );
}

export default Logo;