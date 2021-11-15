import React from 'react';
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

const data = [
];

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const PATH_VENTAS = process.env.REACT_APP_API_VENTAS_PATH;

const Ventas = () => {


  const [modalActualizar, setModalActualizar] = React.useState(false);
  const [modalInsertar, setModalInsertar] = React.useState(false);
  const [errors, setErrors] = React.useState(null);
  const [newVal, setNewVal] = React.useState(0);


  const [venta, setVenta] = React.useState({
    data: data,
    form: {
      idVenta: "",
      fechaVenta: "",
      idProducto: "",
      cantidadProducto: "",
      precioUnitario: "",
      valorTotal: "",
      documentoCliente: "",
      nombreCliente: "",
      idVendedor: ""

    }
  });


  //React.useEffect(() => {
  //if (loading) return;
  //if (!user) return history.replace("/");
  //}, [user, loading]);
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++













  React.useEffect(() => {


    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',

      },
    };

    fetch(`${BASE_URL}${PATH_VENTAS}`, requestOptions)
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
        let opcion = window.confirm("¿Está seguro que desea eliminar la venta " + registro.idVenta + "?");
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
    fetch(`${BASE_URL}${PATH_VENTAS}`, requestOptions)
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
    fetch(`${BASE_URL}${PATH_VENTAS}/${id}`, requestOptions)
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
    fetch(`${BASE_URL}${PATH_VENTAS}/${venta._id}`, requestOptions)
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

      <Container>

        <br />
        <Button color="success" onClick={mostrarModalInsertar}>Crear venta</Button>
        <br />
        <br />

        <div>

          <Table>

            <thead>
              <tr>
                <th>Id Venta</th>
                <th>Fecha Venta</th>
                <th>Id Producto</th>
                <th>Cantidad Producto</th>
                <th>Precio Unitario</th>
                <th>Valor Total</th>
                <th>Documento Cliente</th>
                <th>Nombre Cliente</th>
                <th>Id Vendedor</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>

              {venta.data.map((dato) => (
                <tr key={dato._id}>
                  <td>{dato.idVenta}</td>
                  <td>{dato.fechaVenta}</td>
                  <td>{dato.idProducto}</td>
                  <td>{dato.cantidadProducto}</td>
                  <td>{dato.precioUnitario}</td>
                  <td>{dato.valorTotal}</td>
                  <td>{dato.documentoCliente}</td>
                  <td>{dato.nombreCliente}</td>
                  <td>{dato.idVendedor}</td>
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
          <div><h3>Actualizar Venta</h3> {venta.form.idVenta}</div>
        </ModalHeader>

        <ModalBody>

          <FormGroup>
            <label>Id Venta:</label>
            <input
              className="form-control"
              name="idVenta"
              type="text"
              onChange={handleChange}
              value={venta.form.idVenta}
            />
          </FormGroup>

          <FormGroup>
            <label>Fecha Venta:</label>
            <input
              className="form-control"
              name="fechaVenta"
              type="text"
              onChange={handleChange}
              value={venta.form.fechaVenta}
            />
          </FormGroup>






          <FormGroup>
            <label>Id Producto:</label>
            <input
              className="form-control"
              name="idProducto"
              type="text"
              onChange={handleChange}
              value={venta.form.idProducto}
            />
          </FormGroup>


          <FormGroup>
            <label>Cantidad Producto:</label>
            <input
              className="form-control"
              name="cantidadProducto"
              type="number"
              onChange={handleChange}
              value={venta.form.cantidadProducto}
            />
          </FormGroup>

          <FormGroup>
            <label>Precio Unitario:</label>
            <input
              className="form-control"
              name="precioUnitario"
              type="number"
              onChange={handleChange}
              value={venta.form.precioUnitario}
            />
          </FormGroup>

          <FormGroup>
            <label>Valor Total:</label>
            <input
              className="form-control"
              name="valorTotal"
              type="number"
              onChange={handleChange}
              value={venta.form.valorTotal}
            />
          </FormGroup>

          <FormGroup>
            <label>Documento Cliente:</label>
            <input
              className="form-control"
              name="documentoCliente"
              type="text"
              onChange={handleChange}
              value={venta.form.documentoCliente}
            />
          </FormGroup>

          <FormGroup>
            <label>Nombre Cliente:</label>
            <input
              className="form-control"
              name="nombreCliente"
              type="text"
              onChange={handleChange}
              value={venta.form.nombreCliente}
            />
          </FormGroup>

          <FormGroup>
            <label>Id Vendedor:</label>
            <input
              className="form-control"
              name="idVendedor"
              type="text"
              onChange={handleChange}
              value={venta.form.idVendedor}
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
            <label>Id Venta:</label>
            <input
              className="form-control"
              name="idVenta"
              type="text"
              onChange={handleChange}
              required
            />
          </FormGroup>


          <FormGroup>
            <label> Fecha Venta:</label>
            <input
              className="form-control"
              name="fechaVenta"
              type="text"
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <label>idProducto:</label>
            <input
              className="form-control"
              name="idProducto"
              type="text"
              onChange={handleChange}
            />
          </FormGroup>




          <FormGroup>
            <label>Cantidad Producto:</label>
            <input
              className="form-control"
              name="cantidadProducto"
              type="text"
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <label>Precio Unitario:</label>
            <input
              className="form-control"
              name="precioUnitario"
              type="text"
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <label>Valor Total:</label>
            <input
              className="form-control"
              name="valorTotal"
              type="text"
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <label>Documento Cliente:</label>
            <input
              className="form-control"
              name="documentoCliente"
              type="text"
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <label>Nombre Cliente:</label>
            <input
              className="form-control"
              name="nombreCliente"
              type="text"
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <label>Id Vendedor:</label>
            <input
              className="form-control"
              name="idVendedor"
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



