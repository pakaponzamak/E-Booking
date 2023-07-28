import React, { useState, useEffect,useRef } from "react";
import Image from "next/image";
import { Bai_Jamjuree } from "next/font/google";
import { useRouter } from "next/router";
import DensoLogo from "../images/Denso_logo.png";
import { getDatabase, ref, remove, onValue, off } from "firebase/database";
import StartFireBase from "../../firebase/firebase_conf";
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2'

const bai = Bai_Jamjuree({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "700"],
});

export default function tr_admin_course() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isHealthCareExpanded, setIsHealthCareExpanded] = useState(false);
  const [isCourseExpanded, setIsCourseExpanded] = useState(false);
  const [course, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [clickedDay, setClickedDay] = useState(null);
  const [dayMonthYear, setDayMonthYear] = useState(null);
  const [startIndex, setStartIndex] = useState(1);
  const scrollRef = useRef(null);
  const [filteredCourses, setFilteredCourses] = useState(course);

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

 //Auto go to current Date when entered
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
  const router = useRouter();

  function deleteSingleUserHandler(course) {
    // Access the user object and perform actions
    console.log("Delete Button clicked for user:", course);
    const db = getDatabase();
    var cnf = confirm(`ต้องการจะ "ลบ" ข้อมูลหรือไม่`);
    if (cnf) {
      remove(ref(db, "courses/" + course.id));
    }
    // Other actions...
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
        router.push("./tr_admin_users");
        break;
      case "Option 5":
        router.push("./tr_admin_course");
        break;
        case "Option 2":
        router.push("../admin_health/hc_admin_users");
        break;
        case "Option 3":
          router.push("../admin_health/hc_admin_list");
          break;
          case "tr insert":
          router.push("./tr_admin_insert");
          break;
          case "Option 1":
          router.push("../admin_health/hc_admin_insert");
          break;

      // Add more cases for other menu items and corresponding routes
      default:
        break;
    }
  };

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

    const filteredCourses = course.filter((course) => {
      const courseDate = course.date;

      //console.log(courseDate)
      return courseDate === date;
    });

    setFilteredCourses(filteredCourses);
  };

  const previous7Days = () => {
    setStartIndex((prevStartIndex) => Math.max(1, prevStartIndex - 15));
  };
  
  const next7Days = () => {
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    const maxStartIndex = daysInMonth - 14; // Maximum start index to prevent exceeding the total number of days
  
    setStartIndex((prevStartIndex) =>
      Math.min(prevStartIndex + 15, maxStartIndex)
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

  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  const days = [];
  for (let i = startIndex; i < startIndex + 15; i++) {
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
      ? "rounded-xl text-right p-2 bg-red-500 w-10 h-10  text-white"
      : isCurrentDate &&
        i === todayDate &&
        todayMonth === currentMonth &&
        todayYear === currentYear
      ? "rounded-xl text-right p-2 bg-red-500 w-10 h-10 current-date text-white"
      : "text-right p-2 w-10 h-10 bg-slate-200 hover:bg-blue-300";

    const dayElement = (
      <div key={i} className="flex-none ">
        <div className="text-center text-xs">{dayOfWeek}</div>
        <button
          onClick={() => handleNumberClick(i)}
          className={`${dayButtonClass} rounded-xl mx-1 text-center justify-center items-center flex flex-col`}
           // Disable the button for past dates
          style={
            isPastDate && !isCurrentDate ? { backgroundColor: "#f1f5f9" } : null
          } // Change background color for past dates
        >
          <div className="text-center flex ">{i}</div>
        </button>
      </div>
    );

    days.push(dayElement);
  }

  const exportAllCoursesToExcel = () => {
    const workbook = XLSX.utils.book_new();
  
    const worksheetData = course
    .sort((a, b) => {
      // Compare dates
      if (a.date === b.date) {
        // If dates are equal, compare times
        return a.timeStart > b.timeStart ? 1 : -1;
      }
      return a.date > b.date ? 1 : -1;
    })
    .map((course) => [
      course.course,
      course.lecturer,
      new Date(course.date).toLocaleDateString('en-GB'),
      `${course.timeStart} - ${course.timeEnd}`,
      course.plant,
      course.hall,
      course.onlineCode,
      `${course.number} / ${course.amount}`,
    ]);
  
  
    const worksheet = XLSX.utils.aoa_to_sheet([
      ['Course', 'Lecturer', 'Date', 'Time', 'Plant', 'Hall', 'Online Code', 'Attendance'],
      ...worksheetData,
    ]);
  
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Courses Data');
  
    XLSX.writeFile(workbook, 'All date courses_data.xlsx');
  };
  const exportSpecificDateCoursesToExcel = () => {
    const workbook = XLSX.utils.book_new();
  
    const worksheetData = course
    .sort((a, b) => a.timeStart > b.timeStart ? 1 : -1).filter((course) => {
      const courseDate = course.date;
      return dayMonthYear === courseDate;
    })
      .map((course) => [
        course.course,
        course.lecturer,
        new Date(course.date).toLocaleDateString('en-GB'),
        `${course.timeStart} - ${course.timeEnd}`,
        course.plant,
        course.hall,
        course.onlineCode,
        `${course.number} / ${course.amount}`,
      ]);
  
    const worksheet = XLSX.utils.aoa_to_sheet([
      ['Course', 'Lecturer', 'Date', 'Time', 'Plant', 'Hall', 'Online Code', 'Attendance'],
      ...worksheetData,
    ]);
  
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Courses Data');
  
    XLSX.writeFile(workbook, `${dayMonthYear} courses_data.xlsx`);
  };

  return (
    <div className={`${bai.className} bg-slate-100 flex h-screen `}>
      <div className="w-58 bg-gray-800 rounded-3xl p-3 m-2 h-full overflow-y-auto">
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
        <div className="rounded-3xl m-2 bg-slate-300 p-3 h-full overflow-y-auto">

        <div className="flex justify-between">
          <h1 className="font-extrabold text-3xl p-3 ">ตารางคอร์สอบรม</h1>
          <div><button className="text-green-700   bg-white p-1 px-2 rounded-3xl mr-3"
                  onClick={exportAllCoursesToExcel}>Export All</button>
                  <button className="text-green-700   bg-white p-1 px-2 rounded-3xl mr-3"
                  onClick={exportSpecificDateCoursesToExcel}>Export Only In Date Selected</button>
                  </div>
          </div>

          <div className="border-b border-gray-800 mb-4"></div>
          <div className="flex justify-between text-center mb-1">
        <button onClick={previousMonth} className="border rounded-full p-2 bg-slate-200">
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
        <button onClick={nextMonth} className="border rounded-full p-2 bg-slate-200">
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
      

      <div ref={scrollRef} className=" flex justify-between text-center mb-4">
        <button onClick={previous7Days} disabled={startIndex === 1} className="border rounded-full p-2 bg-slate-200">
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
        <div className="flex text-center justify-center gap-2">{days}</div>
        <button onClick={next7Days} disabled={startIndex + 7 > daysInMonth} className="border rounded-full p-2 bg-slate-200">
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
      <div className="border-b mb-3 border-b-gray-800"></div>
          <div className="text-center items-center">
            <div className="grid grid-cols-9 gap-3 mx-0 text-center font-bold">
              <div>หัวเรื่อง</div>
              <div>ผู้บรรยาย</div>
              <div>วันที่</div>
              <div>เวลา</div>
              <div>Plant</div>
              <div>สถานที่</div>
              <div>Online Code</div>
              <div>จำนวน</div>
            </div>
            {course.sort((a, b) => a.timeStart > b.timeStart ? 1 : -1).filter((course) => {
            const courseDate = course.date;
            return dayMonthYear === courseDate;
          }).map((course) => (
              <div className="grid grid-cols-9 gap-3 mx-0 my-5 ">
                <div>{course.course}</div>
                <div>{course.lecturer}</div>
                <div>{new Date(course.date).toLocaleDateString('en-GB')}</div>
                <div>
                  {course.timeStart} - {course.timeEnd}
                </div>
                <div>{course.plant}</div>
                <div>{course.hall}</div>
                <div>{course.onlineCode}</div>

                <div
                  className={
                    course.number >= course.amount
                      ? "text-white rounded-3xl bg-red-500 font-bold cursor-pointer"
                      : "text-white rounded-3xl bg-green-500 font-bold cursor-pointer"
                  }
                 
                >
                  {course.number} / {course.amount}
                </div>

                <div className="flex">
                
                  <button
                    onClick={() => deleteSingleUserHandler(course)}
                    className=" text-center p-1 px-3 text-white bg-red-600 rounded-3xl"
                  >
                    ลบ
                  </button>
                  
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
