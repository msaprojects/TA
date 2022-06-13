import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/server'
import swal from 'sweetalert'


const LoginPage = () => {

    /// usestate
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    /// routing
    const navigate = useNavigate()
    ///handler
    const loginHandler = async (e) => {
        e.preventDefault();
        /// setting value post
        const loginData = {
            username: username,
            password: password,
            device: 'WEB',
            uuid: 'abcde'
        }
        await axios.post('login', loginData).then((response) => {
            localStorage.setItem('token', response.data.access_token)
            localStorage.setItem('nama', response.data.nama)
            navigate('/dashboard')
        }).catch((error) => {
            swal(`Sorry! ${error.response.data.message}`, {
                icon: "error",
            });
        })
    }

    /// UI
    return (
        <div className='h-screen w-screen flex bg-white'>
            <div className='w-full max-w-md m-auto bg-gray-300 rounded-md  shadow-md py-10 px-16'>
                <h1 className='font-bold text-2xl text-white mt-4 mb-12 text-center'>L O G I N</h1>
                <form onSubmit={loginHandler}>
                    <input className='w-full p-2 text-gray-700 border rounded-md text-sm transition duration-150 ease-in-out mb-8 outline-dashed outline-gray-500'
                        type='text'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder='Username' />
                    <input className='w-full p-2 text-gray-700 border rounded-md outline-dashed outline-gray-500 text-sm transition duration-150 ease-in-out mb-12'
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Pass****' />
                    <div className='flex-auto justify-center items-center mt-7'>
                        <button className='w-full h-12 px-6 text-white rounded-lg focus:shadow-outline hover:bg-gray-600 bg-gray-400 font-bold'>M A S U K</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
