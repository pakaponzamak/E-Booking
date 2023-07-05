import Image from "next/image";
import DensoLogo from "../images/Denso_logo.png";
import Link from "next/link";

export default function option_select() {
  return (
    <div className="flex justify-center item-center m-7 drop-shadow-lg mt-14 ">
      <div>
        <Image src={DensoLogo} alt="Denso logo" width={350} className="mb-4" />
        <div className="text-center text-2xl font-semibold text-[#D43732]">ศูนย์สุขภาพ</div>
        <div className="text-center text-2xl font-semibold text-[#D43732]">(DNTH Health Care Center)</div>
        <div></div>
      </div>
    </div>
  );
}

