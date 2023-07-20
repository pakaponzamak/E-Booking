import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Bai_Jamjuree } from "next/font/google";

import StartFireBase from "../../firebase/firebase_conf";
import {
  getDatabase,
  ref,
  remove,
  onValue,
  off,
  update,
} from "firebase/database";
import startFireBase from "../../firebase/firebase_conf";

const bai_jamjuree = Bai_Jamjuree({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [clickedDay, setClickedDay] = useState(null);
  const [dayMonthYear, setDayMonthYear] = useState(null);
  const [startIndex, setStartIndex] = useState(1);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState(courses);
  //const incrementCounter = () => setCounterState(counterState + 1);
  const [healthCare, setHealthCare] = useState([]);
  const [users, setUsers] = useState([]);
  const [showContent, setShowContent] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [filterHeader, setFilterHeader] = useState("ประเภทหมอ");

  startFireBase();

  const scrollRef = useRef(null);
  const router = useRouter();
  const { firstName, employeeId, checkIn } = router.query;

  useEffect(() => {
    const db = getDatabase();
    const healthRef = ref(db, "health");
    // Listen for changes in the 'users' reference
    onValue(healthRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert the object of users into an array
        const healthArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        // Set the users state with the retrieved data
        setHealthCare(healthArray);
      }
    });
    // Clean up the listener when the component unmounts
    return () => {
      // Turn off the listener
      off(healthRef);
    };
  }, []);

  useEffect(() => {
    const db = getDatabase();
    const userRef = ref(db, "users");
    // Listen for changes in the 'users' reference
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert the object of users into an array
        const userArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        // Set the users state with the retrieved data
        setUsers(userArray);
      }
    });
    // Clean up the listener when the component unmounts
    return () => {
      // Turn off the listener
      off(userRef);
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

  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

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
          className={`${dayButtonClass} rounded-xl text-center justify-center items-center flex flex-col overflow-x-auto`}
          disabled={isDisabled} // Disable the button for past dates
          style={
            isPastDate && !isCurrentDate ? { backgroundColor: "#f1f5f9" } : null
          } // Change background color for past dates
        >
          <div className="text-center flex  overflow-x-auto">{i}</div>
        </button>
      </div>
    );

    days.push(dayElement);
  }

  const pickedHandler = async (health) => {
    const db = getDatabase();
    var cnf = confirm(`ต้องการจะ "ยืนยัน" การจองหรือไม่`);
    let isPick = false;
    for (const user of users) {
      if (user.employeeId === employeeId) {
        if (user.health.pickedWhat !== "N/A" && user.employeeId === employeeId)
          isPick = true;
        break;
      }
    }
    if (isPick === true) {
      alert(`รหัส "${employeeId}" ได้ทำจองพบแพทย์ไปแล้วกรุณายกเลิกก่อน`);
    }
    if (cnf && !isPick) {
      if (health.alreadyPicked < 1) {
        const updatedHealth = healthCare.map((h) => {
          if (h.id === health.id) {
            return {
              ...h,
              alreadyPicked: h.alreadyPicked + 1,
            };
          }
          return h;
        });
        setHealthCare(updatedHealth);
        const postData = {
          alreadyPicked: health.alreadyPicked + 1,
          whoPickedThis: employeeId,
        };
        const addToUser = {
          date: health.date,
          plant: health.plant,
          time: health.timeStart,
          type: health.doctor,
          pickedWhat: health.doctor + health.date + health.timeStart,
          
        };

        update(
          ref(db, "health/" + health.doctor + health.date + health.timeStart),
          postData
        );

        update(ref(db, "users/" + employeeId + "/health"), addToUser);
      } else {
        alert("เต็มแล้ว");
      }
    }
  };

  const handleToggleContent = () => {
    setShowContent(!showContent);
  };
  const handleContentClick = () => {
    setShowContent(false); // Sets showContent to false when content is clicked
  };
  const handleFilterClick = (number) => {
    setSelectedNumber(number);
    if (number === 1) {
      setFilterHeader("แพทย์โรคทั่วไป");
    } else if (number === 2) {
      setFilterHeader("แพทย์เฉพาะทางอายุรกรรม");
    } else if (number === 3) {
      setFilterHeader("แพทย์เฉพาะทางกระดูกและข้อ");
    } else {
      setFilterHeader("ทั้งหมด");
    }
  };
  const getTimeFromString = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const currentTime = new Date();
    currentTime.setHours(parseInt(hours));
    currentTime.setMinutes(parseInt(minutes));
    return currentTime;
  };

  return (
    <main
      className={`m-2  ${bai_jamjuree.className} justify-center item-center `}
    >
      <div className="mb-1">
        <p className="mr-5  flex justify-end text-sm">
          ชื่อ :&nbsp; <strong>{firstName}</strong>&nbsp; ID : &nbsp;
          <strong>{employeeId}</strong>
        </p>
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

      <div ref={scrollRef} className="flex justify-between text-center">
        <button onClick={previous7Days} disabled={startIndex === 1}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <div className="flex text-center justify-center gap-2  overflow-x-auto">
          {days}
        </div>
        <button onClick={next7Days} disabled={startIndex + 7 > daysInMonth}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
      <div className="border-b p-1"></div>
      <div className="flex justify-end p-1 relative mb-2">
        <div
          className="w-max px-2 mb- cursor-pointer flex mt-2 text-sm font-bold"
          onClick={handleToggleContent}
        >
          {" "}
          <u>{filterHeader}</u>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5 ml-1"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </div>
        {showContent && (
          <div
            className="absolute bg-white p-5 border rounded-xl  top-9 z-10 border-slate-400"
            onClick={handleContentClick}
          >
            <div className="space-y-2">
              <div
                onClick={() => handleFilterClick(null)}
                className="border rounded-xl p-1"
              >
                <p>ทั้งหมด</p>
              </div>
              <div
                onClick={() => handleFilterClick(1)}
                className="border rounded-xl p-1 "
              >
                <p>แพทย์โรคทั่วไป</p>
              </div>
              <div
                onClick={() => handleFilterClick(2)}
                className="border rounded-xl p-1"
              >
                <p>แพทย์เฉพาะทางอายุรกรรม</p>
              </div>
              <div
                onClick={() => handleFilterClick(3)}
                className="border rounded-xl p-1"
              >
                <p>แพทย์เฉพาะทางกระดูกและข้อ</p>
              </div>
            </div>
          </div>
        )}
        
      </div>
      

      <div>
        {healthCare
          .sort((a, b) => (a.timeStart > b.timeStart ? 1 : -1))
          .filter((healthCare) => {
            const healthCareDate = healthCare.date;
            let doctor = "";
            if (selectedNumber === null) {
              doctor = healthCare.doctor;
            }
            if (selectedNumber === 1) {
              doctor = "แพทย์โรคทั่วไป";
            } else if (selectedNumber === 2) {
              doctor = "แพทย์เฉพาะทางอายุรกรรม";
            } else if (selectedNumber === 3) {
              doctor = "แพทย์เฉพาะทางกระดูกและข้อ";
            }
            return (
              dayMonthYear === healthCareDate && doctor === healthCare.doctor
            );
          })
          .map((healthCare) => {const timeStart = getTimeFromString(healthCare.timeStart);return(
            
            <div
              key={healthCare.id}
              className="border-2 mx-3 p-2 rounded-xl bg-slate-200 drop-shadow-lg mb-5 "
            >
              <div className="flex justify-between mb-2">
                <h1>
                  ประเภท : <strong>{healthCare.doctor} </strong>
                </h1>
              </div>
              <div className="flex justify-between mb-2">
                <p>
                  Plant : <strong>{healthCare.plant}</strong>
                </p>
              </div>
              <div className="flex justify-between mt-3">
                <p>
                  วันที่ :{" "}
                  <strong>
                    {new Date(healthCare.date).toLocaleDateString("th-TH", {
                      dateStyle: "long",
                    })}
                  </strong>
                </p>
                <p>
                  จำนวน : <strong>{healthCare.alreadyPicked} / 1</strong>
                </p>
              </div>
              <div className="flex justify-between mt-3">
                <p>
                  เวลา :{" "}
                  <strong>
                    {healthCare.timeStart} - {healthCare.timeEnd}
                  </strong>
                </p>

                <button
                  onClick={() => pickedHandler(healthCare)}
                  className={healthCare.alreadyPicked >= 1 ? "" : ""}
                  disabled={healthCare.alreadyPicked >= 1}
                >
                  <div className="">
                    {healthCare.alreadyPicked >= 1 ? (
                      <span className="text-white bg-red-600 p-2 px-2 rounded-2xl font-semibold">
                        จองแล้ว
                      </span>
                    ) : (
                      <span className="text-white bg-green-600 p-2 px-4 rounded-2xl font-semibold">
                        ว่าง
                      </span>
                    )}
                  </div>
                </button>
              </div>
            </div>
          )})}
      </div>
    </main>
  );
}