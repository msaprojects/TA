import axios from 'axios';
const serverurl = axios.create({baseURL: 'http://localhost:9995/api/v1/'});
export default serverurl