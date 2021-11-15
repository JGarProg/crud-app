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
} from "reactstrap";
import Tablero from '../Tablero';

const data = [
];

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
      Factura: "",
      Fecha: "",
      Producto: "",
      Cantidad: "",
      Precio: "",
      Valor: "",
      Id_Cliente: "",
      Cliente: "",
      Vendedor: ""

    }
  });


  //React.useEffect(() => {
  //if (loading) return;
  //if (!user) return history.replace("/");
  //}, [user, loading]);
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++








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
          //setErrors(error);
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
    let userToModify;
    arregloVentas.map((registro) => {
      if (e.target.id === registro._id) {
        userToModify = registro;
      }
    });
    setVenta({
      ...venta,
      form: userToModify
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
    actualizarVenta(ventaAModificar);
    setModalActualizar(false);
    setNewVal(newVal + 1);
  };

  const eliminar = (e) => {
    let arregloVentas = venta.data;
    arregloVentas.map((registro) => {
      if (e.target.id === registro._id) {
        let opcion = window.confirm("¿Está seguro que desea eliminar la venta " + registro.Factura + "?");
        if (opcion) {
          borrarVenta(registro._id);
        }
      }
    });
    setNewVal(newVal + 1);
  };

  const insertar = () => {
    let ventaACrear = { ...venta.form };

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',

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
    setModalInsertar(false);
  }

  const borrarVenta = (id) => {

    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
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
  }

  const actualizarVenta = (venta) => {

    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',

      },
      body: JSON.stringify(venta)
    };
    fetch(`${BASE_URL}${PATH_SALES}/${venta._id}`, requestOptions)
      .then(result => result.json())
      .then(
        (result) => {
          setNewVal(newVal + 1);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  return (

    <>
      <Tablero/>
      <Container>

        <br />
        <Button color="success" onClick={mostrarModalInsertar}>Crear venta</Button>
        <br />
        <br />

        <div>

          <Table>

            <thead>
              <tr>
                <th>Venta</th>
                <th>Fecha</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Valor</th>
                <th>Id_Cliente</th>
                <th>Cliente</th>
                <th>Vendedor</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>

              {venta.data.map((dato) => (
                <tr key={dato._id}>
                  <td>{dato.Factura}</td>
                  <td>{dato.Fecha}</td>
                  <td>{dato.Producto}</td>
                  <td>{dato.Cantidad}</td>
                  <td>{dato.Precio}</td>
                  <td>{dato.Valor}</td>
                  <td>{dato.Id_Cliente}</td>
                  <td>{dato.Cliente}</td>
                  <td>{dato.Vendedor}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      id={dato._id}
                      onClick={mostrarModalActualizar}>
                      Editar
                    </button>
                    {"  "}
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      id={dato._id}
                      onClick={eliminar}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

            </tbody>

          </Table>
        </div>

      </Container>



      <Modal isOpen={modalActualizar}>
        <ModalHeader>
          <div><h3>Actualizar Venta</h3> {venta.form.Factura}</div>
        </ModalHeader>

        <ModalBody>

          <FormGroup>
            <label>Factura:</label>
            <input
              className="form-control"
              name="Factura"
              type="text"
              onChange={handleChange}
              value={venta.form.Factura}
            />
          </FormGroup>

          <FormGroup>
            <label>Fecha Venta:</label>
            <input
              className="form-control"
              name="Fecha"
              type="text"
              onChange={handleChange}
              value={venta.form.Fecha}
            />
          </FormGroup>






          <FormGroup>
            <label>Producto:</label>
            <input
              className="form-control"
              name="Producto"
              type="text"
              onChange={handleChange}
              value={venta.form.Producto}
            />
          </FormGroup>


          <FormGroup>
            <label>Cantidad Producto:</label>
            <input
              className="form-control"
              name="Cantidad"
              type="number"
              onChange={handleChange}
              value={venta.form.Cantidad}
            />
          </FormGroup>

          <FormGroup>
            <label>Precio:</label>
            <input
              className="form-control"
              name="Precio"
              type="number"
              onChange={handleChange}
              value={venta.form.Precio}
            />
          </FormGroup>

          <FormGroup>
            <label>Valor:</label>
            <input
              className="form-control"
              name="Valor"
              type="number"
              onChange={handleChange}
              value={venta.form.Valor}
            />
          </FormGroup>

          <FormGroup>
            <label>Id_Cliente:</label>
            <input
              className="form-control"
              name="Id_Cliente"
              type="text"
              onChange={handleChange}
              value={venta.form.Id_Cliente}
            />
          </FormGroup>

          <FormGroup>
            <label>Cliente:</label>
            <input
              className="form-control"
              name="Cliente"
              type="text"
              onChange={handleChange}
              value={venta.form.Cliente}
            />
          </FormGroup>

          <FormGroup>
            <label>Vendedor:</label>
            <input
              className="form-control"
              name="Vendedor"
              type="text"
              onChange={handleChange}
              value={venta.form.Vendedor}
            />
          </FormGroup>

        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={editar}>Actualizar</Button>
          <Button color="info" onClick={cerrarModalActualizar}>Cancelar</Button>
        </ModalFooter>
      </Modal>



      <Modal isOpen={modalInsertar}>
        <ModalHeader>
          <div><h3>Insertar Venta</h3></div>
        </ModalHeader>

        <ModalBody>

          <FormGroup>
            <label>Factura:</label>
            <input
              className="form-control"
              name="Factura"
              type="text"
              onChange={handleChange}
              required
            />
          </FormGroup>


          <FormGroup>
            <label> Fecha:</label>
            <input
              className="form-control"
              name="Fecha"
              type="text"
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <label>Producto:</label>
            <input
              className="form-control"
              name="Producto"
              type="text"
              onChange={handleChange}
            />
          </FormGroup>




          <FormGroup>
            <label>Cantidad:</label>
            <input
              className="form-control"
              name="Cantidad"
              type="text"
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <label>Precio:</label>
            <input
              className="form-control"
              name="Precio"
              type="text"
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <label>Valor:</label>
            <input
              className="form-control"
              name="Valor"
              type="text"
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <label>Id_Cliente:</label>
            <input
              className="form-control"
              name="Id_Cliente"
              type="text"
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <label>Cliente:</label>
            <input
              className="form-control"
              name="Cliente"
              type="text"
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <label>Vendedor:</label>
            <input
              className="form-control"
              name="Vendedor"
              type="text"
              onChange={handleChange}
            />
          </FormGroup>

        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={insertar}>Insertar</Button>
          <Button color="info" onClick={cerrarModalInsertar}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    </>
  );

}
export default Ventas;



