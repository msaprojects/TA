import React, { Component } from 'react';
import Nav from '../components/Navbar';

import axios from '../../utils/server'
import swal from 'sweetalert';
import { FaSync } from 'react-icons/fa'
/// import data table
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-material.css'

class DashboardPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            jmlpegawai: [],
            setwaktu: '',
            jmlpresensihari: [],
            jmlpresensimobile: [],
            jmlpresensiweb: [],
            jmlterlambat: [],
            loading: true,
            dataPresensi: [],
            jamMasuk: [],
            jamKeluar: [],
            /// AG Data Grid column and row definition
            columnDefs: [
                {
                    headerName: "Nama",
                    field: 'nama',
                    floatingFilter: true,
                },
                {
                    headerName: "Status",
                    field: 'flag_presensi',
                    valueFormatter: params => params.value === 1 ? 'Masuk' : params.value === 2 ? 'Keluar' : '-',
                },
                {
                    headerName: "Presensi By",
                    field: 'device',
                },
                {
                    headerName: 'Jam Presensi',
                    field: 'waktu'
                },
                {
                    headerName: 'Terlambat',
                    field: 'terlambat'
                }
            ],
            /// AG Data Grid default column options
            defaultColDef: {
                editable: false,
                sortable: true,
                flex: 1,
                minWidth: 100,
                filter: true,
            },
            gridOptions: {
                pagination: true,
                paginationAutoPageSize: true,
                enableFilter: true,
                enableSorting: true
            }
        }
    }

    componentDidMount() {
        this.loaddatadashboard()
        this.setwaktu()
    }

    async loaddatadashboard() {
        await axios.get("jmlpegawai", {
            headers: { Authorization: `Bearer ` + localStorage.getItem("token") },
        }).then((response) => {
            this.setState({ jmlpegawai: response.data.data[0].jml_pengguna })
        }).then(async () => {
            await axios.get("dashboardpresensi", {
                headers: { Authorization: `Bearer ` + localStorage.getItem("token") },
            }).then((response) => {
                console.log(response.data.data)
                this.setState({
                    jmlpresensihari: response.data.data[0].jml_presensi,
                    jmlpresensimobile: response.data.data[0].jml_presensi_mobile,
                    jmlpresensiweb: response.data.data[0].jml_presensi_site,
                    jmlterlambat: response.data.data[0].terlambat
                })
            }).catch((error) => {
                swal(`Sorry! ${error}`, {
                    icon: "error",
                });
            }).finally(() => {
                this.setState({ loading: false })
                this.getDataPresensi()
            })
        }).catch((error) => {
            swal(`Sorry! ${error.response.message}`, {
                icon: "error",
            });
        }).finally(() => {
            this.setState({ loading: false })
        })
    }

    /// getting data presensi from api
    async getDataPresensi() {
        this.setState({ loading: true })
        axios.get("presensi?periode=now", {
            headers: { Authorization: `Bearer ` + localStorage.getItem("token") },
        }).then((response) => {
            this.setState({ dataPresensi: response.data.data })
        }).catch((error) => {
            swal(`Sorry! ${error.response.message}`, {
                icon: "error",
            });
        }).finally(() => {
            this.setState({ loading: false })
        })
    }
    setwaktu() {
        setInterval(() => {
            const current = new Date();
            const date = `${current.toLocaleDateString('id-ID', { weekday: 'long' })}, ${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()} ${current.getHours()}:${current.getMinutes()}:${current.getSeconds()}`;
            this.setState({ setwaktu: date })
        }, 1000);
    }

    render() {
        return (
            <>
                {/* /// import navigation */}
                <Nav />
                {/* /// put code of dashboard component here! */}
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <span>{this.state.setwaktu}</span>
                    </div>
                </header>
                <main>
                    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                        <button className="bg-grey-light hover:bg-grey text-grey-darkest font-bold py-2 px-4 rounded inline-flex items-center justify-end" onClick={() => this.loaddatadashboard()}>
                            <FaSync className='mr-2' />
                            <span>Refresh</span>
                        </button>
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <div className='bg-white border rounded-md shadow-md py-10 px-16 items-center'>
                                <h3 className='font-medium text-lg'>Jumlah Pegawai</h3>
                                <h1 className='font-medium text-xl'>{this.state.jmlpegawai}</h1>
                            </div>
                            <div className='bg-white border rounded-md  shadow-md py-10 px-16 col-span-2'>
                                <div className='grid grid-cols-4 gap-2'>
                                    <div className='col-span-2'>
                                        <h3>Jumlah Presensi Hari Ini</h3>
                                        <h1>{this.state.jmlpresensihari}</h1>
                                    </div>
                                    <div>
                                        <h3>Kantor</h3>
                                        <h1>{this.state.jmlpresensiweb}</h1>
                                    </div>
                                    <div>
                                        <h3>Mobile</h3>
                                        <h1>{this.state.jmlpresensimobile}</h1>
                                    </div>
                                    <div>
                                        <h3>Terlambat</h3>
                                        <h1>{this.state.jmlterlambat} Orang</h1>
                                    </div>
                                </div>
                            </div>
                            <div className='bg-cyan-700 rounded-md mt-15 shadow-md py-2 px-2 col-span-3 ag-theme-material' style={{ height: '50vh' }}>
                                {/* /// table data grid */}
                                {/* <div className='ag-theme-alpine' style={{ height: '100vh' }}> */}
                                <AgGridReact
                                    suppressExcelExport={true}
                                    rowData={this.state.dataPresensi}
                                    columnDefs={this.state.columnDefs}
                                    animateRows={true}
                                    gridOptions={this.state.gridOptions}
                                    defaultColDef={this.state.defaultColDef}
                                    loadingCellRendererParams={this.state.loadingCellRendererParams}
                                />
                                {/* </div> */}
                            </div>
                        </div>
                    </div>
                </main>
            </>
        );
    }
}

export default DashboardPage;
