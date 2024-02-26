import React, { useState, Fragment } from "react";
import Swal from "sweetalert2";
import clienteAxios from '../../config/axios';
import { useNavigate } from "react-router-dom";

export default function NuevoProducto() {
  //se estancia navigate para redireccionar
  const navigate = useNavigate();

  const [producto, guardarProducto] = useState({
    nombre: "",
    precio: "",
  });

  //archivo = state, guardarArchivo = setState
  const [archivo, guardarArchivo] = useState("");

  //almacenar nuevo producto en la base de datos
  const agregarProducto = async e =>{
    e.preventDefault();

    //crear un form-data
    const formData = new FormData();

    formData.append('nombre', producto.nombre);
    formData.append('precio', producto.precio);
    formData.append('imagen', archivo);

    try {
      const res = await clienteAxios.post('/productos', formData,{
        Headers:{
          'Content-Type' : 'multipart/form-data'
        }
      })

      if(res.status === 200){
        Swal.fire({
          title: "Agregado correctamente!",
          text: res.data.mensaje,
          icon: "success"
        });
      }
      
      //redireccionar
      navigate('/productos', {replace:true})


    } catch (error) {
      console.log(error)
      //lanzar alerta
      Swal.fire({
        type:'error',
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
      [e.target.name] : e.target.value
    })
  };

  //colocar la imagen en el state
  const leerArchivo = (e) => { 
    guardarArchivo(e.target.files[0])
  };

  return (
    <Fragment>
      <h2>Nuevo Producto</h2>

      <form onSubmit={agregarProducto} >
        <legend>Llena todos los campos</legend>

        <div className="campo">
          <label>Nombre:</label>
          <input 
            type="text" 
            placeholder="Nombre Producto" 
            name="nombre"
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
            onChange={leeInformacionProducto}
          />
        </div>

        <div className="campo">
          <label>Imagen:</label>
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
            value="Agregar Producto"
          />
        </div>
      </form>
    </Fragment>
  );
}
