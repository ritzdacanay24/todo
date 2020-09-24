import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, currentUser, ...rest }) => {
  return (
    <Route {...rest} render={
        props => {
          if (currentUser) {
            return <Component {...rest} {...props} currentUser={currentUser}/>
          } else {
            return <Redirect to={
              {
                pathname: '/',
                state: {
                  from: props.location
                }
              }
            } />
          }
        }
      } />
  )
}

export default ProtectedRoute;