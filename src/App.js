//import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
//import styles from './App.css';
import {
  BrowserRouter,
  Switch,
  Route
} from "react-router-dom";
import PaginaNoEncontrada from './components/PaginaNoEncontrada/PaginaNoEncontrada';
import Tablero from './components/Tablero';
import User from './components/User/User';
import Caja from './components/Caja/Caja';
import Login from './components/Login/Login';
import Ventas from './components/Ventas/Ventas';
import Productos from './components/Productos/Productos';
import Register from './components/Register/Register';
//import Product from './components/models/Product';
//import Category from './components/models/Category';
import Reset from './components/Reset/Reset';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component= {Login} />
          <Route exact path="/Tablero" component= {Tablero} />
          <Route exact path="/users" component= {User} />
          <Route exact path="/Caja" component= {Caja} />
          <Route exact path="/Login" component= {Login} />
          <Route exact path="/Ventas" component= {Ventas} />
          <Route exact path="/Productos" component= {Productos} />
          <Route exact path="/Register" component={Register} />
          <Route exact path="/Reset" component={Reset} />
          <Route component= {PaginaNoEncontrada} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}
export default App;
