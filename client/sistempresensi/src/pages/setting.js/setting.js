import React, { Component } from 'react';
import Nav from '../components/Navbar';

import axios from '../../utils/server'
import swal from 'sweetalert';
import { FaPlus } from 'react-icons/fa'
/// import data table
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-material.css'
/// import react router dom
import { Link } from "react-router-dom";

class SettingPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            dataSetting: [],
            /// AG Data Grid column and row definition
            columnDefs: [
                {
                    headerName: "Jam Masuk",
                    field: 'jam_masuk'
                },
                {
                    headerName: "Jam Keluar",
                    field: 'jam_keluar',
                },
                {
                    headerName: "Toleransi Masuk",
                    field: 'toleransi',
                },
                {
                    headerName: 'Status',
                    field: 'flag_aktif',
                    valueFormatter: params => params.value === 1 ? 'Aktif' : 'Non-Aktif',
                },
                {
                    headerName: "Mulai Berlaku",
                    field: 'created'
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
        this.getDataSetting();
    }
    /// getting data presensi from api
    async getDataSetting() {
        this.setState({ loading: true })
        axios.get("setting", {
            headers: { Authorization: `Bearer ` + localStorage.getItem("token") },
        }).then((response) => {
            console.log(response);
            this.setState({ dataSetting: response.data.data })
        }).catch((error) => {
            swal(`Sorry! ${error.response.message}`, {
                icon: "error",
            });
        }).finally(() => {
            this.setState({ loading: false })
        })
    }
    render() {
        return (
            <>
                {/* /// import navigation */}
                <Nav />
                {/* /// put code of dashboard component here! */}
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-gray-900">Data Setting</h1>
                    </div>
                </header>
                <main>
                    <div className="mx-auto py-6 sm:px-6 lg:px-8">
                        <Link to='/addsetting'>
                            <button className="bg-grey-light hover:bg-grey text-grey-darkest font-bold py-2 px-4 rounded inline-flex items-center justify-end">
                                <FaPlus className='mr-2' />
                                <span>Perbarui Setting</span>
                            </button>
                        </Link>
                        <div className="grid grid-cols-3 gap-4 items-center">
                            <div className='border rounded-md mt-15 shadow-md py-2 px-2 col-span-3 ag-theme-material' style={{ height: '75vh' }}>
                                {/* /// table data grid */}
                                {/* <div className='ag-theme-alpine' style={{ height: '100vh' }}> */}
                                <AgGridReact
                                    suppressExcelExport={true}
                                    rowData={this.state.dataSetting}
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

export default SettingPage;
