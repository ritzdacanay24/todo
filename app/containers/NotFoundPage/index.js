/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 *
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import Jumbotron from 'react-bootstrap/Jumbotron';

import messages from './messages';

export default function NotFound() {
  return (
    <Jumbotron className="text-center bg-white">
      <h1>
        <FormattedMessage {...messages.header} />
      </h1>
    </Jumbotron>

  );
}
