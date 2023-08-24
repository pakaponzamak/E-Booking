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

import { getDatabase, ref, remove, onValue, off } from "firebase/database";
import StartFireBase from "../../firebase/firebase_conf";

const bai_jamjuree = Bai_Jamjuree({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

export default function relation_detail() {
  const router = useRouter();
  const { firstName, employeeId, date, timeStart, doctor } = router.query;
  const [company, setCompany] = useState("");
  const [relation, setRelation] = useState("");
  const [user, setUser] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [addRelation, setAddRelation] = useState("true");

  StartFireBase();

  useEffect(() => {}, []);

  return (
    <main className={`${bai_jamjuree.className}`}>
      <div>
        <Analytics />
        <h1 className="text-center text-3xl mt-10 mb-5">ข้อมูลเพิ่มเติม</h1>
      </div>
      <div className="text-center bg-[#ffd0d1] h-auto rounded-3xl">
        <p className="p-2 text-xl">วันที่ต้องการจอง</p>
        <div className="border mx-10 bg-white rounded-xl py-3 text-2xl">
          {new Date(date).toLocaleDateString("th-TH", {
            dateStyle: "long",
          })}{" "}
          เวลา {timeStart} น.
        </div>
        <div className="mt-4 border mx-10 bg-white rounded-xl py-3 text-2xl">
          {doctor}
        </div>
        <div>
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
                  <MenuItem value={"parent"}>บิดา-มารดา</MenuItem>
                  <MenuItem value={"child"}>บุตร</MenuItem>
                  <MenuItem value={"mirried"}>คู่สมรส</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </div>
          <div className="mt-3 mx-10">
          <input
              className="rounded-xl m-1 border w-full p-3 "
              placeholder="ชื่อ - นามสกุล"
              type="text"
              name="tel"
              id="tel"
              required="required"
            ></input>
            <input
              className="rounded-xl m-1 border w-full p-3 "
              placeholder="เบอร์ติดต่อ"
              type="text"
              name="tel"
              id="tel"
              required="required"
            ></input>
            <textarea
              className="rounded-xl m-1 border w-full p-2"
              placeholder="อาการเบื้องต้น"
              name="detail"
              id="detail"
              required="required"
              maxLength="50"
              rows="4" // Specify the number of visible lines
            ></textarea>
          </div>
        </div>

        <div className="mt-5  text-center mx-16   pb-10">
          <button className="border bg-[#E45A6B] px-16 py-4 text-xl rounded-2xl  text-white font-bold">
            ยืนยัน
          </button>
        </div>
      </div>
    </main>
  );
}
