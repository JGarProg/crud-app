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
const PATH_CUSTOMERS = process.env.REACT_APP_API_CUSTOMERS_PATH;

const Cajas = () => {
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

  const mostrarModalActualizar = () => {
    let arregloProductos = producto.data;
    let dbprod = document.getElementById('buscaprod').value;
    let productToModify;
    arregloProductos.map((registro) => {
      if (dbprod === registro.IdProd) {
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
        <h1>Compras</h1>
        <form class="d-flex" class="col-12 col-m-6 col-lg-2">
        <input class="form-control me-sm-2" type="text" placeholder="Search"/>
        <button class="btn btn-secondary my-2 my-sm-0" type="submit">Buscar</button>
       </form> 
      </div> 
      <Container>
        <br />
        <div class="table-responsive">
          <section id="factura">
              <table class="table table-dark table-bordered mb-0">
                  <thead>
                      <tr>
                          <th scope="col">Factura:</th>
                          <th scope="col">#542589</th>
                          <th scope="col">Fecha:</th>
                          <th scope="col">03/10/2021</th>
                          <th scope="col">CC/NIT:</th>
                          <th scope="col">89.543.678</th>
                          <th scope="col">Cliente</th>
                          <th scope="col">Pepito Perez</th>                          
                      </tr>
                  </thead>
              </table>
          </section>
        </div>
        <Table>
          <thead>
            <tr>
              <th>IdProd</th>
              <th>Producto</th>
              <th>Valor</th>
              <th>Cantidad</th>
              <th>Total</th>              
              <th>Acción</th>
            </tr>
          </thead>

          <tbody>
            {producto.data.map((dato) => (
              <tr key={dato._id}>
                <td>{dato.IdProd}</td>
                  <td>{dato.Producto}</td>
                  <td>{dato.Valor}</td>
                  <td>{dato.Cantidad}</td>
                  <td>{dato.Total}</td>
                <td>
                  <Button id={dato._id} color="danger" onClick={eliminar}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div>
          <InputGroup>
            <Button color="success" onClick={mostrarModalActualizar}>Agregar</Button>
            <Input placeholder="Id Producto.." name="buscaprod" id="buscaprod" type="text" />
          </InputGroup>
        </div>
        <div>
          <br />
            
          <br />
        </div>
      </Container>

      

      <Modal isOpen={modalActualizar}>
        <ModalHeader>
          <div><h3>Agregarar Producto {producto.form.Producto}</h3></div>
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

          <FormGroup>
            <label>
            Cantidad:
            </label>
            <input
              className="form-control"
              name="Cantidad"
              id="Cantidad"
              type="text"
              onChange={handleChange}
            />
          </FormGroup>


          <FormGroup>            
          <script>
              let cant = document.getElementById('Cantidad').value;
              var totitem = producto.form.Valor*cant;
          </script>
            <label>
            Total:
            </label>
            <input
              className="form-control"
              name="Total"
              type="text"
              onChange={handleChange}
              
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

    </>
  );
  }
}
export default Cajas;
