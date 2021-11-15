//import React from 'react'
import { Link } from "react-router-dom";
import React, { useState } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { Alert } from 'reactstrap';
import {
    Collapse,
    Button,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    NavbarText
  } from 'reactstrap';

const Header = () => {
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  const [isOpen, setIsOpen] = useState(false);
  //const toggle = () => setIsOpen(!isOpen);

  const logout = () => {
    auth.signOut().then(function () {
      // Sign-out successful.
      console.log("loggedout");
    }).catch((error) => {
      // An error happened.
      //const errorCode = error.code;
      //const errorMessage = error.message;
    });
  };

  if (!user) {
    return (
      <div className="No se encuentra Logueado">
          <Alert color="info" className='text-center'>
              No se encuentra Logueado <br />
              <a href='/Login'>Ir a Inicio</a>
          </Alert>
      </div>
    );
  } else {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">       JOBAM  Modulo de Ventas      </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" 
                data-bs-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false" 
                aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarColor02">
                <ul className="navbar-nav me-auto">
                  <li className="nav-item">
                      <Link className="nav-link active" to= '/Login' href="#">********
                          <span className="visually-hidden">(current)</span>
                      </Link>
                  </li>
                  <li className="nav-item">
                      <Link className="nav-link" to= '/Caja' href="#">Caja</Link>
                  </li>
                  <li className="nav-item">
                      <Link className="nav-link" to= '/Ventas' href="#">Ventas</Link>
                  </li>
                  <li className="nav-item">
                      <Link className="nav-link" to= '/Productos' href="#">Productos</Link>
                  </li>
                  <li className="nav-item">
                      <Link className="nav-link" to= '/Users' href="#">Usuarios</Link>
                  </li>
                  <NavItem>
                    <NavLink className="nav-link" to= '/' onClick={logout}>Salir</NavLink>
                  </NavItem>                            
                </ul>
                <NavItem>
                  <NavbarText>{user.email} {user.displayName? user.displayName:''} </NavbarText>
                </NavItem>
                <br />
                <form class="d-flex">
                  <input class="form-control me-sm-2" type="text" placeholder="Search"/>
                  <button class="btn btn-secondary my-2 my-sm-0" type="submit">Buscar</button>
                </form>                        
            </div>
          </div>
        </nav>
      </div>
    );
  }  
};

export default Header
