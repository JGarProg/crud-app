import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, signInEmailAndPassword, signInWithGoogle  } from "../Firebase/Firebase";
import { Alert, Spinner } from 'reactstrap';
import "./Login.css";
import PropTypes from 'prop-types';
//import { Spinner } from 'reactstrap';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading] = useAuthState(auth);
  const [hasError, setHasError] = useState(false);
  const [login, setLogin] = useState(false);
  const [errors, setErrors] = useState("");
  const history = useHistory();
  const usernameRef = React.useRef(null)

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
    }
    if (user) history.replace("/users");
  }, [user, loading]);

  if (loading) {
    return <Spinner children="" style={{ width: '8rem', height: '8rem', position: 'fixed', top: '30%', left: '50%' } } />;
  } else {
    return (
      <div className="login">
        {login &&
            <Spinner children="" style={{ width: '8rem', height: '8rem', position: 'fixed', top: '20%', left: '50%' } } />
        }
        <div className="login__container">
          {hasError &&
            <Alert color="warning">
              {errors}
            </Alert>
          }

          <input
            type="text"
            className="login__textBox"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail Address"
            ref={usernameRef}
          />
          <input
            type="password"
            className="login__textBox"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button
            className="login__btn"
            onClick={() => signInEmailAndPassword(email, password, setLogin, setHasError, setErrors)}
          >
            Login
          </button>
          <button className="login__btn login__google" onClick={() => signInWithGoogle(setLogin, setHasError, setErrors)}>
            Login with Google
          </button>
          <div>
            <Link to="/reset">Forgot Password</Link>
          </div>
          <div>
            Don't have an account? <Link to="/register">Register</Link> now.
          </div>
        </div>
      </div>);
  };
}

Login.propTypes = {
  type: PropTypes.string, // default: 'border'
  size: PropTypes.string,
  color: PropTypes.string,
  className: PropTypes.string,
  cssModule: PropTypes.object,
  children: PropTypes.string, // default: 'Loading...'
};

Login.defaultProps = {};

export default Login;
