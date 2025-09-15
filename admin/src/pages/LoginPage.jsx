import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {

    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        const req = await fetch('http://localhost:5000/api/admin/login', {
            method : 'POST',
            body : JSON.stringify({ email : email, password : password }),
            headers : {
                'Content-Type' : 'application/json'
            }
        });

        const res = await req.json();
        if(!res.success) {
            alert(`Login Failed : ${res.message}`);
        } else {
            window.localStorage.setItem('admin_token', res.token);
            navigate('/dashboard');
        }
    }
  return (
    <div onSubmit={handleSubmit}>
        <div className='flex justify-center'>
            <form className='flex flex-col w-[400px] h-[300px] bg-amber-500 justify-center gap-2 px-5 mt-30 rounded-lg'>
                <h1 className='mb-5 ml-25 text-[20px] font-bold'>Admin Panel Login</h1>
                <label>Email : </label>
                <input className='bg-white rounded-lg h-8' type="email" name='email' />

                <label>Password : </label>
                <input className='bg-white rounded-lg h-8' type="password" name='password' />

                <input className='mt-5 bg-white rounded-lg h-8 hover:bg-white/90 transition cursor-pointer ' type="submit" />
            </form>
        </div>
    </div>
  )
}
