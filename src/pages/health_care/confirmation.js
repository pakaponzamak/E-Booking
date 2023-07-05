import { getDatabase, ref, push, onValue, off } from "firebase/database";
import StartFireBase from "../../firebase/firebase_conf";
import { useRouter } from 'next/router';


export default function confirmation(){

    const router = useRouter();
  const { username, employee_id } = router.query;
    return(
     <div>
        <div className="flex justify-center item-center m-7 drop-shadow-lg mt-14 ">
            <div>
                <div className="font-bold text-3xl mt-10">ประวัติการจอง</div>
                <div className="border ">
                    <div className="text-center p-2">จองคิวแพทย์(ทดลอง) {username}</div>
                </div>
            </div>

        </div>
     </div>
    );
}