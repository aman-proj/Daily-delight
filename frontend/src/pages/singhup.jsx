import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import fetch_api from '../fetch/fetch';
import api from '../Axios';
const Signup = () => {
    const navigate = useNavigate();
    const [csrfToken, setCsrfToken] = useState(null);
    const [formData, setFormData] = useState({
        profilePicture: null,
        username: '',
        userId: '',
        gender: '',
        bio: '',
        email: '',
        password: '',
    });

  
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // const handleProfilePictureChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setFormData(prev => ({
    //                 ...prev,
    //                 profilePicture: reader.result 
    //             }));
    //         };
    //         reader.readAsDataURL(file); 
    //     }
    // };
    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
    
            reader.onloadend = () => {
                // Convert the result to a Base64-encoded string
                const base64String = reader.result.split(',')[1]; // Remove the data URL prefix
    
                // Update the form data with the Base64 string
                setFormData(prev => ({
                    ...prev,
                    profilePicture: base64String
                }));
            };
    
            // Read the file as a data URL
            reader.readAsDataURL(file);
        }
    };
    // setprofilePictureDataUrl(`data:image/png;base64,${formData.profilePicture}`)
    // const [profilePictureDataUrl, setprofilePictureDataUrl] = useState('')

    const signup = async () => {
        const formData1 = {
            user_id: formData.userId,
            username: formData.username,
            email_id: formData.email,
            password: formData.password,
            gender: formData.gender,
            bio: formData.bio,
            profile_picture: formData.profilePicture 
        };

        const response = await fetch(`${fetch_api.signup.url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData1)
        });
        
        if (response.ok) {
            alert("Login Now...");
            navigate('/login');
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.Message}`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup();
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-900 p-4">
            <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-4xl hover:shadow-purple-400 shadow-md">
                <h1 className="text-3xl text-slate-100 mb-6 text-center">Sign Up</h1>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Profile Picture */}
                    <div className="col-span-1">
                        <label htmlFor="profilePicture" className="block mb-2 text-slate-300">Profile Picture</label>
                        <input 
                            type="file" 
                            id="profilePicture" 
                            name="profilePicture" 
                            accept="image/*" 
                            onChange={handleProfilePictureChange} 
                            className="block w-full text-slate-800"
                        />
                        {formData.profilePicture && (
                            <img 
                                src={`data:image/png;base64,${formData.profilePicture}`}
                                alt="Profile Preview" 
                                className="w-24 h-24 object-cover rounded-full border-2 border-slate-700 mt-2"
                            />
                        )}
                    </div>

                    {/* Username */}
                    <div className="col-span-1">
                        <label htmlFor="username" className="block mb-2 text-slate-300">Username</label>
                        <input 
                            type="text" 
                            id="username" 
                            name="username" 
                            value={formData.username} 
                            onChange={handleInputChange} 
                            required 
                            className="w-full p-3 border border-slate-600 rounded-md bg-slate-700 text-slate-100"
                        />
                    </div>

                    {/* User ID */}
                    <div className="col-span-1">
                        <label htmlFor="userId" className="block mb-2 text-slate-300">User ID</label>
                        <input 
                            type="text" 
                            id="userId" 
                            name="userId" 
                            value={formData.userId} 
                            onChange={handleInputChange} 
                            required 
                            className="w-full p-3 border border-slate-600 rounded-md bg-slate-700 text-slate-100"
                        />
                    </div>

                    {/* Gender */}
                    <div className="col-span-1">
                        <label htmlFor="gender" className="block mb-2 text-slate-300">Gender</label>
                        <select 
                            id="gender" 
                            name="gender" 
                            value={formData.gender} 
                            onChange={handleInputChange} 
                            required 
                            className="w-full p-3 border border-slate-600 rounded-md bg-slate-700 text-slate-100"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Bio */}
                    <div className="col-span-1 md:col-span-2">
                        <label htmlFor="bio" className="block mb-2 text-slate-300">Bio (optional)</label>
                        <textarea 
                            id="bio" 
                            name="bio" 
                            value={formData.bio} 
                            onChange={handleInputChange} 
                            rows="4" 
                            className="w-full p-3 border border-slate-600 rounded-md bg-slate-700 text-slate-100"
                        />
                    </div>

                    {/* Email */}
                    <div className="col-span-1">
                        <label htmlFor="email" className="block mb-2 text-slate-300">Email ID</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleInputChange} 
                            required 
                            className="w-full p-3 border border-slate-600 rounded-md bg-slate-700 text-slate-100"
                        />
                    </div>

                    {/* Password */}
                    <div className="col-span-1">
                        <label htmlFor="password" className="block mb-2 text-slate-300">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            value={formData.password} 
                            onChange={handleInputChange} 
                            required 
                            className="w-full p-3 border border-slate-600 rounded-md bg-slate-700 text-slate-100"
                        />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <button 
                            type="submit" 
                            className="w-full p-3 bg-teal-500 text-white rounded-md font-semibold cursor-pointer transition-colors duration-300 hover:bg-teal-600"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
                <p className="text-center mt-4 text-slate-300">
                    Already have an account? <Link to="/login" className="text-teal-400 hover:underline">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
