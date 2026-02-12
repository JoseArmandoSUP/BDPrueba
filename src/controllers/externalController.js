const pool = require('../config/db');

const poblarProductos = async (req, res) => {
    try{
        // Fetch FakeStoreApi
        const apiFetch = await fetch ('http://fakestoreapi.com/products');
        const products = await apiFetch.json();

        const categorias = [...new Set(products.map(p => p.category))];
        for (const categori of categorias) {
            await pool.query(
                'INSERT INTO categoria (nombre) VALUES ($1) ON CONFLICT (nombre) DO NOTHING',
                [categori]
            );
        }

        let inserciones = 0;
        // Destructuracion el objeto
        for(const product of products){
            const {title, price, description, image, category} = product;
            const stock = Math.floor(Math.random()*50) + 1;
            
            const {rows} = await pool.query('SELECT id FROM categoria WHERE nombre = $1', [category]);
            const categoria_id = rows[0].id;
            
            const query = `
                INSERT INTO productos
                (nombre, precio, stock, descripcion, imagenUrl, categoria_id) 
                VALUES ($1, $2, $3, $4, $5, $6)
            `
            // await porque estamos haciendo una transaccion a la bd
            await pool.query(query, [title, price, stock, description, image, categoria_id]);
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

const buscarCoincidenciasEnElNombre = async (req, res) => {
    try{
        const coincidencia = req.params.coincidencia;
        const {rows, rowsCount} = await pool.query('SELECT FROM productos WHERE nombre ILIKE $1', [`%${coincidencia}%`]);
        if(rowsCount === 0){
            return res.status(500).json({ mensaje: 'Error al buscar' });
        }
        res.json(rows);
    }catch (error){
        console.error(`Error: ${error}`);
        res.status(500).json({error: error.message});
    }
};

const buscarProductosDeCategoria = async (req, res) => {
    try{
        const cat = req.params.cat;
        const {rows, rowCount} = await pool.query('SELECT p.* FROM productos p JOIN categoria c ON p.categoria_id = c.id WHERE c.nombre ILKE $1', [`%${cat}%`]);
        if(rowCount == 0){
            return res.status(404).json({ mensaje: 'Error al buscar productos' });
        }
        res.json(rows)
    }catch (error){
        console.error(`Error: ${error}`);
        res.status(500).json({error: error.message});
    }
}; 

module.exports = {poblarProductos, buscarCoincidenciasEnElNombre, buscarProductosDeCategoria};