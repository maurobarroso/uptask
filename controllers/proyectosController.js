const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.proyectosHome = async (req, res) => {

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where:{usuarioId}});

    res.render('index', {
        nombrePagina: 'Proyectos',
        proyectos
    });
}

exports.formularioProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where:{usuarioId}});

    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    });
}

exports.nuevoProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where:{usuarioId}});

    // Validamos datos que ingresan
    const { nombre } = req.body;
    let errores = [];

    if (!nombre) {
        errores.push({ 'texto': 'Agregá un nombre al proyecto' });
    }
    // Si hay errores
    if (errores.length > 0) {
        console.log(errores);
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        // Si no hay errores insertamos los valores en la base de datos
        const usuarioId = res.locals.usuario.id;
        // Relacionamos el usuario con el usuario en sesion
        await Proyectos.create({ nombre, usuarioId});
        res.redirect('/');
    }
}

// Exportamos
exports.proyectoPorUrl = async (req, res, next) => {

    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where:{usuarioId}});

    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    // Consultamos tareas del proyecto actual

    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        }
        // include: [
        //     { model: Proyectos }
        // ]
    })

    if (!proyecto) return next();

    // Render a la vista
    res.render('tareas', {
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas
    })

}

exports.formularioEditar = async (req, res, next) => {

    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where:{usuarioId}});

    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    res.render('nuevoProyecto', {
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto
    })

}

exports.actualizarProyecto = async (req, res) => {
    const proyectos = await Proyectos.findAll();

    // Validamos datos que ingresan
    const { nombre } = req.body;
    let errores = [];

    if (!nombre) {
        errores.push({ 'texto': 'Agregá un nombre al proyecto' });
    }
    // Si hay errores
    if (errores.length > 0) {
        console.log(errores);
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        // Si no hay errores insertamos los valores en la base de datos
        await Proyectos.update(
            { nombre: nombre },
            { where: { id: req.params.id } }
        );
        res.redirect('/');
    }
}

exports.eliminarProyecto = async (req, res, next) => {
    const proyectos = await Proyectos.findAll();

    const { urlProyecto } = req.query;
    const resultado = await Proyectos.destroy({ where: { url: urlProyecto } });

    // Si no hay resultado por X motivo, salteamos al siguiente middleware
    if (!resultado) {
        return next();
    }

    res.status(200).send('Proyecto Eliminado Correctamente');
}