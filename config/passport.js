const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


// Referenciamos el modelo a adonde vamos a autenticar
const Usuarios = require('../models/Usuarios');

// Local strategy, será el login con las credenciales propias (usuario y password)

passport.use(
    new LocalStrategy(
        // Por defecto passport espera un usuario y password
        {
            usernameField: 'email',
            passwordField: 'password'
        },

        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where:
                    {
                        email,
                        activo:1
                    }
                })
                // El usuario existe pero el password es incorrecto
                if (!usuario.verificarPassword(password)) {
                    return done(null, false, {
                        message: 'Password incorrecto'
                    })
                }
                // Caso contrario el mail es correcto y el password es correcto
                return done(null, usuario);
            } catch (error) {
                
                // Ese usuario no existe
                return done(null, false, {
                    message: 'Esa cuenta no existe'
                })
            }
        }
    )
);

// Serializar el usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
})

// Deserializar el usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
})

// Exportamos

module.exports = passport;