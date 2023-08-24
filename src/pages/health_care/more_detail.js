import { Analytics } from "@vercel/analytics/react";
import { Bai_Jamjuree } from "next/font/google";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Link from "next/link";
import Swal from "sweetalert2";

import { getDatabase, ref, update, onValue, off,set } from "firebase/database";
import StartFireBase from "../../firebase/firebase_conf";

const bai_jamjuree = Bai_Jamjuree({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

export default function appointment() {
  const router = useRouter();
  const { firstName, employeeId, date, time } = router.query;
  const [company, setCompany] = useState("");
  const [relation, setRelation] = useState("");
  const [telphoneNum, setTelephoneNum] = useState("");
  const [symptom, setSymptom] = useState("");
  const [user, setUser] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [addRelation,setAddRelation] = useState("true")
 
  StartFireBase();

   useEffect(() => {
    
   
   }, []);

const alertHandler = () => {
  // Check if any of the fields are empty
  if (
    employeeId.trim() === "" ||
    relation.trim() === "" ||
    company.trim() === "" ||
    telphoneNum.trim() === "" ||
    symptom.trim() === ""
  ) {
    alert("กรุณากรอกข้อมูล");
    return; // Don't proceed if any field is empty
  }

  Swal.fire({
    title: 'สำเร็จ',
    icon: 'success'
  }).then((result) => {
    if (result.isConfirmed) {
      const db = getDatabase();
      const data = {
        id: employeeId,
        relation: relation,
        company: company,
        telphone_num: telphoneNum,
        symtom: symptom,
      };

      update(ref(db, "users/" + employeeId + "/health"), data)
        .then(() => {
          
        })
        .catch((error) => {
          console.error("Error inserting data:", error);
        });

      router.push({
        pathname: `./option_select`,
        query: { firstName, employeeId },
      });
    }
  });
};


  return (
    <main className={`${bai_jamjuree.className}`}>
      <div>
        <Analytics />
        <h1
          className="text-center text-3xl mt-5 mb-5"
        >
          ข้อมูลเพิ่มเติม
        </h1>
      </div>
      <div className="text-center bg-[#ffd0d1] h-auto rounded-3xl">
        <p className="p-2 text-xl">วันที่ต้องการจอง</p>
        <div className="border mx-10 bg-white rounded-xl py-3 text-2xl">
          {new Date(date).toLocaleDateString("th-TH", {
            dateStyle: "long",
          })}{" "}
          เวลา {time} น.
        </div>
        <div className="mt-4 border mx-10 bg-white rounded-xl py-3 text-2xl">
          {firstName}
        </div>
        <div className="mx-16 my-5 bg-white">
          <Box sx={{}}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                เลือก Company
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={company}
                label="เลือก Company"
                onChange={(e) => setCompany(e.target.value)}
              >
                <MenuItem value={"DNTH-SRG"}>DNTH-SRG</MenuItem>
                <MenuItem value={"DNTH-WGR"}>DNTH-WGR</MenuItem>
                <MenuItem value={"DNTH-BPK"}>DNTH-BPK</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </div>
        <div>
          <div>สถานะผู้ติดต่อ</div>
          <div className="mx-16 mt-3 bg-white">
            <Box sx={{}}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  สถานะผู้ติดต่อ
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={relation}
                  label="สถานะผู้ติดต่อ"
                  onChange={(e) => setRelation(e.target.value)}
                >
                  <MenuItem value={"employee"}>พนักงาน</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </div>
          <div className = "mt-3 mx-10">
          <input
            className="rounded-xl m-1 border w-full p-3 "
            placeholder="เบอร์ติดต่อ"
            type="text"
            name="tel"
            id="tel"
            required="required"
            onChange={(e) => setTelephoneNum(e.target.value)}
          ></input>
          <textarea
            className="rounded-xl m-1 border w-full p-2"
            placeholder="ระบุอาการเบื้องต้น"
            name="detail"
            id="detail"
            required="required"
            maxLength="50"
         rows="4" // Specify the number of visible lines
         onChange={(e) => setSymptom(e.target.value)}
></textarea>
          </div>
        </div>


        <div className="mt-5  text-center mx-16 flex justify-between pb-10">
        
            <button className="border bg-[#E45A6B] px-10 py-4 text-xl rounded-2xl  text-white font-bold"
            onClick={() => {alertHandler()}}>
                ยืนยัน
            </button>
        
            <Link href={`./HCcalendar?firstName=${firstName}&employeeId=${employeeId}&relation=${addRelation}`}>
            <button className="border bg-[#E45A6B] px-10 py-4 text-xl rounded-2xl text-white font-bold">
                เพิ่ม
            </button>
            </Link>
        </div>
      </div>

    </main>
  );
}
