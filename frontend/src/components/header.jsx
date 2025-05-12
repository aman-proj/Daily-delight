import React from 'react'
import logo from "../assets/logo.png"
import search from "../assets/search.png"
import profile_pic from "../assets/profile_pic.png"
import { Link,useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Searching from "./searching"
const header = () => {
  const nevigate=useNavigate();
  const home =()=>{
    nevigate('/')
  }
  const [seachi, setseachi] = useState(false)
  const set_searchi_false=()=>{
    setseachi(false);
  }
 
  return (
    <div className='bg-slate-800 p-2 hover:bg-slate-700  shadow-indigo-600  shadow-md'>
      <div className='flex items-center justify-between'>
        <div className='flex gap-2 items-center'>
          <img src={logo} onClick={home} className='w-20 hover:cursor-pointer rounded-md shadow-md hover:shadow-indigo-500 h-12' alt="" />
          <div className='flex bg-white rounded-md'>
          <input  type="search" onClick={()=>setseachi(true)} className='placeholder:text-gray-700 outline-none px-2 rounded-md' placeholder='Search here...' />
          <img src={search} className='rounded-md w-8 ' alt="" />
          </div>
        </div>
        <div className='flex gap-3'>
          {/* <button className='flex items-center text-white bg-purple-600 px-1 rounded-lg gap-1 hover:underline'>
            <img src={profile_pic} className='w-8' alt="" />
             Anshika_singh.01
          </button> */}
          <button className='bg-slate-600 text-white p-1  hover:bg-red-500 rounded-md px-2'>Logout</button>
          <button className='bg-slate-600 text-white p-1  hover:bg-sky-500 rounded-md px-2'>Contact Us</button>
        
        </div>
      </div>
      {
        seachi && <Searching close={set_searchi_false} />
      }
    </div>
  )
}

export default header
