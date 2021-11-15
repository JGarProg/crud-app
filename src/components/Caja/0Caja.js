import React from 'react';
import Tablero from '../Tablero';
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
  { id: 1, IdProd: "78", producto: "pan", valor: "12345667", cantidad: "1", total: "01" },
  { id: 2, IdProd: "78", producto: "azucar", valor: "12345667", cantidad: "2", total: "02" },
  { id: 3, IdProd: "78", producto: "mantequilla", valor: "12345667", cantidad: "3", total: "03" },
  { id: 4, IdProd: "78", producto: "helado", valor: "12345667", cantidad: "4", total: "04" },
  { id: 5, IdProd: "78", producto: "gaseosa", valor: "12345667", cantidad: "5", total: "05" }
];

const Caja = () => {

  const [modalActualizar, setModalActualizar] = React.useState(false);
  const [modalInsertar, setModalInsertar] = React.useState(false);
  const [cajon, setCajon] = React.useState({
    data: data,
    form: {
      id: "",
      IdProd: "",
      producto: "",
      valor: "",
      cantidad: "",
      total: ""      
    }
  });

  const handleChange = (e) => {
    setCajon((prevState) => ({
      ...prevState,
      form: {
        ...prevState.form,
        [e.target.name]: e.target.value,
      }
    }));
  };

  const mostrarModalActualizar = (e) => {
    let arregloCajons = cajon.data;
    let cajaToModify;
    arregloCajons.map((registro) => {
      if (e.target.id == registro.id) {
        cajaToModify = registro;
        }
    });
    setCajon({
      ...cajon,
      form: cajaToModify
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
    let cajonAModificar = { ...cajon.form };
    let arregloCajons = cajon.data;
    arregloCajons.map((registro) => {
      if (cajonAModificar.id === registro.id) {
        arregloCajons[contador]= cajonAModificar;
      }
      contador++;
    });
    setCajon({
      ...cajon,
      data: arregloCajons
    });
    setModalActualizar(false);
  };

  const eliminar = (e) => {
    let contador = 0;
    let arregloCajons = cajon.data;
    arregloCajons.map((registro) => {
      if (e.target.id == registro.id) {
        let opcion = window.confirm("¿Está seguro que desea eliminar " + registro.producto + "?");
        if (opcion) {
          arregloCajons.splice(contador, 1);
        }
      }
      contador++;
    });
    setCajon({
      ...cajon,
      data: arregloCajons
    });
  };

  const insertar = () => {
    let cajonACrear = { ...cajon.form };
    cajonACrear.id = cajon.data.length + 1;
    let arregloCajons = cajon.data;
    arregloCajons.push(cajonACrear);
    setCajon({
      ...cajon,
      data: arregloCajons
    });
    setModalInsertar(false);
  }

  return (
    <>
      <Tablero/>
      <div Class='tit m-3'>
        <h1>Carrito</h1>
      </div>      
      <Container>
        <div>
            <br />
                <Button class="btn btn-success float-left" onClick={mostrarModalInsertar}>Agregar</Button>
            <br />
        </div>
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
            {cajon.data.map((dato) => (
              <tr key={dato.id}>
                <td>{dato.IdProd}</td>
                <td>{dato.producto}</td>
                <td>{dato.valor}</td>
                <td>{dato.cantidad}</td>
                <td>{dato.total}</td>                
                <td>
                  <Button id={dato.id} color="primary" onClick={mostrarModalActualizar}>Editar</Button>{" "}
                  <Button id={dato.id} color="danger" onClick={eliminar}>Eliminar</Button>
                </td>
              </tr>
            ))}
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td>Compra</td>
              <td>35656</td>
            </tr>
           </tbody>
        </Table>
        <tfoot>
            <tr>
              <td><Button color="danger" >Eliminar</Button>{" "}
                  <Button color="success" >Comprar</Button>
              </td>
            </tr>
          </tfoot>
        
      </Container>
      


      <Modal isOpen={modalActualizar}>
        <ModalHeader>
          <div><h3>Actualizar Producto {cajon.form.producto}</h3></div>
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
              value={cajon.form.id}
            />
          </FormGroup>

          <FormGroup>
            <label>
            IdProd:
            </label>
            <input
              className="form-control"
              name="IdProd"
              type="text"
              onChange={handleChange}
              value={cajon.form.IdProd}
            />
          </FormGroup>

          <FormGroup>
            <label>
              producto:
            </label>
            <input
              className="form-control"
              name="producto"
              type="text"
              onChange={handleChange}
              value={cajon.form.producto}
              required
            />
          </FormGroup>

          <FormGroup>
            <label>
              valor:
            </label>
            <input
              className="form-control"
              name="valor"
              type="text"
              onChange={handleChange}
              value={cajon.form.valor}
            />
          </FormGroup>

          <FormGroup>
            <label>
              cantidad:
            </label>
            <input
              className="form-control"
              name="cantidad"
              type="text"
              onChange={handleChange}
              value={cajon.form.cantidad}
            />
          </FormGroup>

          <FormGroup>
            <label>
              total:
            </label>
            <input
              className="form-control"
              name="total"
              type="text"
              onChange={handleChange}
              value={cajon.form.total}
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
              Id:
            </label>

            <input
              className="form-control"
              readOnly
              type="text"
              value={cajon.data.length + 1}
            />
          </FormGroup>

          <FormGroup>
            <label>
              IdProd:
            </label>
            <input
              className="form-control"
              name="IdProd"
              type="text"
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <label>
              producto:
            </label>
            <input
              className="form-control"
              name="producto"
              type="text"
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <label>
              valor:
            </label>
            <input
              className="form-control"
              name="valor"
              type="text"
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <label>
              cantidad:
            </label>
            <input
              className="form-control"
              name="cantidad"
              type="text"
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <label>
              total:
            </label>
            <input
              className="form-control"
              name="total"
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
export default Caja;
