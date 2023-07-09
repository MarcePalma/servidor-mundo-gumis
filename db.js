const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createConnection(process.env.DATABASE_URL);

db.connect((error) => {
  if (error) {
    console.error('Error al conectar a la base de datos:', error);
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});

function insertarUsuario(usuario) {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO usuarios (username, email, password, rol) VALUES (?, ?, ?, ?)';
    const defaultRol = 'usuario';
    db.query(query, [usuario.username, usuario.email, usuario.password, defaultRol], (error, resultado) => {
      if (error) {
        reject(error);
      } else {
        resolve(resultado);
      }
    });
  });
}


module.exports = {
  insertarUsuario,
};

