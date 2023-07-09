import express from "express";
import cors from "cors";
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

// Database connection
const db = mysql.createConnection(process.env.DATABASE_URL);

db.connect((error) => {
  if (error) {
    console.error("Error al conectar a la base de datos:", error);
  } else {
    console.log("Conexión exitosa a la base de datos");
  }
});

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

// Registrar un usuario
app.post("/registrar", (req, res) => {
  const { username, email, password } = req.body;

  db.query(
    "INSERT INTO usuarios (username, email, password) VALUES (?, ?, ?)",
    [username, email, password],
    (error, resultado) => {
      if (error) {
        console.error("Error al registrar el usuario:", error);
        return res.status(500).json({ message: "Error al registrar el usuario" });
      }

      res.status(201).json({ message: "Usuario registrado exitosamente" });
    }
  );
});

const PORT = process.env.PORT || 3000;

// Initialization
app.listen(PORT, () => {
  console.log(`Servidor levantado en el puerto ${PORT}`);
});
