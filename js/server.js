const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'check_db'
});

// Middleware de autenticación y autorización por rol
function verificarAutenticacion(rolesPermitidos = []) {
  return (req, res, next) => {
    const rolUsuario = req.headers['x-user-role'];

    if (!rolUsuario || rolUsuario === 'Invitado') {
      return res.status(401).json({ 
        exito: false, 
        mensaje: 'Debes iniciar sesión para realizar esta acción.' 
      });
    }

    if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(rolUsuario)) {
      return res.status(403).json({ 
        exito: false, 
        mensaje: 'No tienes permisos de administrador para realizar esta acción.' 
      });
    }

    next();
  };
}

// LOGIN
app.post('/api/login', async (req, res) => {
  const { correo, password } = req.body;

  try {
    const [rows] = await db.query(
      `SELECT u.id_usuario, u.correo, u.rol, nu.nombre, nu.apellido 
       FROM usuarios u 
       JOIN nuevo_usuario nu ON u.id_nuevo_usuario = nu.id_nuevo_usuario 
       WHERE u.correo = ? AND u.password_hash = ?`,
      [correo, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ exito: false, mensaje: 'Correo o contraseña incorrectos.' });
    }

    const usuario = rows[0];

    try {
      await db.query(
        `INSERT INTO historial_sesiones (id_usuario, ip_origen) VALUES (?, ?)`,
        [usuario.id_usuario, req.ip || '127.0.0.1']
      );
    } catch (e) {
      // Continuar si no existe la tabla historial
    }

    res.json({
      exito: true,
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
  }
});

// REGISTRO DE USUARIOS
app.post('/api/registro', async (req, res) => {
  const { nombre, apellido, correo, ciudad, password, actividades } = req.body;
  const actividadFav = Array.isArray(actividades) && actividades.length > 0 ? actividades.join(', ') : 'OTROS';

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [resNuevo] = await connection.query(
      `INSERT INTO nuevo_usuario (nombre, apellido, correo, barrio_localidad, actividad_favorita) 
       VALUES (?, ?, ?, ?, ?)`,
      [nombre, apellido, correo, ciudad, actividadFav]
    );

    await connection.query(
      `INSERT INTO usuarios (id_nuevo_usuario, correo, password_hash, rol) 
       VALUES (?, ?, ?, 'Usuario')`,
      [resNuevo.insertId, correo, password]
    );

    await connection.commit();
    res.json({ exito: true, mensaje: 'Registro completado con éxito.' });

  } catch (error) {
    await connection.rollback();
    console.error('Error en registro:', error);
    res.status(500).json({ exito: false, mensaje: 'Error al registrar el usuario en la base de datos.' });
  } finally {
    connection.release();
  }
});

// INSCRIBIRSE EN ACTIVIDAD
app.post('/api/participantes/inscribir', async (req, res) => {
  const { nombre, apellido, correo, telefono, actividad } = req.body;

  try {
    // Validar inscripción duplicada
    const [existente] = await db.query(
      `SELECT * FROM participante_actividades WHERE correo = ? AND actividad = ?`,
      [correo, actividad]
    );

    if (existente.length > 0) {
      return res.status(400).json({ exito: false, mensaje: 'Ya estás inscrito en esta actividad.' });
    }

    await db.query(
      `INSERT INTO participante_actividades (nombre, apellido, correo, telefono, actividad) VALUES (?, ?, ?, ?, ?)`,
      [nombre, apellido, correo, telefono || 'No especificado', actividad]
    );

    res.json({ exito: true, mensaje: '¡Inscripción realizada correctamente!' });
  } catch (error) {
    console.error('Error en inscripción:', error);
    res.status(500).json({ exito: false, mensaje: 'No se pudo conectar con la base de datos. Inténtalo nuevamente.' });
  }
});

// OBTENER INSCRIPCIONES (SOLO ADMIN)
app.get('/api/admin/participantes', verificarAutenticacion(['Admin']), async (req, res) => {
  try {
    const [participantes] = await db.query(`SELECT * FROM participante_actividades ORDER BY fecha_inscripcion DESC`);
    res.json({ exito: true, participantes });
  } catch (error) {
    console.error('Error al consultar inscripciones:', error);
    res.status(500).json({ exito: false, mensaje: 'Error al obtener la lista de inscripciones.' });
  }
});

// ELIMINAR INSCRIPCIÓN (SOLO ADMIN)
app.delete('/api/admin/participantes/:id', verificarAutenticacion(['Admin']), async (req, res) => {
  const { id } = req.params;

  try {
    const [resultado] = await db.query(`DELETE FROM participante_actividades WHERE id_inscripcion = ?`, [id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ exito: false, mensaje: 'La inscripción no existe o ya fue eliminada.' });
    }

    res.json({ exito: true, mensaje: 'Inscripción eliminada correctamente de la base de datos.' });
  } catch (error) {
    console.error('Error al eliminar:', error);
    res.status(500).json({ exito: false, mensaje: 'Error en la base de datos al intentar eliminar.' });
  }
});

app.listen(3000, () => console.log('Servidor activo en http://localhost:3000'));