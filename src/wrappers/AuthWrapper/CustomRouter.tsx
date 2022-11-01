import React from 'react';
import PropTypes from 'prop-types';
import { Route, Navigate, useLocation } from 'react-router-dom';

const CustomRoute = ({ component: Component, ...rest }: { component: any }) => {
  const { pathname } = useLocation();

  return (
    <Route
      {...rest}
      children={(props: any) =>
        pathname === '/' ? (
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

CustomRoute.propTypes = {
  component: PropTypes.object.isRequired,
};

export default CustomRoute;
