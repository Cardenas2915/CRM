import React, { useContext, useState } from 'react'
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import { useNavigate } from 'react-router-dom';

//CONTEXT
import { CRMContext } from '../../context/CRMContext';

export default function Login() {

    const navigate = useNavigate();

    //auth y token
    const [ auth, guardarAuth ] = useContext(CRMContext);
    
    //datos del formulario
    const [ credenciales, guardarCredenciales ] = useState({});

    //almacenar lo que el usuario escribe en el state
    const leerDatos = e => {
        guardarCredenciales({
            ...credenciales,
            [e.target.name] : e.target.value
        })
    }

    //inicia sesion en el servidor
    const iniciarSesion = async e => {
        e.preventDefault()

        try {

            const respuesta = await clienteAxios.post('/iniciar-sesion', credenciales)

            //extraer el token y colocarlo en el storage
            const token = respuesta.data.token;
            localStorage.setItem('token', token);

            //colocarlo en el state
            guardarAuth({
                token,
                auth: true
            })

            //lanzar una alerta
            Swal.fire({
                title: 'Login correcto',
                text: 'Tu sesion a iniciado',
                icon: 'success'
            })

            navigate('/');
            
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: 'Hubo un error',
                text: error.response.data.mensaje,
                icon: 'error'
            })
        }
    }

    return (
        <div className='login'>
            <h2>Iniciar sesion</h2>
            <div className="contenedor-formulario">
                <form onSubmit={iniciarSesion}>
                    <div className="campo">
                        <label htmlFor="Email">Email</label>
                        <input type="text" name="email" id="Email" required onChange={leerDatos} />
                    </div>

                    <div className="campo">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" required onChange={leerDatos} />
                    </div>

                    <input type="submit" value="Iniciar sesion" className='btn btn-verde btn-block' />
                </form>
            </div>
        </div>
    )
}
