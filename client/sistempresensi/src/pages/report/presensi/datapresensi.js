import React, { Component } from 'react';
import Nav from '../../components/Navbar';

import axios from '../../../utils/server'
import swal from 'sweetalert';

import AsyncSelect from 'react-select/async'
/// import data table
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-material.css'

class Datapresensi extends Component {
    constructor(props) {
        super(props)
        this.state = {
            filter: '',
            tanggalAwal: '',
            tanggalAkhir: '',
            loading: true,
            idpengguna: '',
            tglawal: '',
            tglakhir: '',
            dataPresensi: [],
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
                    headerName: 'Waktu Presensi',
                    field: 'timestamp'
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
        this.getDataPresensi('all')
    }

    /// getting data presensi from api
    async getDataPresensi(filter) {
        this.setState({ loading: true })
        axios.get("presensi?periode=" + filter, {
            headers: { Authorization: `Bearer ` + localStorage.getItem("token") },
        }).then((response) => {
            this.setState({ dataPresensi: response.data.data })
        }).catch((error) => {
            console.log(error.response)
            swal(`Sorry! ${error.response.message}`, {
                icon: "error",
            });
        }).finally(() => {
            this.setState({ loading: false })
        })
    }
    loadPegawai() {
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
    render() {
        return (
            <>
                <Nav />
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-gray-900">Data Presensi</h1>
                    </div>
                </header>
                <main>
                    <div className="mx-auto py-6 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                    Tanggal Awal
                                </label>
                                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    id="grid-first-name"
                                    type="date"
                                    onChange={(e) => this.setState({ tglawal: e.target.value })}
                                    placeholder="08:00:00" />
                            </div>
                            <div className="w-full md:w-1/4 px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                    tanggal Akhir
                                </label>
                                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="grid-last-name"
                                    type="date"
                                    // value={jamkeluar}
                                    onChange={(e) => this.setState({ tglakhir: e.target.value })}
                                    placeholder="16:00:00" />
                            </div>
                            <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                    Pilih Pengguna
                                </label>
                                <div className="relative">
                                    <AsyncSelect
                                        cacheOptions
                                        defaultOptions
                                        getOptionLabel={e => e.nama}
                                        getOptionValue={e => e.idpengguna}
                                        loadOptions={this.loadPegawai}
                                        placeholder="Pilih Pegawai..."
                                        onChange={(value) => {
                                            this.setState({ idpengguna: value.idpengguna })
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="w-full md:w-1/4 px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">

                                </label>
                                <button className='w-full h-12 px-6 text-white rounded-lg focus:shadow-outline hover:bg-gray-600 bg-cyan-700 font-bold shadow-xl'
                                    onClick={(e) => {
                                        if (this.state.idpengguna !== '' || this.state.tglawal !== '' || this.state.tglakhir !== '') {
                                            this.getDataPresensi('periode&tanggalawal='+this.state.tglawal+'&tanggalakhir='+this.state.tglakhir+'&idpengguna='+this.state.idpengguna)
                                        } else {
                                            swal(`Pilih Tanggal awal, Tanggal Akhir dan pengguna`, {
                                                icon: "error",
                                            });
                                        }
                                    }}
                                    type='button'
                                >FILTER</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <div className='border rounded-md mt-15 shadow-md py-2 px-2 col-span-3 ag-theme-material' style={{ height: '65vh' }}>
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

export default Datapresensi;
