const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const {email, password} = req.body;
    try{
        const userExist = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if(userExist.rows.length > 0){
            return res.status(400).json({ mensaje: "El uusario no existe" })
        }
        //Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        //Insertar usuario
        const newUser = await pool.query('INSERT INTO usuarios (email, password) VALUES ($1, $2) RETURNING id, email', [email, passwordHash]);

        res.status(201).json({
            msg: "Usuario registrado con exito",
            user: newUser.rows[0]
        });
    }catch (error){
        console.error(error);
        res.status(500).json({ eror: "Error en el servidor" });
    }
};

const login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try{
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if(result.rows.length === 0){
            return res.status(400).json({ mensaje: "Credenciales Invalidas" });
        }

        const usuario = result.rows[0];
        //Comparar contraseña
        const isMatch = await bcrypt.compare(password, usuario.password);
        
        if(!isMatch){
            return res.status(400).json({ mensaje: "Credenciales Invalidas (Password)" }); 
        }

        const playload = {
            id: usuario.id,
            rol: usuario.rol,
            email: usuario.email
        };

        const token = jwt.sign(
            playload, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.json({
            msg: "Bienvenido",
            token: token
        });
    }catch (error){
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

module.exports = {register, login}