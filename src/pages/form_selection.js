import DensoLogo from "./images/Denso_logo.png";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/router';
import { Bai_Jamjuree } from "next/font/google";
import { Analytics } from '@vercel/analytics/react';

const bai_jamjuree = Bai_Jamjuree({
    subsets: ["latin"],
    weight: ["200", "300", "400", "500", "600", "700"],
  });

export default function selectionPage() {
  const router = useRouter();
  const { firstName, employeeId,checkIn } = router.query;
  return (
    
    <div className={bai_jamjuree.className}>
      <div>
        <p className="mr-3 mt-2 flex justify-end text-sm">ชื่อ : <strong>&nbsp;{firstName}</strong></p>
           <p className="mr-3 flex justify-end text-sm">ID : <strong>&nbsp;{employeeId}</strong></p>
      </div>
      <Analytics />
      <div className="flex justify-center item-center m-7 drop-shadow-lg mt-8">
      <div className="place-content-center text-center p-10">
        <Image
          src={DensoLogo}
          alt="Denso logo"
          width={350}
          className="mb-8 text-center inline"
        />
        <div className="font-extrabold text-[#D43732] italic">
          DNTH Electronic Form
        </div>
        <div className="mb-8 font-extrabold text-[#D43732] italic">
          (ระบบฟอร์มออนไลน์)
        </div>
        <Link href={`./health_care/option_select?firstName=${firstName}&employeeId=${employeeId}&checkIn=${checkIn}`}>
          <button
            type="summit"
            class="text-white bg-[#D43732] hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 rounded-full text-lg px-10 py-2.5 text-center 
                                mr-2 mb-5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 font-bold"
          >
            จองคิวรักษาพยาบาล
          </button>
        </Link>
        <Link href={`./tr_course/plant_select?firstName=${firstName}&employeeId=${employeeId}&checkIn=${checkIn}`}>
          <button
            type="summit"
            class="text-white bg-[#D43732] hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 rounded-full text-lg px-10 py-2.5 text-center 
                                mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 font-bold"
          >
            คอร์สอบรมวินัยทางการเงิน
          </button>
        </Link>

      </div>
    </div>
    </div>
  );
}
