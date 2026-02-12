const express = require('express');
const cors = require('cors');
const productoRoutes = require('./src/routes/productoRoutes'); 
const  route  = require('./src/routes/productoRoute'); // <----- Poblar productos 
require('dotenv').config();

const app = express();

app.use(cors()); 
app.use(express.json()); 
app.use('/api/productoss', productoRoutes);

app.use('/api/productoss', route); // <----- Poblar productos


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => { console.log(`Server runnig on port ${PORT}`); });     