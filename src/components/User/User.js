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
const PATH_CUSTOMERS = process.env.REACT_APP_API_CUSTOMERS_PATH;

const User = () => {
  const auth = getAuth();
  const [modalActualizar, setModalActualizar] = React.useState(false);
  const [modalInsertar, setModalInsertar] = React.useState(false);
  const [errors, setErrors] = React.useState(null);
  const [newVal, setNewVal] = React.useState(0);
  const [user, loading, error] = useAuthState(auth);
  const history = useHistory();

  const [usuario, setUsuario] = React.useState({
    data: data,
    form: {
      //id: "",
      Identificacion: "",
      Nombre: "",
      tipo: "",
      email: "",
      Direccion: "",
      Estado: ""         
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
      fetch(`${BASE_URL}${PATH_CUSTOMERS}`, requestOptions)
        .then(res => res.json())
        .then(
          (result) => {
            //setIsLoaded(true);
            setUsuario({
              ...usuario,
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
      if (e.target.id === registro._id) {
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
    let usuarioAModificar = { ...usuario.form };
    actualizar(usuarioAModificar);
    setModalActualizar(false);
  };

  const eliminar = (e) => {
    let arregloUsuarios = usuario.data;
    arregloUsuarios.map((registro) => {
      if (e.target.id === registro._id) {
        let opcion = window.confirm("¿Está seguro que desea eliminar el usuario " + registro.Identificacion + "?");
        if (opcion) {
          borrar(registro._id);
        }
      }
    });
    setNewVal(newVal + 1);
  };

  const insertar = () => {
    let usuarioACrear = { ...usuario.form };
    user.getIdToken(true).then(token => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(usuarioACrear)
    };
    fetch(`${BASE_URL}${PATH_CUSTOMERS}`, requestOptions)
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
    fetch(`${BASE_URL}${PATH_CUSTOMERS}/${id}`, requestOptions)
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

  const actualizar = (customer) => {
    user.getIdToken(true).then(token => {
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(customer)
    };
    fetch(`${BASE_URL}${PATH_CUSTOMERS}/${customer._id}`, requestOptions)
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
    let arregloUsuarios = usuario.data;
    let db = document.getElementById('buscar').value;
    let userToModify;
    let Identificacion = db;
    user.getIdToken(true).then(token => {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      fetch(`${BASE_URL}${PATH_CUSTOMERS}/${Identificacion}`, requestOptions)
        .then(res => res.json())
        .then(
          (result) => {
            arregloUsuarios.map((registro) => {
              if (db === registro.Identificacion) {
                userToModify = registro;             
                setUsuario({
                  ...usuario,
                  form: userToModify
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
    let arregloUsuarios = usuario.data;
    let db = document.getElementById('buscar').value;
    arregloUsuarios.map((registro) => {
      if (db === registro.Identificacion) {
        let opcion = window.confirm("¿Está seguro que desea eliminar el Usuario " + registro.Nombre + "?");
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
        <h1>Usuarios</h1>
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
                <Input placeholder="Identificacion.." name="buscar" id="buscar" type="text" />
              </InputGroup>
            </div>
          </div>
        </div>
        <br />
        <Table>
          <thead>
            <tr>
              <th>Identificación</th>
              <th>Nombre</th>
              <th>Clase</th>
              <th>Email</th>
              <th>Dirección</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>

          <tbody>
            {usuario.data.map((dato) => (
              <tr key={dato._id}>
                <td>{dato.Identificacion}</td>
                <td>{dato.Nombre}</td>
                <td>{dato.tipo}</td>
                <td>{dato.email}</td>
                <td>{dato.Direccion}</td>
                <td>{dato.Estado}</td>
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
          <div><h3>Actualizar Usuario {usuario.form.Nombre}</h3></div>
        </ModalHeader>

        <ModalBody>

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
              Nombre:
            </label>
            <input
              className="form-control"
              name="Nombre"
              type="text"
              onChange={handleChange}
              value={usuario.form.Nombre}
            />
          </FormGroup>

          <FormGroup>
            <label>
              Clase:
            </label>
            <input
              className="form-control"
              name="tipo"
              type="text"
              onChange={handleChange}
              value={usuario.form.tipo}
              required
            />
          </FormGroup>

          <FormGroup>
            <label>
              Email:
            </label>
            <input
              className="form-control"
              name="email"
              type="text"
              onChange={handleChange}
              value={usuario.form.email}
              required
            />
          </FormGroup>

          <FormGroup>
            <label>
              Dirección:
            </label>
            <input
              className="form-control"
              name="Direccion"
              type="text"
              onChange={handleChange}
              value={usuario.form.Direccion}
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
              value={usuario.form.Estado}
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
          <div><h3>Insertar Usuario</h3></div>
        </ModalHeader>

        <ModalBody>
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
              Nombre:
            </label>
            <input
              className="form-control"
              name="Nombre"
              type="text"
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <label>
              Clase:
            </label>
            <input
              className="form-control"
              name="tipo"
              type="text"
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <label>
              Email:
            </label>
            <input
              className="form-control"
              name="email"
              type="text"
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <label>
              Dirección:
            </label>
            <input
              className="form-control"
              name="Direccion"
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
export default User;
