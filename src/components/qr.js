import React, { Component } from "react";
import QrReader from "react-qr-reader";
import "./style/qr.css";
import logo from "./images/logo.png";
import QrService from "../services/qr.service";
import "./global";
import { Link } from "react-router-dom";

class Qr extends Component {
  state = {
    result: "No result",
    qr: [],
    visible: "none", //none or true
    notvisible: "none",
  };

  componentDidMount() {
    QrService.getallqr().then(
      (response) => {
        const qr = response.data;
        this.setState({ qr });
      },
      (error) => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString(),
        });
      }
    );
  }

  exist(item) {
    const tableau = [];
    this.state.qr.map((q) => tableau.push(q.qr.toString()));
    console.log(tableau.includes(item));
    if (tableau.includes(item)) {
      this.state.visible = true;
      this.state.notvisible = "none";
    } else if (!tableau.includes(item)) {
      this.state.visible = "none";
      this.state.notvisible = true;
    }
  }

  handleScan = (data) => {
    this.setState({
      result: "en cours de scanne",
    });
    if (data) {
      this.setState({
        result: data,
      });
      localStorage.setItem("dataqr", data);
      //global.qr = data;
      this.exist(localStorage.getItem("dataqr"));
    }
    //console.log(global.qr);
  };

  handleError = (err) => {
    console.error(err);
  };

  render() {
    return (
      <body className="forqr">
        <section style={{width:'30%'}}>
          <div class="container">
            <div class="logoa">
              <img src={logo} alt="background-img" />
            </div>
            <div className="hair"></div>
            <h1>Scanner code QR </h1>
            <p>
              Placer code qr dans ce cadre pour scanner . Veuillez ne pas
              secouer pour afficher les résultats rapidement
            </p>

            <QrReader
              delay={300}
              onError={this.handleError}
              onScan={this.handleScan}
              facingMode={"environment"}
            />

            <div style={{ display: this.state.visible }}>
              <button className="form-control-button">
                <span>
                  {" "}
                  <Link to={"/menu"}>Voir menu</Link>
                </span>
              </button>
            </div>

            <div class="messagediv" style={{ display: this.state.notvisible }}>
              <span className="message">
                Veuillez Verifier Si Ce Code Appartient A Notre Service
              </span>
            </div>
          </div>
        </section>
      </body>
    );
  }
}

export default Qr;
