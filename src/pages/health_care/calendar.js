import { useState, useEffect, useRef } from "react";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [clickedDay, setClickedDay] = useState(null);
  const [startIndex, setStartIndex] = useState(1);
  const scrollRef = useRef(null);

  const handleNumberClick = (number) => {
    setClickedDay(number);
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const date = new Date(currentYear, currentMonth, number);
    const dayOfWeek = date.toLocaleDateString("th-TH", { weekday: "long" });

    console.log("Clicked number:", number);
    console.log("Day of the week:", dayOfWeek);
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
        currentDateElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [currentDate]);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const days = [];
  for (let i = startIndex; i < startIndex + 7; i++) {
    if (i > daysInMonth) break;
    const date = new Date(currentYear, currentMonth, i);
    const dayOfWeek = date.toLocaleDateString("th-TH", { weekday: "long" });
    const isCurrentMonth =
      currentMonth === date.getMonth() && currentYear === date.getFullYear();
    const isCurrentDate = isCurrentMonth && i === currentDate.getDate();
    const isClickedDay = i === clickedDay;

    const buttonClass = isCurrentDate
      ? "border rounded-3xl text-right p-2 bg-red-500 w-10 h-10 current-date hover:bg-red-600"
      : isClickedDay
      ? "border rounded-3xl text-right p-2 bg-blue-500 w-10 h-10 hover:bg-blue-600"
      : "border-2 text-right p-2 w-10 h-10";

    const dayElement = (
      <div key={i} className="flex-none">
        <button
          onClick={() => handleNumberClick(i)}
          className={`${buttonClass} rounded-3xl text-center justify-center items-center flex flex-col hover:bg-blue-100`}
        >
          <div className="text-center">{i}</div>
        </button>
      </div>
    );

    days.push(dayElement);
  }

  return (
    <main className="m-6 col-span-5">
      <div className="flex justify-between mb-4">
        <button onClick={previousMonth}>
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
              d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <h2 className="flex text-center justify-center font-bold">
          {currentDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button onClick={nextMonth}>
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
              d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
      <div className="flex text-center justify-center gap-3">{days}</div>
      <div ref={scrollRef} className="flex justify-between mt-4">
        <button onClick={previous7Days} disabled={startIndex === 1}>
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
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <button onClick={next7Days} disabled={startIndex + 7 > daysInMonth}>
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
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
    </main>
  );
}
