import React, { useEffect, useState, Fragment } from 'react'
import { Link } from 'react-router-dom';

//importar config de axios
import clienteAxios from '../../config/axios';

import Cliente from './Cliente';


export default function Clientes() {

    //trabajar con el state
    //clientes = state, guardarClientes = funcion para guardar el state
    const [clientes, guardarClientes ] = useState([]);

    const consultarAPI = async () => {
        const clientesConsulta = await clienteAxios.get("/clientes");

        //colocar el resultado en el state
        guardarClientes(clientesConsulta.data);
        
    }

    //USE EFECT ES SIMILAR A COMPONENT DIDMOUNT 
    useEffect(() => {
        consultarAPI();
    }, [clientes]);


    return (
        <Fragment>
            <h2>Clientes</h2>

            <Link to={"/clientes/nuevo"} className="btn btn-verde nvo-cliente"> <i className="fas fa-plus-circle"></i>
                Nuevo Cliente
            </Link>

            <ul className='listado-clientes'>
                {clientes.map(cliente => (
                    <Cliente 
                        key={cliente._id}
                    //se le pasa los props(datos del cliente) al componente
                        cliente={cliente}
                    />
                ))}
            </ul>
        </Fragment>
        
        
    )
}


