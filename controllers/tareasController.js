const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.agregarTarea = async (req, res, next) => {
    // Obtenemos el proyecto actual
    const proyecto = await Proyectos.findOne({
        where: {
            url: req.params.url
        }
    });

    // Leemos el valor del input
    const { tarea } = req.body
    // Estado 0 incompleto
    const estado = 0;
    // Id del proyecto
    const proyectoId = proyecto.id;
    // Insertamos en la base de datos
    const resultado = await Tareas.create({ tarea, estado, proyectoId });
    // Si no hay resultado continuamos
    if (!resultado) {
        return next();
    }
    // Redireccionamos
    res.redirect(`/proyectos/${req.params.url}`);
}

exports.cambiarEstadoTarea = async (req, res, next) => {
    const { id } = req.params;
    const tarea = await Tareas.findOne({ where: { id } });

    // Cambiamos estado

    let estado = 0;
    // Si el estado que viene es 0 significa que hay que cambiarlo
    if (tarea.estado === estado) {
        estado = 1;
    }

    tarea.estado = estado;

    const resultado = await tarea.save();

    if (!resultado) {
        return next();
    }

    res.status(200).send('actualizado');

    console.log(tarea);
}

exports.eliminarTarea = async (req, res, next) => {
    const { id } = req.params;

    // Eliminamos la tarea por id
    const resultado = await Tareas.destroy({ where: { id } });

    if (!resultado) {
        next();
    }

    res.status(200).send('Tarea Eliminada Correctamente');
}