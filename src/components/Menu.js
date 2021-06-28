import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import _, { map } from "underscore";
import "./style/menu.css";
import Card from "react-bootstrap/Card";
import MenuService from "../services/menu.service";
import "./global";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-modal";
import axios from "axios";
import moment from "moment";
class Menu extends Component {
  state = {
    menu: [],
    resultat: [],
    plats: [],
    show: false,
    etatPanier: 0,
    selectedItems: [],
    lastItemAdded: 0,
    prixTotal: 0,
    open: false,
    table: "",
  };

  handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    this.setState({ table: value });
  };

  ItemCounter = (array, item) => {
    let counter = 0;
    array.flat(Infinity).forEach((x) => {
      if (x == item) {
        counter++;
      }
    });
    return counter;
  };

  delete = (id) => {
    var tmp = [];
    this.state.selectedItems.map((ele) => {
      if (ele.id !== id) {
        tmp = [...tmp, ele];
      } else {
        this.setState({
          prixTotal: this.state.prixTotal - ele.qte * ele.prix,
        });
      }
    });
    this.setState({
      selectedItems: tmp,
    });
  };

  componentDidMount() {
    MenuService.getallmenu(localStorage.getItem("dataqr")).then(
      (response) => {
        const qr = response.data;
        this.setState({ qr });
        global.menu = qr;
        this.setState({ show: true });
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
    setTimeout(
      function () {
        this.setState({ show: true });
      }.bind(this),
      1000
    );
  }

  exist(item) {
    this.state.resultat = _.keys(
      _.countBy(item, function (item) {
        return item.categorie;
      })
    );

    this.state.plats = item.reduce(function (r, a) {
      r[a.categorie] = r[a.categorie] || [];
      r[a.categorie].push(a);
      return r;
    }, Object.create(null));
  }

  suivant() {
    this.setState({ open: true });
    axios
      .post("http://localhost:8080/api/Ecommande", {
        qr: localStorage.getItem("dataqr"),
        date: moment().format("YYYY-MM-DD"),
        total: this.state.prixTotal,
      })
      .then(
        (response) => {
          localStorage.setItem("myid", response.data.id);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  confirmer() {
    console.log(this.state.table);
    console.log(this.state.selectedItems);
    this.state.selectedItems.map((ele) => {
      axios.post("http://localhost:8080/api/commandes", {
        categorie: ele.categorie,
        idcommande: localStorage.getItem("myid"),
        place: this.state.table,
        plat: ele.title,
        pret: 0,
        prix: ele.prix,
        quantite: ele.qte,
        qr: localStorage.getItem("dataqr"),
      });
    });
  }
  render() {
    if (this.state.show) {
      this.exist(global.menu);
    }
    return (
      <section className="containera">
        <Modal
          isOpen={this.state.open}
          className="Modal"
          overlayClassName="Overlay"
        >
          <div className="hair"></div>
          <h1 style={{ textAlign: "center" }}>Table</h1>
          <div className="hair"></div>
          <h4 style={{ marginTop: "30px", textAlign: "center" }}>
            Veuillez Saisir Votre Numéro De Table
          </h4>
          <input
            value={this.state.table}
            style={{
              width: "250px",
              height: "40px",
              marginTop: "20px",
              marginLeft: "50px",
              backgroundColor: "#38323236",
              fontSize: "1.5em",
            }}
            onChange={this.handleChange}
          />
          <Link to={"/waiting"}>
            <button
              className="ajouter"
              style={{ marginLeft: "35px" }}
              onClick={() => {
                this.confirmer();
              }}
            >
              {" "}
              CONFIRMER
            </button>
          </Link>
        </Modal>
        <div
          className={
            this.state.etatPanier % 2 === 0
              ? "panierContent display-none"
              : "panierContent display-block"
          }
        >
          {this.state.selectedItems.length !== 0 ? (
            <div className="content">
              <div className="items">
                {this.state.selectedItems.map((ele, index) => {
                  if (ele in this.state.selectedItems) {
                    <p>sc,od</p>;
                  } else {
                    return (
                      <div key={index} className="item">
                        <p className="qte">{ele.qte}x</p>
                        <p className="title">{ele.title}</p>
                        <p className="prix">{ele.prix}DH</p>
                        <i
                          onClick={() => {
                            this.delete(ele.id);
                          }}
                          class="icon bi bi-x"
                        ></i>
                      </div>
                    );
                  }
                })}
              </div>
              <div className="Total">
                <p className="title">Total : </p>
                <p className="prix">{this.state.prixTotal} DH </p>
              </div>
              <div className="controls">
                {" "}
                <Button onClick={() => this.suivant()} className="checkout">
                  SUIVANT
                </Button>
              </div>
            </div>
          ) : (
            <div className="EmptyList">
              <i class="bi bi-basket"></i>
              <p>Empty</p>
            </div>
          )}
        </div>

        <div className="logo">
          <div className="hair"></div>
          <div className="menuA">Menu </div>
          <i
            onClick={() => {
              this.setState({
                etatPanier: this.state.etatPanier + 1,
              });
            }}
            class="bi log_panier bi-bag-check-fill"
          ></i>
          <div className="hair"></div>
        </div>

        {this.state.resultat.map((resultatone) => (
          <div className="row__posters">
            <h1 className="categories">{resultatone}</h1>

            <div className="containt">
              {global.menu.map((menuone) => {
                if (menuone.categorie == resultatone)
                  return (
                    <Card className="plat">
                      <Card.Img
                        className="image"
                        variant="top"
                        src={menuone.image}
                      />
                      <Card.Body>
                        <Card.Title className="titre">
                          {menuone.nomrepas}
                        </Card.Title>
                        <Card.Title className="titreprix">
                          {" "}
                          Prix : <span>{menuone.prix}</span> DH
                        </Card.Title>
                        <Card.Text className="description">
                          {menuone.description}
                        </Card.Text>
                        <button
                          className="ajouter"
                          onClick={() => {
                            var occ = 1;
                            const product = {
                              id: this.state.lastItemAdded,
                              qte: occ,
                              categorie: resultatone,
                              title: menuone.nomrepas,
                              prix: menuone.prix,
                            };

                            var found = false;
                            for (
                              var i = 0;
                              i < this.state.selectedItems.length;
                              i++
                            ) {
                              if (
                                this.state.selectedItems[i].title ==
                                menuone.nomrepas
                              ) {
                                found = true;
                                break;
                              }
                            }

                            if (!found) {
                              this.setState({
                                selectedItems: [
                                  ...this.state.selectedItems,
                                  product,
                                ],
                                prixTotal: this.state.prixTotal + menuone.prix,
                                lastItemAdded: this.state.lastItemAdded + 1,
                              });
                            }

                            for (
                              var i = 0;
                              i < this.state.selectedItems.length;
                              i++
                            ) {
                              if (
                                this.state.selectedItems[i].title ==
                                menuone.nomrepas
                              ) {
                                occ = occ + 1;
                                this.state.selectedItems[i].qte += 1;
                              }

                              this.setState({
                                prixTotal: this.state.prixTotal + menuone.prix,
                                lastItemAdded: this.state.lastItemAdded + 1,
                              });
                            }
                          }}
                          className="ajouter"
                        >
                          Ajouter
                        </button>
                      </Card.Body>
                    </Card>
                  );
              })}
            </div>
          </div>
        ))}
      </section>
    );
  }
}
export default Menu;
