import React from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useHistory } from "react-router-dom";
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

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
const PATH_SALES = process.env.REACT_APP_API_SALES_PATH;

const Ventas = () => {
  const auth = getAuth();
  const [modalActualizar, setModalActualizar] = React.useState(false);
  const [modalInsertar, setModalInsertar] = React.useState(false);
  const [errors, setErrors] = React.useState(null);
  const [newVal, setNewVal] = React.useState(0);
  const [user, loading, error] = useAuthState(auth);
  const history = useHistory();

  const [venta, setVenta] = React.useState({
    data: data,
    form: {
      //id: "",
      Fecha: "",
      Factura: "",
      Identificacion: "",
      Nombre: "",
      Compra: ""        
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
      fetch(`${BASE_URL}${PATH_SALES}`, requestOptions)
        .then(res => res.json())
        .then(
          (result) => {
            //setIsLoaded(true);
            setVenta({
              ...venta,
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
    setVenta((prevState) => ({
      ...prevState,
      form: {
        ...prevState.form,
        [e.target.name]: e.target.value,
      }
    }));
  };

  const mostrarModalActualizar = (e) => {
    let arregloVentas = venta.data;
    let saleToModify;
    arregloVentas.map((registro) => {
      if (e.target.id === registro._id) {
        saleToModify = registro;
      }
    });
    setVenta({
      ...venta,
      form: saleToModify
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
    let ventaAModificar = { ...venta.form };
    actualizar(ventaAModificar);
    setModalActualizar(false);
  };

  const eliminar = (e) => {
    let arregloVentas = venta.data;
    arregloVentas.map((registro) => {
      if (e.target.id === registro._id) {
        let opcion = window.confirm("??Est?? seguro que desea eliminar el venta " + registro.Venta + "?");
        if (opcion) {
          borrar(registro._id);
        }
      }
    });
    setNewVal(newVal + 1);
  };

  const insertar = () => {
    let ventaACrear = { ...venta.form };
    user.getIdToken(true).then(token => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(ventaACrear)
    };
    fetch(`${BASE_URL}${PATH_SALES}`, requestOptions)
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
    fetch(`${BASE_URL}${PATH_SALES}/${id}`, requestOptions)
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

  const actualizar = (sale) => {
    user.getIdToken(true).then(token => {
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(sale)
    };
    fetch(`${BASE_URL}${PATH_SALES}/${sale._id}`, requestOptions)
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
        <h1>Ventas</h1>
      </div> 
      <Container>
        <br />
          <Button color="success" onClick={mostrarModalInsertar}>Crear</Button>
        <br />
        <br />
        <Table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Factura</th>              
              <th>Identificacion</th>
              <th>Nombre</th>
              <th>Compra</th>
            </tr>
          </thead>

          <tbody>
            {venta.data.map((dato) => (
              <tr key={dato._id}>
                <td>{dato.Fecha}</td>
                  <td>{dato.Factura}</td>
                  <td>{dato.Identificacion}</td>
                  <td>{dato.Nombre}</td>
                  <td>{dato.Compra}</td>
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
          <div><h3>Actualizar Venta {venta.form.Venta}</h3></div>
        </ModalHeader>

        <ModalBody>

          <FormGroup>
            <label>
            Fecha:
            </label>
            <input
              className="form-control"
              name="Fecha"
              type="text"
              onChange={handleChange}
              value={venta.form.Fecha}
            />
          </FormGroup>

          <FormGroup>
            <label>
            Factura:
            </label>
            <input
              className="form-control"
              name="Factura"
              type="text"
              onChange={handleChange}
              value={venta.form.Factura}
            />
          </FormGroup>

          <FormGroup>
            <label>
            Identificacion:
            </label>
            <input
              className="form-control"
              name="Identificacion"
              type="text"
              onChange={handleChange}
              value={venta.form.Identificacion}
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
              value={venta.form.Nombre}
              required
            />
          </FormGroup>

          <FormGroup>
            <label>
            Compra:
            </label>
            <input
              className="form-control"
              name="Compra"
              type="text"
              onChange={handleChange}
              value={venta.form.Compra}
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
          <div><h3>Insertar Venta</h3></div>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <label>
            Fecha:
            </label>
            <input
              className="form-control"
              name="Fecha"
              type="text"
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <label>
            Factura:
            </label>
            <input
              className="form-control"
              name="Factura"
              type="text"
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <label>
            Identificacion:
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
            Nombre:
            </label>
            <input
              className="form-control"
              name="Nombre"
              type="text"
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <label>
            Compra:
            </label>
            <input
              className="form-control"
              name="Compra"
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
export default Ventas;
