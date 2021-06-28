import axios from "axios";
const API_URL = "http://localhost:8080/api/restaux";
class QrService {
  getallqr() {
    return axios.get(API_URL);
  }
}
export default new QrService();
