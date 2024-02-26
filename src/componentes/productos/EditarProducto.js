import React, { useEffect, useState } from 'react'
import Swal from "sweetalert2";
import clienteAxios from '../../config/axios';
import { useNavigate, useParams } from "react-router-dom";
import Spinner from '../layouts/Spinner'

export default function EditarProducto(props) {

  const navigate = useNavigate();

  //Obtener el id de un producto
  const { id } = useParams();

  //definimos el state
  const [producto, guardarProducto] = useState({
    nombre: '',
    precio: '',
    imagen: ''
  })

  //archivo = state, guardarArchivo = setState
  const [archivo, guardarArchivo] = useState("");

  //cuando el componente carga
  useEffect(() => {
    //consultar la api para traer el producto a editar
    const consultarAPI = async () => {
      const productoConsulta = await clienteAxios.get(`/productos/${id}`)
      guardarProducto(productoConsulta.data)

    }
    consultarAPI()
  }, [])

  //editar el producto en la DB
  const editarProducto = async e => {
    e.preventDefault();

    //crear un form-data
    const formData = new FormData();

    formData.append('nombre', producto.nombre);
    formData.append('precio', producto.precio);
    formData.append('imagen', archivo);

    try {
      const res = await clienteAxios.put(`/productos/${id}`, formData, {
        Headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (res.status === 200) {
        Swal.fire({
          title: "Actualizado correctamente!",
          text: 'El producto se actualizo',
          icon: "success"
        });
      }

      //redireccionar
      navigate('/productos', { replace: true })


    } catch (error) {
      console.log(error)
      //lanzar alerta
      Swal.fire({
        type: 'error',
        title: 'Hubo un error',
        text: 'Vuelve a intentarlo'
      })
    }
  }


  // leer los datos del form
  const leeInformacionProducto = (e) => {
    guardarProducto({
      //obtener una copia del state
      ...producto,
      [e.target.name]: e.target.value
    })
  };

  //colocar la imagen en el state
  const leerArchivo = (e) => {
    guardarArchivo(e.target.files[0])
  };

  //extraer los valores del state
  const { nombre, precio, imagen } = producto;
  if (!nombre) return <Spinner />

  return (
    <>
      <h2>Editar Producto</h2>

      <form onSubmit={editarProducto}>
        <legend>Llena todos los campos</legend>

        <div className="campo">
          <label>Nombre:</label>
          <input
            type="text"
            placeholder="Nombre Producto"
            name="nombre"
            defaultValue={nombre}
            onChange={leeInformacionProducto}
          />
        </div>

        <div className="campo">
          <label>Precio:</label>
          <input
            type="number"
            name="precio"
            min="0.00"
            step="0.01"
            placeholder="Precio"
            defaultValue={precio}
            onChange={leeInformacionProducto}
          />
        </div>

        <div className="campo">
          <label>Imagen:</label>
          {imagen ? (
            <img src={`http://localhost:5000/${imagen}`} alt="Imagen" width="300" />
          ) : null}
          <input
            type="file"
            name="imagen"
            onChange={leerArchivo}
          />
        </div>

        <div className="enviar">
          <input
            type="submit"
            className="btn btn-azul"
            value="Editar Producto"
          />
        </div>
      </form>
    </>
  )
}
