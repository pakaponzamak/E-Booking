import { getDatabase, ref,onValue,off,child, push, update,remove } from "firebase/database";
import StartFireBase from "../../firebase/firebase_conf";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { redirect } from 'next/navigation';

export default function confirmation() {
  StartFireBase();
  const router = useRouter();
  const { firstName, employeeId,checkIn } = router.query;
  const [users, setUsers] = useState([]);
  let ifTrue;

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
  console.log("Match found for employeeId:", employeeId,firstName);

const confirmHandler = async (e) => {
    var cnf = confirm(`ต้องการจะ "ยืนยัน" การจองหรือไม่`)
    if(cnf) {
    {users.map((user) => (
        performConfirm(user.employeeId,user.firstName,user.checkIn),
        user.checkIn = true
        ))} 
    }
    
};

const cancelHandler = async (e) => {
    var cnf = confirm(`ต้องการจะ "ยกเลิก" การจองหรือไม่`)
    if (cnf){
    {users.map((user) => (
        performDelete(user.employeeId,user.firstName)
        //user.checkIn = true
        ))}
        router.push(`../`);
    }
}

function performDelete(idParameter,nameParameter) {
    const anotherEmployeeId = employeeId; 
    const anotherName = firstName
    
    const db = getDatabase();
    
    const updates = {};
    const postData = {
        firstName: anotherName,
        employeeId: anotherEmployeeId,
        checkIn: true
    }
    const newPostKey = remove(ref(db, "users/" + anotherEmployeeId ), postData);

    if (idParameter === anotherEmployeeId && nameParameter === anotherName){
      console.log("Match found for employeeId:", employeeId,firstName,newPostKey);
      //updates[newPostKey] = postData;
      return remove(ref(db, "users/" + anotherEmployeeId), updates);
    } else {
      console.log("No match found for employeeId:", employeeId);
    }
}

function performConfirm(idParameter,nameParameter,checkinParameter) {
    const anotherEmployeeId = employeeId; 
    const anotherName = firstName
    const ifTrue = checkinParameter

    const db = getDatabase();
    
    const updates = {};
    const postData = {
        firstName: anotherName,
        employeeId: anotherEmployeeId,
        checkIn: true
    }
    const newPostKey = update(ref(db, "users/" + anotherEmployeeId ), postData);

    if (idParameter === anotherEmployeeId && nameParameter === anotherName){
      console.log("Match found for employeeId:", employeeId,firstName,checkinParameter);
      //updates[newPostKey] = postData;
      //alert("เช็คอินเรียบร้อยแล้ว")    
      
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
                id="confirm-btn"
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
