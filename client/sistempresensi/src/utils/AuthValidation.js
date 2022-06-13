/// import axios
import axios from "./server";

// LOGOUT
export const logout = () => {
  localStorage.clear();
  // return <Route exact path="/dashboard" element={<DashboardPage />} />;
};

// LOGIN STATUS
// export function TokenValidation() {
//   return axios.get("cekvalidasi/" + localStorage.getItem("token"));
// }

export const isLogin = () => {
    //  axios
    // .get("cekvalidasi/" + localStorage.getItem("token"))
    // .then((response)=> {return response.data.data}).catch((error)=>{return error.response.data});
    if (localStorage.getItem("token")) {
      return true;
    } else {
      return false;
    }
};
