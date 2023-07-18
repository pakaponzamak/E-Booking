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
  const [healthCare, setHealthCare] = useState([]);
  const [showBtn, setShowBtn] = useState(false);
  const [name, setName] = useState("");
  const [emp, setEmp] = useState("");
  const [checkInStatus, setCheckInStatus] = useState("");

  var today = new Date();
  var options = { month: "short", day: "numeric" };
  var date = today.toLocaleDateString("th-TH", options);
  var time = today.getHours() + ":" + today.getMinutes();
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
    var cnf = confirm(`ต้องการจะ "ยืนยัน" การจองหรือไม่`);
    if (cnf) {
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

  function performHealthCareRemovePerson(
    whoPickedParam,
    empParam,
    typeParam,
    dateParam,
    timeParam
  ) {
    if (whoPickedParam === empParam) {
      const db = getDatabase();
      const updates = {
        ["health/" + typeParam + dateParam + timeParam + "/whoPickedThis"]: "",
        ["health/" + typeParam + dateParam + timeParam + "/alreadyPicked"]: 0,
      };
      update(ref(db), updates)
        .then(() => {
          alert("ByeBye");
        })
        .catch((error) => {
          console.error("Error updating data:", error);
        });
      return true;
    }
  }

  function performDelete(idParameter, nameParameter) {
    const anotherEmployeeId = employeeId;
    const anotherName = firstName;
    const db = getDatabase();
    let whoPickedFound = false;
    if (idParameter === anotherEmployeeId && nameParameter === anotherName) {
      console.log("Match found for employeeId:", employeeId, firstName);
      for (const health of healthCare) {
        if (
          performHealthCareRemovePerson(
            health.whoPickedThis,
            employeeId,
            health.doctor,
            health.date,
            health.timeStart
          )
        ) {
          whoPickedFound = true;
          break;
        }
        if (!whoPickedFound) {
          break;
        }
      }

      const updates = {
        ["users/" + anotherEmployeeId + "/health"]: {
          checkIn: false,
          checkInTime: "N/A",
          type: "N/A",
          time: "N/A",
          date: "N/A",
          relationship: "N/A",
          plant: "N/A",
        },
      };

      return update(ref(db), updates);
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

      return update(ref(db), updates);
    } else if (
      idParameter === anotherEmployeeId &&
      nameParameter === anotherName &&
      checkinParameter === true
    ) {
      alert(`ท่านได้ทำการเช็คอินไปแล้ว`);
      return true;
    } else if (
      idParameter === anotherEmployeeId &&
      nameParameter === anotherName &&
      checkinParameter !== true &&
      typeParameter === "N/A"
    ) {
      alert("ยังไม่ได้เลือกเวลานัดหมาย");
      return true;
    }
  }

  return (
    <div className={`${bai_jamjuree.className} bg-slate-100 h-screen`}>
      <div className="flex justify-center item-center">
        <div>
          <div className="border  p-5  mt-20  rounded-xl bg-white drop-shadow-md">
            {users.map((user) => {
              if (user.employeeId === emp && user.firstName === name) {
                return (
                  <div>
                    <div className="font text mb-2 text-left ">
                      ประวัติการจอง
                    </div>
                    <div className="border-b mb-2"></div>
                    <div className="text-center mb-3 text-lg">
                      <u>
                        <strong>{user.health.type}</strong>
                      </u>
                    </div>
                    <div className="">
                      ID : <strong>{user.employeeId}</strong>
                    </div>
                    <div className="">
                      ชื่อ : <strong>{user.firstName}</strong>
                    </div>
                    {/* Render other user data */}
                    
                    {user.health && (
                      <div>
                        <div className="">
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
                        <div className="">
                          เวลา : <strong>{user.health.time}</strong>
                        </div>
                        <div className="mb-3">
                          Plant : <strong>{user.health.plant}</strong>
                        </div>

                        <div
                          className={`text-center p-3 rounded-xl justify-center flex overflow-hidden text-white ${
                            user.health.checkIn ? "bg-green-500" : "bg-red-500"
                          }`}
                        >
                          <div className="flex items-center text-center">
                            <div className="text-center">
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

            <div className="mt-5 p-2 flex flex-wrap justify-center space-x-4">
              <button
                onClick={cancelHandler}
                className="text-white bg-[#D43732] rounded-3xl text-xl text-center font-bold px-6 py-3 "
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmHandler}
                id="confirm-btn"
                className="text-white bg-[#16a34a] rounded-3xl text-xl text-center font-bold px-6 py-3 "
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
