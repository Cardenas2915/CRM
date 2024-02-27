import React, { useState, useEffect, Fragment } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import clienteAxios from '../../config/axios';
import Swal from 'sweetalert2';
import FormBuscarPedido from './FormBuscarPedido';
import FormCantidadProducto from './FormCantidadProducto';

export default function NuevoPedido() {

    const { id } = useParams();
    const navigate = useNavigate();

    //state
    const [cliente, guardarCliente] = useState({})
    const [busqueda, guardarBusqueda] = useState('')
    const [productos, guardarProductos] = useState([])
    const [total, guardarTotal] = useState(0);


    useEffect(() => {
        //obtener el cliente
        const consultarAPI = async () => {

            const resultado = await clienteAxios(`/clientes/${id}`);
            guardarCliente(resultado.data)
        }

        consultarAPI();

        //actualizar el total a pagar
        actualizarTotal();

    }, [productos])

    //
    const buscarProducto = async e => {
        e.preventDefault()

        //obtener los productos de la busqueda
        const resultadoBusqueda = await clienteAxios.post(`/productos/busqueda/${busqueda}`)

        //si no hay resultados un alerta, contrario agregar al state
        if (resultadoBusqueda.data[0]) {

            let productoResultado = resultadoBusqueda.data[0];

            //agregar la llave producto(copia de id)
            productoResultado.producto = resultadoBusqueda.data[0]._id;
            productoResultado.cantidad = 0;


            //ponerlo en state
            guardarProductos([...productos, productoResultado])

        } else {
            //no hay resultados
            Swal.fire({
                title: 'No resultados',
                text: 'No hay resultados de esta busqueda',
                icon: 'error'
            })
        }
    }

    //almacenar una busqueda en el state
    const leerDatosBusqueda = e => {
        guardarBusqueda(e.target.value);
    }

    //actualizar la cantidad de productos
    const restarProductos = i => {
        //copiar el arrglo original
        const todosProductos = [...productos];

        //validar su esta en 0 no puede ir mas alla
        if (todosProductos[i].cantidad === 0) return;

        //decremento
        todosProductos[i].cantidad--;

        //almacenar en el state
        guardarProductos(todosProductos);
    }

    const sumarProductos = i => {
        //copiar el arreglo
        const todosProductos = [...productos];

        //incremento
        todosProductos[i].cantidad++;

        //almacenar en el state
        guardarProductos(todosProductos);
    }

    //eliminar un product del state
    const eliminarProducto = id => {
        const todosProductos = productos.filter(producto => producto.producto !== id)
        guardarProductos(todosProductos)
    }

    //actualizar el total a pagar
    const actualizarTotal = () => {
        if(productos.length === 0){
            guardarTotal(0);
            return
        }

        //calcular el nuevo total
        let nuevoTotal = 0;

        //recorrer todos los prouctos y cantidades
        productos.map(producto => nuevoTotal += (producto.cantidad * producto.precio));

        guardarTotal(nuevoTotal)
    }


    //Almacenar el pedido en la base de datos
    const realizarPedido = async e =>{
        e.preventDefault();


        // construir el objeto
        const pedido = {
            "cliente" : id,
            "pedido" : productos,
            "total" : total
        }
        
        // almacenar en la base de datos 
        const resultado = await clienteAxios.post(`/pedidos/nuevo/${id}`, pedido);
        
        //leer resultado
        if(resultado.status === 200){
            //alerta 
            Swal.fire({
                title: 'Pedido recibido',
                text: 'el pedido se agrego correctamente',
                icon: 'success'
            })
        }else{
            //alerta de error
            Swal.fire({
                title: 'Pedido Rechazado',
                text: 'el pedido no se pudo realizar',
                icon: 'error'
            })
        }
        navigate('/pedidos');


    }

    return (
        <Fragment>
            <h2>Nuevo Pedido</h2>

            <div className="ficha-cliente">
                <h3>Datos de Cliente</h3>
                <p>{cliente.nombre} {cliente.apellido}</p>
            </div>

            <FormBuscarPedido
                buscarProducto={buscarProducto}
                leerDatosBusqueda={leerDatosBusqueda}
            />

            <ul className="resumen">
                {productos.map((producto, index) => (
                    <FormCantidadProducto
                        key={producto.producto}
                        producto={producto}
                        restarProductos={restarProductos}
                        sumarProductos={sumarProductos}
                        eliminarProducto={eliminarProducto}
                        index={index}
                    />
                ))}
            </ul>
            <p className='total'>Total a pagar: <span>{total}</span></p>
            {total > 0 ? (
                <form onSubmit={realizarPedido}>
                    <input type="submit"
                        className="btn btn-verde btn-block"
                        value="Realizar pedido" 
                        />
                </form>
            ): null}
        </Fragment>
    )
}
