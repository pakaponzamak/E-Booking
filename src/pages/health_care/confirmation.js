import {
  getDatabase,
  ref,
  onValue,
  off,
  child,
  push,
  update,
  remove,
} from "firebase/database";
import StartFireBase from "../../firebase/firebase_conf";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { Bai_Jamjuree } from "next/font/google";

const bai_jamjuree = Bai_Jamjuree({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

export default function confirmation() {
  StartFireBase();
  const router = useRouter();
  const { firstName, employeeId, checkIn } = router.query;
  const [users, setUsers] = useState([]);
  const [showBtn, setShowBtn] = useState(false);
  const [name, setName] = useState("");
  const [emp, setEmp] = useState("");
  const [checkInStatus, setCheckInStatus] = useState("");

  var today = new Date();
  var date =
    today.getDate() + "-" + (today.getMonth() + 1) + "-" +today.getFullYear() ;
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + " " + time;

  useEffect(() => {
    const db = getDatabase();
    const usersRef = ref(db, "users");
    // Listen for changes in the 'users' reference
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert the object of users into an array
        const usersArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        // Set the users state with the retrieved data
        setUsers(usersArray);
      }
    });

    // Clean up the listener when the component unmounts
    return () => {
      // Turn off the listener
      off(usersRef);
    };
  }, []);

  useEffect(() => {
    // Perform an effect for data
    fetchCheckIn();
  }, [users]);

  const fetchCheckIn = async () => {
    let already = false;
    for (const user of users) {
      if (fetchCheckInHandler(user.employeeId, user.firstName, user.checkIn)) {
        already = true;
        break; // Exit the loop when a matching user is found
      }
    }
  };

  function fetchCheckInHandler(idParameter, nameParameter, checkinParameter) {
    const anotherEmployeeId = employeeId;
    const anotherName = firstName;
    //const buttonId = e.target.id;
    if (idParameter === anotherEmployeeId && nameParameter === anotherName) {
      setName(nameParameter);
      setEmp(idParameter);
      if (checkinParameter === true) {
        setCheckInStatus("เช็คอินเรียบร้อยแล้ว");
      } else if (checkinParameter === false) {
        setCheckInStatus("ยังไม่ได้เช็คอิน");
      }
      return true;
    }
  }

  const confirmHandler = async (e) => {
    var cnf = confirm(`ต้องการจะ "ยืนยัน" การจองหรือไม่`);
    if (cnf) {
      const buttonId = e.target.id;
      // Use the buttonId as needed
      let userFound = false;
      
      for (const user of users) {
        if (performConfirm(user.employeeId, user.firstName, user.checkIn)) {
          userFound = true;
          break; // Exit the loop when a matching user is found
        }
      }
      if (!userFound) {
        // console.log("No match found for userFound:", userFound);
        alert("Account Not Found");
        router.push(`../`);
      }
    }
  };

  const cancelHandler = async (e) => {
    var cnf = confirm(`ต้องการจะ "ยกเลิก" การจองหรือไม่`);
    if (cnf) {
      {
        users.map(
          (user) => performDelete(user.employeeId, user.firstName)
          //user.checkIn = true
        );
      }
      router.push(`../`);
    }
  };

  function performDelete(idParameter, nameParameter) {
    const anotherEmployeeId = employeeId;
    const anotherName = firstName;

    const db = getDatabase();

    const updates = {};
    const postData = {
      firstName: anotherName,
      employeeId: anotherEmployeeId,
      checkIn: true,
    };
    const newPostKey = remove(ref(db, "users/" + anotherEmployeeId), postData);

    if (idParameter === anotherEmployeeId && nameParameter === anotherName) {
      console.log(
        "Match found for employeeId:",
        employeeId,
        firstName,
        newPostKey
      );
      //updates[newPostKey] = postData;
      return remove(ref(db, "users/" + anotherEmployeeId), updates);
    } else {
      console.log("No match found for employeeId:", employeeId);
    }
  }

  function performConfirm(idParameter, nameParameter, checkinParameter) {
    const anotherEmployeeId = employeeId;
    const anotherName = firstName;
    //const ifTrue = checkinParameter
    const db = getDatabase();

    if (idParameter === anotherEmployeeId && nameParameter === anotherName && checkinParameter !== true) {
      const updates = {};
      const postData = {
        firstName: nameParameter,
        employeeId: idParameter,
        checkIn: true,
      };
      const newPostKey = update(
        ref(db, "users/" + anotherEmployeeId),
        postData
      );
      return update(ref(db), updates);
    }
    else if(idParameter === anotherEmployeeId && nameParameter === anotherName && checkinParameter === true)
    {
        alert(`ท่านได้ทำการเช็คอินไปแล้ว`);
        return true;
    }
  }

  return (
    <div className={bai_jamjuree.className}>
      <div className="flex justify-center item-center m-5 drop-shadow-lg mt-14 my-10">
        <div>
          <div className="font-extrabold text-3xl mt-10 text-center">
            ประวัติการจอง
          </div>
          <div className="border text-center p-10 my-20 mt-10 text-2xl rounded-3xl bg-slate-200 drop-shadow-3xl">
            <div>
              {" "}
              <u className="font-extrabold">ชื่อ : {name}</u>
            </div>
            <div>
              {" "}
              <u className="font-bold">ID : {emp}</u>
            </div>
            <div className="">จองคิวแพทย์(ทดลอง)</div>
            <div>Date :</div>
            <div>Time :</div>
            <div className="font-bold ">
              สถานะ :{" "}
              {checkInStatus === "เช็คอินเรียบร้อยแล้ว" ? (
                <div className="text-green-600 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-10 h-10"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="flex flex-col">
                    <div className="text-green-600">{checkInStatus}</div>
                  </div>
                </div>
              ) : (
                <span className="text-red-500 text-center">
                  {checkInStatus}
                </span>
              )}
            </div>
            <div className="mt-5 p-2 flex flex-wrap justify-center space-x-4">
              <button
                onClick={cancelHandler}
                className="text-white bg-[#D43732] rounded-full text-xl text-center font-bold px-6 py-3 "
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmHandler}
                id="confirm-btn"
                className="text-white bg-[#16a34a] rounded-full text-xl text-center font-bold px-6 py-3 "
              >
                เช็คอิน
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
