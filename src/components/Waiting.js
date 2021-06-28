import React, { Component } from "react";
import axios from "axios";
import "./style/table.css";
import logo from "./images/logo.png";
class Waiting extends Component {
  state = {
    information: "en cours de preparation",
  };
  getData = () => {
    URL =
      "http://localhost:8080/api/commandes/qr/etat/" +
      localStorage.getItem("dataqr") +
      "/" +
      localStorage.getItem("myid");
    axios.get(URL).then((resp) => {
      if (resp.data == 1) {
        this.setState({ information: "pret" });
      } else this.setState({ information: "en cours de preparation" });
    });
  };

  componentDidMount() {
    setInterval(this.getData, 1000);
  }
  render() {
    return (
      <div className="container">
        <img src={logo} alt="background-img" />
        <div className="box">
          <div className="circle"></div>
          <div className="circle"></div>
        </div>
        <h2>
          Votre Repas est <text>{this.state.information}</text>
        </h2>
      </div>
    );
  }
}

export default Waiting;
