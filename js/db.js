const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',       
  user: 'root',           
  password: '1234', 
  database: 'check_db',    
  waitForConnections: true,
  connectionLimit: 10,     
  queueLimit: 0
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error de conexión:', err.message);
  } else {
    console.log(' Conectado exitosamente a MySQL Workbench (check_db)');
    connection.release(); 
  }
});

module.exports = pool.promise();