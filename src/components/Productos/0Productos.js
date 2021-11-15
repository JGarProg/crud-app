//import React from 'react';
import React, { useState } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useHistory } from "react-router-dom";
import { getAuth } from "firebase/auth";

import {
  Table,
  Button,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
  Alert
} from "reactstrap";
import Tablero from '../Tablero';

const data = [];
const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const PATH_PRODUCTS = process.env.REACT_APP_API_PRODUCTS_PATH;

const Productos = () => {
  const auth = getAuth();
  const [modalActualizar, setModalActualizar] = React.useState(false);
  const [modalInsertar, setModalInsertar] = React.useState(false);
  const [errors, setErrors] = React.useState(null);
  const [newVal, setNewVal] = React.useState(0);
  const [user, loading, error] = useAuthState(auth);
  const history = useHistory();

  const [producto, setProducto] = React.useState({
    data: data,
    form: {
      _id: "",
      IdProd: "",
      Producto: "",
      Descripcion: "",
      Existen: "",
      Valor: ""
    }
  });
  
  React.useEffect(() => {
    if (loading) return;
    if (!user) return history.replace("/");
  }, [user, loading]);

  React.useEffect(() => {
    if (!user) return history.replace("/");
    user.getIdToken(true).then(token => {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      fetch(`${BASE_URL}${PATH_PRODUCTS}`, requestOptions)
        .then(res => res.json())
        .then(
          (result) => {
            //setIsLoaded(true);
            setProducto({
              ...producto,
              data: result
            });
          },
          (error) => {
            //setIsLoaded(true);
            setErrors(error);
          }
        )
    });
  }, [newVal]);

  const handleChange = (e) => {
    setProducto((prevState) => ({
      ...prevState,
      form: {
        ...prevState.form,
        [e.target.name]: e.target.value,
      }
    }));
  };

  const mostrarModalActualizar = (e) => {
    let arregloProductos = producto.data;
    let productToModify;
    arregloProductos.map((registro) => {
      if (e.target.id === registro._id) {
        productToModify = registro;
      }
    });
    setProducto({
      ...producto,
      form: productToModify
    });
    setModalActualizar(true);
  };

  const cerrarModalActualizar = () => {
    setModalActualizar(false);
  };

  const mostrarModalInsertar = () => {
    setModalInsertar(true);
  };

  const cerrarModalInsertar = () => {
    setModalInsertar(false);
  };

  const editar = () => {
    let productoAModificar = { ...producto.form };
    actualizar(productoAModificar);
    setModalActualizar(false);
  };

  const eliminar = (e) => {
    let arregloProductos = producto.data;
    arregloProductos.map((registro) => {
      if (e.target.id === registro._id) {
        let opcion = window.confirm("¿Está seguro que desea eliminar el producto " + registro.IdProd + "?");
        if (opcion) {
          borrar(registro._id);
        }
      }
    });
    setNewVal(newVal + 1);
  };

  const insertar = () => {
    let productoACrear = { ...producto.form };
    user.getIdToken(true).then(token => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productoACrear)
    };
    fetch(`${BASE_URL}${PATH_PRODUCTS}`, requestOptions)
      .then(
        (response) => {
          response.json();
          setNewVal(newVal + 1);
        },
        (error) => {
          //setIsLoaded(true);
          setErrors(error);
      })
    });
    setModalInsertar(false);
  };

  const borrar = (id) => {
    user.getIdToken(true).then(token => {
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    fetch(`${BASE_URL}${PATH_PRODUCTS}/${id}`, requestOptions)
      .then(result => result.json())
      .then(
        (result) => {
          setNewVal(newVal + 1);
        },
        (error) => {
          console.log(error);
        }
      );
    });
  }

  const actualizar = (product) => {
    user.getIdToken(true).then(token => {
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product)
    };
    fetch(`${BASE_URL}${PATH_PRODUCTS}/${product._id}`, requestOptions)
      .then(result => result.json())
      .then(
        (result) => {
          setNewVal(newVal + 1);
        },
        (error) => {
          console.log(error);
        }
      );
    });
  }



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
      <>
        <Tablero/>
        <div Class='tit m-3'>
          <h1>Productos</h1>
        </div> 
        <Container>
          <br />
          <Button color="success" onClick={mostrarModalInsertar}>Crear</Button>
          <br />
          <br />
          <Table>
            <thead>
              <tr>
                <th>IdProd</th>
                <th>Producto</th>              
                <th>Descripcion</th>
                <th>Existen</th>
                <th>Valor</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {producto.data.map((dato) => (
                <tr key={dato._id}>
                  <td>{dato.IdProd}</td>
                  <td>{dato.Producto}</td>
                  <td>{dato.Descripcion}</td>
                  <td>{dato.Existen}</td>
                  <td>{dato.Valor}</td>     
                  <td>
                    <Button id={dato.id} color="primary" onClick={mostrarModalActualizar}>Editar</Button>{" "}
                    <Button id={dato.id} color="danger" onClick={eliminar}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>

        <Modal isOpen={modalActualizar}>
          <ModalHeader>
            <div><h3>Actualizar Producto {producto.form.IdProd}</h3></div>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>
                IdProd:
              </label>
              <input
                className="form-control"
                name="IdProd"
                type="text"
                onChange={handleChange}
                value={producto.form.IdProd}
              />
            </FormGroup>
            <FormGroup>
              <label>
                Producto:
              </label>
              <input
                className="form-control"
                name="Producto"
                type="text"
                onChange={handleChange}
                value={producto.form.Producto}
              />
            </FormGroup>
            <FormGroup>
              <label>
                Descripcion:
              </label>
              <input
                className="form-control"
                name="Descripcion"
                type="text"
                onChange={handleChange}
                value={producto.form.Descripcion}
              />
            </FormGroup>
            <FormGroup>
              <label>
                Existen:
              </label>
              <input
                className="form-control"
                name="Existen"
                type="text"
                onChange={handleChange}
                value={producto.form.Existen}
              />
            </FormGroup>
            <FormGroup>
              <label>
                Valor:
              </label>
              <input
                className="form-control"
                name="Valor"
                type="text"
                onChange={handleChange}
                value={producto.form.Valor}
              />
            </FormGroup>   
          </ModalBody>

          <ModalFooter>
            <Button
              color="primary"
              onClick={editar}
            >
              Actualizar
            </Button>
            <Button
              className="btn btn-danger"
              onClick={cerrarModalActualizar}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={modalInsertar}>
          <ModalHeader>
            <div><h3>Insertar Producto</h3></div>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>
                IdProd:
              </label>
              <input
                className="form-control"
                name="IdProd"
                type="text"
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <label>
                Producto:
              </label>
              <input
                className="form-control"
                name="Producto"
                type="text"
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <label>
                Descripcion:
              </label>
              <input
                className="form-control"
                name="Descripcion"
                type="text"
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <label>
                Existen:
              </label>
              <input
                className="form-control"
                name="Existen"
                type="text"
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <label>
                Valor:
              </label>
              <input
                className="form-control"
                name="Valor"
                type="text"
                onChange={handleChange}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={insertar}
            >
              Insertar
            </Button>
            <Button
              className="btn btn-danger"
              onClick={cerrarModalInsertar}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
export default Productos;