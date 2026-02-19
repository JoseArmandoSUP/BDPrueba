const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
    const {email, password} = req.body;
    try{
        const userExist = await pool.query('SELECT * FROM usuarios');
        if(userExist.rows.length > 0){
            return res.satus(400).json({ mensaje: "El uusario no existe" })
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        
        const newUser = await pool.query('INSERT INTO usuarios (email, password) VALUES ($1, $2)', [email, passwordHash]);

        res.status(201).json({
            mag: "Usuario registrado con exito",
            user: newUser.rows[0]
        });
    }catch (error){
        console.error(error);
        res.satus(500).json({ eror: "Error en el servidor" });
    }
};

module.exports = {register}