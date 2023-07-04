import Image from "next/image";
import { Bai_Jamjuree } from "next/font/google";
import DensoLogo from "./images/Denso_logo.png";
import ReactDOM from "react-dom";
import Link from "next/link";
import { useState } from "react";
import StartFireBase from "../firebase/firebase_conf";
import { getDatabase, ref, push, } from "firebase/database";
import { async } from "@firebase/util";


const bai_jamjuree = Bai_Jamjuree({ subsets: ["latin"],weight:['200', '300', '400', '500', '600', '700'] });

export default function Home() {
  StartFireBase();
  const [firstName, setFirstName] = useState("");
  const [employeeId, setEmployee_id] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      firstName: firstName,
      employeeId: employeeId,
    };
    function delay(time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    }

    const db = getDatabase();
    push(ref(db, "users/"), data)
    delay(1000).then(() => {
      console.log(`Inserted ${firstName} successfully`);
     // alert(`Inserted ${firstName} successfully`);
       window.location.href = "./form_selection";
      })
      .catch((error) => {
        console.error("Error inserting data:", error);
      });
  };

  return (
    <main className="flex justify-center item-center m-7 drop-shadow-lg mt-14 ">
      <form
        className="place-content-center text-center p-10 "
        onSubmit={handleSubmit}
      >
        <Image src={DensoLogo} alt="Denso logo" width={350} className="mb-8" />
        <div className="font-extrabold text-[#D43732] italic">
          DNTH Electronic Form
        </div>
        <div className="mb-8 font-extrabold text-[#D43732] italicv" >
          (ระบบฟอร์มออนไลน์)
        </div>
        <div>
          <div>
            <input
              className="border-2 px-5 py-3 rounded-full mb-5 "
              placeholder="ชื่อ"
              type="text"
              name="username"
              id="username"
              required="required"
              onChange={(e) => setFirstName(e.target.value)}
            ></input>
          </div>
          <div>
            <input
              className="border-2 px-5 py-3 rounded-full mb-5 "
              placeholder="รหัสพนักงาน"
              type="text"
              name="employee_id"
              id="employee_id"
              required="required"
              onChange={(e) => setEmployee_id(e.target.value)}
            ></input>
          </div>
        </div>

        <button
          type="summit"
          class="text-white bg-[#D43732] hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 rounded-full text-xl px-14 py-2.5 text-center 
                                mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 font-bold"
        >
          เข้าสู่ระบบ
        </button>
      </form>
    </main>
  );
}
