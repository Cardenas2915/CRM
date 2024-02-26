import React from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';


export default function Producto({ producto }) {

  const { _id, nombre, precio, imagen } = producto;

  //eliminar un producto
  const eliminarProducto = id => {

    Swal.fire({
      title: "Estas seguro?",
      text: "Un producto eliminado no se puede recuperar!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        //Eliminar el la restapi
        clienteAxios.delete(`/productos/${id}`)
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
    <li className="producto">
      <div className="info-producto">
        <p className="nombre">{nombre}</p>
        <p className="precio">$ {precio} </p>
        {imagen ? (
          <img src={`http://localhost:5000/${imagen}`} alt='Imagen' />
        ) : null}
      </div>
      <div className="acciones">
        <Link to={`/productos/editar/${_id}`} className="btn btn-azul">
          <i className="fas fa-pen-alt"></i>
          Editar Producto
        </Link>

        <button onClick={() => eliminarProducto(_id)} type="button" className="btn btn-rojo btn-eliminar">
          <i className="fas fa-times"></i>
          Eliminar Cliente
        </button>
      </div>
    </li>
  )
}
