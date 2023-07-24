import {
  getDatabase,
  ref,
  onValue,
  off,
  child,
  push,
  update,
  set,
} from "firebase/database";
import StartFireBase from "../../firebase/firebase_conf";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import { Bai_Jamjuree } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Swal from "sweetalert2"

const bai_jamjuree = Bai_Jamjuree({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

export default function confirmation() {
  StartFireBase();
  const router = useRouter();
  const { firstName, employeeId, checkIn } = router.query;
  const [users, setUsers] = useState([]);
  const [healthCare, setHealthCare] = useState([]);
  const [showBtn, setShowBtn] = useState(false);
  const [name, setName] = useState("");
  const [emp, setEmp] = useState("");
  const [checkInStatus, setCheckInStatus] = useState("");

  var today = new Date();
  var options = { month: "short", day: "numeric" };
  var date = today.toLocaleDateString("th-TH", options);
  var hours = today.getHours().toString().padStart(2, "0");
  var minutes = today.getMinutes().toString().padStart(2, "0");
  var time = hours + ":" + minutes;
  var dateTime = date + " " + time;

  useEffect(() => {
    const db = getDatabase();
    const healthRef = ref(db, "health");

    onValue(healthRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const healthArray = Object.keys(data).map((key) => {
          const health = {
            id: key,
            ...data[key],
            health: data[key]?.health || null,
          };
          return health;
        });

        setHealthCare(healthArray);
      }
    });

    return () => {
      off(healthRef);
    };
  }, []);

  useEffect(() => {
    const db = getDatabase();
    const usersRef = ref(db, "users");

    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersArray = Object.keys(data).map((key) => {
          const user = {
            id: key,
            ...data[key],
            user: data[key]?.user || null,
          };
          return user;
        });

        setUsers(usersArray);
      }
    });

    return () => {
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
      if (
        fetchCheckInHandler(
          user.employeeId,
          user.firstName,
          user.health.checkIn
        )
      ) {
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
    //var cnf = confirm(`ต้องการจะ "เช็คอิน" หรือไม่`);
    Swal.fire({
      title: 'ท่านต้องการจะ "เช็คอิน" หรือไม่',
      text: "",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#D43732',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
    if (result.isConfirmed) {
      const buttonId = e.target.id;
      // Use the buttonId as needed
      let userFound = false;

      for (const user of users) {
        if (
          performConfirm(
            user.employeeId,
            user.firstName,
            user.health.checkIn,
            user.health.type
          )
        ) {
          userFound = true;
          break; // Exit the loop when a matching user is found
        }
      }
      if (!userFound) {
        // console.log("No match found for userFound:", userFound);
        alert("Account Not Found");
        router.push(`../`);
      }
    }})
  };

  const cancelHandler = async (e) => {
    
    Swal.fire({
      title: 'ท่านต้องการจะ "ยกเลิก" การจองหรือไม่',
      text: "",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#D43732',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
    if (result.isConfirmed) {
      {
        users.map(
          (user) => performDelete(user.employeeId, user.firstName)
          //user.checkIn = true
        );
      }
      //router.push(`../`);
    }})
  };

  function performDelete(idParameter, nameParameter) {
    const anotherEmployeeId = employeeId;
    const anotherName = firstName;
    const db = getDatabase();
    let whoPickedFound = false;

    if (idParameter === anotherEmployeeId && nameParameter === anotherName) {
      for (const health of healthCare) {
        console.log(
          "Match found for employeeId in for:",
          health.whoPickedThis,
          anotherEmployeeId
        );
        if (health.whoPickedThis === anotherEmployeeId) {
          const updates = {
            ["health/" +
            health.plant +
            health.doctor +
            health.date +
            health.timeStart +
            "/whoPickedThis"]: "",
            ["health/" +
            health.plant +
            health.doctor +
            health.date +
            health.timeStart +
            "/alreadyPicked"]: 0,
            ["users/" + anotherEmployeeId + "/health"]: {
              checkIn: false,
              checkInTime: "N/A",
              type: "N/A",
              time: "N/A",
              date: "N/A",
              relationship: "N/A",
              plant: "N/A",
              pickedWhat: "N/A",
              employeeId: anotherEmployeeId,
              firstName: anotherName,
            },
          };
          update(ref(db), updates)
            .then(() => {
              Swal.fire(
                'ยกเลิกสำเร็จ',
                '',
                'success'
              )
            })
            .catch((error) => {
              console.error("Error updating data:", error);
            });
          whoPickedFound = true;
          break;
        }
      }

      if (!whoPickedFound) {
        const updates = {
          ["users/" + anotherEmployeeId + "/health"]: {
            checkIn: false,
            checkInTime: "N/A",
            type: "N/A",
            time: "N/A",
            date: "N/A",
            relationship: "N/A",
            plant: "N/A",
            pickedWhat: "N/A",
          },
        };

        return update(ref(db), updates);
      }
    } else {
      console.log("No match found for employeeId:", employeeId);
    }
  }

  function performConfirm(
    idParameter,
    nameParameter,
    checkinParameter,
    typeParameter
  ) {
    const anotherEmployeeId = employeeId;
    const anotherName = firstName;
    //const ifTrue = checkinParameter
    const db = getDatabase();

    if (
      idParameter === anotherEmployeeId &&
      nameParameter === anotherName &&
      checkinParameter !== true &&
      typeParameter !== "N/A"
    ) {
      const updates = {};
      const postData = {
        firstName: nameParameter,
        employeeId: idParameter,
        health: {
          checkIn: true,
          checkInTime: dateTime,
        },
      };
      updates["users/" + anotherEmployeeId + "/health/checkIn"] = true;
      updates["users/" + anotherEmployeeId + "/health/checkInTime"] = dateTime;
      Swal.fire(
        'เช็คอินสำเร็จ',
        '',
        'success',
        
      )
      return update(ref(db), updates);
    } else if (
      idParameter === anotherEmployeeId &&
      nameParameter === anotherName &&
      checkinParameter === true
    ) {
      Swal.fire(
        'ท่านได้ทำการเช็คอินไปแล้ว',
        '',
        'warning'
      )
      return true;
    } else if (
      idParameter === anotherEmployeeId &&
      nameParameter === anotherName &&
      checkinParameter !== true &&
      typeParameter === "N/A"
    ) {
      Swal.fire({
        title: 'ท่านยังไม่ได้ทำการเลือกเวลานัดหมาย',
        text: '',
        icon: 'warning',
        confirmButtonText: 'ปิด',
        confirmButtonColor: '#D43732'
      })
      return true;
    }
  }
  const getTimeFromString = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const currentTime = new Date();
    currentTime.setHours(parseInt(hours));
    currentTime.setMinutes(parseInt(minutes));
    return currentTime;
  };

  return (
    <div className={`${bai_jamjuree.className} bg-slate-100 h-screen`}>
      <Analytics />
      <div className="flex justify-center item-center">
        <div>
          <div className="border p-6  mb-10 mt-32  rounded-xl bg-white drop-shadow-md">
            {users.map((user) => {
              const timeStart = getTimeFromString(user.health.time);
              if (user.employeeId === emp && user.firstName === name) {
                return (
                  <div className=" mx-2">
                    <div className="text mb-3 text-left ">ประวัติการจอง</div>
                    <div className="border-b mb-3"></div>
                    <div className="text-center mb-4 text-2xl ">
                      <strong>{user.health.type}</strong>
                    </div>
                    <div className="flex justify-between mt-3">
                      <div className="mb-1">
                        วันที่ :{" "}
                        <strong>
                          {user.health.date &&
                          !isNaN(new Date(user.health.date))
                            ? new Date(user.health.date).toLocaleDateString(
                                "th-TH",
                                {
                                  dateStyle: "long",
                                }
                              )
                            : " "}{" "}
                        </strong>
                      </div>
                      <div className="mb-1">
                        เวลา : <strong>{user.health.time}</strong>
                      </div>
                    </div>
                    {/* Render other user data */}

                    {user.health && (
                      <div>
                        <div className="mb-1">
                          Plant : <strong>{user.health.plant}</strong>
                        </div>
                        <p className="mb-1">
                          ชื่อ : <strong>{user.firstName}</strong>
                        </p>
                        <p className="mb-3">
                          ID : <strong>{user.employeeId.toUpperCase()}</strong>
                        </p>

                        <div
                          className={`text-center p-3 px-10 rounded-xl justify-center flex overflow-hidden  ${
                            user.health.checkIn
                              ? "bg-green-500 text-white"
                              : "border-red-500 text-red-500 border"
                          }`}
                        >
                          <div className="flex items-center text-center">
                            <div className="text-center ">
                              {user.health.checkIn ? (
                                <>
                                  เช็คอินแล้ว ณ วันที่{" "}
                                  <span className="font-bold">
                                    {user.health.checkInTime}
                                  </span>
                                </>
                              ) : (
                                "ยังไม่ได้เช็คอิน"
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            })}
            <div className="mb-16 border-b mt-6"></div>
          </div>
          <div className="justify-between flex -translate-y-28 gap-10 mx-10 ">
            <button
              onClick={cancelHandler}
              className="flex-grow text-white bg-[#D43732] hover:bg-[#FF4D49] transition-colors duration-300 text-lg text-center px-8 py-3 rounded-xl font-semibold"
            >
              ยกเลิก
            </button>
            <button
              onClick={confirmHandler}
              id="confirm-btn"
              className="flex-grow text-white bg-[#16a34a] hover:bg-[#0E8A37] transition-colors duration-300 text-lg text-center px-8 py-3 rounded-xl font-semibold"
            >
              เช็คอิน
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
