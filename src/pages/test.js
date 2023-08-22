import React, { useState,useEffect } from 'react';


export default function Test() {
  const [tel, setTel] = useState('');
  const [detail, setDetail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [test,setTest] = useState([]);
  const [data, setData] = useState([]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/hello', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: tel, fname: detail }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
      } else {
        console.error('Error:', response.status, response.statusText);
        setMessage('Error occurred while sending data.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error occurred while sending data.');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/hello?fname=${name}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message) {
          setMessage(data.message);
        } else {
          setMessage('No name found in the database');
        }
      } else {
        console.error('Error:', response.status, response.statusText);
        setMessage('Error occurred while deleting data.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error occurred while deleting data.');
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch('/api/hello', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: tel, fname: detail }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
      } else {
        console.error('Error:', response.status, response.statusText);
        setMessage('Error occurred while updating data.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error occurred while updating data.');
    }
  };
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/hello', {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Error:', response.status, response.statusText);
        setMessage('Error occurred while fetching data.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error occurred while fetching data.');
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  

  return (
    <div className="container mx-auto mt-5">
      <form onSubmit={handleFormSubmit}>
        <div className="mb-3">
          <input
            className="rounded-xl m-1 border p-2"
            placeholder="เบอร์ติดต่อ"
            type="text"
            name="tel"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            className="rounded-xl m-1 border p-2"
            placeholder="อาการเบื้องต้น"
            type="text"
            name="detail"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
      </form>

      <div className="mt-3">
        <input
          className="rounded-xl m-1 border p-2"
          placeholder="First Name to Delete"
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Delete
        </button>
      </div>

      {message && <div className="mt-3">{message}</div>}
      <div className="mt-3">
  <input
    className="rounded-xl m-1 border p-2"
    placeholder="uodate what?"
    type="text"
    name="fname"
    value={tel}
    onChange={(e) => setTel(e.target.value)}
    required
  />
  <input
    className="rounded-xl m-1 border p-2"
    placeholder="First Name to Update"
    type="text"
    name="newDate"
    value={detail}
    onChange={(e) => setDetail(e.target.value)}
    required
  />
  <button
    onClick={handleUpdate}
    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
  >
    Update
  </button>
</div>
<div className="mt-3">
        <h2>Updated Data</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>Date: {user.name} Name: {user.user_id}</li>
          ))}
        </ul>
        
      </div>


    </div>
  );
}
