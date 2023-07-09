import express from 'express';
import path from 'path';

const router = express.Router();

// Middleware de verificación de roles
const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.rol === 'admin') {
    next(); // Usuario administrador, continuar con la siguiente operación
  } else {
    res.status(403).json({ message: 'Acceso denegado' });
  }
};

// Ruta para la página de customproducts.html solo para usuarios administradores
router.get('/customproducts', isAdmin, (req, res) => {
  const filePath = path.join(__dirname, '/public/customproducts.html');
  res.sendFile(filePath);
});

// Ruta para la página de lastsales.html solo para usuarios administradores
router.get('/lastsales', isAdmin, (req, res) => {
  const filePath = path.join(__dirname, '/public/lastsales.html');
  res.sendFile(filePath);
});

// Ruta para la página de upload.html solo para usuarios administradores
router.get('/upload', isAdmin, (req, res) => {
  const filePath = path.join(__dirname, '/public/upload.html');
  res.sendFile(filePath);
});

// Ruta para la página de edit.html solo para usuarios administradores
router.get('/edit', isAdmin, (req, res) => {
  const filePath = path.join(__dirname, '/public/edit.html');
  res.sendFile(filePath);
});

export default router;
