import proyectos from './modulos/proyectos';
import tareas from './modulos/tareas';
import {actualizarAvance} from './funciones/avance';

// Cargamos la funcion de avance al DOM
document.addEventListener('DOMContentLoaded', () =>{
    actualizarAvance();
});