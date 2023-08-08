import { Analytics } from "@vercel/analytics/react";
import { Bai_Jamjuree } from "next/font/google";

const bai_jamjuree = Bai_Jamjuree({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

export default function appointment() {
  return (
    <main className={`${bai_jamjuree.className}`}>
      <div>
        <Analytics />
        <h1 className="text-center text-3xl mt-10 mb-5">ข้อมูลเพิ่มเติม</h1>
      </div>
      <div className="text-center bg-[#FFB0B1] h-screen rounded-t-3xl">
        <p className="p-2 text-xl">วันที่ต้องการจอง</p>
        <div></div>
      </div>
    </main>
  );
}
