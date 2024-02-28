import React, { useContext } from "react";
import { CRMContext } from "../../context/CRMContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();

    const [auth, guardarAuth] = useContext(CRMContext);

    const cerrarSesion = () => {

        // cambiar el context manualmente y eliminar el token 
        guardarAuth({
            token:'',
            auth: false
        })

        localStorage.setItem('token', '');

        //redireccionar
        navigate('/iniciar-sesion');
    }
    
    return (
        <header className="barra">
            <div className="contenedor">
                <div className="contenido-barra">
                    <h1>CRM - Administrador de Clientes</h1>
                    { auth.auth ? (
                        <button onClick={cerrarSesion} type="button" className="btn btn-rojo">
                            Cerrar sesion
                        </button>
                    ) : null }

                </div>
            </div>
        </header>
    );
};

export default Header;
