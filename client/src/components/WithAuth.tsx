import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

interface IProps {
  loggedInUser: string;
  Component: any;
}

const WithAuth: React.FC<IProps> = ({ loggedInUser, Component }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [redirect, setRedirect] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/user')
      .then((res) => {
        if (res.status === 200) {
          setLoading(false);
        } 
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        setRedirect(true);
      });
  }, []);

  if (loading) return null;
  if (redirect) {
    return (
      <Redirect to="/login" />
    );
  }

  return (
    <Component loggedInUser={loggedInUser} />
  );
};

WithAuth.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default WithAuth;
