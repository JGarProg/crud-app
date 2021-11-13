import React from 'react';
import { Alert } from 'reactstrap';

const PaginaNoEncontrada = () => (
  <div className="PaginaNoEncontrada">
  <Alert color="info" className='text-center'>
    No se encontró la página <br />
    <a href='/Login'>Ir a Inicio</a>
  </Alert>
 </div>
);

export default PaginaNoEncontrada;
