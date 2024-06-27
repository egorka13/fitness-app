import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import styles from './Auth.module.scss';
import {
  doCreateUserWithEmailAndPassword,
  doSignInWithEmailAndPassword,
  useAuth,
} from '../../context/AuthContext';
import { Button } from 'antd';
import { LoginOutlined } from '@ant-design/icons';

export const Login: React.FC = () => {
  const { userLoggedIn } = useAuth();

  const [isSigningIn, setIsSigningIn] = React.useState(true);

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');

  const navigate = useNavigate();

  const onButtonClick = async () => {
    // Set initial error values to empty
    setEmailError('');
    setPasswordError('');

    // Check if the user has entered both fields correctly
    if ('' === email) {
      setEmailError('Please enter your email');
      return;
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError('Please enter a valid email');
      return;
    }

    if ('' === password) {
      setPasswordError('Please enter a password');
      return;
    }

    if (password.length < 7) {
      setPasswordError('The password must be 8 characters or longer');
      return;
    }

    if (isSigningIn) {
      await doSignInWithEmailAndPassword(email, password).catch((error) => {
        setPasswordError(error.message);
      });
    } else {
      await doCreateUserWithEmailAndPassword(email, password).catch((error) => {
        setPasswordError(error.message);
      });
    }
  };

  return (
    <div className={styles.mainContainer}>
      {userLoggedIn && <Navigate to={'/'} replace={true} />}
      <div className={styles.titleContainer}>
        <div>{isSigningIn ? 'Login' : 'Register'}</div>
      </div>
      <br />
      <div className={styles.inputContainer}>
        <input
          value={email}
          placeholder="Enter your email here"
          className={styles.inputBox}
          onChange={(ev) => setEmail(ev.target.value)}
        />
        <label className={styles.errorLabel}>{emailError}</label>
      </div>
      <br />
      <div className={styles.inputContainer}>
        <input
          value={password}
          placeholder="Enter your password here"
          className={styles.inputBox}
          onChange={(ev) => setPassword(ev.target.value)}
        />
        <label className={styles.errorLabel}>{passwordError}</label>
      </div>
      <br />
      <div className={styles.inputContainer}>
        <Button
          type="primary"
          size={'large'}
          icon={<LoginOutlined />}
          onClick={onButtonClick}
        >
          {isSigningIn ? 'Sign in' : 'Sign up'}
        </Button>
      </div>
      <div className={styles.additionalText}>
        {isSigningIn ? (
          <>
            Do not have an account yet?{' '}
            <a
              className={styles.linkText}
              onClick={() => setIsSigningIn((prev) => !prev)}
            >
              Click to sign up
            </a>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <a
              className={styles.linkText}
              onClick={() => setIsSigningIn((prev) => !prev)}
            >
              Click to sign in
            </a>
          </>
        )}
      </div>
    </div>
  );
};
