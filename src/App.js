import React, { Component } from "react";
import "./App.css";

import Qr from "./components/qr";
import Menu from "./components/Menu";
import Waiting from "./components/Waiting";
import Welcome from "./components/welcome";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  componentWillMount() {
    const that = this;
    let sqPaymentScript = document.createElement("script");
    sqPaymentScript.src = "https://js.squareup.com/v2/paymentform";
    sqPaymentScript.type = "text/javascript";
    sqPaymentScript.async = false;
    sqPaymentScript.onload = () => {
      that.setState({
        loaded: true,
      });
    };
    document.getElementsByTagName("head")[0].appendChild(sqPaymentScript);
  }

  render() {
    return (
      <div>
        <Router>
          <Switch>
            <Route path="/welcome">
              <Welcome />
            </Route>

            <Route path="/qr">
              <Qr />
            </Route>

            <Route path="/menu">
              <Menu />
            </Route>

            <Route path="/waiting">
              <Waiting />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
