import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { auth, resetPassword } from "../Firebase/Firebase";
import { Alert } from 'reactstrap';
import "./Reset.css";
function Reset() {
  const [email, setEmail] = useState("");
  const [user, loading] = useAuthState(auth);
  const [errors, setErrors] = useState("");
  const [hasError, setHasError] = useState(false);
  const [success, setSuccess] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const history = useHistory();
  useEffect(() => {
    if (loading) return;
    if (user) history.replace("/users");
  }, [user, loading]);

  const handleErrors = (error) => {
    setHasError(true);
    setIsSuccess(false);
    console.log(error);
    setErrors(error);
  };

  const handleSuccess = (message) => {
    setHasError(false);
    setIsSuccess(true);
    console.log(message);
    setSuccess(message);
  };

  return (
    <div className="reset">
      <div className="reset__container">
        {hasError &&
          <Alert color="warning">
            {errors}
          </Alert>
        }
        {isSuccess &&
          <Alert color="success">
            {success}
          </Alert>
        }
        <input
          type="text"
          className="reset__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu correo electronico"
        />
        <button
          className="reset__btn"
          onClick={() => resetPassword(email, handleErrors, handleSuccess)}
        >
          Enviar email de Reset password
        </button>
        <div>
          No tiene una cuenta? <Link to="/register">Registrese</Link> ya.
        </div>
      </div>
    </div>
  );
}
export default Reset;