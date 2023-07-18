import Image from "next/image";
import { Bai_Jamjuree } from "next/font/google";
import DensoLogo from "./images/Denso_logo.png";
import { useState,useEffect } from "react";
import StartFireBase from "../firebase/firebase_conf";
import { getDatabase, ref, push,set,onValue,off } from "firebase/database";
import { useRouter } from 'next/router';


const bai_jamjuree = Bai_Jamjuree({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

export default function Home() {
  StartFireBase();
  const [users, setUsers] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [employeeId, setEmployee_id] = useState("");
  //const [checkIn, SetCheckIn] = useState(false);
  const router = useRouter()

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

const userIsNotCheckHandler = async (e) => {
  //console.log("userIsNotCheckHandler")
  let userFound = false;
  for (const user of users) {
    if (checkUser(user.employeeId, user.firstName, user.checkIn)) {
      userFound = true;
      break; // Exit the loop when a matching user is found
    }
  }
  if (!userFound) {
    // Execute the else statement
    // ...
    var checkIn = false
    console.log("Insert New One")
      //let checkIn = false
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
          hall: "N/A"
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
             checkIn: false
            },
      };
      const healthData = {
        firstName: firstName,
            employeeId: employeeId,
            type: "N/A",
             time: "N/A",
             date: "N/A",
             plant: "N/A",
             relationship: "N/A",
             checkInTime: "N/A",
             checkIn: false
      }
      const courseData = {
        firstName: firstName,
        employeeId: employeeId,
          course: "N/A",
          date: "N/A",
          time: "N/A",
          plant: "N/A",
          hall: "N/A"
      }
  
      function delay(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
      }
      
      const db = getDatabase();
      set(ref(db, "users/" + employeeId), data)
      set(ref(db, "usersHealth/" + employeeId), healthData)
      set(ref(db, "usersCourse/" + employeeId), courseData)
      //db.ref("users/").push(data)
      //delay(1000)
        .then(() => {
          //console.log(key)
          router.push(`/form_selection?firstName=${firstName}&employeeId=${employeeId}&checkIn=${checkIn}`);
          //window.location.href = "./form_selection";
        })
        .catch((error) => {
          console.error("Error inserting data:", error);
        });
  }
        
} 
function checkUser(idParameter,nameParameter,checkinParameter) {
  
    const emp_id = employeeId
    const name = firstName
    let numberForCheck = 0 //If have data then not enter else if Statement
    console.log(numberForCheck)
    if(idParameter === emp_id && nameParameter === name) {
      
       let checkIn = checkinParameter
       numberForCheck = 1;
       console.log("Have it yeahhhh",checkIn)
       router.push(`/form_selection?firstName=${firstName}&employeeId=${employeeId}&checkIn=${checkIn}`);
       return true;
      
    }
   
}

  const handleSubmit = async (e) => {
    e.preventDefault();
    userIsNotCheckHandler();
  };

  return (
    <main className={`flex justify-center items-center m-7  mt-16 ${bai_jamjuree.className}`}>
      <form
        className="place-content-center text-center p-10 "
        onSubmit={handleSubmit}
      >
        <Image src={DensoLogo} alt="Denso logo" width={350} className="mb-8" />
        <div className="font-extrabold text-[#D43732] italic">
          DNTH Electronic Form
        </div>
        <div className="mb-8 font-extrabold text-[#D43732] italic">
          (ระบบฟอร์มออนไลน์)
        </div>
        <div className="drop-shadow-lg">
          <div>
            <input
              className="border px-5 py-3 rounded-2xl mb-6 "
              placeholder="ชื่อ"
              type="text"
              name="username"
              id="username"
              required="required"
              onChange={(e) => setFirstName(e.target.value.toLowerCase())}
            ></input>
          </div>
          <div>
            <input
              className="border px-5 py-3 rounded-2xl mb-10 "
              placeholder="รหัสพนักงาน"
              type="text"
              name="employee_id"
              id="employee_id"
              required="required"
              onChange={(e) => setEmployee_id(e.target.value.toLowerCase())}
            ></input>
          </div>
        </div>

        <button
          type="submit"
          class="text-white bg-[#D43732] hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 rounded-2xl text-xl px-16 py-3 text-center 
                                 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 "
        >
          เข้าสู่ระบบ
        </button>
      </form>
    </main>
  );
}
