import React from 'react';
import { Search } from 'lucide-react';
import { useState,useEffect,useRef } from 'react';
import fetch_api from '../fetch/fetch'

const UserProfileItem = ({ user }) => (
  <div className="flex items-center space-x-3 p-2 hover:cursor-pointer hover:bg-slate-700 rounded-lg transition-colors duration-200">
    <img 
      src={user.profile_picture} 
      alt={user.username[0,3]} 
      className="w-10 h-10  bg-slate-500 rounded-full object-cover flex justify-center text-center"
    />
    <div className="flex-grow">
      <p className="text-slate-200 font-semibold">{user.username}</p>
      <p className="text-slate-400 text-sm">@{user.user_id}</p>
    </div>
  </div>
);

const UserProfileList = ({ close }) => {
    const inputRef = useRef(null);
    useEffect(() => {
        if (inputRef.current) {
          inputRef.current.focus();  
        }
      }, []);
    const [searchh, setsearchh] = useState('')
    const [loading, setloading] = useState(true)
    const [users, setusers] = useState([])
    const onclose = (event) => {
        close();
      };
      const handle_propogation = (event) => {
        event.stopPropagation(); 
      };
      const handle_search=(e)=>{
        setsearchh(e.target.value)
      }
      const get_search=async()=>{
        const response=await fetch(`${fetch_api.search_user.url}/?search=${searchh}`,{
          method:fetch_api.search_user.method,
          credentials:'include',
          headers:{
            'Content-Type':'application/json',
            },
            })
            const res=await response.json();
             console.log(res.data);
             
            if(res.Success){
              setloading(false);
              setusers(res.data);
            }
            
      }
    
      useEffect(() => {
        const fetchData = async () => {
          await get_search();
        };
        fetchData()
      }, [searchh]);
  return (
       <div onClick={onclose} className='fixed flex inset-0 backdrop-blur-md items-center justify-center p-10  top-0 left-0 right-0 opacity-85 h-full w-full bg-slate-600'>
            <div onClick={handle_propogation} className="bg-slate-800 text-slate-100 p-4 backdrop-blur-sm rounded-lg shadow-lg">
      <div className="flex items-center space-x-2 mb-4 bg-slate-700 rounded-full px-3 py-2">
        <Search size={20} className="text-slate-400" />
        <input 
          ref={inputRef}
          onChange={handle_search}
          type="text" 
          placeholder="Search users..." 
          className="bg-transparent border-none focus:outline-none text-slate-200 placeholder-slate-400 w-full"
        />
      </div>
      <div className="space-y-2 h-[400px] w-[380px] overflow-x-auto scrool-none ">
        {users.map(user => (
          <UserProfileItem key={user.id} user={user} />
        ))}
        
      </div>
    </div>
       </div>
  );
};

export default  UserProfileList;