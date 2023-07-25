import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';


export default function DropdownMenu() {
    const [age, setAge] = useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    return (
        <main>
  <div className='mx-20 my-10'>
    <InputLabel id="demo-simple-select-label">เลือก Company</InputLabel>
    <Box sx={{ minWidth: 60 }}>
      <FormControl fullWidth>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Age"
          onChange={handleChange}
          MenuProps={{
            sx: { minWidth: 100 }, // Adjust the width here
          }}
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
    </Box>
  </div>
  <div className='mx-20 my-10'>
    <InputLabel id="demo-simple-select-label">เลือก Plant</InputLabel>
    <Box sx={{ minWidth: 60 }}>
      <FormControl fullWidth>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Age"
          onChange={handleChange}
          MenuProps={{
            sx: { minWidth: 100 }, // Adjust the width here
          }}
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
    </Box>
  </div>
  {age && <p>Selected Age: {age}</p>} {/* Display selected age */}
</main>


    );
}
