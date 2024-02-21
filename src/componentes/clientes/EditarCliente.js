import React, { useState, Fragment, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import clienteAxios from "../../config/axios";

export default function EditarCliente() {
    //definimos naviagte para redireccionar
    const navigate = useNavigate();

    //obtener ID de la url
    const { id } = useParams();

    //cliente = state, guardarCliente = funcion para guardar el state
    const [cliente, datosCliente] = useState({
        nombre: "",
        apellido: "",
        empresa: "",
        email: "",
        telefono: "",
    });

    //  QUERY A LA API
    const consultarApi = async () => {
        const clienteConsulta = await clienteAxios.get(`/clientes/${id}`);
        datosCliente(clienteConsulta.data);
    };

    //useEffect cuando el componente carga
    useEffect(() => {
        consultarApi();
    }, []);

    /*CON ESTA FUNCION LO HACEMOS DE MANERA QUE CADA VEZ QUE CAMBIE EL ID SE EJECUTE LA FUNCION
    useEffect( () => {
        async function consultarAPI(){
        const clienteConsulta = await clienteAxios.get(`/clientes/${id}`);
        // colocar en el state
        datosCliente(clienteConsulta.data);
        }
        
        consultarAPI();
        }, [id]);
    */

    //leer datos del formulario
    const actualizarState = (e) => {
        //Almacenar lo que el usuario escribe en el state

        datosCliente({
            //obtener copia del cliente
            ...cliente,

            //guardar valores
            [e.target.name]: e.target.value,
        });
    };

    //VALIDAR EL FORMULARIO
    const validarCliente = () => {
        const { nombre, apellido, empresa, email, telefono } = cliente;
        let valido =
            !nombre.length ||
            !apellido.length ||
            !empresa.length ||
            !email.length ||
            !telefono.length;
        return valido;
    };


    //envia la peticion de actualizar cliente
    const actualizarCliente = e => {
        e.preventDefault();

        //enviar peticion axios
        clienteAxios.put(`/clientes/${cliente._id}`, cliente)
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
                        title: "Correcto!",
                        text: 'El cliente fue actualizado',
                        icon: "success"
                    });
                    navigate('/', { replace: true })
                }
            })
    }


    return (
        <Fragment>
            <h2>Editar Cliente</h2>

            <form onSubmit={actualizarCliente}>
                <legend>Llena todos los campos</legend>
                <div className="campo">
                    <label>Nombre:</label>
                    <input
                        onChange={actualizarState}
                        type="text"
                        placeholder="Nombre Cliente"
                        name="nombre"
                        value={cliente.nombre}
                    />
                </div>

                <div className="campo">
                    <label>Apellido:</label>
                    <input
                        onChange={actualizarState}
                        type="text"
                        placeholder="Apellido Cliente"
                        name="apellido"
                        value={cliente.apellido}
                    />
                </div>

                <div className="campo">
                    <label>Empresa:</label>
                    <input
                        onChange={actualizarState}
                        type="text"
                        placeholder="Empresa Cliente"
                        name="empresa"
                        value={cliente.empresa}
                    />
                </div>

                <div className="campo">
                    <label>Email:</label>
                    <input
                        onChange={actualizarState}
                        type="email"
                        placeholder="Email Cliente"
                        name="email"
                        value={cliente.email}
                    />
                </div>

                <div className="campo">
                    <label>Teléfono:</label>
                    <input
                        onChange={actualizarState}
                        type="tel"
                        placeholder="Teléfono Cliente"
                        name="telefono"
                        value={cliente.telefono}
                    />
                </div>

                <div className="enviar">
                    <input
                        type="submit"
                        className="btn btn-azul"
                        value="Guardar cambios"
                        disabled={validarCliente()}
                    />
                </div>
            </form>
        </Fragment>
    );
}
