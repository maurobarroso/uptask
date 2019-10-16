import axios from "axios";
import Swal from "sweetalert2";

import {actualizarAvance} from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if (tareas) {
    tareas.addEventListener('click', e => {
        if (e.target.classList.contains('fa-check-circle')) {
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;

            // Enviamos la request a tareas router (tareas:id)
            const url = `${location.origin}/tareas/${idTarea}`;

            axios.patch(url, { idTarea })
                .then(function (respuesta) {
                    if (respuesta.status === 200) {
                        icono.classList.toggle('completo');
                        actualizarAvance();
                    }
                    console.log(respuesta);
                })
        }

        if (e.target.classList.contains('fa-trash')) {

            const tareaHTML = e.target.parentElement.parentElement,
                idTarea = tareaHTML.dataset.tarea;

            Swal.fire({
                title: 'Deseas borrar esta tarea?',
                text: "Un proyecto eliminado no se puede recuperar",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, borrar',
                cancelButtonText: 'No, cancelar'
            }).then((result) => {
                if (result.value) {
                    const url = `${location.origin}/tareas/${idTarea}`;
                    // Enviamos el delete por medio de axios
                    axios.delete(url, { params: { idTarea } })
                        .then(function (respuesta) {
                            if (respuesta.status === 200) {
                                // Eliminamos el nodo del html
                                tareaHTML.parentElement.removeChild(tareaHTML);

                                // Opcional una alerta, eliminamos tarea del DOM
                                Swal.fire(
                                    'Tarea Eliminada',
                                    respuesta.data,
                                    'success'
                                )
                                actualizarAvance();
                            }
                        });

                }
            })
        }

    });
}

export default tareas;
