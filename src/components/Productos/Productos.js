import React from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useHistory } from "react-router-dom";
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

import {
  Table,
  Input,
  InputGroup,
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
      //id: "",
      IdProd: "",
      Producto: "",
      Descripcion: "",
      Estado: "",
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
        let opcion = window.confirm("¿Está seguro que desea eliminar el producto " + registro.Producto + "?");
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

  const mostrarModalBuscar = () => {
    let arregloProductos = producto.data;
    let db = document.getElementById('buscar').value;
    let productToModify;
    let IdProd = db;
    user.getIdToken(true).then(token => {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      fetch(`${BASE_URL}${PATH_PRODUCTS}/${IdProd}`, requestOptions)
        .then(res => res.json())
        .then(
          (result) => {
            arregloProductos.map((registro) => {
              if (db === registro.IdProd) {
                productToModify = registro;             
                setProducto({
                  ...producto,
                  form: productToModify
                });
                setModalActualizar(true);
              //}else{
                //console.log(error);
                //let opcion = window.alert("La factura " + dbven + " no se encuentra");
              }
            });
          },          
          (error) => {
            console.log(error);
          }
        );
    });    
  };

  const eliminar1 = () => {
    let arregloProductos = producto.data;
    let db = document.getElementById('buscar').value;
    arregloProductos.map((registro) => {
      if (db === registro.IdProd) {
        let opcion = window.confirm("¿Está seguro que desea eliminar el Producto " + registro.Producto + "?");
        if (opcion) {
          borrar(registro._id);
        }
      }
    });
    setNewVal(newVal + 1);
    setModalActualizar(false);
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
    <>
      <Tablero/>
      <div Class='tit m-3'>
        <h1>Productos</h1>
      </div> 
      <Container>
        <br />
        <div class="container">
          <div class="row">
            <div class="col-sm">
              <Button color="success" onClick={mostrarModalInsertar}>Crear</Button>
            </div>
            <div class="col-sm">
            </div>
            <div class="col-sm">
              <InputGroup>
                <Button onClick={mostrarModalBuscar}>Buscar</Button>
                <Input placeholder="Id_Producto.." name="buscar" id="buscar" type="text" />
              </InputGroup>
            </div>
          </div>
        </div>
        <br />
        <Table>
          <thead>
            <tr>
              <th>IdProd</th>
              <th>Producto</th>              
              <th>Descripcion</th>
              <th>Estado</th>
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
                  <td>{dato.Estado}</td>
                  <td>{dato.Valor}</td>
                <td>
                  <Button id={dato._id} color="primary" onClick={mostrarModalActualizar}>Editar</Button>{" "}
                  <Button id={dato._id} color="danger" onClick={eliminar}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      <Modal isOpen={modalActualizar}>
        <ModalHeader>
          <div><h3>Actualizar Producto {producto.form.Producto}</h3></div>
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
              readOnly
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
              required
            />
          </FormGroup>

          <FormGroup>
            <label>
            Estado:
            </label>
            <input
              className="form-control"
              name="Estado"
              type="text"
              onChange={handleChange}
              value={producto.form.Estado}
              required
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
        <Button color="danger" onClick={eliminar1}>Eliminar</Button>
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
              required
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
            Estado:
            </label>
            <input
              className="form-control"
              name="Estado"
              type="text"
              onChange={handleChange}
              required
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
              required
            />
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={insertar}>Insertar</Button>
          <Button className="btn btn-danger" onClick={cerrarModalInsertar}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    </>
  );
  }
}
export default Productos;
