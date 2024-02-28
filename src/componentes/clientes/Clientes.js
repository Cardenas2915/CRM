import React, { useEffect, useState, Fragment, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';

//importar config de axios
import clienteAxios from '../../config/axios';

import Cliente from './Cliente';
import Spinner from '../layouts/Spinner';

//importar el context
import { CRMContext } from '../../context/CRMContext';


export default function Clientes() {

    const navigate = useNavigate();

    //trabajar con el state
    //clientes = state, guardarClientes = funcion para guardar el state
    const [clientes, guardarClientes] = useState([]);

    //UTILIZAR EL CONTEXT
    const [auth, guardarAuth] = useContext(CRMContext);




    //USE EFECT ES SIMILAR A COMPONENT DIDMOUNT 
    useEffect(() => {

        if (auth.token !== '') {

            const consultarAPI = async () => {

                try {
                    const clientesConsulta = await clienteAxios.get("/clientes", {
                        headers: {
                            Authorization: `Bearer ${auth.token}`
                        }
                    });
    
                    //colocar el resultado en el state
                    guardarClientes(clientesConsulta.data);

                } catch (error) {
                    //ERROR CON AUTORIZACION
                    if(error.response.status = 500){
                        navigate('/iniciar-sesion')
                    }
                }
            }
            consultarAPI();

        }else{
            navigate('/iniciar-sesion')
        }

    }, [clientes]);

    if(!auth.auth) {
        navigate('/iniciar-sesion')
    }

    if (!clientes.length) return <Spinner />
    
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


