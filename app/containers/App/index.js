/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';

import HomePage from 'containers/HomePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';

//custom
import ToDo from 'containers/ToDo/Loadable';
import Profile from 'containers/Profile/Loadable';
import Features from 'containers/Features/Loadable';
import SignIn from 'containers/SignIn/Loadable';
import NavbarHeader from "../ToDo/NavbarHeader";
import Footer from "../ToDo/Footer";

//main app css
import GlobalStyle from '../../global-styles';

//3rd party css
import "font-awesome/css/font-awesome.css";
import 'react-confirm-alert/src/react-confirm-alert.css';
import 'react-notifications/lib/notifications.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <div className="App">
      <NavbarHeader />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/ToDo/" component={ToDo} />
        <Route exact path="/ToDo/:id" component={ToDo} />
        <Route exact path="/ToDo/:id/:tab" component={ToDo} />
        <Route exact path="/Profile" component={Profile} />
        <Route exact path="/Features" component={Features} />
        <Route exact path="/SignIn" component={SignIn} />
        <Route component={NotFoundPage} />
      </Switch>
      <Footer />
      <GlobalStyle />
    </div >
  );
}

export default App;