import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Bai_Jamjuree } from "next/font/google";
import StartFireBase from "../../firebase/firebase_conf";
import { Analytics } from "@vercel/analytics/react";
import { getDatabase, ref, get, onValue, off, update } from "firebase/database";
import Swal from "sweetalert2";
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

  const scrollRef = useRef(null);
  StartFireBase();
  const router = useRouter();
  const { firstName, employeeId, checkIn } = router.query;

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
  const countClickCheckHandler = async (course) => {
    const db = getDatabase();
    const userPickedCourse = courses.find((c) => c.id === course.id);

    if (!userPickedCourse.whoPickedThisCourse) {
      userPickedCourse.whoPickedThisCourse = []; // Ensure that it's an array when not present
    }

    if (userPickedCourse.whoPickedThisCourse.includes(employeeId)) {
      // The user has already picked the course, so we want to allow them to remove it
      const updatedCourses = courses.map((c) => {
        if (c.id === course.id) {
          return {
            ...c,
            number: c.number - 1,
            whoPickedThisCourse: c.whoPickedThisCourse.filter(
              (id) => id !== employeeId
            ),
          };
        }
        return c;
      });
      setCourses(updatedCourses);

      const postData = {
        number: userPickedCourse.number - 1,
        whoPickedThisCourse: userPickedCourse.whoPickedThisCourse.filter(
          (id) => id !== employeeId
        ),
      };
      const userData = {
        course: "N/A",
        date: "N/A",
        hall: "N/A",
        time:"N/A",
        plant:"N/A"
      }
      await update(
        ref(
          db,
          "courses/" +
            course.course +
            course.date +
            course.timeStart +
            course.onlineCode
        ),
        postData
      );
      await update(
        ref(
          db,
          "users/" +
            employeeId +
            "/courses"
        ),
        userData
      );
    } else {
      // The user has not picked the course, so we want to allow them to add it
      if (userPickedCourse.number + 1 > userPickedCourse.amount) {
        alert("เต็มแล้วครับพ่อหนุ่ม");
        return;
      }

      const updatedCourses = courses.map((c) => {
        if (c.id === course.id) {
          return {
            ...c,
            number: c.number + 1,
            whoPickedThisCourse: [...c.whoPickedThisCourse, employeeId],
          };
        }
        return c;
      });
      setCourses(updatedCourses);

      const postData = {
        number: userPickedCourse.number + 1,
        whoPickedThisCourse: [
          ...userPickedCourse.whoPickedThisCourse,
          employeeId,
        ],
      };
      const userData = {
        course: course.course,
        date: course.date,
        hall: course.hall,
        time:course.timeStart,
        
      }

      await update(
        ref(
          db,
          "courses/" +
            course.course +
            course.date +
            course.timeStart +
            course.onlineCode
        ),
        postData
      );
      await update(
        ref(
          db,
          "users/" +
            employeeId +
            "/courses"
        ),
        userData
      );
    }
  };


  return (
    <main
      className={`m-2  ${bai_jamjuree.className} justify-center item-center `}
    >
      <Analytics />
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

      <div ref={scrollRef} className="flex justify-between ">
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
        <div className="flex text-center justify-center gap-2 overflow-x-auto">
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
              className=" m-3 p-2 rounded-xl bg-slate-200 drop-shadow-lg mb-5"
            >
              <div className="flex justify-between mb-2">
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
                  Course : <strong>{courses.course}</strong>
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
                  Place: <strong>{courses.hall}</strong>
                </p>
                {courses.number >= courses.amount && !courses.whoPickedThisCourse.includes(employeeId) ? (
                  <button
                    onClick={() => countClickCheckHandler(courses)}
                    className="bg-gray-400 text-white p-2 px-4 rounded-2xl font-semibold"
                  >
                    ที่นั่งเต็มแล้ว
                  </button>
                ) : (
                  <>
                    {courses.whoPickedThisCourse &&
                    courses.whoPickedThisCourse.includes(employeeId) ? (
                      <button
                        onClick={() => countClickCheckHandler(courses)}
                        className="bg-red-600 text-white p-2 px-4 rounded-2xl font-semibold"
                      >
                        ยกเลิก
                      </button>
                    ) : (
                      <button
                        onClick={() => countClickCheckHandler(courses)}
                        className="bg-green-600 text-white p-2 px-4 rounded-2xl font-semibold"
                      >
                        เลือก
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}
