import React, { useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import fetch_api from '../fetch/fetch';
import { UserContext } from '../context/Usercontext';
const Login = () => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(UserContext);
    const loginn =async()=>{
        const  response =await fetch(`http://localhost:3000/login`,{
            method: "POST",
            credentials: 'include',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "user_id":userId,
                "password":password
            })
        });
       const res=await response.json();
       console.log(res);
       
        if (res.Success) {
            alert("Logined Successfully...");
            login({ user_id: userId, name: 'User' });
            navigate(`/profile?user_id=${userId?userId:null}`);
        } else {
            alert(`Error: ${res.message}`);
        }
    }
    const handleSubmit = async(event) => {
        event.preventDefault(); // Prevent default form submission
        await loginn();

    };

    const handleSignupNavigation = () => {
        navigate('/signup');
    };

    return (
        <div className="flex justify-center items-center h-screen bg-slate-900">
            <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-md hover:shadow-indigo-500 shadow-md">
                <h1 className="text-3xl text-slate-100 text-center mb-6 font-semibold">Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="user-id" className="block mb-2 text-slate-300 font-medium">User Id</label>
                        <input 
                            type="text" 
                            id="user-id" 
                            name="user-id" 
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="w-full p-3 border border-slate-600 rounded-md bg-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500"
                            placeholder="Enter your user ID"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block mb-2 text-slate-300 font-medium">Your Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-slate-600 rounded-md bg-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500"
                            placeholder="Enter your password"
                        />
                    </div>
                    <div className="flex items-center mb-6">
                        <input 
                            type="checkbox" 
                            id="rememberMe" 
                            name="rememberMe" 
                            className="h-4 w-4 text-slate-400 focus:ring-slate-500 border-slate-600 rounded"
                        />
                        <label htmlFor="rememberMe" className="ml-2 text-slate-300">Remember me</label>
                    </div>
                    <button 
                        type="submit" 
                        className="w-full p-3 bg-teal-500 text-white rounded-md text-base font-semibold cursor-pointer transition-colors duration-300 hover:bg-teal-600"
                    >
                        Login
                    </button>
                </form>
                <p className="text-center mt-4">
                    <button
                        onClick={handleSignupNavigation}
                        className="text-teal-400 hover:underline"
                    >
                        New here? Create an account
                    </button>
                </p>
                <p className="text-center mt-2">
                    <a href="#" className="text-teal-400 hover:underline">Forgot Password?</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
