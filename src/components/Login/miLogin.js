//import React from 'react'
//import { getAnalytics } from "firebase/analytics";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
//import { initializeApp } from "firebase/app";
import PropTypes from 'prop-types';
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { signInEmailAndPassword, signInWithGoogle } from "../Firebase/Firebase";
//import { auth, signInEmailAndPassword, signInWithGoogle  } from "../Firebase/Firebase";
import "./Login.css";
import {
    Alert,
    Spinner,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    FormGroup,
    ModalFooter,
  } from "reactstrap";

const data = [];
  
const Login = () => {
  
  const [modalInsertar, setModalInsertar] = React.useState(false);
  const [usuario, setUsuario] = React.useState({
    data: data,
    form: {
      id: "",
      email: "",
      Telefono: "",
      Direccion: "",
      Nombre: "",
      Identificacion: ""
    }
  });


  // Initialize Firebase
  const auth = getAuth();
  auth.languageCode = 'it';
  //const analytics = getAnalytics(app);


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading] = useAuthState(auth);
  const [hasError, setHasError] = useState(false);
  const [login, setLogin] = useState(false);
  const [errors, setErrors] = useState("");
  const history = useHistory();
  const usernameRef = React.useRef(null)




  const handleChange = (e) => {
    setUsuario((prevState) => ({
      ...prevState,
      form: {
        ...prevState.form,
        [e.target.name]: e.target.value,
      }
    }));
  };

  const mostrarModalInsertar = () => {
    setModalInsertar(true);
  };

  const cerrarModalInsertar = () => {
    setModalInsertar(false);
  };

  const insertar = () => {
    let usuarioACrear = { ...usuario.form };
    usuarioACrear.id = usuario.data.length + 1;
    let arregloUsuarios = usuario.data;
    arregloUsuarios.push(usuarioACrear);
    setUsuario({
      ...usuario,
      data: arregloUsuarios
    });
    setModalInsertar(false);
  }


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
        <div class="contenedor__todo">
          {hasError &&
            <Alert color="warning">
              {errors}
            </Alert>
          }
          <div class="caja__trasera">
            <div class="caja__trasera-login">
              <h3>¿En la Aplicacion Ya tienes en una cuenta?</h3>
              <p>Inicia sesión para entrar en la aplicacion Web</p>
              <button id="btn__iniciar-sesion">Iniciar Sesión</button>
            </div>
            <div class="caja__trasera-register p-5 m-5">
              <h3>¿Aún no tienes una cuenta?</h3>
              <p>Regístra tus datos o Utiliza una cuenta de Gmail</p>
              <button className="login__btn" id="btn__registrarse" onClick={mostrarModalInsertar}>Regístrarse</button>
              <p><Link to="/reset">Olvidaste la Contraseña</Link></p>                     
            </div>
          </div>
          <div className="contenedor__login-register">            
            <form action="" class="formulario__login">
              <h2>Iniciar Sesión</h2>
              <input
                type="text"
                className="login__textBox"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu-email"
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
                onClick={() => signInEmailAndPassword(email, password)}
                >Login con tu Cuenta
              </button>
              <button
                className="login__btn login__google"
                onClick={signInWithGoogle}
                >Login con Gmail
              </button>
            </form>
          </div>
        </div>
        <Modal isOpen={modalInsertar}>
          <ModalHeader>
              <div><h3>Ingresar Datos</h3></div>
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <label>
                Email:
              </label>
              <input
                className="form-control"
                name="email"
                type="text"
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
                <label>
                  Nombre:
                </label>
                <input
                  className="form-control"
                  name="Nombre"
                  type="text"
                  onChange={handleChange}
                />
            </FormGroup>
            <FormGroup>
                <label>
                  Identificación:
                </label>
                <input
                  className="form-control"
                  name="Identificacion"
                  type="text"
                  onChange={handleChange}
                />
            </FormGroup>
            <FormGroup>
                <label>
                  Dirección:
                </label>
                <input
                  className="form-control"
                  name="Direccion"
                  type="text"
                  onChange={handleChange}
                />
            </FormGroup>
            <FormGroup>
                <label>
                  Telefóno:
                </label>
                <input
                  className="form-control"
                  name="Telefono"
                  type="text"
                  onChange={handleChange}
                />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={insertar} >Insertar</Button>
            <Button className="btn btn-danger" onClick={cerrarModalInsertar} >Cancelar</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  };  
}
Login.propTypes = {
  type: PropTypes.string, // default: 'border'
  size: PropTypes.string,
  color: PropTypes.string,
  className: PropTypes.string,
  cssModule: PropTypes.object,
  children: PropTypes.string // default: 'Loading...'
};

Login.defaultProps = {};

export default Login