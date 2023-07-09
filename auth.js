import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import dotenv from 'dotenv';


// Importar la función insertarUsuario del archivo db.js
import { insertarUsuario } from './db';

// App
const app = express();

// Middlewares
dotenv.config();
app.use(express.json());
app.use(cors({ origin: '*' }));

//Database
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

// Routes
db.query('SELECT * FROM usuarios', (error, resultado) => {
  if (error) {
    console.log(error);
  } else {
    console.log(resultado);
  }
});

// REQ: Peticion
// RES: Respuesta
app.get('/usuarios', (req, res) => {
  db.query('SELECT * FROM usuarios', (error, resultado) => {
    if (error) return res.status(500).json(error);

    res.status(200).json(resultado);
  });
});

app.post('/registrar', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    await insertarUsuario({ username, email, password });
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
});

app.post('/iniciar-sesion', (req, res) => {
  const { email, password } = req.body;

  function passwordIsValid(passwordFromClient, passwordFromDB) {
    return passwordFromClient === passwordFromDB;
  }

  const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

  if (!emailRegex.test(email)) return res.status(400).json({ msg: 'No enviaste un email válido' });

  db.query('SELECT * FROM usuarios WHERE email = ?', [email], (error, resultado) => {
    if (error) return res.status(500).json(error);

    const usuario = { ...resultado[0] };

    if (passwordIsValid(password, usuario.password)) {
      res.status(200).json(usuario);
    } else {
      res.status(401).json({ msg: 'Contraseña incorrecta.' });
    }
  });
});

// Initialization
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor levantado en el puerto ${PORT}`);
});
