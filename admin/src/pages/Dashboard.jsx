import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const navigate = useNavigate();
    useEffect(() => {
        const verifyAdminToken = async () => {
            const token = localStorage.getItem('admin_token');

            const req = await fetch('http://localhost:5000/api/admin/verifytoken', {
                method : 'POST',
                body : JSON.stringify({ token : token }),
                headers : {
                    'Content-Type' : 'application/json'
                }
            });

            const res = await req.json();
            if(!res.success) {
                alert(`Authentication Error  :${res.message}`);
                navigate('/');
            }
        }

        verifyAdminToken();
    }, []);
  return (
    <div className='flex justify-center items-center flex-col'>
        <h1 className='text-2xl font-bold mb-20 mt-10'>Admin Panel</h1>
        <div className='flex gap-10 '>
            <div onClick={() => navigate('/vehicles')} className='w-40 h-40 bg-amber-500 hover:bg-amber-300 cursor-pointer hover:text-black rounded-2xl flex justify-center items-center text-white font-bold'>
                Manage Vehicles
            </div>
            <div onClick={() => navigate('/users')} className='w-40 h-40 bg-amber-500 hover:bg-amber-300 cursor-pointer hover:text-black rounded-2xl flex justify-center items-center text-white font-bold'>
                Manage Users
            </div>
            <div onClick={() => navigate('/requests')} className='w-40 h-40 bg-amber-500 hover:bg-amber-300 cursor-pointer hover:text-black rounded-2xl flex justify-center items-center text-white font-bold'>
                Manage Requests
            </div>
        </div>
    </div>
  )
}
