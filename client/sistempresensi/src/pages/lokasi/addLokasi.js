import React, { useState } from 'react';
import Nav from '../components/Navbar';

import axios from '../../utils/server'
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';

const AddLokasi = () => {
    const [lokasi, setLokasi] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    /// routing
    const navigate = useNavigate()
    ///handler
    const postLokasi = async (e) => {
        e.preventDefault();
        /// setting value post
        const postData = {
            lokasi: lokasi,
            latitude: latitude,
            longitude: longitude,
            flag_aktif:'1'
        }
        await axios.post('lokasi', postData, {
            headers: { Authorization: `Bearer ` + localStorage.getItem("token") },
        }).then((response) => {
            console.log(response)
            swal(`${response.data.message}`, {
                icon: "success",
            });
            navigate('/datalokasi')
        }).catch((error) => {
            swal(`Sorry! ${error.response.data.message}`, {
                icon: "error",
            });
        })
    }

    /// action konfirmasi
    const KonfirmasiData = async (e) => {
        swal({
            title: `Yakin menyimpan data ${lokasi}?`,
            text: "Pastikan data yang anda masukkan sudah sesuai!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
            closeOnClickOutside: false,
            closeOnEsc: false,
        }).then((willDelete) => {
            if (willDelete) {
                postLokasi(e)
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
                    <h1 className="text-3xl font-bold text-gray-900">Tambah Data Lokasi</h1>
                </div>
            </header>
            <main>
                <div className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 flex flex-col justify-center items-center'>
                    <form className="w-full max-w-lg">
                        <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                    Nama Lokasi
                                </label>
                                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="grid-password"
                                    type="text"
                                    value={lokasi}
                                    onChange={(e) => setLokasi(e.target.value)}
                                    placeholder="xxx" />
                                {/* <p className="text-gray-600 text-xs italic">Make it as long and as crazy as you'd like</p> */}
                            </div>
                        <div className="flex flex-wrap -mx-3 mb-6">
                            
                        </div>
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                    Latitude
                                </label>
                                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    id="grid-first-name"
                                    type="text"
                                    value={latitude}
                                    onChange={(e) => setLatitude(e.target.value)}
                                    placeholder="-712.xxxxxx" />
                            </div>
                            <div className="w-full md:w-1/2 px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                    Longitude
                                </label>
                                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="grid-last-name"
                                    type="text"
                                    value={longitude}
                                    onChange={(e) => setLongitude(e.target.value)}
                                    placeholder="112.xxxxxxx" />
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

export default AddLokasi;