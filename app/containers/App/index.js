/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import HomePage from 'containers/HomePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';

//custom
import ToDo from '../../components/ToDo';
import Profile from "../../components/Profile/Profile";
import Features from '../../components/Features';
import NavbarHeader from "../../components/NavbarHeader";
import Footer from "../../components/Footer";
import Login from "../../components/login.component";
import Register from "../../components/register.component";

//main app css
import GlobalStyle from '../../global-styles';

//3rd party css
import "font-awesome/css/font-awesome.css";
import 'react-confirm-alert/src/react-confirm-alert.css';
import 'react-notifications/lib/notifications.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import AuthService from "../../services/auth.service";

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
      isAuthenticating: true
    };
  }

  async componentDidMount() {
    const user = await AuthService.getCurrentUser();
    if (user) {
      this.setState({
        currentUser: user
      });
    }
    this.setState({isAuthenticating:false})
  }
  
  render() {
    if (this.state.isAuthenticating) return null;
    const { currentUser } = this.state;
    return (
      <div className="App">
        <NavbarHeader userInfo={currentUser} />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/ToDo" render={(props) => (<ToDo currentUser={currentUser} {...props}/>)}  />
          <Route exact path="/ToDo/:id" render={(props) => (<ToDo currentUser={currentUser} {...props}/>)}  />
          <Route exact path="/ToDo/:id/:tab" render={(props) => (<ToDo currentUser={currentUser} {...props}/>)}  />
          <Route exact path="/Profile" render={(props) => (<Profile currentUser={currentUser} {...props}/>)}  />
          <Route exact path="/Features" component={Features} />
          <Route exact path="/Login" component={Login} />
          <Route exact path="/Register" component={Register} />
          <Route component={NotFoundPage} />
        </Switch>
        <Footer />
        <GlobalStyle />
      </div >
    )
  };
}

export default App;