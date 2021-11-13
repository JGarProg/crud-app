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
import Tablero from '../Tablero';

const data = [
  { id: 1, Fecha: "11/05/2021", Factura: "1234", Cliente: "Homero", Identificacion: "12345667", Valor: "12345667" },
  { id: 2, Fecha: "11/05/2021", Factura: "1234", Cliente: "Bart", Identificacion: "12345667", Valor: "12345667" },
  { id: 3, Fecha: "11/05/2021", Factura: "1234", Cliente: "Marge", Identificacion: "12345667", Valor: "12345667" },
  { id: 4, Fecha: "11/05/2021", Factura: "1234", Cliente: "Lisa", Identificacion: "12345667", Valor: "12345667" },
  { id: 5, Fecha: "11/05/2021", Factura: "1234", Cliente: "Maggy", Identificacion: "12345667", Valor: "12345667" }
];

const Ventas = () => {

  const [modalActualizar, setModalActualizar] = React.useState(false);
  const [modalInsertar, setModalInsertar] = React.useState(false);
  const [usuario, setUsuario] = React.useState({
    data: data,
    form: {
      id: "",
      Fecha: "",
      Factura: "",
      Identificacion: "",
      Cliente: "",      
      Valor: ""
    }
  });

  const handleChange = (e) => {
    setUsuario((prevState) => ({
      ...prevState,
      form: {
        ...prevState.form,
        [e.target.name]: e.target.value,
      }
    }));
  };

  const mostrarModalActualizar = (e) => {
    let arregloUsuarios = usuario.data;
    let userToModify;
    arregloUsuarios.map((registro) => {
      if (e.target.id == registro.id) {
        userToModify = registro;
        }
    });
    setUsuario({
      ...usuario,
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
    let contador = 0;
    let usuarioAModificar = { ...usuario.form };
    let arregloUsuarios = usuario.data;
    arregloUsuarios.map((registro) => {
      if (usuarioAModificar.id === registro.id) {
        arregloUsuarios[contador]= usuarioAModificar;
      }
      contador++;
    });
    setUsuario({
      ...usuario,
      data: arregloUsuarios
    });
    setModalActualizar(false);
  };

  const eliminar = (e) => {
    let contador = 0;
    let arregloUsuarios = usuario.data;
    arregloUsuarios.map((registro) => {
      if (e.target.id == registro.id) {
        let opcion = window.confirm("¿Está seguro que desea eliminar la factura " + registro.Factura + "?");
        if (opcion) {
          arregloUsuarios.splice(contador, 1);
        }
      }
      contador++;
    });
    setUsuario({
      ...usuario,
      data: arregloUsuarios
    });
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
                <th>Identificación</th>
                <th>Cliente</th>
                <th>Valor</th>
                <th>Acción</th>
            </tr>
          </thead>

          <tbody>
            {usuario.data.map((dato) => (
              <tr key={dato.id}>
                <td>{dato.Fecha}</td>
                <td>{dato.Factura}</td>
                <td>{dato.Identificacion}</td>
                <td>{dato.Cliente}</td>
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
          <div><h3>Actualizar Factura {usuario.form.Factura}</h3></div>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <label>
              Id:
            </label>
            <input
              className="form-control"
              readOnly
              type="text"
              value={usuario.form.id}
            />
          </FormGroup>

          <FormGroup>
            <label>
              Fecha:
            </label>
            <input
              className="form-control"
              name="Fecha"
              type="text"
              onChange={handleChange}
              value={usuario.form.Fecha}
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
              value={usuario.form.Factura}
              required
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
              value={usuario.form.Identificacion}
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
              value={usuario.form.Cliente}
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
              value={usuario.form.Valor}
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
              Id:
            </label>
            <input
              className="form-control"
              readOnly
              type="text"
              value={usuario.data.length + 1}
            />
          </FormGroup>

          <FormGroup>
            <label>
              Fecha:
            </label>
            <input
              className="form-control"
              name="Fecha"
              type="text"
              onChange={handleChange}
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
              Cliente:
            </label>
            <input
              className="form-control"
              name="Cliente"
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
export default Ventas;