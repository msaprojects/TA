import React, {Component} from "react";
import { Routes, Route } from "react-router-dom";
/// checking localstorage
import PrivateRoute from './utils/PrivateRoute'
///put page here!
// | LOGIN
import LoginPage from "./pages/login/login";

// | DASHBOARD
import DashboardPage from "./pages/dashboard/dashboard";

// | WEBCAM
import FaceRegister from "./pages/webcam/faceregister";

class App extends Component {
  render() {
    return (
      <div>
      <Routes>
        <Route exact path='/' element={<LoginPage/>}/>
        <Route exact path='/login' element={<LoginPage/>}/>
        {/* /// NEED AUTHENTICATION */}
        <Route exact path='/dashboard' element={<PrivateRoute/>}>
          <Route exact path='/dashboard' element={<DashboardPage/>}/>
        </Route>
        <Route exact path='/registrasiwajah' element={<PrivateRoute/>}>
          <Route exact path='/registrasiwajah' element={<FaceRegister/>}/>
        </Route>
      </Routes>
    </div>
    );
  }
}

export default App;
