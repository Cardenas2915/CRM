import React, { Fragment, useEffect, useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import clienteAxios from '../../config/axios';
import Producto from './Producto';
import Spinner from '../layouts/Spinner'
import { CRMContext } from '../../context/CRMContext';


export default function Productos() {
    const navigate = useNavigate();

    const [productos, guardarProductos] = useState([]);

    //UTILIZAR EL CONTEXT
    const [auth, guardarAuth] = useContext(CRMContext);

    useEffect(() => {

        if (auth.token !== '') {
            //query a la api
            const consultarApi = async () => {

                try {
                    const productosConsulta = await clienteAxios.get('/productos', {
                        headers: {
                            Authorization: `Bearer ${auth.token}`
                        }
                    })

                    guardarProductos(productosConsulta.data)
                } catch (error) {
                    //ERROR CON AUTORIZACION
                    if(error.response.status = 500){
                        navigate('/iniciar-sesion')
                    }
                }


            }
            //llamado a la api
            consultarApi();

        } else {
            navigate('/iniciar-sesion')
        }

    }, [productos])

    if (!auth.auth) {
        navigate('/iniciar-sesion')
    }

    //Spinner de carga
    if (!productos.length) return <Spinner />

    return (
        <Fragment>
            <h2>Productos</h2>

            <Link to="/productos/nuevo" className="btn btn-verde nvo-cliente"> <i className="fas fa-plus-circle"></i>
                Nuevo Producto
            </Link>

            <ul className="listado-productos">
                {productos.map(producto => (
                    <Producto
                        key={producto._id}
                        producto={producto}
                    />
                ))}
            </ul>

        </Fragment>
    )
}
