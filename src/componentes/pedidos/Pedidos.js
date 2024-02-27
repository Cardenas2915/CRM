import React, { useEffect, useState } from 'react'
import clienteAxios from '../../config/axios'
import DetallesPedido from './DetallesPedido';
import Swal from 'sweetalert2';


export default function Pedidos() {

    const [pedidos, guardarPedidos] = useState([]);

    useEffect(() => {

        const consultarAPI = async () => {

            //obtener los pedido
            const resultado = await clienteAxios.get('/pedidos');
            guardarPedidos(resultado.data)
        }

        consultarAPI();
    }, [pedidos])

    //eliminar pedido
    const eliminarPedido = id => {
        Swal.fire({
            title: "Estas seguro?",
            text: "Un pedido eliminado no se puede recuperar!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, Eliminar!",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                //Eliminar el la restapi
                clienteAxios.delete(`/pedidos/${id}`)
                    .then(res => {
                        if (res.status === 200) {
                            Swal.fire({
                                title: "Eliminado!",
                                text: res.data.mensaje,
                                icon: "success"
                            });
                        }
                    })
            }
        });
    }

    return (
        <>
            <h2>Pedidos</h2>

            <ul className="listado-pedidos">
                {pedidos.map(pedido => (
                    <DetallesPedido
                        key={pedido._id}
                        pedido={pedido}
                        eliminarPedido={eliminarPedido}
                    />
                ))}
            </ul>
        </>
    )
}
