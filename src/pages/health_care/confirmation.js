import { getDatabase, ref,onValue,off,child, push, update,set } from "firebase/database";
import StartFireBase from "../../firebase/firebase_conf";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function confirmation() {
  StartFireBase();
  const router = useRouter();
  const { firstName, employeeId } = router.query;
  const [users, setUsers] = useState([]);
  
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
const confirmHandler = async (e) => {
    //alert(employeeId);
    {users.map((user) => (
        performComparison(user.employeeId,user.firstName),
        user.checkIn = true
        ))}
    
};

const cancelHandler = async (e) => {
    alert("Cancel");
}

function performComparison(idParameter,nameParameter) {
    const anotherEmployeeId = employeeId; 
    const anotherName = firstName
    
    const db = getDatabase();
    
    const updates = {};
    const postData = {
        firstName: anotherName,
        employeeId: anotherEmployeeId,
        checkIn: true
    }
    const newPostKey = update(ref(db, "users/" + anotherEmployeeId ), postData);

    if (idParameter === anotherEmployeeId && nameParameter === anotherName){
      console.log("Match found for employeeId:", employeeId,firstName,newPostKey);
      //updates[newPostKey] = postData;
      alert("เช็คอินเรียบร้อยแล้ว")
      return update(ref(db), updates);
    } else {
      console.log("No match found for employeeId:", employeeId);
    }
}



  return (
    <div>
      <div className="flex justify-center item-center m-7 drop-shadow-lg mt-14 ">
        <div>
          <div className="font-extrabold text-3xl mt-10 text-center">ประวัติการจอง</div>
          <div className="border text-center p-3 mt-10 text-xl rounded-3xl">
            <div className="">จองคิวแพทย์(ทดลอง)</div>
            <div>
              {" "}
              <u className="font-bold">ชื่อ : {firstName}</u>
            </div>
            <div>
              {" "}
              <u className="font-bold">ID : {employeeId}</u>
            </div>
            <div>Date :</div>
            <div>Time :</div>
            <div className="mt-5">
              <button
                onClick={cancelHandler}
                class="text-white bg-[#D43732] rounded-full text-xl  text-center 
                                mr-10 mb-2  font-bold px-5 py-3"
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmHandler}
                class="text-white bg-[#16a34a] rounded-full text-xl  text-center 
                                mr-2 mb-2  font-bold px-5 py-3"
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
