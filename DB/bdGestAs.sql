/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.5.2-MariaDB, for Win64 (AMD64)
--
-- Host: gestion-asesorias.cna4yyo0k2no.us-east-2.rds.amazonaws.com    Database: gestion_asesorias
-- ------------------------------------------------------
-- Server version	11.4.4-MariaDB-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `Administrador`
--

DROP TABLE IF EXISTS `Administrador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Administrador` (
  `id_administrador` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id_administrador`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `Administrador_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `Usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Administrador`
--

LOCK TABLES `Administrador` WRITE;
/*!40000 ALTER TABLE `Administrador` DISABLE KEYS */;
INSERT INTO `Administrador` VALUES
(1,3,'Andr├⌐s Pardo Rubalcaba');
/*!40000 ALTER TABLE `Administrador` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Alumno`
--

DROP TABLE IF EXISTS `Alumno`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Alumno` (
  `id_alumno` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `matricula` varchar(50) NOT NULL,
  PRIMARY KEY (`id_alumno`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `Alumno_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `Usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Alumno`
--

LOCK TABLES `Alumno` WRITE;
/*!40000 ALTER TABLE `Alumno` DISABLE KEYS */;
INSERT INTO `Alumno` VALUES
(1,1,'Oscar Eduardo Gonz├ílez Navarro','22760560'),
(2,7,'Oscar Eduardo','22760561'),
(6,14,'Benito Juarez','22760986'),
(7,15,'Angel','22760920');
/*!40000 ALTER TABLE `Alumno` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Asesor`
--

DROP TABLE IF EXISTS `Asesor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Asesor` (
  `id_asesor` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `especialidad` varchar(100) DEFAULT 'No definido',
  PRIMARY KEY (`id_asesor`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `Asesor_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `Usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Asesor`
--

LOCK TABLES `Asesor` WRITE;
/*!40000 ALTER TABLE `Asesor` DISABLE KEYS */;
INSERT INTO `Asesor` VALUES
(3,2,'Saul Guillermo Mart├¡nez Monge','Sistemas Computacionales'),
(4,10,'Oscar','Algebra Lineal,C├ílculo Integral,');
/*!40000 ALTER TABLE `Asesor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Asesoria`
--

DROP TABLE IF EXISTS `Asesoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Asesoria` (
  `id_asesoria` int(11) NOT NULL AUTO_INCREMENT,
  `id_alumno` int(11) NOT NULL,
  `id_asesor` int(11) NOT NULL,
  `id_materia` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `estado` varchar(50) NOT NULL,
  `aula` varchar(20) NOT NULL,
  `id_tema` int(11) DEFAULT NULL,
  `modalidad` varchar(50) NOT NULL,
  PRIMARY KEY (`id_asesoria`),
  KEY `id_alumno` (`id_alumno`),
  KEY `id_asesor` (`id_asesor`),
  KEY `id_materia` (`id_materia`),
  KEY `id_tema` (`id_tema`),
  CONSTRAINT `Asesoria_ibfk_2` FOREIGN KEY (`id_alumno`) REFERENCES `Alumno` (`id_alumno`) ON DELETE CASCADE,
  CONSTRAINT `Asesoria_ibfk_3` FOREIGN KEY (`id_asesor`) REFERENCES `Asesor` (`id_asesor`) ON DELETE CASCADE,
  CONSTRAINT `Asesoria_ibfk_4` FOREIGN KEY (`id_materia`) REFERENCES `Materia` (`id_materia`) ON DELETE CASCADE,
  CONSTRAINT `Asesoria_ibfk_5` FOREIGN KEY (`id_tema`) REFERENCES `Tema` (`id_tema`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Asesoria`
--

LOCK TABLES `Asesoria` WRITE;
/*!40000 ALTER TABLE `Asesoria` DISABLE KEYS */;
INSERT INTO `Asesoria` VALUES
(1,1,4,3,'2025-04-23','12:00:00','Completada','LC4',1,'Presencial'),
(2,1,4,3,'2025-04-23','08:00:00','Completada','6000',1,'Presencial'),
(3,1,4,3,'2025-05-06','19:00:00','En proceso','6000',1,'Presencial'),
(4,1,4,3,'2025-04-30','18:00:00','En proceso','LC2',1,'Presencial'),
(5,1,4,3,'2025-04-24','17:00:00','En proceso','6000',1,'Presencial'),
(6,1,4,3,'2025-04-23','17:00:00','En proceso','404',1,'Presencial'),
(7,1,4,3,'2025-04-22','20:15:00','En proceso','5164',1,'Presencial'),
(8,1,4,3,'2025-04-24','10:00:00','En proceso','LC4',1,'Presencial'),
(9,1,4,3,'2025-04-24','14:00:00','En proceso','408',2,'En Linea'),
(10,1,4,3,'2025-04-29','12:00:00','En proceso','LC4',1,'Presencial');
/*!40000 ALTER TABLE `Asesoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Chat`
--

DROP TABLE IF EXISTS `Chat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Chat` (
  `id_chat` int(11) NOT NULL AUTO_INCREMENT,
  `id_alumno` int(11) NOT NULL,
  `id_asesor` int(11) NOT NULL,
  `id_asesoria` int(11) NOT NULL,
  PRIMARY KEY (`id_chat`),
  KEY `id_alumno` (`id_alumno`),
  KEY `id_asesor` (`id_asesor`),
  KEY `id_asesoria` (`id_asesoria`),
  CONSTRAINT `Chat_ibfk_1` FOREIGN KEY (`id_alumno`) REFERENCES `Alumno` (`id_alumno`) ON DELETE CASCADE,
  CONSTRAINT `Chat_ibfk_2` FOREIGN KEY (`id_asesor`) REFERENCES `Asesor` (`id_asesor`) ON DELETE CASCADE,
  CONSTRAINT `Chat_ibfk_3` FOREIGN KEY (`id_asesoria`) REFERENCES `Asesoria` (`id_asesoria`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Chat`
--

LOCK TABLES `Chat` WRITE;
/*!40000 ALTER TABLE `Chat` DISABLE KEYS */;
INSERT INTO `Chat` VALUES
(3,1,4,10);
/*!40000 ALTER TABLE `Chat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Horario`
--

DROP TABLE IF EXISTS `Horario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Horario` (
  `id_horario` int(15) NOT NULL AUTO_INCREMENT,
  `horario_inicio` time DEFAULT '00:00:00',
  `horario_fin` time DEFAULT '00:00:00',
  `dia_inicio` varchar(30) DEFAULT 'No definido',
  `dia_fin` varchar(30) DEFAULT 'No definido',
  `id_asesor` int(15) DEFAULT NULL,
  PRIMARY KEY (`id_horario`),
  KEY `id_asesor` (`id_asesor`),
  CONSTRAINT `Horario_ibfk_1` FOREIGN KEY (`id_asesor`) REFERENCES `Asesor` (`id_asesor`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Horario`
--

LOCK TABLES `Horario` WRITE;
/*!40000 ALTER TABLE `Horario` DISABLE KEYS */;
INSERT INTO `Horario` VALUES
(2,'06:00:00','08:00:00','lunes','lunes',NULL),
(21,'20:45:00','10:45:00','martes','martes',4);
/*!40000 ALTER TABLE `Horario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Materia`
--

DROP TABLE IF EXISTS `Materia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Materia` (
  `id_materia` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripci├│n` text DEFAULT NULL,
  `imagen` varchar(30) NOT NULL,
  `popularidad` int(11) NOT NULL,
  PRIMARY KEY (`id_materia`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Materia`
--

LOCK TABLES `Materia` WRITE;
/*!40000 ALTER TABLE `Materia` DISABLE KEYS */;
INSERT INTO `Materia` VALUES
(1,'Algebra Lineal','El estudio del ├ülgebra Lineal desarrolla el pensamiento l├│gico y anal├¡tico, permitiendo entender estructuras matem├íticas fundamentales que se aplican tanto en la teor├¡a como en la pr├íctica.','images/algebra_lineal.jpg',0),
(2,'C├ílculo Diferencial','Esta materia introduce conceptos como l├¡mites, derivadas y sus aplicaciones, y es esencial para comprender fen├│menos din├ímicos en ciencias e ingenier├¡a.','images/calculo_diferencial.png',2),
(3,'C├ílculo Integral','El estudio de c├ílculo integral desarrolla el pensamiento l├│gico y an├ílitico para comprender el c├ílculo de ├íreas a trav├⌐s de distintos m├⌐todos','images/calculo_integral.png',5),
(4,'Programaci├│n Lineal','Materia de matem├íticas aplicada que se enfoca en optimizar una funci├│n lineal.','images/1745593462755.png',0),
(5,'Programaci├│n Orientada a Objetos','Es un paradigma de programaci├│n que organiza el c├│digo en torno a objetos, que son instancias de clases que contienen datos y comportamientos','images/1745593753447.png',0),
(6,'Aut├│matas I','Es una rama de la inform├ítica que estudia las m├íquinas abstractas y sus lenguajes, con un enfoque en los aut├│matas finitos.','images/1745593965097.jpg',0),
(7,'Principios El├⌐ctricos y Aplicaciones Digitales','Es una materia que generalmente se enfoca en ense├▒ar los fundamentos de la electricidad y c├│mo se aplican en el dise├▒o y desarrollo de sistemas electr├│nicos, especialmente en el ├ímbito de la tecnolog├¡a digital.','images/1745594267267.JPG',0),
(9,'Ingenier├¡a de Software','Disciplina que se enfoca en la aplicaci├│n de principios, m├⌐todos y herramientas para dise├▒ar, desarrollar, probar e implementar software','images/1745595645559.jpg',0);
/*!40000 ALTER TABLE `Materia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Mensaje`
--

DROP TABLE IF EXISTS `Mensaje`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Mensaje` (
  `id_mensaje` int(11) NOT NULL AUTO_INCREMENT,
  `id_chat` int(11) NOT NULL,
  `contenido` text DEFAULT 'Mensaje vac├¡o',
  `fecha` date NOT NULL DEFAULT curdate(),
  `hora` time NOT NULL DEFAULT curtime(),
  `id_remitente` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_mensaje`),
  KEY `id_chat` (`id_chat`),
  CONSTRAINT `Mensaje_ibfk_1` FOREIGN KEY (`id_chat`) REFERENCES `Chat` (`id_chat`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Mensaje`
--

LOCK TABLES `Mensaje` WRITE;
/*!40000 ALTER TABLE `Mensaje` DISABLE KEYS */;
INSERT INTO `Mensaje` VALUES
(5,3,'Hola como estas','2025-04-27','21:17:08',1),
(6,3,'Practica','2025-04-27','22:01:04',1),
(7,3,'Fijo','2025-04-27','22:01:08',1),
(8,3,'Bueno ','2025-04-27','22:17:06',10),
(9,3,'Preuba','2025-04-27','22:21:41',1),
(10,3,'Prueba 2','2025-04-27','22:24:27',10),
(11,3,'Preuba 3','2025-04-27','22:27:23',10),
(12,3,'Hola como estas','2025-04-27','23:37:21',10),
(13,3,'Hola','2025-04-27','23:38:02',10),
(14,3,'input','2025-04-27','23:38:39',10),
(15,3,'hola','2025-04-28','00:18:05',10),
(16,3,'prueba','2025-04-28','00:19:59',10),
(17,3,'si','2025-04-28','00:20:07',10),
(18,3,'hola','2025-04-28','00:24:34',10),
(19,3,'Mensaje','2025-04-28','00:28:56',10),
(20,3,'Preuba','2025-04-28','00:29:39',10),
(21,3,'kssll','2025-04-29','15:56:58',1),
(22,3,'Prueba','2025-04-29','16:14:04',1),
(23,3,'Hola','2025-04-30','00:34:49',1),
(24,3,'Oa','2025-04-30','00:34:59',1),
(25,3,'Hola','2025-04-30','00:43:16',1),
(26,3,'ak;ldsjfkas','2025-04-30','00:43:59',1),
(27,3,'Prueba','2025-04-30','00:45:45',10),
(28,3,'hola como estas','2025-04-30','00:46:36',10),
(29,3,'hola','2025-04-30','00:46:58',1),
(30,3,'oaaaaaaaa','2025-04-30','00:48:47',10),
(31,3,'hola','2025-04-30','00:51:20',1),
(32,3,'p','2025-04-30','00:51:28',10),
(33,3,'prueba','2025-05-01','20:52:42',1),
(34,3,'hola','2025-05-01','21:33:07',1),
(35,3,'Hola','2025-05-01','23:49:58',1),
(36,3,'hey','2025-05-01','23:53:06',1);
/*!40000 ALTER TABLE `Mensaje` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Notificacion`
--

DROP TABLE IF EXISTS `Notificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Notificacion` (
  `id_notificacion` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `mensaje` text NOT NULL,
  `fecha_envio` datetime NOT NULL,
  `estado` varchar(50) NOT NULL,
  PRIMARY KEY (`id_notificacion`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `Notificacion_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `Usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Notificacion`
--

LOCK TABLES `Notificacion` WRITE;
/*!40000 ALTER TABLE `Notificacion` DISABLE KEYS */;
INSERT INTO `Notificacion` VALUES
(29,10,'Asesor├¡a Cancelada','Tu asesor├¡a de Integrales indefinidas fue cancelada por el administrador. Lo sentimos mucho.','2025-04-25 05:56:21','Enviada'),
(39,10,'Asesor├¡a Modificada','Tu Asesor├¡a de Integrales indefinidas fue modificada por el administrador. Rev├¡sala','2025-04-25 06:44:35','Enviada');
/*!40000 ALTER TABLE `Notificacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Reporte`
--

DROP TABLE IF EXISTS `Reporte`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Reporte` (
  `id_reporte` int(11) NOT NULL AUTO_INCREMENT,
  `id_asesoria` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripci├│n` text DEFAULT NULL,
  `fecha` datetime NOT NULL,
  `hora_inicial` time NOT NULL,
  `hora_final` time NOT NULL,
  `total_horas` int(11) NOT NULL,
  `porcentaje` int(11) NOT NULL,
  `estado_asesoria` varchar(50) NOT NULL,
  `id_asesor` int(11) NOT NULL,
  `id_alumno` int(11) NOT NULL,
  `id_materia` int(11) NOT NULL,
  `id_tema` int(11) NOT NULL,
  PRIMARY KEY (`id_reporte`),
  KEY `id_asesoria` (`id_asesoria`),
  KEY `id_asesor` (`id_asesor`),
  KEY `id_alumno` (`id_alumno`),
  KEY `id_materia` (`id_materia`),
  KEY `id_tema` (`id_tema`),
  CONSTRAINT `Reporte_ibfk_1` FOREIGN KEY (`id_asesoria`) REFERENCES `Asesoria` (`id_asesoria`) ON DELETE CASCADE,
  CONSTRAINT `Reporte_ibfk_2` FOREIGN KEY (`id_asesor`) REFERENCES `Asesor` (`id_asesor`),
  CONSTRAINT `Reporte_ibfk_3` FOREIGN KEY (`id_alumno`) REFERENCES `Alumno` (`id_alumno`),
  CONSTRAINT `Reporte_ibfk_4` FOREIGN KEY (`id_materia`) REFERENCES `Materia` (`id_materia`),
  CONSTRAINT `Reporte_ibfk_5` FOREIGN KEY (`id_tema`) REFERENCES `Tema` (`id_tema`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Reporte`
--

LOCK TABLES `Reporte` WRITE;
/*!40000 ALTER TABLE `Reporte` DISABLE KEYS */;
INSERT INTO `Reporte` VALUES
(6,1,'XAsesoria','Descripcion generica','2025-04-23 00:00:00','12:00:00','15:00:00',3,100,'Completada',4,1,3,1);
/*!40000 ALTER TABLE `Reporte` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Solicitud`
--

DROP TABLE IF EXISTS `Solicitud`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Solicitud` (
  `id_solicitud` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `id_alumno` int(11) NOT NULL,
  `id_materia` int(11) NOT NULL,
  `fecha_solicitud` date NOT NULL,
  `estado` varchar(50) NOT NULL,
  `id_tema` int(11) NOT NULL,
  `hora` time NOT NULL,
  `modalidad` varchar(50) NOT NULL,
  `observaciones` text DEFAULT NULL,
  PRIMARY KEY (`id_solicitud`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_alumno` (`id_alumno`),
  KEY `id_materia` (`id_materia`),
  KEY `id_tema` (`id_tema`),
  CONSTRAINT `Solicitud_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `Usuario` (`id_usuario`) ON DELETE CASCADE,
  CONSTRAINT `Solicitud_ibfk_2` FOREIGN KEY (`id_alumno`) REFERENCES `Alumno` (`id_alumno`) ON DELETE CASCADE,
  CONSTRAINT `Solicitud_ibfk_4` FOREIGN KEY (`id_materia`) REFERENCES `Materia` (`id_materia`) ON DELETE CASCADE,
  CONSTRAINT `Solicitud_ibfk_5` FOREIGN KEY (`id_tema`) REFERENCES `Tema` (`id_tema`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Solicitud`
--

LOCK TABLES `Solicitud` WRITE;
/*!40000 ALTER TABLE `Solicitud` DISABLE KEYS */;
INSERT INTO `Solicitud` VALUES
(5,1,1,3,'2025-04-23','Aceptada',1,'12:00:00','Presencial','No se sumar'),
(6,1,1,3,'2025-04-22','Pendiente',1,'00:00:00','Presencial','No hay observaciones'),
(7,1,1,3,'2025-04-29','Aceptada',1,'12:00:00','Presencial','No hay observaciones'),
(8,1,1,3,'2025-04-22','Pendiente',1,'12:00:00','Presencial','No hay observaciones'),
(9,1,1,3,'2025-04-24','Aceptada',1,'17:00:00','En Linea','No hay observaciones'),
(10,1,1,3,'2025-04-24','Aceptada',1,'10:00:00','Presencial','No hay observaciones'),
(11,1,1,3,'2025-04-23','Aceptada',1,'17:00:00','Presencial','No hay observaciones'),
(12,1,1,3,'2025-04-30','Aceptada',1,'18:00:00','Presencial','No hay observaciones'),
(13,1,1,3,'2025-05-06','Aceptada',1,'19:00:00','Presencial','No hay observaciones'),
(14,1,1,3,'2025-04-23','Aceptada',1,'08:00:00','Presencial','No hay observaciones'),
(15,1,1,3,'2025-04-22','Aceptada',1,'20:15:00','En Linea','Ninguna'),
(16,1,1,3,'2025-04-24','Aceptada',2,'14:00:00','En Linea','Quiero aprender Sumas de Riemann'),
(17,14,6,3,'2025-04-29','Aceptada',1,'08:00:00','En Linea','No hay observaciones');
/*!40000 ALTER TABLE `Solicitud` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Tema`
--

DROP TABLE IF EXISTS `Tema`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Tema` (
  `id_tema` int(11) NOT NULL AUTO_INCREMENT,
  `id_materia` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripci├│n` text DEFAULT NULL,
  `popularidad` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_tema`),
  KEY `id_materia` (`id_materia`),
  CONSTRAINT `Tema_ibfk_1` FOREIGN KEY (`id_materia`) REFERENCES `Materia` (`id_materia`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tema`
--

LOCK TABLES `Tema` WRITE;
/*!40000 ALTER TABLE `Tema` DISABLE KEYS */;
INSERT INTO `Tema` VALUES
(1,3,'Integrales indefinidas','Asesor├¡a de integrales definidas para principantes',4),
(2,3,'Sumas de Riemann','\nLa suma de Riemann es el nombre que recibe el c├ílculo aproximado de una integral definida, mediante una sumatoria discreta con un n├║mero de t├⌐rminos finito.',6),
(3,5,'Manejo de objetos en Java','En Java, todo es un objeto, y la manipulaci├│n de estos objetos es clave para desarrollar aplicaciones eficientes y bien estructuradas. ',0),
(4,5,'Abstracci├│n','Se refiere al concepto de ocultar los detalles complejos de la implementaci├│n de un sistema o proceso, mostrando solo la informaci├│n esencial o relevante para el usuario o el programador. ',0);
/*!40000 ALTER TABLE `Tema` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Usuario`
--

DROP TABLE IF EXISTS `Usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Usuario` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `correo` varchar(100) NOT NULL,
  `contrase├▒a` varchar(255) NOT NULL,
  `rol` enum('alumno','asesor','administrador') DEFAULT NULL,
  PRIMARY KEY (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Usuario`
--

LOCK TABLES `Usuario` WRITE;
/*!40000 ALTER TABLE `Usuario` DISABLE KEYS */;
INSERT INTO `Usuario` VALUES
(1,'al22760560@ite.edu.mx','burrito','alumno'),
(2,'al22760566@ite.edu.mx','saul','asesor'),
(3,'al22760571@ite.edu.mx','pardo','administrador'),
(7,'al22760561@ite.edu.mx','OscarEduardo','alumno'),
(10,'al22760560@ite.edu.mx','burrito','asesor'),
(14,'al22760986@ite.edu.mx','benitojuarez','alumno'),
(15,'al22760920@gmail.com','angel','alumno');
/*!40000 ALTER TABLE `Usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2025-05-22 11:15:31
