const pool = require('../config/db');

const getProducto = async (req, res) => { 
    try{
        const {rows} = await pool.query('SELECT * FROM productos');
        res.json(rows);
    }catch (error){
        res.status(500).json({ error: 'Error del servidor' });
    }
};

const createProducto = async (req, res) => {
    const {nombre, precio, stock, descripcion} = req.body;
    try{
        const {rows, rowCount} = await pool.query('INSERT INTO productos (nombre, precio, stock, descripcion) VALUES ($1, $2, $3, $4) RETURNING *', [nombre, precio, stock, descripcion]);
        if(rowCount === 0){
            return res.status(400).json({ error: 'Error al insertar' });
        }
        res.status(201).json(rows[0]);
    }catch (error){
        res.status(500).json({ error: 'Error al guardar' });
    }
};

const actualizarProducto = async (req, res) =>{
    try{
        const id = parseInt(req.params.id);
        const nombre = req.body.nombre;
        const precio = req.body.precio;
        const stock = req.body.stock;
        const descripcion = req.body.descripcion;
        if(req.body.nombre || req.body.descripcion){
            return res.status(400).json({ error: 'Solo se puede modificar el precio y el stock' });
        }
        const {rows, rowCount} = await pool.query('UPDATE productos SET precio = $1, stock = $2 WHERE id = $3 RETURNING *', [precio, stock, id]);
        if(rowCount === 0){
            return res.status(400).json({ error: 'Error al actualizar' });
        }
        res.json({ mensaje: 'Producto modificado: ', id, nombre, precio, stock, descripcion});
    }catch (error){
        console.error(error);
        res.status(500).json({ error: 'Error al modificar' });
    }
};

const borrarProducto = async (req, res) => {
    const id = parseInt(req.params.id);
    try{
        const {rowCount} = await pool.query('DELETE FROM productos WHERE id = $1', [id]);
        if(rowCount === 0){
            return res.status(400).json({ error: 'Producto no encontrado' });
        }
        res.json({ mensaje: 'Producto eliminado: ', id});
    }catch (error){
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar' });
    }
};

module.exports = {getProducto, createProducto, actualizarProducto, borrarProducto};