import Image from "next/image";
import DensoLogo from "../images/Denso_logo.png";
import Link from "next/link";
import { useRouter } from "next/router";
import { Bai_Jamjuree } from "next/font/google";
import { Analytics } from '@vercel/analytics/react';

const bai_jamjuree = Bai_Jamjuree({
    subsets: ["latin"],
    weight: ["200", "300", "400", "500", "600", "700"],
  });

export default function option_select() {
  const router = useRouter();
  const { firstName, employeeId,checkIn } = router.query;
  return (
    <div className={bai_jamjuree.className}>
      <Analytics />
      <div>
        <p className="mr-3 mt-2 flex justify-end text-sm">ชื่อ : <strong>&nbsp;{firstName}</strong></p>
        <p className="mr-3 flex justify-end text-sm">ID : <strong>&nbsp;{employeeId}</strong></p>
      </div>
    <div className="flex justify-center item-center m-7 drop-shadow-lg mt-14 ">
      <div>
        <Image src={DensoLogo} alt="Denso logo" width={350} className="mb-4" />
        <div className="text-center text-2xl font-semibold text-[#D43732]">
          ศูนย์สุขภาพ
        </div>
        <div className="text-center text-2xl font-semibold text-[#D43732]">
          (DNTH Health Care Center)
        </div>
        <div className="mt-20  text-center flex">
        <Link href={`./HCcalendar?firstName=${firstName}&employeeId=${employeeId}&checkIn=${checkIn}`}>
          <div className=" inline-block p-4 px-5 text-center w-40 h-50 bg-slate-300 rounded-3xl mr-5">
            จองคิว
            <svg
              width="71"
              height="50"
              viewBox="0 0 71 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mt-2 mx-auto"
            >
              <path
                d="M64.3438 10H53.25V5C53.25 2.23958 50.2686 0 46.5938 0H24.4062C20.7314 0 17.75 2.23958 17.75 5V10H6.65625C2.98145 10 0 12.2396 0 15V45C0 47.7604 2.98145 50 6.65625 50H64.3438C68.0186 50 71 47.7604 71 45V15C71 12.2396 68.0186 10 64.3438 10ZM26.625 6.66667H44.375V10H26.625V6.66667ZM48.8125 32.5C48.8125 32.9583 48.3133 33.3333 47.7031 33.3333H39.9375V39.1667C39.9375 39.625 39.4383 40 38.8281 40H32.1719C31.5617 40 31.0625 39.625 31.0625 39.1667V33.3333H23.2969C22.6867 33.3333 22.1875 32.9583 22.1875 32.5V27.5C22.1875 27.0417 22.6867 26.6667 23.2969 26.6667H31.0625V20.8333C31.0625 20.375 31.5617 20 32.1719 20H38.8281C39.4383 20 39.9375 20.375 39.9375 20.8333V26.6667H47.7031C48.3133 26.6667 48.8125 27.0417 48.8125 27.5V32.5Z"
                fill="#2F2E41"
              />
            </svg>
          </div>
          </Link>
         <Link href={`./confirmation?firstName=${firstName}&employeeId=${employeeId}&checkIn=${checkIn}`}>
          <div className=" inline-block p-4 px-5 text-center w-40 h-50 bg-slate-300 rounded-3xl">
            รายการจอง
            <svg
              width="71"
              height="50"
              viewBox="0 0 71 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mt-2 mx-auto"
            >
              <path
                d="M57.75 0H5.25C2.35156 0 0 2.39955 0 5.35714V44.6429C0 47.6004 2.35156 50 5.25 50H57.75C60.6484 50 63 47.6004 63 44.6429V5.35714C63 2.39955 60.6484 0 57.75 0ZM19.25 10.7143C23.1109 10.7143 26.25 13.9174 26.25 17.8571C26.25 21.7969 23.1109 25 19.25 25C15.3891 25 12.25 21.7969 12.25 17.8571C12.25 13.9174 15.3891 10.7143 19.25 10.7143ZM31.5 37.1429C31.5 38.3259 30.4062 39.2857 29.05 39.2857H9.45C8.09375 39.2857 7 38.3259 7 37.1429V35C7 31.4509 10.2922 28.5714 14.35 28.5714H14.8969C16.2422 29.1406 17.7078 29.4643 19.25 29.4643C20.7922 29.4643 22.2688 29.1406 23.6031 28.5714H24.15C28.2078 28.5714 31.5 31.4509 31.5 35V37.1429ZM56 31.25C56 31.7411 55.6063 32.1429 55.125 32.1429H39.375C38.8937 32.1429 38.5 31.7411 38.5 31.25V29.4643C38.5 28.9732 38.8937 28.5714 39.375 28.5714H55.125C55.6063 28.5714 56 28.9732 56 29.4643V31.25ZM56 24.1071C56 24.5982 55.6063 25 55.125 25H39.375C38.8937 25 38.5 24.5982 38.5 24.1071V22.3214C38.5 21.8304 38.8937 21.4286 39.375 21.4286H55.125C55.6063 21.4286 56 21.8304 56 22.3214V24.1071ZM56 16.9643C56 17.4554 55.6063 17.8571 55.125 17.8571H39.375C38.8937 17.8571 38.5 17.4554 38.5 16.9643V15.1786C38.5 14.6875 38.8937 14.2857 39.375 14.2857H55.125C55.6063 14.2857 56 14.6875 56 15.1786V16.9643Z"
                fill="#2F2E41"
              />
            </svg>
          </div>
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
}
