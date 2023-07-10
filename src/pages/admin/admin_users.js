import Image from "next/image";
import { Roboto } from "next/font/google";
import DensoLogo from "../images/Denso_logo.png";
import { useState, useEffect } from "react";
import { getDatabase, ref, remove, onValue, off } from "firebase/database";
import StartFireBase from "../../firebase/firebase_conf";
import { getAuth } from "firebase/auth";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export default function admin() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [employeeId, setEmployee_id] = useState("");

  StartFireBase();

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
  function deleteSingleUserHandler(user) {
    // Access the user object and perform actions

    console.log("Delete Button clicked for user:", user);
    const db = getDatabase();
    if (
      user.id !== "!!Do no delete!!" &&
      user.employeeId !== "!!`~Do no delete~`!!"
    ) {
      var cnf = confirm(`ต้องการจะ "ลบ" ข้อมูลหรือไม่`);
      if (cnf) {
        remove(ref(db, "users/" + user.id));
      }
    } else {
      alert("Cannot perform this action");
    }
    // Other actions...
  }

  const toggleForm = (user) => {
    if (
      user.id !== "!!Do no delete!!" &&
      user.employeeId !== "!!`~Do no delete~`!!"
    ){
    setShowForm(user);}
    else {alert("Cannot perform this action");}
  };

  function updateSingleUserHandler(user) {
    // Access the user object and perform actions
    //console.log("Update Button clicked for user:", user);
    if (
      user.id !== "!!Do no delete!!" &&
      user.employeeId !== "!!`~Do no delete~`!!"
    ) {
    } else {
      alert("Cannot perform this action");
    }
    // Other actions...
  }

  return (
    <div className={roboto.className}>
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        class="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span class="sr-only">Open sidebar</span>
        <svg
          class="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clip-rule="evenodd"
            fill-rule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="default-sidebar"
        class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <ul class="space-y-2 font-medium">
            <li className="mb-10">
              <a
                href="#"
                class="flex items-center  text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div>
                  <Image
                    src={DensoLogo}
                    alt="Denso logo"
                    width={250}
                    className="mb-1"
                  />
                  <p className="text-center italic text-bold">
                    Admin Dashboard
                  </p>
                </div>
              </a>
            </li>

            <li>
              <a
                href="#"
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg
                  aria-hidden="true"
                  class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                </svg>
                <span class="ml-3">Dashboard</span>
              </a>
            </li>

            <li>
              <a
                href="#"
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-red-400 bg-red-300"
              >
                <svg
                  aria-hidden="true"
                  class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="flex-1 ml-3 whitespace-nowrap">Health Care Data</span>
              </a>
            </li>

            <li>
              <a
                href="./admin_insert"
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 "
              >
                <svg
                  aria-hidden="true"
                  class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="flex-1 ml-3 whitespace-nowrap">Insert Data</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>

      <div class="p-4 sm:ml-64 ">
        <div className="ml-5">
          <div className="m-1 rounded-3xl bg-red-100 drop-shadow-lg pb-5">
            <h1 className="font-extrabold text-4xl p-2 mx-10 mt-2">USERS</h1>

            <table className="ml-10 border-collapse p-10">
              <thead>
                <tr>
                  <th className="px-5 border bg-slate-300">Employee ID</th>
                  <th className="px-5 border bg-slate-300">Name - Surname</th>
                  <th className="px-5 border bg-slate-300">Plant</th>
                  <th className="px-5 border bg-slate-300">Time</th>
                  <th className="px-5 border bg-slate-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-l border-slate-300">
                    <td className="text-center p-2 py-4 ">{user.employeeId}</td>
                    <td className="text-center p-2">{user.firstName}</td>
                    
                    <td className="text-center">{user.plant}</td>
                    <td className="text-center">{user.time}</td>
                    <td
                      className="text-center p-2 text-white"
                      style={{
                        backgroundColor: user.checkIn ? "green" : "#D43732",
                      }}
                    >
                      {user.checkIn ? "เช็คอินแล้ว" : "ยังไม่ได้เช็คอิน"}
                    </td>
                    <td className="">
                      <button onClick={() => deleteSingleUserHandler(user)}>
                        <span className="text-center p-2 px-4 ml-2 text-white bg-red-700 rounded-3xl">
                          Delete
                        </span>
                      </button>
                    </td>

                    <td>
                      {showForm === user ? (
                        <form className="flex items-center ml-2 ">
                          {
                            /* Your form content goes here */
                            <div className="flex flex-1 gap-1">
                              <div>
                                <input
                                  className="p-2 rounded-full mb-1 w-32"
                                  placeholder="ชื่อ"
                                  type="text"
                                  name="username"
                                  id="username"
                                  required="required"
                                  onChange={(e) => setFirstName(e.target.value)}
                                ></input>
                              </div>
                              <div>
                                <input
                                  className="p-2 rounded-full w-32"
                                  placeholder="รหัสพนักงาน"
                                  type="text"
                                  name="employee_id"
                                  id="employee_id"
                                  required="required"
                                  onChange={(e) =>
                                    setEmployee_id(e.target.value)
                                  }
                                ></input>
                              </div>

                              <button
                                type="button"
                                onClick={() => updateSingleUserHandler(user)}
                                className="text-center ml-2 p-1 text-white bg-green-500 rounded-full justify-center "
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="1.5"
                                  stroke="currentColor"
                                  class="w-6 h-6 "
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M4.5 12.75l6 6 9-13.5"
                                  />
                                </svg>
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleForm(false)}
                                className="text-center ml-2 p-1 text-white bg-red-500 rounded-full justify-center"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="1.5"
                                  stroke="currentColor"
                                  class="w-6 h-6"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                          }
                        </form>
                      ) : (
                        <button
                          onClick={() => toggleForm(user)}
                          className=" text-center p-1 px-3 ml-2 text-white bg-orange-500 rounded-3xl"
                        >
                          Update
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

//<span className="text-center p-1 px-3 ml-2 text-white bg-orange-500 rounded-3xl">
//Update
//</span>
