import axios from "axios";
const API_URL = "http://localhost:8080/api/Ecommande";

class ajoutercommande {
  getallmenu() {
    return axios.post(API_URL);
  }
}
export default new ajoutercommande();
