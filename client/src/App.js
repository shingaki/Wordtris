import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from "axios";
// import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Play from "./components/Play"
import NoMatch from "./components/NoMatch"
import LoginPrompt from "./components/LoginPrompt"

class App extends Component {

  state = {
    loggedin: false
  }

  componentWillMount = () => {
    this.checkLoggedInState();
  }

  autoLogin = event => {
    event.preventDefault();
    axios.get("/auto-login").then(UserInfo => {
      console.log("are they logged in");
      console.log(UserInfo);
      this.updateLoggedInState(UserInfo.data.loggedin);
      window.location.reload();
    }).catch(err => console.log(err))
  }

  checkLoggedInState = () => {
    axios.get("/isloggedin").then(UserInfo => {
      console.log("are they logged in");
      console.log(UserInfo.data);
      this.updateLoggedInState(UserInfo.data.loggedin);
    }).catch(err => console.log(err))
  }

  updateLoggedInState = (value) => {
    this.setState({
      loggedin: value
    })
  }



  LoginSection = (props) => {
    return (
      <Login updateLoggedInState={this.updateLoggedInState} autoLogin={this.autoLogin} />
    );
  }

  render() {
    return (
      <>
        <Navbar loggedin={this.state.loggedin} updateLoggedInState={this.updateLoggedInState} />
        <Router>
          <Switch>
            {/* <Route exact path="/" render={this.ResultsSection} /> */}
            {/* <Route exact path="/login" render={this.SavedSection} /> */}
            <Route exact path="/" render={this.LoginSection} />
            <Route exact path="/login" render={this.LoginSection} />
            <Route exact path="/signup" component={SignUp} updateLoggedInState={this.updateLoggedInState} />
            {this.state.loggedin ?
              <Route exact path="/play" component={Play} /> : <Route exact path="/play" component={LoginPrompt} />
            }
            <Route component={NoMatch} />
          </Switch>
        </Router>
      </>
    );
  }
}

export default App;
