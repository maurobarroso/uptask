const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

// Importamos variables de entorno
require('dotenv').config({ path: 'variables.env' })

// Helpers con algunas funciones
const helpers = require('./helpers');

// Creamos la conexion a la base BD
const db = require('./config/db');

// Importar el modelo de proyectos
require('./models/Proyectos');

// Importamos el modelo de tareas
require('./models/Tareas');

// Importamos el modelo de usuarios
require('./models/Usuarios');

db.sync()
    .then(() => console.log('Conectado al servidor'))
    .catch(error => console.log(error));

// Creamos la app
const app = express();

// Donde cargar los archivos estaticos
app.use(express.static('public'));

// Habilitamos Pug
app.set('view engine', 'pug');

// Habilitamos body-parser para leer datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));

// Agregamos express validator
 app.use(expressValidator());


// Añadimos la carpeta de views
app.set('views', path.join(__dirname, './views'));

// Agregamos flash messages
app.use(flash());

app.use(cookieParser());

// Sesiones nos permiten navegar entre distintas paginas sin volvernos a autenticar
app.use(session({
    secret:'supersecreto',
    resave: false,
    saveUnitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Pasar vardump a la app
app.use((req, res, next) => {
    console.log(req.user);
    // Creamos variable para accesar a vardumps
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    
    next();
});


// Utilizamos las rutas directamente desde el archivo de rutas
app.use('/', routes());

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port,host,()=>{
    console.log('El servidor esta funcionando Listo');
});