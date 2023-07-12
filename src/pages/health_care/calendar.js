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

const bai_jamjuree = Bai_Jamjuree({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [clickedDay, setClickedDay] = useState(null);
  const [startIndex, setStartIndex] = useState(1);
  const [counterState, setCounterState] = useState(1);
  const [users, setUser] = useState([]);
  const [courses, setCourses] = useState([]);
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
        const usersArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        // Set the users state with the retrieved data
        setCourses(usersArray);
      }
    });
    // Clean up the listener when the component unmounts
    return () => {
      // Turn off the listener
      off(courseRef);
    };
  }, []);

  const handleNumberClick = (day) => {
    setClickedDay(day);
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const currentDay = currentDate.getDate();
    const date = new Date(currentYear, currentMonth, day);
    const dayOfWeek = date.toLocaleDateString("th-TH", { weekday: "long" });

    console.log("Clicked number:", day);
    console.log("Day of the week:", dayOfWeek);
    console.log("month :", currentMonth + 1);
    console.log(users);
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
  }, []);

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
    const firstLetterOfDay = dayOfWeek.charAt(0);
    const isCurrentDate = i === todayDate;
    const isClickedDay = i === clickedDay;

    const dayButtonClass =
      isCurrentDate &&
      i === todayDate &&
      todayMonth === currentMonth &&
      todayYear === currentYear
        ? "rounded-xl text-right p-2 bg-red-500 w-10 h-10 current-date text-white bg-red-500 hover:bg-red-600"
        : isClickedDay
        ? "rounded-xl text-right p-2 bg-blue-500 w-10 h-10 hover:bg-blue-600 text-white"
        : "text-right p-2 w-10 h-10 bg-slate-200 hover:bg-blue-300 ";

    const dayElement = (
      <div key={i} className="flex-none ">
        <div className="text-center text-xs">{dayOfWeek}</div>
        <button
          onClick={() => handleNumberClick(i)}
          className={`${dayButtonClass} rounded-xl text-center justify-center items-center flex flex-col `}
        >
          <div className="text-center">{i}</div>
        </button>
      </div>
    );

    days.push(dayElement);
  }

  const countClickCheckHandler = async (course) => {
    if (course.number < course.amount) {
      const db = getDatabase();
      const postData = {
        number: course.number + 1,
      };
      update(ref(db, "courses/" + course.id), postData);
    } else {
      alert("เต็มแล้วครับพ่อหนุ่ม");
    }
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

      <div ref={scrollRef} className="flex justify-between ">
        <button onClick={previous7Days} disabled={startIndex === 1}>
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
        <button onClick={next7Days} disabled={startIndex + 7 > daysInMonth}>
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
        {courses.map((courses) => (
          <div
            key={courses.id}
            className="border-2 m-3 p-2 rounded-xl bg-slate-200 drop-shadow-lg mb-5"
          >
            <div className="flex justify-between mb-2">
              <h1>
                Date :{" "}
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
                onClick={() => countClickCheckHandler(courses)}
                className={courses.number >= courses.amount ? "full-button" : ""}
              >
                <div className="">
                  {courses.number >= courses.amount ? (
                    <span className="text-white bg-red-600 p-1 rounded-2xl font-semibold">ครบจำนวนแล้ว</span>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-10 h-10 text-green-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                </div>
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
