const Sequelize = require('sequelize');
const db = require('../config/db');

// Requerimos el modelo de Proyectos para relacionarlos con las tareas
const Proyectos = require('./Proyectos');

const Tareas = db.define('tarea', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    tarea: Sequelize.STRING(100),
    estado: Sequelize.INTEGER(1)
});

// Creamos llave foranea
Tareas.belongsTo(Proyectos);

module.exports = Tareas;