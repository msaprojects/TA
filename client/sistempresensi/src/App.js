import React, {Component} from "react";
import { Routes, Route } from "react-router-dom";
/// checking localstorage
import PrivateRoute from './utils/PrivateRoute'
///put page here!
// | LOGIN
import LoginPage from "./pages/login/login";

// | DASHBOARD
import DashboardPage from "./pages/dashboard/dashboard";

// | PEGAWAI
import DataPegawaiPage from "./pages/pegawai/pegawai";
import AddPegawai from "./pages/pegawai/addPegawai"

// | SETTING
import SettingPage from "./pages/setting/setting";
import AddSetting from "./pages/setting/addSetting";

// | WEBCAM
import FaceRegister from "./pages/webcam/faceregister";
import PresensiWebcam from "./pages/presensi/presensi";

// | LOKASI
import LokasiPage from "./pages/lokasi/lokasi";
import AddLokasi from "./pages/lokasi/addLokasi";

// | TUGAS
import TugasPage from "./pages/tugas/tugas";
import AddTugas from "./pages/tugas/addTugas";

// | PRESENSI
import Datapresensi from "./pages/report/presensi/datapresensi";

class App extends Component {
  render() {
    return (
      <div>
      <Routes>
        <Route exact path='/' element={<LoginPage/>}/>
        <Route exact path='/login' element={<LoginPage/>}/>
        <Route exact path='/landmarkview' element={<FaceRegister/>}/>
        {/* /// NEED AUTHENTICATION */}
        <Route exact path='/dashboard' element={<PrivateRoute/>}>
          <Route exact path='/dashboard' element={<DashboardPage/>}/>
        </Route>
        <Route exact path='/registrasiwajah' element={<PrivateRoute/>}>
          <Route exact path='/registrasiwajah' element={<FaceRegister/>}/>
        </Route>
        <Route exact path='/datapegawai' element={<PrivateRoute/>}>
          <Route exact path='/datapegawai' element={<DataPegawaiPage/>}/>
        </Route>
        <Route exact path='/datasetting' element={<PrivateRoute/>}>
          <Route exact path='/datasetting' element={<SettingPage/>}/>
        </Route>
        <Route exact path='/addpegawai' element={<PrivateRoute/>}>
          <Route exact path='/addpegawai' element={<AddPegawai/>}/>
        </Route>
        <Route exact path='/addsetting' element={<PrivateRoute/>}>
          <Route exact path='/addsetting' element={<AddSetting/>}/>
        </Route>
        <Route exact path='/presensi' element={<PrivateRoute/>}>
          <Route exact path='/presensi' element={<PresensiWebcam/>}/>
        </Route>
        <Route exact path='/datalokasi' element={<PrivateRoute/>}>
          <Route exact path='/datalokasi' element={<LokasiPage/>}/>
        </Route>
        <Route exact path='/addlokasi' element={<PrivateRoute/>}>
          <Route exact path='/addlokasi' element={<AddLokasi/>}/>
        </Route>
        <Route exact path='/datatugas' element={<PrivateRoute/>}>
          <Route exact path='/datatugas' element={<TugasPage/>}/>
        </Route>
        <Route exact path='/addtugas' element={<PrivateRoute/>}>
          <Route exact path='/addtugas' element={<AddTugas/>}/>
        </Route>
        <Route exact path='/datapresensi' element={<PrivateRoute/>}>
          <Route exact path='/datapresensi' element={<Datapresensi/>}/>
        </Route>
      </Routes>
    </div>
    );
  }
}

export default App;
