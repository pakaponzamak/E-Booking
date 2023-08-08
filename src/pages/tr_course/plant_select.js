import React, { useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useRouter } from "next/router";
import Swal from 'sweetalert2'
import {
    getDatabase,
    ref,
    onValue,
    off,
    remove,
    push,
    update,
    set,
  } from "firebase/database";
  import StartFireBase from "../../firebase/firebase_conf";

export default function DropdownMenu() {
  const [company, setCompany] = useState("");
  const [division, setDivision] = useState("");
  const [department, setDepartment] = useState("");
  const [plant, setPlant] = useState("");
  const router = useRouter();
  const { firstName, employeeId, checkIn } = router.query;

  StartFireBase();
  const submitHandler = () => {
    if (
      company.trim() === "" ||
      division.trim() === "" ||
      department.trim() === "" ||
      plant.trim() === ""
    ) {
      alert("กรุณากรอกข้อมูล");
      return;
    }
    else{
        const addPlant = {
            company: company,
            plant: plant,
            division: division,
            department: department,
          };
        const db = getDatabase();
      update(ref(db, "users/" + employeeId + "/courses/"), addPlant)
    }

    router.push(
      `./TRcalendar?firstName=${firstName}&employeeId=${employeeId}&checkIn=${checkIn}`
    );
  };
  const helpHandler = () => {
    Swal.fire({
        title: "เนื้อหายอดนิยม",
        html: `
          <b><u>TMC 1:หลักสูตรจัดการเงินพื้นฐาน</u></b> <br>
          <b>วัตถุประสงค์:</b> เพื่อจัดการเงินให้เป็นระเบียบ บริหารสภาพคล่อง จัดการภาระหนี้สิน <br>
          <b>กลุ่มเป้าหมาย:</b> เหมาะกับผู้เรียนเริ่มต้นบริหารเงิน อยากจัดการเงินให้เพียงพอลดภาระหนี้ เพิ่มเงินออม รูปแบบการเรียน: บรรยาย และ workshop พร้อมแบบทดสอบความรู้ <br>
          <b>หัวข้อการเรียน:</b> 
          <b>1.</b> หลักการจัดการเงินส่วนบุคคล 
          <b>2.</b> การจัดการรายได้เพียงพอใช้จ่าย 
          <b>3.</b> การจัดการภาระหนี้ 
          <b>4.</b> การวางแผนการออม (เงินสำรองฉุกเฉินและกองทุนสำรองเลี้ยงชีพ) <br>
          <br>
          <b><u>TMC 2:การวางแผนสู่ความมั่งคั่ง</u></b> <br>
          <b>วัตถุประสงค์:</b> เพื่อเรียนรู้วิธีการบริหารเงินในระยะยาว เพื่่อเกษียณอย่างมั่งคั่งและมีความสุข <br>
          <b> กลุ่มเป้าหมาย:</b> เหมาะกับผู้เรียนที่จัดสรรเงินได้ดี มีเงินออม และเกี่ยวข้องกับการอบรมทางการเงิน <br>
          <b>รูปแบบการเรียน:</b> บรรยาย และ workshop พร้อมแบบทดสอบความรู้ <br>
          <b>หัวข้อการเรียน:</b> 
          <b>1.</b> การวางแผนการอบรม 
          <b>2.</b> การวางแผนการเกษียณ 
          <b>3.</b> การจัดพอร์ตบงทุนเพื่อการเกษียณ (กองทุนรวม, ประกันชีวิต) 
          <b>4.</b> การวางแผนใช้เงินหลังเกษียณ
        `,
        confirmButtonText: "ปิด",
        confirmButtonColor: "#D43732", // Set the confirm button color to red
      });
      
      
      
  }

  return (
    <main>
      <div className="mb-28">
        <p className="mr-5  flex justify-end text-sm mt-2">
          ชื่อ :&nbsp; <strong>{firstName}</strong>&nbsp; ID : &nbsp;
          <strong>{employeeId}</strong>
        </p>
        <div className="border-b p-1 mb-2 mx-3"></div>
      </div>

      <div className="mx-20 my-5">
        <Box sx={{}}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">เลือก Company</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={company}
              label="เลือก Company"
              onChange={(e) => setCompany(e.target.value)}
            >
              <MenuItem value={"DNTH"}>DNTH</MenuItem>
              <MenuItem value={"..."}>...</MenuItem>
              <MenuItem value={"---"}>---</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </div>
      <div className="mx-20 my-5">
        <Box sx={{ }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">เลือก Plant</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={plant}
              label="เลือก Plant"
              onChange={(e) => setPlant(e.target.value)}
            >
              <MenuItem value={"SRG"}>SRG</MenuItem>
              <MenuItem value={"WGR"}>WRG</MenuItem>
              <MenuItem value={"BPK"}>BPK</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </div>

      <div className="text-center">
        <div>
          <div></div>
          <input
            className=" px-10 py-3 rounded-xl m-1 border"
            placeholder="Division"
            type="text"
            name="division"
            id="division"
            required="required"
            onChange={(e) => setDivision(e.target.value)}
          ></input>
        </div>
        <div>
          <div></div>
          <input
            className=" px-10 py-3 rounded-xl m-1 border"
            placeholder="Department"
            type="text"
            name="department"
            id="department"
            required="required"
            onChange={(e) => setDepartment(e.target.value)}
          ></input>
        </div>
      </div>

      <div className="text-center mt-5">
        <button
          type="button"
          onClick={submitHandler}
          class="text-white bg-[#D43732] hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 rounded-xl text-xl px-28 py-3 text-center 
                                mr-2 mb-5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 font-bold "
        >
          ยืนยัน
        </button>
      </div>
      <div>
        <div className=" flex justify-end mr-4 text-slate-500 text-sm">
            <button className="flex" onClick={helpHandler}>
            <span>ช่วยเหลือ</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
            />
          </svg>
          </button>
        </div>
      </div>
    </main>
  );
}
