// src/AppRoutes.jsx
import PaginaBase from "./pages/PaginaBase";
import Inicio from "./pages/Inicio";
import NotFound from "./pages/NotFound";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CrearCuenta from "./pages/CrearCuenta";
import Cartas from "./pages/Cartas";
import Paquetes from "./pages/Paquetes";
import Carrito from "./pages/Carrito";
import Detalle from "./pages/Detalle";
import IniciarSesion from "./pages/IniciarSesion";
import RecuperarContrasena from "./pages/RecuperarContrasena";
import Admin from "./pages/Admin";
import PrivateRoute from "@src/componentes/PrivateRoute"; 
import { AuthProvider } from "@src/context/AuthContext";
import Coleccion from "./pages/Coleccion";
import Baraja from "./pages/Baraja";
import CentroCombate from "./pages/CentroCombate";
import ListaUsuarios from "./pages/ListaUsuarios/ListaUsuarios";
import AdminRoute from "./componentes/AdminRoute";
import CartasAdmin from "./pages/CartasAdmin";
import PaquetesAdmin from "./pages/paquetesAdmin";
import DetalleAdmin from "./pages/DetalleAdmin";
import DetalleColeccion from "./pages/DetalleColeccion";

function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PaginaBase />}>
            <Route index element={<Inicio />}></Route>
            <Route path="cartas" element={<Cartas />}></Route>
            <Route path="paquetes" element={<Paquetes />}></Route>
            <Route path="carrito" element={<Carrito />}></Route>
            <Route path="/detalle/:tipo/:id" element={<Detalle />}></Route>
            <Route path="*" element={<NotFound />}></Route>
            <Route path="mi-coleccion" element={<PrivateRoute><Coleccion /></PrivateRoute>}></Route>
            <Route path="detalle-coleccion/:id_carta" element={<PrivateRoute><DetalleColeccion /></PrivateRoute>}></Route>
            <Route path="mi-baraja" element={<PrivateRoute><Baraja /></PrivateRoute>}></Route>
            <Route path="centro-combate" element={<PrivateRoute><CentroCombate /></PrivateRoute>}></Route>
            <Route path="admin" element={<AdminRoute><Admin /></AdminRoute>}></Route>
          <Route path="editar-usuarios" element={<AdminRoute><ListaUsuarios/></AdminRoute>}></Route>
          <Route path="cartas-admin" element={<AdminRoute><CartasAdmin/></AdminRoute>}></Route>
          <Route path="paquetes-admin" element={<AdminRoute><PaquetesAdmin/></AdminRoute>}></Route>
          <Route path="detalle-admin/:tipo/:id" element={<AdminRoute><DetalleAdmin/></AdminRoute>}></Route>
          </Route>
          <Route path="crear-cuenta" element={<CrearCuenta />}></Route>
          <Route path="iniciar-sesion" element={<IniciarSesion />}></Route>
          <Route path="recuperar-contrasena" element={<RecuperarContrasena />}></Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRoutes;
