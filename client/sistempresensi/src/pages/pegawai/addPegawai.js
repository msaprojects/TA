import React, { useState } from 'react';
import Nav from '../components/Navbar';

import axios from '../../utils/server'
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';

const AddPegawai = () => {
    const [nama, setNama] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [jabatan, setJabatan] = useState('');
    const [uuid, setUuid] = useState('');

    /// routing
    const navigate = useNavigate()
    ///handler
    const postPegawai = async (e) => {
        e.preventDefault();
        /// setting value post
        const postData = {
            nama: nama,
            username: username,
            password: password,
            jabatan: jabatan,
            uuid: uuid,
            flag_aktif:'1'
        }
        await axios.post('pengguna', postData, {
            headers: { Authorization: `Bearer ` + localStorage.getItem("token") },
        }).then((response) => {
            console.log(response)
            swal(`${response.data.message}`, {
                icon: "success",
            });
            navigate('/datapegawai')
        }).catch((error) => {
            swal(`Sorry! ${error.response.data.message}`, {
                icon: "error",
            });
        })
    }

    /// action konfirmasi
    const KonfirmasiData = async (e) => {
        swal({
            title: `Yakin menyimpan data ${nama}?`,
            text: "Pastikan data yang anda masukkan sudah sesuai!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
            closeOnClickOutside: false,
            closeOnEsc: false,
        }).then((willDelete) => {
            if (willDelete) {
                postPegawai(e)
            }
        });
    }


    return (
        <>
            {/* /// import navigation */}
            <Nav />
            {/* /// put code of dashboard component here! */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">Tambah Data Pegawai</h1>
                </div>
            </header>
            <main>
                <div className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 flex flex-col justify-center items-center'>
                    <form className="w-full max-w-lg">
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                    Nama Pegawai
                                </label>
                                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    id="grid-first-name"
                                    type="text"
                                    value={nama}
                                    onChange={(e) => setNama(e.target.value)}
                                    placeholder="Syahrul" />
                            </div>
                            <div className="w-full md:w-1/2 px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                    Username
                                </label>
                                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="grid-last-name"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Affandy_s" />
                            </div>
                        </div>
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                    Password
                                </label>
                                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="grid-password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Pas***************" />
                                {/* <p className="text-gray-600 text-xs italic">Make it as long and as crazy as you'd like</p> */}
                            </div>
                        </div>
                        <div className="flex flex-wrap -mx-3 mb-2">
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                    Jabatan
                                </label>
                                <div className="relative">
                                    <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        id="grid-state"
                                        value={jabatan}
                                        onChange={(e) => setJabatan(e.target.value)}>
                                        <option>Admin</option>
                                        <option>HR</option>
                                        <option>Pegawai</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                    UUID
                                </label>
                                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="grid-zip"
                                    type="text"
                                    value={uuid}
                                    onChange={(e) => setUuid(e.target.value)}
                                    placeholder="RKQ.2012080**" />
                            </div>
                        </div>
                        <div className='flex-auto justify-center items-center mt-12'>
                            <button className='w-full h-12 px-6 text-white rounded-lg focus:shadow-outline hover:bg-gray-600 bg-cyan-700 font-bold shadow-xl'
                                onClick={(e) => KonfirmasiData(e)}
                                type='button'
                            >SIMPAN</button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}

export default AddPegawai;