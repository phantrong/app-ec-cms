import React from 'react';
import PropTypes from 'prop-types';
import { Route, Navigate } from 'react-router-dom';

import { getToken } from '../../helper/storage';

const PrivateRoute = ({ component: Component, ...rest }: { component: any }) => {
  const hasToken = getToken();

  return (
    <Route
      {...rest}
      children={(props: any) =>
        hasToken ? (
          <Component {...props} />
        ) : (
          <Navigate
            to={{
              pathname: '/',
            }}
            state={{ from: props.location }}
          />
        )
      }
    />
  );
};

PrivateRoute.propTypes = {
  component: PropTypes.object.isRequired,
};

export default PrivateRoute;
