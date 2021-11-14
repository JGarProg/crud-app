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
      Vendedor: "",
      Id_Cliente: "",
      Cliente: "",
      Producto: "",
      Precio: "",
      Cantidad: "",
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
        let opcion = window.confirm("¿Está seguro que desea eliminar la Factura " + registro.Factura + "?");
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

  const mostrarModalBuscar = () => {
    let arregloVentas = venta.data;
    let dbven = document.getElementById('buscar').value;
    let saleToModify;
    let Factura = dbven;
    user.getIdToken(true).then(token => {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      fetch(`${BASE_URL}${PATH_SALES}/${Factura}`, requestOptions)
        .then(res => res.json())
        .then(
          (result) => {
            arregloVentas.map((registro) => {
              if (dbven === registro.Factura) {
                saleToModify = registro;             
                setVenta({
                  ...venta,
                  form: saleToModify
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
    let arregloVentas = venta.data;
    let dbven = document.getElementById('buscar').value;
    arregloVentas.map((registro) => {
      if (dbven === registro.Factura) {
        let opcion = window.confirm("¿Está seguro que desea eliminar la Factura " + registro.Factura + "?");
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
          <h1>Ventas</h1>
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
                  <Input placeholder="Factura.." name="buscar" id="buscar" type="text" />
                </InputGroup>
              </div>
            </div>
          </div>
          <br />
          <Table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Factura</th>
                <th>Vendedor</th>
                <th>Id_Cliente</th>
                <th>Cliente</th>
                <th>Producto</th>            
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Valor</th>
              </tr>
            </thead>


            <tbody>
              {venta.data.map((dato) => (
                <tr key={dato._id}>
                  <td>{dato.Fecha}</td>
                  <td>{dato.Factura}</td>
                  <td>{dato.Vendedor}</td>
                  <td>{dato.Id_Cliente}</td>
                  <td>{dato.Cliente}</td>
                  <td>{dato.Producto}</td>
                  <td>{dato.Precio}</td>
                  <td>{dato.Cantidad}</td>
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
            <div><h3>Actualizar Venta {venta.form.Factura}</h3></div>
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
                value={venta.form.Factura}
                required
                readOnly
              />
            </FormGroup>

            <FormGroup>
              <label>
              Vendedor:
              </label>
              <input
                className="form-control"
                name="Vendedor"
                type="text"
                onChange={handleChange}
                value={venta.form.Vendedor}
                required
              />
            </FormGroup>

            <FormGroup>
              <label>
              Id_Cliente:
              </label>
              <input
                className="form-control"
                name="Id_Cliente"
                type="text"
                onChange={handleChange}
                value={venta.form.Id_Cliente}
                required
              />
            </FormGroup>

            <FormGroup>
              <label>
              Cliente:
              </label>
              <input
                className="form-control"
                name="Cliente"
                type="text"
                onChange={handleChange}
                value={venta.form.Cliente}
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
                value={venta.form.Producto}
                required
              />
            </FormGroup>

            <FormGroup>
              <label>
              Precio:
              </label>
              <input
                className="form-control"
                name="Precio"
                type="text"
                onChange={handleChange}
                value={venta.form.Precio}
                required
              />
            </FormGroup>

            <FormGroup>
              <label>
              Cantidad:
              </label>
              <input
                className="form-control"
                name="Cantidad"
                type="text"
                onChange={handleChange}
                value={venta.form.Cantidad}
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
                value={venta.form.Valor}
                required
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
              Vendedor:
              </label>
              <input
                className="form-control"
                name="Vendedor"
                type="text"
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <label>
              Id_Cliente:
              </label>
              <input
                className="form-control"
                name="Id_Cliente"
                type="text"
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <label>
              Cliente:
              </label>
              <input
                className="form-control"
                name="Cliente"
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
              Precio:
              </label>
              <input
                className="form-control"
                name="Precio"
                type="text"
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <label>
              Cantidad:
              </label>
              <input
                className="form-control"
                name="Cantidad"
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
