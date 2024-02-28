import React, { Fragment, useState, useContext, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../../config/axios";

//importar el context
import { CRMContext } from '../../context/CRMContext';

export default function NuevoCliente() {
    const navigate = useNavigate();

    //cliente = state, guardarCliente = funcion para guardar el state
    const [cliente, guardarCliente] = useState({
        nombre: "",
        apellido: "",
        empresa: "",
        email: "",
        telefono: "",
    });

    //UTILIZAR EL CONTEXT
    const [auth, guardarAuth] = useContext(CRMContext);

    //leer datos del formulario
    const actualizarState = e => {
        //Almacenar lo que el usuario escribe en el state

        guardarCliente({
            //obtener copia del cliente
            ...cliente,

            //guardar valores
            [e.target.name]: e.target.value
        })
    }

    //VALIDAR EL FORMULARIO 
    const validarCliente = () => {

        const { nombre, apellido, empresa, email, telefono } = cliente;

        let valido = !nombre.length || !apellido.length || !empresa.length || !email.length || !telefono.length;

        return valido;
    }

    //AÑADE EN LA REST API UN CLIENTE NUEVO
    const agregarCliente = e => {
        e.preventDefault();

        //enviar peticion
        clienteAxios.post('/clientes', cliente,  {
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        })
            .then(res => {

                //validar errores de mongo
                if (res.data.code === 11000) {
                    Swal.fire({
                        title: "Hubo un error!",
                        text: 'Ese cliente ya esta registrado',
                        icon: "error"
                    });
                } else {
                    Swal.fire({
                        title: "Se agrego el cliente!",
                        text: `${res.data.mensaje}`,
                        icon: "success"
                    });

                    navigate('/', {replace:true})
                }
            })
            
    }

    //VERIFICAR SI EL USUARIO ESTA AUTENTICADO
    useEffect(() => {
        // Verificar si el usuario está autenticado
        if (!auth.auth && localStorage.getItem('token') === auth.token) {
            navigate('/iniciar-sesion', { replace: true });
        }
    }, [auth]);

    return (
        <Fragment>
            <h2>NuevoCliente</h2>

            <form onSubmit={agregarCliente}>
                <legend>Llena todos los campos</legend>
                <div className="campo">
                    <label>Nombre:</label>
                    <input onChange={actualizarState} type="text" placeholder="Nombre Cliente" name="nombre" />
                </div>

                <div className="campo">
                    <label>Apellido:</label>
                    <input onChange={actualizarState} type="text" placeholder="Apellido Cliente" name="apellido" />
                </div>

                <div className="campo">
                    <label>Empresa:</label>
                    <input onChange={actualizarState} type="text" placeholder="Empresa Cliente" name="empresa" />
                </div>

                <div className="campo">
                    <label>Email:</label>
                    <input onChange={actualizarState} type="email" placeholder="Email Cliente" name="email" />
                </div>

                <div className="campo">
                    <label>Teléfono:</label>
                    <input onChange={actualizarState} type="tel" placeholder="Teléfono Cliente" name="telefono" />
                </div>

                <div className="enviar">
                    <input
                        type="submit"
                        className="btn btn-azul"
                        value="Agregar Cliente"
                        disabled={validarCliente()}
                    />
                </div>
            </form>
        </Fragment>
    );
}
