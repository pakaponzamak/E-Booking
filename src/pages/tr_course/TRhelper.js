
import Image from "next/image";
import Link from "next/link";
import { Analytics } from '@vercel/analytics/react';

export default function course_selection()
{
   return(
     
    <div className="flex justify-center item-center m-7 drop-shadow-lg mt-14">
      <Analytics />
        <div className="place-content-center text-center p-10">
          <h1 className="text-3xl font-bold mb-10">ตัวเลือกหลักสูตร</h1>
          <button
          type="summit"
          class="text-white bg-[#D43732] hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 rounded-2xl px-10 py-2.5 text-center 
                                mr-2 mb-10 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 font-semibold"
        >
          <p className="font-extrabold text-xl underline mb-1">หลักสูตร TMC 1:</p>หลักสูตรจัดการเงินพื้นฐาน
        </button>
        <button
          type="summit"
          class="text-white bg-[#D43732] hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 rounded-2xl px-10 py-2.5 text-center 
                                mr-2 mb-5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 font-semibold"
        >
          <p className="font-extrabold text-xl underline mb-1">หลักสูตร TMC 2:</p>การวางแผนสู่ความมั่งคั่ง
        </button>
        </div>
            
    </div>
   );

}