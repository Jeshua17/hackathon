
CREATE DATABASE IF NOT EXISTS check_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
  
USE check_db;

-- (Creacion de cuenta)
CREATE TABLE IF NOT EXISTS nuevo_usuario (
    id_nuevo_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    barrio_localidad VARCHAR(100) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actividad_favorita ENUM('FUTBOL', 'BALONCESTO', 'SKATE', 'SENDERISMO','CICLISMO', 'OTROS') DEFAULT 'OTROS'
) ENGINE=InnoDB;

INSERT INTO nuevo_usuario (nombre, apellido, correo, barrio_localidad,actividad_favorita) 
VALUES
 ('Administrador', 'Principal', 'admin@check.com', 'Laborio','OTROS'),
  ('Usuario', 'Principal', 'usuario@check.com', 'Sutiava','OTROS'),
   ('Invitado', 'Principal', 'invitado@check.com', 'Laborio','OTROS');


INSERT INTO usuarios (id_nuevo_usuario, correo, password_hash, rol) 
VALUES
  (1, 'admin@check.com', 'admin123', 'Admin'),
  (2, 'usuario@check.com', 'usuario123', 'Usuario'),
  (3, 'invitado@check.com', 'invitado123', 'Auditor');

-- ( inicio de sesión)
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    id_nuevo_usuario INT NOT NULL UNIQUE,
    correo VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('Admin', 'Usuario', 'Auditor') NOT NULL DEFAULT 'Usuario',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuarios_nuevo_usuario 
        FOREIGN KEY (id_nuevo_usuario) 
        REFERENCES nuevo_usuario (id_nuevo_usuario) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;


-- (Suscripción a actividades)
CREATE TABLE participante_actividades (
    id_inscripcion INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL,
    telefono VARCHAR(20) DEFAULT 'No especificado',
    actividad VARCHAR(100) NOT NULL,
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- (Registro de logins)
CREATE TABLE IF NOT EXISTS historial_sesiones (
    id_sesion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sesiones_usuario 
        FOREIGN KEY (id_usuario) 
        REFERENCES usuarios(id_usuario) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 7. TABLA: MENSAJES_CONTACTO (Formulario de contacto/soporte)
CREATE TABLE IF NOT EXISTS mensajes_contacto (
    id_mensaje INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL,
    asunto VARCHAR(150) DEFAULT 'Sin asunto',
    mensaje TEXT NOT NULL,
    leido BOOLEAN DEFAULT FALSE,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

select * from nuevo_usuario;
select * from usuarios;
select * from mensajes_contacto;
select * from participante_actividades;
