import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import './Nav.css';

interface IProps {
  loggedInUser: string;
  setLoggedInUser: React.Dispatch<React.SetStateAction<string>>;
}

const Nav: React.FC<IProps> = ({ loggedInUser, setLoggedInUser }) => {
  const history = useHistory();

  const logout = () => {
    console.log('logging out');
    // TODO: clear token cookie
    // document.cookie = 'connect.sid=; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/';
    fetch('/api/logout')
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
      })
      .catch((err) => {
        // TODO: handle error if fetch attempt fails
        console.log('Error on logout: ', err);
      });
    setLoggedInUser('');
    history.push('/');
  };

  return (
    <header className="header">
      <nav className="nav">
        <ul className="nav__list">
          <li className="nav__item">
            <Link to="/" className="nav__link">
              Home
            </Link>
          </li>

          {!loggedInUser && (
            <>
              <li className="nav__item">
                {/* <Link to="/api/login" className="nav__link">
                  Login
                </Link> */}
                <a href="/api/login" className="nav__link">
                  Login
                </a>
              </li>
              <li className="nav__item">
                <Link to="/register" className="nav__link">
                  Register
                </Link>
              </li>
            </>
          )}
          {loggedInUser && (
            <>
              <li className="nav__item">
                <Link to="/savedcollections" className="nav__link">
                  Saved Collections
                </Link>
              </li>
              {/* Profile nav bar item not completed but functionality can be added */}
              <li className="nav__item">
                <Link to="/profile" className="nav__link">
                  Profile
                </Link>
              </li>
              <li className="nav__item">
                <a href="/api/logout" className="nav__link">Logout</a>
                {/* <button type="button" className="nav__link" onClick={logout}>
                  Logout
                </button> */}
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Nav;
