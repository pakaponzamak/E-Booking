import Image from "next/image";
import { Roboto } from "next/font/google";
import { Bai_Jamjuree } from "next/font/google";
import DensoLogo from "../images/Denso_logo.png";
import * as React from "react";
import { useState } from "react";
import { getDatabase, ref, push, set, onValue, off } from "firebase/database";


const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});
import startFireBase from "../../firebase/firebase_conf";

const bai = Bai_Jamjuree({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "700"],
});

export default function admin() {
  //startFireBase();

  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [date, setDate] = useState("");
  const [lecturer, setLecturer] = useState("");
  const [amount, setAmount] = useState(0);
  const [onlineCode, setOnlineCode] = useState("");
  const [meetHall, setMeetHall] = useState("");
  const [course, setCourse] = useState("")
  const [plantSelect, setPlantSelect] = useState(null);
  const number = 0;

  const handleOptionChange = (event) => {
    setPlantSelect(event.target.value);
  };

  const courseOptionChange = (event) => {
    setCourse(event.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const db = getDatabase();
    const data = {
      course: course,
      timeStart: timeStart,
      timeEnd: timeEnd,
      date: date,
      lecturer: lecturer,
      amount: amount,
      hall: meetHall,
      plant: plantSelect,
      onlineCode: onlineCode,
      number:number
    };
    set(ref(db, "courses/" + course + date + timeStart + onlineCode ), data).then(() => {alert("เรียบร้อยแล้ว")}).catch((error) => {
      console.error("Error inserting data:", error);
    });

  };

  return (
    <div className={`${bai.className} font-medium`}>
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        class="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span class="sr-only">Open sidebar</span>
        <svg
          class="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clip-rule="evenodd"
            fill-rule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="default-sidebar"
        class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <ul class="space-y-2 font-medium">
            <li className="mb-10">
              <a
                href="#"
                class="flex items-center  text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div>
                  <Image
                    src={DensoLogo}
                    alt="Denso logo"
                    width={250}
                    className="mb-1"
                  />
                  <p className="text-center italic text-bold">
                    Admin Dashboard
                  </p>
                </div>
              </a>
            </li>

            <li>
              <a
                href="#"
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg
                  aria-hidden="true"
                  class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                </svg>
                <span class="ml-3">Dashboard</span>
              </a>
            </li>

            <li>
              <a
                href="./admin_users"
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg
                  aria-hidden="true"
                  class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="flex-1 ml-3 whitespace-nowrap">
                  Health Care Data
                </span>
              </a>
            </li>

            <li>
              <a
                href="#"
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-red-400 bg-red-300"
              >
                <svg
                  aria-hidden="true"
                  class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="flex-1 ml-3 whitespace-nowrap">Insert Data</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>

      <div class="p-4 sm:ml-64">
        <div className="">
          <div className=" rounded-3xl bg-red-100 drop-shadow-lg p-5">
            <h1 className="font-extrabold text-4xl pt-2 text-center">คอร์สอบรมวินัยทางการเงิน</h1>
            <div>
              <form
                className="p-3 text-center"
                onSubmit={handleSubmit}
              >
                <div className="mb-5">
                  <div>
                  <p>เลือก Course</p>
                    <label className="mx-3">
                      <input
                        type="radio"
                        name="tmc1"
                        value="TMC-1"
                        checked={course === "TMC-1"}
                        onChange={courseOptionChange}
                        className="mx-2"
                      />
                      TMC 1
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="tmc2"
                        value="TMC-2"
                        checked={course === "TMC-2"}
                        onChange={courseOptionChange}
                        className="mx-2"
                      />
                      TMC 2
                    </label>
                  </div>
                  <div className="p-2">
                    <p>เลือก Plant</p>
                    <label>
                      <input
                        type="radio"
                        name="srg"
                        value="SRG"
                        checked={plantSelect === "SRG"}
                        onChange={handleOptionChange}
                        className="mx-2"
                      />
                      SRG
                    </label>

                    <label>
                      <input
                        type="radio"
                        name="well"
                        value="WELL"
                        checked={plantSelect === "WELL"}
                        onChange={handleOptionChange}
                        className="mx-2"
                      />
                      WELL
                    </label>

                    <label>
                      <input
                        type="radio"
                        name="bpk"
                        value="BPK"
                        checked={plantSelect === "BPK"}
                        onChange={handleOptionChange}
                        className="mx-2"
                      />
                      BPK
                    </label>
                  </div>
                  <div>
                    <label className="mr-2">ผู้บรรยาย</label>
                    <input
                      className="border-2 px-5 py-3 rounded-full mb-5 "
                      placeholder="ผู้บรรยาย"
                      type="text"
                      name="username"
                      id="username"
                      required="required"
                      onChange={(e) =>
                        setLecturer(e.target.value)
                      }
                    ></input>
                  </div>
                  <div>
                  <label className="mr-2">สถานที่</label>
                    <input
                      className="border-2 px-5 py-3 rounded-full mb-5 "
                      placeholder="สถานที่"
                      type="text"
                      name="employee_id"
                      id="employee_id"
                      required="required"
                      onChange={(e) =>
                        setMeetHall(e.target.value)
                      }
                    ></input>
                  </div>
                  <div>
                  <label className="mr-2">Online Code</label>
                    <input
                      className="border-2 px-5 py-3 rounded-full mb-5 "
                      placeholder="Online Code"
                      type="text"
                      name="employee_id"
                      id="employee_id"
                      required="required"
                      onChange={(e) => setOnlineCode(e.target.value)}
                    ></input>
                  </div>
                  <div>
                  <label className="mr-2">จำนวนคน</label>
                    <input
                      className="border-2 px-5 py-3 rounded-full mb-5 "
                      placeholder="จำนวนคน"
                      type="number"
                      name="employee_id"
                      id="employee_id"
                      required="required"
                      onChange={(e) => setAmount(e.target.value)}
                    ></input>
                  </div>
                  <div>
                    <span className="mx-3">วันที่</span>
                    <input
                      type="date"
                      id="datepciker"
                      name="datepicker"
                      className="p-4 rounded-2xl px-5 py-3 mb-5"
                      onChange={(e) => setDate(e.target.value)}
                    ></input>
                  </div>
                  <div>
                    <span className="mx-3">ตั้งแต่</span>
                    <input
                      type="time"
                      id="datepciker"
                      name="datepicker"
                      className="p-4 rounded-2xl px-5 py-3"
                      onChange={(e) => setTimeStart(e.target.value)}
                    ></input>
                    <span className="mx-3">ไปจนถึง</span>
                    <input
                      type="time"
                      id="datepciker"
                      name="datepicker"
                      className="p-4 rounded-2xl px-5 py-3"
                      onChange={(e) => setTimeEnd(e.target.value)}
                    ></input>
                  </div>
                </div>

                <button
                  type="submit"
                  class="text-white bg-[#D43732] hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 rounded-full text-xl px-14 py-2.5 text-center 
                                mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 font-bold"
                >
                  ยืนยัน
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
