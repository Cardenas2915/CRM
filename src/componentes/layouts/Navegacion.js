import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { CRMContext } from "../../context/CRMContext";

export default function Navegacion() {

    const [auth, guardarAuth] = useContext(CRMContext);

    if(!auth.auth) return null;
    return (
        <aside className="sidebar col-3">
            <h2>Administración</h2>

            <nav className="navegacion">
                <Link to="/" className="clientes">Clientes</Link>
                <Link to="/productos" className="productos">Productos</Link>
                <Link to="/pedidos" className="pedidos">Pedidos</Link>
            </nav>
            
        </aside>
    )
}

