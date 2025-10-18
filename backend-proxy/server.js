// backend-proxy/server.js
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3001; // Puerto para nuestro servidor intermediario

// Habilita CORS para que tu app de Angular pueda conectarse
app.use(cors({
  origin: 'http://localhost:4200'
}));

// Creamos un endpoint que recibirá el DNI desde Angular
app.get('/api/dni/:numero', async (req, res) => {
  const numeroDni = req.params.numero;
  // El token de la API de Decolecta
  const token = 'sk_3128.4Yrpr5YLpAKkJSdZon6Ix4gqlPvgdedX';
  // La URL base de la API de Decolecta
  const apiUrl = 'https://api.decolecta.com/v1/reniec/dni';

  try {
    console.log(`Proxy: Consultando DNI ${numeroDni} en Decolecta...`);

    // Hacemos la llamada a la API externa desde nuestro servidor
    const response = await axios.get(apiUrl, {
      params: {
        numero: numeroDni // El DNI se envía como parámetro de consulta
      },
      headers: {
        'Authorization': `Bearer ${token}` // El token se envía en los encabezados
      }
    });

    // Enviamos la respuesta exitosa de vuelta a Angular
    res.json(response.data);

  } catch (error) {
    console.error('Proxy: Error al consultar la API de Decolecta:', error.response?.data || error.message);
    res.status(500).json({ message: 'Error en la API externa.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor proxy para Decolecta corriendo en http://localhost:${PORT}`);
});
