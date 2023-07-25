import React, { useState, useEffect,useCallback,useRef } from "react";
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
   const [currentDate, setCurrentDate] = useState(new Date());
   const [startIndex, setStartIndex] = useState(1);
   const [clickedDay, setClickedDay] = useState(null);
   const [dayMonthYear, setDayMonthYear] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isHealthCareExpanded, setIsHealthCareExpanded] = useState(false);
  const [isCourseExpanded, setIsCourseExpanded] = useState(false);
  const [courses, setCourses] = useState([]);
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
  const [filteredCourses, setFilteredCourses] = useState(courses);

  const [click, setClick] = useState(0);

  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const scrollRef = useRef(null);
  StartFireBase();

  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();
  useEffect(() => {
    // Scroll to current date section
    if (scrollRef.current) {
      const currentDateElement =
        scrollRef.current.querySelector(".current-date");
      if (currentDateElement) {
        currentDateElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
    setClickedDay(currentDate.getDate());
    setStartIndex(currentDate.getDate());
    const currentDay = currentDate.getDate();
    const currentMonth = `${currentDate.getMonth() + 1}`.padStart(2, "0");
    const currentYear = currentDate.getFullYear();
    const date =
      currentYear +
      "-" +
      currentMonth +
      "-" +
      currentDay.toString().padStart(2, "0");
    setDayMonthYear(date);
    console.log(dayMonthYear);
  }, []);

  const handleNumberClick = (day) => {
    setClickedDay(day);
    const currentMonth = `${currentDate.getMonth() + 1}`.padStart(2, "0");
    const currentYear = currentDate.getFullYear();
    //const currentDay = currentDate.getDate();
    //const date = new Date(currentYear, currentMonth, day);
    //const dayOfWeek = date.toLocaleDateString("th-TH", { weekday: "long" });

    const date =
      currentYear + "-" + currentMonth + "-" + day.toString().padStart(2, "0");
    setDayMonthYear(date);
    console.log(dayMonthYear);

    const filteredCourses = courses.filter((course) => {
      const courseDate = course.date;

      //console.log(courseDate)
      return courseDate === date;
    });

    setFilteredCourses(filteredCourses);
  };

  const previous7Days = () => {
    setStartIndex((prevStartIndex) => Math.max(1, prevStartIndex - 7));
  };

  const next7Days = () => {
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    setStartIndex((prevStartIndex) =>
      Math.min(prevStartIndex + 7, daysInMonth - 6)
    );
  };

  const previousMonth = () => {
    const previousDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1
    );
    setCurrentDate(previousDate);
    setStartIndex(1);
  };

  const nextMonth = () => {
    const nextDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1
    );
    setCurrentDate(nextDate);
    setStartIndex(1);
  };

  const days = [];
  for (let i = startIndex; i < startIndex + 7; i++) {
    if (i > daysInMonth) break;
    const date = new Date(currentYear, currentMonth, i);
    const dayOfWeek = date.toLocaleDateString("th-TH", { weekday: "short" });

    const isCurrentDate = i === todayDate;
    const isClickedDay =
      i === clickedDay &&
      currentYear === todayYear &&
      currentMonth === todayMonth &&
      i < todayDate;

    const isPastDate = date < today;

    const isDisabled = isPastDate && !isCurrentDate; // Set the disabled state based on whether it's a past date and not the current date

    const dayButtonClass = isClickedDay
      ? "rounded-xl text-right p-2 bg-blue-500 w-10 h-10 hover:bg-blue-600 text-white"
      : isDisabled
      ? "rounded-xl text-right p-2 bg-red-500 w-10 h-10 cursor-not-allowed text-white"
      : isCurrentDate &&
        i === todayDate &&
        todayMonth === currentMonth &&
        todayYear === currentYear
      ? "rounded-xl text-right p-2 bg-red-500 w-10 h-10 current-date text-white"
      : "text-right p-2 w-10 h-10 bg-slate-200 hover:bg-blue-300";

    const dayElement = (
      <div key={i} className="flex-none">
        <div className="text-center text-xs">{dayOfWeek}</div>
        <button
          onClick={() => handleNumberClick(i)}
          className={`${dayButtonClass} rounded-xl text-center justify-center items-center flex flex-col`}
          disabled={isDisabled} // Disable the button for past dates
          style={
            isPastDate && !isCurrentDate ? { backgroundColor: "#f1f5f9" } : null
          } // Change background color for past dates
        >
          <div className="text-center">{i}</div>
        </button>
      </div>
    );

    days.push(dayElement);
  }

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
      alert("กรุณากรอกข้อมูล");
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
      number:0,
      whoPickedThisCourse: []
    };
    set(ref(db, "courses/" + courseOption + date + timeStart + onlineCode ), data).then(() => {alert("เรียบร้อยแล้ว");}).catch((error) => {
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
        router.push("../admin_health/hc_admin_list");
        break;
        case "tr insert":
          router.push("../admin_TRcourse/tr_admin_insert");
          break;
          case "Option 1":
          router.push("../admin_health/hc_admin_insert");
          break;

      // Add more cases for other menu items and corresponding routes
      default:
        break;
    }
  };

  

  return (
    <div className={`flex ${bai.className} bg-slate-100  overflow-y-auto `}>
      <div className="w-58 bg-gray-800 rounded-3xl p-3 m-2 flex flex-col drop-shadow-xl h-screen">
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

      <div className="flex-1 w-min drop-shadow-lg h-screen">
        <div className="w-58 bg-slate-300 rounded-3xl p-3 m-2 flex flex-col ">
          <h1 className="font-extrabold text-3xl p-3 ">ใส่ข้อมูลข้อมูลคอร์ส</h1>
          <div className="border-b border-gray-800 mb-4"></div>
          <div className="grid grid-cols-2">
            <div className="border-2 m-3 p-2 rounded-xl bg-slate-200 drop-shadow-lg  mt-5">
            <div className="text-center mb-1 mt-2">
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
                      value="WGR"
                      control={<Radio />}
                      label="WGR"
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
                  className="px-10 py-3 rounded-xl m-1 "
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
                  className=" px-10 py-3 rounded-xl m-1 "
                  placeholder="สถานที่"
                  type="text"
                  name="username"
                  id="username"
                  required="required"
                  onChange={handlePlaceChange}
                ></input>
                <div>Online Code</div>
                <input
                  className=" px-10 py-3 rounded-xl m-1 "
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
                  className=" px-10 py-3 rounded-xl m-1 "
                  placeholder="จำนวนคน"
                  type="number"
                  name="username"
                  id="username"
                 
                  required="required"
                  onChange={(e) => setAmount(e.target.value)}
                ></input>
                <div className="mb-3"></div>
                <div className="mb-5">
                  <label htmlFor="datepicker-date" className="mx-2">
                    วันที่
                  </label>
                  <input
                    type="date"
                    id="datepicker-date"
                    name="datepicker-date"
                    className="p-3 rounded-2xl px-4 py-2 mr-2"
                    onChange={(e) => setDate(e.target.value)}
                  />
                  </div><div className="mb-3">
                  <label htmlFor="datepicker-date" className="mx-2">
                    เวลา :{" "}
                  </label>
                  <input
                    type="time"
                    id="datepicker-start"
                    name="datepicker-start"
                    className="p-3 rounded-2xl px-4 py-2"
                    onChange={(e) => setTimeStart(e.target.value)}
                  />
                  <label htmlFor="datepicker-end" className="mx-2">
                    ไปจนถึง
                  </label>
                  <input
                    type="time"
                    id="datepicker-end"
                    name="datepicker-end"
                    className="p-3 rounded-2xl px-4 py-2"
                    onChange={(e) => setTimeEnd(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSubmit}
                  class="text-white bg-[#D43732] hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 rounded-full text-xl px-32 py-3 text-center 
                                mr-2 mb-5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 font-bold "
                >
                  ยืนยัน
                </button>
               
                </div>
             
            </div>
            <div>
            <div>
              <div className="border-2 m-3 p-2 rounded-xl bg-slate-200 drop-shadow-lg mb-10 mt-5">
                <div className="text-center font-extrabold text-3xl">
                  Preview
                </div>
                <div className="flex justify-between mb-2">
                  <h1>
                    Date : <strong>{new Date(date).toLocaleDateString("th-TH", {
                          dateStyle: "long",
                        })}</strong>
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
              
                   
              </div>
              <div className="border-2 m-3 p-2 rounded-xl bg-slate-200 drop-shadow-lg  mt-5 overflow-y-auto h-96">
                  <main className={`m-2   justify-center item-center `}>
                    <div className="mb-1">
                      <div className="border-b p-1 mb-2"></div>
                    </div>
                    <div className="flex justify-between text-center">
                      <button onClick={previousMonth}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-8 h-8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
                          />
                        </svg>
                      </button>
                      <h2 className="flex text-center justify-center font-bold text-2xl">
                        {clickedDay ? (
                          <>
                            {clickedDay}&nbsp;
                            {currentDate.toLocaleDateString("th-TH", {
                              month: "long",
                              year: "numeric",
                            })}
                          </>
                        ) : (
                          currentDate.toLocaleDateString("th-TH", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })
                        )}
                      </h2>
                      <button onClick={nextMonth}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-8 h-8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="border-b p-1 mb-2"></div>

                    <div ref={scrollRef} className="flex justify-between ">
                      <button
                        onClick={previous7Days}
                        disabled={startIndex === 1}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-8 h-8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5L8.25 12l7.5-7.5"
                          />
                        </svg>
                      </button>
                      <div className="flex text-center justify-center gap-2">
                        {days}
                      </div>
                      <button
                        onClick={next7Days}
                        disabled={startIndex + 7 > daysInMonth}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-8 h-8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="border-b p-1 mb-5"></div>
                    <div>
                      {courses
                        .sort((a, b) => (a.timeStart > b.timeStart ? 1 : -1))
                        .filter((course) => {
                          const courseDate = course.date;
                          return dayMonthYear === courseDate;
                        })
                        .map((courses) => (
                          <div
                            key={courses.id}
                            className=" m-3 p-2 rounded-xl bg-white drop-shadow-lg mb-5"
                          ><div className="flex justify-between mb-2">
                          <p>
                            Date :{" "}
                            <strong>
                            {new Date(courses.date).toLocaleDateString("th-TH", {
                          dateStyle: "long",
                        })}
                            </strong>
                          </p>
                        
                        </div>
                           <div className="flex justify-between mb-2">
                              <p>
                                Course :{" "}
                                <strong>
                                  {courses.course}
                                </strong>
                              </p>
                              <p>
                                Plant : <strong>{courses.plant}</strong>
                              </p>
                            </div>
                            <div className="flex justify-between mb-2">
                              <h1>
                                Time :{" "}
                                <strong>
                                  {courses.timeStart} - {courses.timeEnd}
                                </strong>
                              </h1>
                              <p>
                                Online : <strong>{courses.onlineCode}</strong>
                              </p>
                            </div>
                            <div className="flex justify-between mb-2">
                              <p>
                                Lecturer : <strong>{courses.lecturer}</strong>
                              </p>
                              <p>
                                Onside :{" "}
                                <strong>
                                  {courses.number} / {courses.amount}
                                </strong>
                              </p>
                            </div>
                            <div className="flex justify-between mt-3">
                              <p>
                                Place : <strong>{courses.hall}</strong>
                              </p>
                              <button
                                disabled
                                className={
                                  courses.number >= courses.amount ? "" : ""
                                }
                              >
                                <div className="">
                                  {courses.number >= courses.amount ? (
                                    <span className="text-white bg-red-600 p-2 px-2  rounded-2xl font-semibold">
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
                        ))}
                    </div>
                  </main>
                </div>
            </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
