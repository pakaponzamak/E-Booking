import DensoLogo from "./images/Denso_logo.png";
import Image from "next/image";
import Link from "next/link";


export default function selectionPage(){
    return(
    <div className="flex justify-center item-center m-7 drop-shadow-lg mt-14">
        <div className="place-content-center text-center p-10">
        <Image src={DensoLogo} alt="Denso logo" width={350} className="mb-8 text-center inline" />
        <div className="font-extrabold text-[#D43732] italic">
          DNTH Electronic Form
        </div>
        <div className="mb-8 font-extrabold text-[#D43732] italic">
          (ระบบฟอร์มออนไลน์)
        </div>
        <Link href="./health_care/option_select">
        <button
          type="summit"
          class="text-white bg-[#D43732] hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 rounded-full text-lg px-10 py-2.5 text-center 
                                mr-2 mb-5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 font-bold"
        >
          ระบบรักษาพยาบาล
        </button></Link>
        <Link href="./tr_course/course_select">
       <button
          type="summit"
          class="text-white bg-[#D43732] hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 rounded-full text-lg px-10 py-2.5 text-center 
                                mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 font-bold"
        >
        คอร์สอบรมวินัยทางการเงิน 
        </button></Link>

        <Link href="../admin/admin_insert">
       <button
          type="summit"
          class="text-white bg-[#D43732] hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 rounded-full text-xl px-10 py-2.5 text-center 
                                mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 font-bold"
        >
        Admin Page Test
        </button></Link>
        

        </div>
            
    </div>
    );
}