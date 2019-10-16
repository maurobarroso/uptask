const express = require('express');
const router = express.Router();

// Importamos express-validator
const { body } = require('express-validator/check');

// Importamos controlador de proyectos
const proyectosController = require('../controllers/proyectosController');
// Importamos controlador de tareas
const tareasController = require('../controllers/tareasController');
// Importamos el controlador de usuarios
const usuariosController = require('../controllers/usuariosController');
// Importamos el controlador para iniciar sesion
const authController = require('../controllers/authController');

module.exports = function () {

    // Ruta al home, aplicamos usuarioautenticado, si esta autenticado avanzamos al siguiente middleware
    router.get('/',
        authController.usuarioAutenticado,
        proyectosController.proyectosHome
    );

    // Ruta para las vistas de nuevoProyecto
    router.get('/nuevo-proyecto',
        authController.usuarioAutenticado,
        proyectosController.formularioProyecto
    );

    // Ruta para enviar los datos del nuevo psroyecto por POST
    router.post('/nuevo-proyecto',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto
    );

    // Listar proyectos
    router.get('/proyectos/:url',
        authController.usuarioAutenticado,
        proyectosController.proyectoPorUrl
    );

    // Actualizar el proyectos
    router.get('/proyecto/editar/:id',
        authController.usuarioAutenticado,
        proyectosController.formularioEditar
    );

    // Enviar datos del proyecto por post
    router.post('/nuevo-proyecto/:id',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.actualizarProyecto
    );
    // Eliminar proyecto
    router.delete('/proyectos/:url',
        authController.usuarioAutenticado,
        proyectosController.eliminarProyecto
    );

    // Agregar tareas
    router.post('/proyectos/:url',
        authController.usuarioAutenticado,
        tareasController.agregarTarea
    );

    // Actualizar tarea
    router.patch('/tareas/:id',
        authController.usuarioAutenticado,
        tareasController.cambiarEstadoTarea
    );

    // Eliminar tarea
    router.delete('/tareas/:id',
        authController.usuarioAutenticado,
        tareasController.eliminarTarea
    );

    // Crear nueva cuenta (Ruta para renderizar la vista y para enviar los datos al server mediante el controlador)
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearCuenta);
    router.get('/confirmar/:correo',usuariosController.confirmarCuenta);

    // Creamos la ruta para iniciar sesion y consultar los datos de sesion a la base de datos

    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);

    // cerrar sesion
    router.get('/cerrar-sesion', authController.cerrarSesion);

    // reestablecer contraseña
    router.get('/reestablecer', usuariosController.formRestablecerPassword);
    router.post('/reestablecer', authController.enviarToken);
    router.get('/reestablecer/:token', authController.validarToken);
    router.post('/reestablecer/:token', authController.actualizarPassword);
     

    return router;
}