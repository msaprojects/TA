import React, { useState } from 'react';
import Nav from '../components/Navbar';

import axios from '../../utils/server'
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import AsyncSelect from 'react-select/async'

const AddTugas = () => {
    const [keterangan, setKeterangan] = useState('');
    const [idlokasi, setIdLokasi] = useState('');
    const [idpegawai, setIdPegawai] = useState('');

    /// routing
    const navigate = useNavigate()
    ///handler
    const postTugas = async (e) => {
        e.preventDefault();
        /// setting value post
        const postData = {
            keterangan: keterangan,
            idlokasi: idlokasi,
            idpengguna: idpegawai,
            flag_aktif:'0'
        }
        await axios.post('tugas', postData, {
            headers: { Authorization: `Bearer ` + localStorage.getItem("token") },
        }).then((response) => {
            console.log(response)
            swal(`${response.data.message}`, {
                icon: "success",
            });
            navigate('/datatugas')
        }).catch((error) => {
            console.log(error)
            swal(`Sorry! ${error.response.data.message}`, {
                icon: "error",
            });
        })
    }
    /// getting data mesin from api for dropdown lokasi
    const loadLokasi = () => {
        return axios.get("lokasi", {
            headers: { Authorization: `Bearer ` + localStorage.getItem("token") },
        }).then((response) => {
            const respon = response.data.data
            return respon
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
        })
    }
    const loadPegawai = () => {
        return axios.get("pengguna", {
            headers: { Authorization: `Bearer ` + localStorage.getItem("token") },
        }).then((response) => {
            const respon = response.data.data
            return respon
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
        })
    }

    /// action konfirmasi
    const KonfirmasiData = async (e) => {
        swal({
            title: `Yakin Assign tugas ?`,
            text: "Pastikan data yang anda masukkan sudah sesuai!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
            closeOnClickOutside: false,
            closeOnEsc: false,
        }).then((willDelete) => {
            if (willDelete) {
                postTugas(e)
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
                    <h1 className="text-3xl font-bold text-gray-900">Tambah Data Tugas</h1>
                </div>
            </header>
            <main>
                <div className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 flex flex-col justify-center items-center'>
                    <form className="w-full max-w-lg">
                        
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                    Note Tugas
                                </label>
                                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="grid-password"
                                    type="textarea"
                                    value={keterangan}
                                    onChange={(e) => setKeterangan(e.target.value)}
                                    placeholder="Tulis Deskripsi tugas disini" />
                                {/* <p className="text-gray-600 text-xs italic">Make it as long and as crazy as you'd like</p> */}
                            </div>
                        </div>
                        <div className="flex flex-wrap -mx-3 mb-2">
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                    Pilih Lokasi
                                </label>
                                <div className="relative">
                                <AsyncSelect
                                    cacheOptions
                                    defaultOptions
                                    getOptionLabel={e => e.nama}
                                    getOptionValue={e => e.idlokasi}
                                    loadOptions={loadLokasi}
                                    placeholder="Pilih Lokasi..."
                                    onChange={(value) => {
                                        setIdLokasi(value.idlokasi)
                                    }}
                                />
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                    Assign ke
                                </label>
                                <div className='relative'>
                                {/* <AsyncSelect className='block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500' */}
                                <AsyncSelect
                                    cacheOptions
                                    defaultOptions
                                    getOptionLabel={e => e.nama}
                                    getOptionValue={e => e.idpengguna}
                                    loadOptions={loadPegawai}
                                    placeholder="Pilih Pegawai..."
                                    onChange={(value) => {
                                        setIdPegawai(value.idpengguna)
                                    }}
                                />
                            </div>
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

export default AddTugas;