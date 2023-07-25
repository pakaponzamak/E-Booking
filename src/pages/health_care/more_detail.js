import { Analytics } from '@vercel/analytics/react';
import { Bai_Jamjuree } from "next/font/google";

const bai_jamjuree = Bai_Jamjuree({
    subsets: ["latin"],
    weight: ["200", "300", "400", "500", "600", "700"],
  });

export default function appointment(){
    return(
        <main className={`${bai_jamjuree} m-5`}>
            <div>
            <Analytics />
            <h1 className='text-center text-xl'>ข้อมูลเพิ่มเติม</h1>
            </div>
        </main>
    );


}