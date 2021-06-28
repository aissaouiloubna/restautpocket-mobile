import React, { Component } from "react";
import logo from "./images/logo.png";
import "./style/table.css";
import { Link } from "react-router-dom";
class Welcome extends Component {
  state = {};

  render() {
    return (
      <div className="container">
        <img src={logo} alt="background-img" />
        <h2>bienvenue sur restaurantpocket</h2>
        <div style={{ marginTop: "50px" }}>
          <Link to={"/qr"}>
            {" "}
            <buton className="ajouter">COMMANDER</buton>
          </Link>
        </div>
      </div>
    );
  }
}

export default Welcome;
