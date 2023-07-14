import React, { useState, useEffect,useCallback } from "react";
import Image from "next/image";
import { Bai_Jamjuree } from "next/font/google";
import { useRouter } from "next/router";
import DensoLogo from "../images/Denso_logo.png";
import { getDatabase, ref, set, onValue, off } from "firebase/database";
import StartFireBase from "../../firebase/firebase_conf";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

const bai = Bai_Jamjuree({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "700"],
});

export default function tr_admin_course() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isHealthCareExpanded, setIsHealthCareExpanded] = useState(false);
  const [isCourseExpanded, setIsCourseExpanded] = useState(false);
  const [course, setCourses] = useState([]);
 // const [showForm, setShowForm] = useState(false);
  const [courseOption, setCourseOption] = useState("");
  const [plantOption, setPlantOption] = useState("");
  const [lecturer,setLecturer] = useState("")
  const [place, setPlace] = useState("");
  const [onlineCode, setOnlineCode] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");

  const [click, setClick] = useState(0);

  const increase = () => {
    setClick((count) => count + 1);
  };



  StartFireBase();

  useEffect(() => {
    const db = getDatabase();
    const courseRef = ref(db, "courses");
    // Listen for changes in the 'users' reference
    onValue(courseRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert the object of users into an array
        const coursesArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        // Set the users state with the retrieved data
        setCourses(coursesArray);
      }
    });
    // Clean up the listener when the component unmounts
    return () => {
      // Turn off the listener
      off(courseRef);
    };
  }, []);


  const router = useRouter();
 
  const handleSubmit = () => {
   if (
      courseOption.trim() === "" ||
      timeStart.trim() === "" ||
      timeEnd.trim() === "" ||
      date.trim() === "" ||
      lecturer.trim() === "" ||
      place.trim() === "" ||
      plantOption.trim() === "" ||
      onlineCode.trim() === "" ||
      amount === 0
    ) {
      alert("Please fill out all the required fields.");
      return;
    }

    const db = getDatabase();
    const data = {
      course: courseOption,
      timeStart: timeStart,
      timeEnd: timeEnd,
      date: date,
      lecturer: lecturer,
      amount: amount,
      hall: place,
      plant: plantOption,
      onlineCode: onlineCode,
      number:0
    };
    set(ref(db, "courses/" + courseOption + date + timeStart + onlineCode ), data).then(() => {alert("เรียบร้อยแล้ว");window.location.reload();}).catch((error) => {
      console.error("Error inserting data:", error);
    });
  }

 const handlePlaceChange = useCallback((e) => {
   setPlace(e.target.value);
 }, []);

  const courseOptionChange = (event) => {
   setCourseOption(event.target.value)
   console.log(courseOption)
 }
 const plantOptionChange = (event) => {
   setPlantOption(event.target.value)
   console.log(plantOption)
 }

  const toggleHealthCareMenu = () => {
    setIsHealthCareExpanded(!isHealthCareExpanded);
    setIsCourseExpanded(false);
    setActiveMenu("healthcare");
  };

  const toggleCourseMenu = () => {
    setIsCourseExpanded(!isCourseExpanded);
    setIsHealthCareExpanded(false);
    setActiveMenu("trainingcourse");
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    setIsHealthCareExpanded(false);
    setIsCourseExpanded(false);
    navigateToSection(menu);
  };

  const handleSubMenuClick = (menu) => {
    setActiveMenu(menu);
    navigateToSection(menu);
  };

  const isMenuActive = (menu) => {
    return activeMenu === menu;
  };

  const navigateToSection = (menu) => {
    switch (menu) {
      
      case "about":
        router.push("../admin_TRcourse/admin_insert");
        break;
      case "Option 4":
        router.push("../admin_TRcourse/tr_admin_users");
        break;
      case "Option 5":
        router.push("../admin_TRcourse/tr_admin_course");
        break;
        case "Option 2":
        router.push("../admin_health/hc_admin_users");
        break;
        case "Option 3":
        router.push("./hc_admin_list");
        break;
        case "tr insert":
          router.push("../admin_TRcourse/tr_admin_insert");
          break;
          case "Option 1":
          router.push("./hc_admin_insert");
          break;

      // Add more cases for other menu items and corresponding routes
      default:
        break;
    }
  };

  

  return (
    <div className={`flex h-screen ${bai.className} bg-slate-100`}>
      <div className="w-58 bg-gray-800 rounded-3xl p-3 m-2 flex flex-col drop-shadow-xl">
        <div className="p-4 text-center">
          <Image
            src={DensoLogo}
            alt="Denso logo"
            width={150}
            className="mx-auto mb-2"
          />
          <h1 className="text-white text-xl font-bold italic">
            Admin Dashboard
          </h1>
        </div>

        <nav className="text-gray-300 flex-1 drop-shadow-lg">
          <ul className="space-y-2 py-4 mx-2">
           

            <li>
              <a
                href="#"
                className={`flex items-center px-4 py-3 ${
                  isMenuActive("healthcare")
                    ? "text-white border-b-2 border-blue-500 bg-blue-500 rounded-3xl"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={toggleHealthCareMenu}
              >
                <svg
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
                Health Care
              </a>
              {isHealthCareExpanded && (
                <ul className="space-y-2 ml-6">
                  <li>
                    <a
                      href="#"
                      className={`flex items-center px-4 py-3 ${
                        isMenuActive("Option 1")
                          ? "text-white border-b-2 border-blue-500 bg-blue-500 rounded-3xl"
                          : "text-gray-400 hover:text-white"
                      }`}
                      onClick={() => handleSubMenuClick("Option 1")}
                    >
                      <svg
                        className="h-6 w-6 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        ></path>
                      </svg>
                      <span className="">ใส่ข้อมูล</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className={`flex items-center px-4 py-3 ${
                        isMenuActive("Option 2")
                          ? "text-white border-b-2 border-blue-500 bg-blue-500 rounded-3xl"
                          : "text-gray-400 hover:text-white"
                      }`}
                      onClick={() => handleSubMenuClick("Option 2")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                      </svg>

                      <span className="ml-2">ข้อมูลผู้ใช้งาน</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className={`flex items-center px-4 py-3 ${
                        isMenuActive("Option 3")
                          ? "text-white border-b-2 border-blue-500 bg-blue-500 rounded-3xl"
                          : "text-gray-400 hover:text-white"
                      }`}
                      onClick={() => handleSubMenuClick("Option 3")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                      </svg>

                      <span className="ml-2">ตารางแพทย์</span>
                    </a>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <a
                href="#"
                className={`flex items-center px-4 py-3 ${
                  isMenuActive("trainingcourse")
                    ? "text-white border-b-2 border-blue-500 bg-blue-500 rounded-3xl"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={toggleCourseMenu}
              >
                <svg
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
                Training Course
              </a>
              {isCourseExpanded && (
                <ul className="space-y-2 ml-6">
                  <li>
                    <a
                      href="#"
                      className={`flex items-center px-4 py-3 ${
                        isMenuActive("tr insert")
                          ? "text-white border-b-2 border-blue-500 bg-blue-500 rounded-3xl"
                          : "text-gray-400 hover:text-white"
                      }`}
                      onClick={() => handleSubMenuClick("tr insert")}
                    >
                      <svg
                        className="h-6 w-6 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        ></path>
                      </svg>
                      <span className="">ใส่ข้อมูล</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className={`flex items-center px-4 py-3 ${
                        isMenuActive("Option 4")
                          ? "text-white border-b-2 border-blue-500 bg-blue-500 rounded-3xl"
                          : "text-gray-400 hover:text-white"
                      }`}
                      onClick={() => handleSubMenuClick("Option 4")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                      </svg>
                      <span className="ml-2">ข้อมูลผู้ใช้งาน</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className={`flex items-center px-4 py-3 ${
                        isMenuActive("Option 5")
                          ? "text-white border-b-2 border-blue-500 bg-blue-500 rounded-3xl"
                          : "text-gray-400 hover:text-white"
                      }`}
                      onClick={() => handleSubMenuClick("Option 5")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                      </svg>
                      <span className="ml-2">ตารางอบรม</span>
                    </a>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <a
                href="#"
                className={`flex items-center px-4 py-3 ${
                  isMenuActive("about")
                    ? "text-white border-b-2 border-blue-500 bg-blue-500 rounded-3xl"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => handleMenuClick("about")}
              >
                <svg
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                TBA
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="flex-1 w-min drop-shadow-lg">
        <div className="w-58 bg-slate-300 rounded-3xl p-3 m-2 flex flex-col">
          <h1 className="font-extrabold text-3xl p-3 ">ใส่ข้อมูลข้อมูลคอร์ส</h1>
          <div className="border-b border-gray-800 mb-4"></div>
          <div className="grid grid-cols-2">
            <div>
            <div className="text-center mb-3 mt-10">
                <FormControl>
                  <div>เลือกคอร์ส</div>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={courseOption}
                    required="required"
                    onChange={courseOptionChange}
                  >
                    <FormControlLabel
                      value="TMC-1"
                      control={<Radio />}
                      label="TMC - 1"
                    />
                    <FormControlLabel
                      value="TMC-2"
                      control={<Radio />}
                      label="TMC - 2"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
              <div className="text-center mb-1">
                <FormControl>
                  <div>เลือก Plant</div>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    required="required"
                    value={plantOption}
                    onChange={plantOptionChange}
                  >
                    <FormControlLabel
                      value="SRG"
                      control={<Radio />}
                      label="SRG"
                    />
                    <FormControlLabel
                      value="WELL"
                      control={<Radio />}
                      label="WELL"
                    />
                    <FormControlLabel
                      value="BPK"
                      control={<Radio />}
                      label="BPK"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
              <div className="text-center">
              <div>ผู้บรรยาย</div>
                <input
                  className="px-10 py-3 rounded-xl m-2 "
                  placeholder="ผู้บรรยาย"
                  type="text"
                  name="username"
                  id="username"
                  required="required"
                  onChange={(e) =>
                     setLecturer(e.target.value)
                   }
                ></input>
                <div>สถานที่</div>
                <input
                  className=" px-10 py-3 rounded-xl m-2 "
                  placeholder="สถานที่"
                  type="text"
                  name="username"
                  id="username"
                  required="required"
                  onChange={handlePlaceChange}
                ></input>
                <div>Online Code</div>
                <input
                  className=" px-10 py-3 rounded-xl m-2 "
                  placeholder="Online Code"
                  type="text"
                  name="username"
                  id="username"
                  required="required"
                  onChange={(e) => setOnlineCode(e.target.value)}
                ></input>
                
              </div>
              <div className="text-center">
                  <div>จำนวนคน</div>
                  <input
                  className=" px-10 py-3 rounded-xl m-2 "
                  placeholder="จำนวนคน"
                  type="number"
                  name="username"
                  id="username"
                 
                  required="required"
                  onChange={(e) => setAmount(e.target.value)}
                ></input>
                <div className="mb-5"></div>
                <div className="mb-20">
                  <label htmlFor="datepicker-date" className="mx-2">
                    วันที่
                  </label>
                  <input
                    type="date"
                    id="datepicker-date"
                    name="datepicker-date"
                    className="p-4 rounded-2xl px-4 py-3 mr-2"
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <label htmlFor="datepicker-date" className="mx-2">
                    เวลา :{" "}
                  </label>
                  <input
                    type="time"
                    id="datepicker-start"
                    name="datepicker-start"
                    className="p-4 rounded-2xl px-4 py-3"
                    onChange={(e) => setTimeStart(e.target.value)}
                  />
                  <label htmlFor="datepicker-end" className="mx-2">
                    ไปจนถึง
                  </label>
                  <input
                    type="time"
                    id="datepicker-end"
                    name="datepicker-end"
                    className="p-4 rounded-2xl px-4 py-3"
                    onChange={(e) => setTimeEnd(e.target.value)}
                  />
                </div>
                
               
                </div>
             
            </div>
            <div>
            <div>
              <div className="border-2 m-3 p-2 rounded-xl bg-slate-200 drop-shadow-lg mb-5 mt-10">
                <div className="text-center font-extrabold text-3xl">
                  Preview
                </div>
                <div className="flex justify-between mb-2">
                  <h1>
                    Date : <strong>{date}</strong>
                  </h1>
                  
                </div>
                <div className="flex justify-between mb-2">
                  <h1>
                    Course : <strong>{courseOption}</strong>
                  </h1>
                  <p>
                    Plant : <strong>{plantOption}</strong>
                  </p>
                </div>
                <div className="flex justify-between mb-2">
                  <h1>
                    Time :{" "}
                    <strong>
                      {timeStart} - {timeEnd}
                    </strong>
                  </h1>
                  <p>
                    Online : <strong>{onlineCode}</strong>
                  </p>
                </div>
                <div className="flex justify-between mb-2">
                  <p>
                    Lecturer : <strong>{lecturer}</strong>
                  </p>
                  <p>
                    Onside :{" "}
                    <strong>
                      {click} / {amount}
                    </strong>
                  </p>
                </div>
                <div className="flex justify-between mt-3">
                  <p>
                    Place : <strong>{place}</strong>
                  </p>
                  <button
                    onClick={increase}
                    className={click >= amount ? "" : ""}
                    disabled={click >= amount}
                  >
                    <div className="">
                      {click >= amount ? (
                        <span className="text-white bg-red-600 p-2 px-2  rounded-2xl font-semibold cursor-not-allowed">
                          ที่นั่งเต็มแล้ว
                        </span>
                      ) : (
                        <span className="text-white bg-green-600 p-2 px-4 rounded-2xl font-semibold">
                          เลือก
                        </span>
                      )}
                    </div>
                  </button>
                </div>
              </div>
              <div className="text-center">
              <button
                  type="button"
                  onClick={handleSubmit}
                  class="text-white bg-[#D43732] hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 rounded-full text-xl px-32 py-3 text-center 
                                mr-2 mb-5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 font-bold mt-5"
                >
                  ยืนยัน
                </button>
                   
              </div>
            </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
