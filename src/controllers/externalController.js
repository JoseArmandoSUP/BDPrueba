const pool = require('../config/db');

const poblarProductos = async (req, res) => {
    try{
        // Fetch FakeStoreApi
        const apiFetch = await fetch('http://fakestoreapi.com/products');
        const products = await apiFetch.json();
        let inserciones = 0;
        // Destructuracion el objeto
        for(const product of products){
            const {title, price, description, image} = product;
            const stock = Math.floor(Math.random()*50) + 1;
            const query = `
                INSERT INTO productos
                (nombre, precio, stock, descripcion, imagenUrl) 
                VALUES ($1, $2, $3, $4, $5, $6)
            `
            // await porque estamos haciendo una transaccion a la bd
            await pool.query(query, [title, price, stock, description, image]);
            inserciones++;
        }
        res.status(200).json({
            mensaje: 'Carga masiva exitosa',
            cantidad: inserciones
        });
    }catch (error){
        console.error(`Error: ${error}`);
        res.status(500).json({error: error.message});
    }
};

// Hacer un metodo para poblar categorias 
// hacer un distinc a las categorias para que retornen

module.exports = {poblarProductos};