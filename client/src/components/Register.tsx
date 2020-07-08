import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './Register.css';

type RegisterEvent = React.MouseEvent<HTMLInputElement, MouseEvent>;

interface IProps {
  setLoggedInUser: React.Dispatch<React.SetStateAction<string>>;
}

const register: React.FC<IProps> = ({ setLoggedInUser }) => {
  const history = useHistory();

  // -----------
  // Form fields
  // -----------

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  // --------------
  // Error messages
  // --------------

  let containsErrors = false;
  const [error, setError] = useState(false);

  const [errorEmail, setErrorEmail] = useState('');
  const [errorUsername, setErrorUsername] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [errorPasswordConfirm, setErrorPasswordConfirm] = useState('');

  // ------------------------
  // Clear out error messages
  // ------------------------

  const clearErrorMessages = () => {
    containsErrors = false;
    setError(false);
    setErrorEmail('');
    setErrorUsername('');
    setErrorPassword('');
    setErrorPasswordConfirm('');
  };

  // ---------------------
  // Validate email format
  // ---------------------

  const validateEmailFormat = () => {
    // Regex for email validation from: https://stackoverflow.com/a/46181/2040509
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!regex.test(String(email).toLowerCase())) {
      setErrorEmail('Please enter a valid email');
      containsErrors = true;
      setError(true);
      return;
    }

    setErrorEmail('');
  };

  // ------------------------
  // Validate username format
  // ------------------------

  const validateUsernameFormat = () => {
    // Regex for username validation from: https://www.regextester.com/104030
    const regex = /^[a-z0-9_-]{3,16}$/;

    if (!regex.test(username)) {
      setErrorUsername('Please enter a valid username');
      containsErrors = true;
      setError(true);
      return;
    }

    setErrorUsername('');
  };

  // ------------------------
  // Validate password format
  // ------------------------

  const validatePasswordFormat = () => {
    if (String(password).length < 3) {
      setErrorPassword('Please enter a valid password');
      containsErrors = true;
      setError(true);
      return;
    }

    setErrorPassword('');
  };

  // -----------------------
  // Validate password match
  // -----------------------

  const validatePasswordMatch = () => {
    if (password !== passwordConfirm) {
      setErrorPasswordConfirm("Password fields don't match");
      containsErrors = true;
      setError(true);
      return;
    }

    setErrorPasswordConfirm('');
  };

  // --------------
  // Send user data
  // --------------
  // TODO: clear any tokens that might be lingering in the users cookies

  const sendUserData = async () => {
    const userInfo = { email, username, password };

    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),
    });

    const data = await response.json();
    console.log(data);

    // Email already exists
    if (data.emailAlreadyExists) {
      setErrorEmail('An account with that email already exists');
      containsErrors = true;
      setError(true);
    }

    // Username is taken
    if (data.usernameTaken) {
      setErrorUsername('Username already taken');
      containsErrors = true;
      setError(true);
    }

    // TODO: handle any server errors that might have occured

    if (data.registrationSuccessful) {
      // TODO: show successful registration message
      setLoggedInUser(data.userId);
      history.push('/');
    }
  };

  // -----------
  // Form submit
  // -----------

  const submitForm = (e: RegisterEvent) => {
    e.preventDefault();

    // Clear our all errors before validating
    clearErrorMessages();

    // Validate all inputs
    validateEmailFormat();
    validateUsernameFormat();
    validatePasswordFormat();
    validatePasswordMatch();

    // If any of the inputs don't pass validation stop submission
    if (containsErrors) return;

    // Send the data to the backend and do backend validation
    sendUserData();
  };

  // ------
  // Render
  // ------

  return (
    <div className="register-page">
      <h1>Register</h1>

      {error && (
        <ul className="form-error">
          {errorEmail && <li className="form-error__item">{errorEmail}</li>}
          {errorUsername && (
            <li className="form-error__item">{errorUsername}</li>
          )}
          {errorPassword && (
            <li className="form-error__item">{errorPassword}</li>
          )}
          {errorPasswordConfirm && (
            <li className="form-error__item">{errorPasswordConfirm}</li>
          )}
        </ul>
      )}

      <form className="register-form">
        <label htmlFor="register-email" className="input-label">
          <div className="input-label__text">Email</div>
          <input
            type="text"
            className="input-label__input"
            id="register-email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </label>

        <label htmlFor="register-username" className="input-label">
          <div className="input-label__text">Username</div>
          <div className="input-label__description">
            Length 3-16 characters, numbers, letters, -, and _ allowed
          </div>
          <input
            type="text"
            className="input-label__input"
            id="register-username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
        </label>

        <label htmlFor="register-password" className="input-label">
          <div className="input-label__text">Password</div>
          <div className="input-label__description">
            Minimum length of 3 characters
          </div>
          <input
            type="password"
            className="input-label__input"
            id="register-password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </label>

        <label htmlFor="register-confirm-password" className="input-label">
          <div className="input-label__text">Confirm Password</div>
          <input
            type="password"
            className="input-label__input"
            id="register-confirm-password"
            onChange={(e) => setPasswordConfirm(e.target.value)}
            value={passwordConfirm}
          />
        </label>

        <input type="submit" value="Register" onClick={submitForm} />
      </form>
    </div>
  );
};

export default register;
