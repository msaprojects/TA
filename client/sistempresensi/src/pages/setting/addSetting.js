import React, {useState} from 'react';
import Nav from '../components/Navbar';

import axios from '../../utils/server'
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';


const AddSetting = () => {
    const [jammasuk, setJamMasuk] = useState('');
    const [jamkeluar, setJamKeluar] = useState('');

    /// routing
    const navigate = useNavigate()
    ///handler
    const postSetting = async (e) => {
        e.preventDefault();
        /// setting value post
        const postData = {
            jam_masuk: jammasuk,
            jam_keluar: jamkeluar,
            flag_aktif:'1'
        }
        await axios.post('setting', postData, {
            headers: { Authorization: `Bearer ` + localStorage.getItem("token") },
        }).then((response) => {
            console.log(response)
            swal(`${response.data.message}`, {
                icon: "success",
            });
            navigate('/datasetting')
        }).catch((error) => {
            swal(`Sorry! ${error}`, {
                icon: "error",
            });
        })
    }

    /// action konfirmasi
    const KonfirmasiData = async (e) => {
        swal({
            title: `Yakin menyimpan data setting baru?`,
            text: "Pastikan data yang anda masukkan sudah sesuai, karena setting akan aktif ketika data sudah berhasil disimpan!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
            closeOnClickOutside: false,
            closeOnEsc: false,
        }).then((willDelete) => {
            if (willDelete) {
                postSetting(e)
            }
        });
    }

    return (
        <>
            {/* /// import navigation */}
            <Nav />
            {/* /// pu4t code of dashboard component here! */}
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
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                    Jam Masuk
                                </label>
                                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    id="grid-first-name"
                                    type="time"
                                    value={jammasuk}
                                    onChange={(e) => setJamMasuk(e.target.value)}
                                    placeholder="08:00:00" />
                            </div>
                            <div className="w-full md:w-1/2 px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                    Jam Keluar
                                </label>
                                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="grid-last-name"
                                    type="time"
                                    value={jamkeluar}
                                    onChange={(e) => setJamKeluar(e.target.value)}
                                    placeholder="16:00:00" />
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

export default AddSetting;
