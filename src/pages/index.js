import Image from "next/image";
import { Bai_Jamjuree } from "next/font/google";
import DensoLogo from "./images/Denso_logo.png";
import { useState, useEffect } from "react";
import StartFireBase from "../firebase/firebase_conf";
import { getDatabase, ref, onValue, off } from "firebase/database";
import { useRouter } from "next/router";

const bai_jamjuree = Bai_Jamjuree({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

export default function Home() {
  StartFireBase();
  const [users, setUsers] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [forgotName, setForgotName] = useState("");
  const [employeeId, setEmployee_id] = useState("");
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);


  useEffect(() => {
    const db = getDatabase();
    const usersRef = ref(db, "users");
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setUsers(usersArray);
      }
    });
    return () => {
      off(usersRef);
    };
  }, []);

  const userIsNotCheckHandler = async (e) => {
    let userFound = false;
    for (const user of users) {
      if (checkUser(user.employeeId, user.firstName, user.checkIn)) {
        userFound = true;
        break;
      }
    }
    if (!userFound) {
      var checkIn = false;
      const data = {
        firstName: firstName,
        employeeId: employeeId,
        courses: {
          firstName: firstName,
          employeeId: employeeId,
          course: "N/A",
          date: "N/A",
          time: "N/A",
          plant: "N/A",
          hall: "N/A",
        },
        health: {
          firstName: firstName,
          employeeId: employeeId,
          type: "N/A",
          time: "N/A",
          date: "N/A",
          plant: "N/A",
          relationship: "N/A",
          checkInTime: "N/A",
          pickedWhat: "N/A",
          checkIn: false,
        },
      };
      const db = getDatabase();
      ref(db, "users/" + employeeId)
        .set(data)
        .then(() => {
          router.push(
            `/form_selection?firstName=${firstName}&employeeId=${employeeId}&checkIn=${checkIn}`
          );
        })
        .catch((error) => {
          console.error("Error inserting data:", error);
        });
    }
  };

  function checkUser(idParameter, nameParameter, checkinParameter) {
    const emp_id = employeeId;
    const name = firstName;
    if (idParameter === emp_id && nameParameter === name) {
      let checkIn = checkinParameter;
      router.push(
        `/form_selection?firstName=${firstName}&employeeId=${employeeId}&checkIn=${checkIn}`
      );
      return true;
    }
    if (idParameter === emp_id && nameParameter !== name) {
      alert("ชื่อไม่ตรงกับรหัสพนักงานที่เคยเข้าสู่ระบบในครั้งแรก");
      return true;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    userIsNotCheckHandler();
  };

  const handleToggleContent = () => {
    setShowContent(!showContent);
  };
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <main
      className={`flex justify-center items-center m-7  mt-16 ${bai_jamjuree.className}`}
    >
      <div className="relative flex flex-col items-center">
        {" "}
        {/* Add flex flex-col items-center class */}
        <form
          className="place-content-center text-center pt-10 "
          onSubmit={handleSubmit}
        >
          {/* Your form content here */}
          <Image
            src={DensoLogo}
            alt="Denso logo"
            width={300}
            className="mb-8"
          />
          <div className="font-extrabold text-[#D43732] italic">
            DNTH Electronic Form
          </div>
          <div className="mb-8 font-extrabold text-[#D43732] italic">
            (ระบบฟอร์มออนไลน์)
          </div>
          <div className="drop-shadow-lg flex flex-col items-center">
            <div>
              <input
                className="border px-5 py-3 rounded-2xl mb-6"
                placeholder="ชื่อ"
                type="text"
                name="username"
                id="username"
                required
                onChange={(e) => setFirstName(e.target.value.toLowerCase())}
              />
            </div>
            <div className="">
              <input
                className="border px-5 py-3 rounded-2xl mb-8"
                placeholder="รหัสพนักงาน"
                type="text"
                name="employee_id"
                id="employee_id"
                required
                onChange={(e) => setEmployee_id(e.target.value.toLowerCase())}
              />
            </div>
          </div>

          <button
            type="submit"
            className="text-white bg-[#D43732] hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 rounded-2xl text-xl px-16 py-3 text-center 
                             mb- dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            เข้าสู่ระบบ
          </button>
        </form>
        <div className="flex justify-end ">
          <div className="text-sm text-slate-500 mb-5 text-right mt-4  mx-2  ">
            {/* Move the "ลืมรหัสผ่าน?" button outside the form */}
            <div onClick={handleToggleContent}>ลืมรหัสผ่าน?</div>
            {showContent && (
              <div
                className="relative bg-white p-5 border rounded-xl  top-2 z-10 border-slate-400"
                onClick={handleContentClick}
              >
                <div className="space-y-2">
                  <div>
                    <input
                      className="border px-5 py-3 rounded-2xl mb-2"
                      placeholder="รหัสพนักงาน"
                      type="text"
                      name="username"
                      id="username"
                      required
                      onChange={(e) =>
                        setForgotName(e.target.value.toLowerCase())
                      }
                    />
                  </div>
                  <div className="flex justify-center">
                    {" "}
                    {/* Add flex justify-center to center the button */}
                    <button
                      className="border rounded-xl px-10 py-2 bg-red-500 text-white text-center"
                      onClick={() => {
                        // Loop through the users array to find the matching firstName
                        let matchedFirstName = null;
                        for (const user of users) {
                          if (user.employeeId === forgotName) {
                            matchedFirstName = user.firstName;
                            break;
                          }
                        }

                        if (matchedFirstName) {
                          alert(
                            `รหัสพนักงาน "${forgotName}" ตรงกับชื่อ "${matchedFirstName}"`
                          );
                        } else {
                          alert(`ไม่พบข้อมูลของท่านกรุณาตรวจสอบรหัสพนักงาน`);
                        }
                      }}
                    >
                      ยืนยัน
                    </button>
                    
                  </div>
                </div>
                
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
