create database diagramagantt;
use diagramagantt;

DROP TABLE IF EXISTS `login`;

CREATE TABLE `login` (
  `idLOGIN` int NOT NULL AUTO_INCREMENT,
  `USERNAME` varchar(45) NOT NULL,
  `PASSWORD` varchar(45) NOT NULL,
  `TIPOUSUARIO` varchar(45) NOT NULL,
  PRIMARY KEY (`idLOGIN`),
  UNIQUE KEY `USERNAME` (`USERNAME`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `login` WRITE;
INSERT INTO `login` VALUES (1,'admin','1234','administrador');
UNLOCK TABLES;


CREATE TABLE ejercicios (
  idEJERCICIO int NOT NULL AUTO_INCREMENT,
  nombre varchar(100) NOT NULL,
  idLOGIN int NOT NULL,
  PRIMARY KEY (idEJERCICIO),
  FOREIGN KEY (idLOGIN) REFERENCES login (idLOGIN) ON DELETE CASCADE
);

CREATE TABLE tareas (
  idTAREA int NOT NULL AUTO_INCREMENT,
  nombre varchar(100) NOT NULL,
  fecha_inicio date NOT NULL,
  fecha_terminacion date NOT NULL,
  idEJERCICIO int NOT NULL,
  idDependencia int NULL,
  PRIMARY KEY (idTAREA),
  FOREIGN KEY (idEJERCICIO) REFERENCES ejercicios (idEJERCICIO) ON DELETE CASCADE,
  FOREIGN KEY (idDependencia) REFERENCES tareas (idTAREA) ON DELETE SET NULL
);

INSERT INTO ejercicios (nombre, idLOGIN) values ('Graficadora Diagramas de Gantt', 1);

INSERT INTO tareas (nombre, fecha_inicio, fecha_terminacion, `idEJERCICIO`) values ('Obtencion de requerimientos', '2026-05-18', '2026-05-25', 1);
INSERT INTO tareas (nombre, fecha_inicio, fecha_terminacion, idEJERCICIO, idDependencia) values ('Documentacion', '2026-05-26', '2026-05-29', 1, 1);
INSERT INTO tareas (nombre, fecha_inicio, fecha_terminacion, idEJERCICIO, idDependencia) values ('Codificacion', '2026-06-01', '2026-06-19', 1, 2);
INSERT INTO tareas (nombre, fecha_inicio, fecha_terminacion, idEJERCICIO) values ('Codificacion', '2026-06-20', '2026-06-21', 1);

INSERT INTO ejercicios (nombre, idLOGIN) values ('Proyecto de Ejemplo 1', 1);

INSERT INTO tareas (nombre, fecha_inicio, fecha_terminacion, idEJERCICIO) values ('Tarea A', '2026-05-18', '2026-05-25', 1);
INSERT INTO tareas (nombre, fecha_inicio, fecha_terminacion, idEJERCICIO, idDependencia) values ('Tarea B', '2026-05-26', '2026-05-29', 1, 5);
INSERT INTO tareas (nombre, fecha_inicio, fecha_terminacion, idEJERCICIO, idDependencia) values ('Tarea C', '2026-06-01', '2026-06-19', 1, 6);
INSERT INTO tareas (nombre, fecha_inicio, fecha_terminacion, idEJERCICIO, idDependencia) values ('Tarea D', '2026-06-20', '2026-06-21', 1, 7);


INSERT INTO ejercicios (nombre, idLOGIN) values ('Proyecto de Ejemplo 2', 1);

INSERT INTO tareas (nombre, fecha_inicio, fecha_terminacion, idEJERCICIO) values ('Tarea A', '2026-05-18', '2026-05-25', 1);
INSERT INTO tareas (nombre, fecha_inicio, fecha_terminacion, idEJERCICIO) values ('Tarea B', '2026-05-26', '2026-05-29', 1);
INSERT INTO tareas (nombre, fecha_inicio, fecha_terminacion, idEJERCICIO) values ('Tarea C', '2026-06-01', '2026-06-19', 1);
INSERT INTO tareas (nombre, fecha_inicio, fecha_terminacion, idEJERCICIO) values ('Tarea D', '2026-06-20', '2026-06-21', 1);
