CREATE DATABASE  IF NOT EXISTS `DS_Inclutec_Bitacoras` /*!40100 DEFAULT CHARACTER SET utf8 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `DS_Inclutec_Bitacoras`;
-- MySQL dump 10.13  Distrib 8.0.21, for Linux (x86_64)
--
-- Host: localhost    Database: DS_Inclutec_Bitacoras
-- ------------------------------------------------------
-- Server version	8.0.20-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `AccessToken`
--

DROP TABLE IF EXISTS `AccessToken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AccessToken` (
  `id` varchar(255) NOT NULL,
  `ttl` int DEFAULT NULL,
  `created` timestamp NULL DEFAULT NULL,
  `userID` int DEFAULT NULL,
  `scopes` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Activities`
--

DROP TABLE IF EXISTS `Activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Activities` (
  `idActivity_pk` int NOT NULL AUTO_INCREMENT,
  `activityName` varchar(255) NOT NULL,
  `idUnits_fk` int NOT NULL,
  PRIMARY KEY (`idActivity_pk`),
  KEY `fk_Activity_1_idx` (`idUnits_fk`),
  CONSTRAINT `fk_Activity_1` FOREIGN KEY (`idUnits_fk`) REFERENCES `Units` (`idUnits_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=671 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ActivityByPhases`
--

DROP TABLE IF EXISTS `ActivityByPhases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ActivityByPhases` (
  `idActivity_fk` int NOT NULL,
  `idPhases_fk` int NOT NULL,
  PRIMARY KEY (`idActivity_fk`,`idPhases_fk`),
  KEY `fk_ActivityByPhases_2_idx` (`idPhases_fk`),
  CONSTRAINT `fk_ActivityByPhases_1` FOREIGN KEY (`idActivity_fk`) REFERENCES `Activities` (`idActivity_pk`),
  CONSTRAINT `fk_ActivityByPhases_2` FOREIGN KEY (`idPhases_fk`) REFERENCES `Phases` (`idPhases_pk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Disabilities`
--

DROP TABLE IF EXISTS `Disabilities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Disabilities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `DisabilitiesByUsers`
--

DROP TABLE IF EXISTS `DisabilitiesByUsers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DisabilitiesByUsers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usersIdFk` int NOT NULL,
  `disabilitiesIdFk` int NOT NULL,
  PRIMARY KEY (`id`,`disabilitiesIdFk`,`usersIdFk`),
  KEY `disabilitiesIdFk` (`disabilitiesIdFk`),
  KEY `usersIdFk` (`usersIdFk`),
  CONSTRAINT `DisabilitiesByUsers_ibfk_1` FOREIGN KEY (`disabilitiesIdFk`) REFERENCES `Disabilities` (`id`),
  CONSTRAINT `DisabilitiesByUsers_ibfk_2` FOREIGN KEY (`usersIdFk`) REFERENCES `Users` (`idUsers_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `NotificationByUsers`
--

DROP TABLE IF EXISTS `NotificationByUsers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `NotificationByUsers` (
  `idNotification_fk` int NOT NULL,
  `idUsers_fk` int NOT NULL,
  PRIMARY KEY (`idNotification_fk`,`idUsers_fk`),
  KEY `fk_Notification_has_Users_Users1_idx` (`idUsers_fk`),
  KEY `fk_Notification_has_Users_Notification1_idx` (`idNotification_fk`),
  CONSTRAINT `notification_fk` FOREIGN KEY (`idNotification_fk`) REFERENCES `Notifications` (`idNotification_pk`),
  CONSTRAINT `user_fk` FOREIGN KEY (`idUsers_fk`) REFERENCES `Users` (`idUsers_pk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Notifications`
--

DROP TABLE IF EXISTS `Notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Notifications` (
  `idNotification_pk` int NOT NULL AUTO_INCREMENT,
  `viewed` varchar(45) DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL,
  `idUserCreate` int DEFAULT NULL,
  `idUserReceive` int NOT NULL,
  PRIMARY KEY (`idNotification_pk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `PhaseByProjects`
--

DROP TABLE IF EXISTS `PhaseByProjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PhaseByProjects` (
  `idPhase_fk` int NOT NULL,
  `idProjects_fk` int NOT NULL,
  PRIMARY KEY (`idPhase_fk`,`idProjects_fk`),
  KEY `fk_PhaseByProjects_2_idx` (`idProjects_fk`),
  CONSTRAINT `fk_PhaseByProjects_1` FOREIGN KEY (`idPhase_fk`) REFERENCES `Phases` (`idPhases_pk`),
  CONSTRAINT `fk_PhaseByProjects_2` FOREIGN KEY (`idProjects_fk`) REFERENCES `Projects` (`idProjects_pk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Phases`
--

DROP TABLE IF EXISTS `Phases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Phases` (
  `idPhases_pk` int NOT NULL AUTO_INCREMENT,
  `phaseName` varchar(255) NOT NULL,
  `idUnits_fk` int NOT NULL,
  PRIMARY KEY (`idPhases_pk`),
  KEY `fk_Phases_1_idx` (`idUnits_fk`),
  CONSTRAINT `fk_Phases_1` FOREIGN KEY (`idUnits_fk`) REFERENCES `Units` (`idUnits_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=488 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Projects`
--

DROP TABLE IF EXISTS `Projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Projects` (
  `idProjects_pk` int NOT NULL AUTO_INCREMENT,
  `projectName` varchar(45) NOT NULL,
  `idUnits_fk` int NOT NULL,
  `status` int DEFAULT '0',
  `createdAt` datetime DEFAULT NULL,
  `createdBy` int DEFAULT NULL,
  PRIMARY KEY (`idProjects_pk`),
  KEY `fk_Projects_1_idx` (`idUnits_fk`),
  CONSTRAINT `fk_Projects_1` FOREIGN KEY (`idUnits_fk`) REFERENCES `Units` (`idUnits_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=142 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ProjectsByUsers`
--

DROP TABLE IF EXISTS `ProjectsByUsers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ProjectsByUsers` (
  `idUsers_fk` int NOT NULL,
  `idProjects_fk` int NOT NULL,
  PRIMARY KEY (`idUsers_fk`,`idProjects_fk`),
  KEY `fk_ProjectsByUsers_2_idx` (`idUsers_fk`),
  KEY `fk_ProjectsByUsers_1` (`idProjects_fk`),
  CONSTRAINT `fk_ProjectsByUsers_1` FOREIGN KEY (`idProjects_fk`) REFERENCES `Projects` (`idProjects_pk`),
  CONSTRAINT `fk_ProjectsByUsers_2` FOREIGN KEY (`idUsers_fk`) REFERENCES `Users` (`idUsers_pk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ProjectsColors`
--

DROP TABLE IF EXISTS `ProjectsColors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ProjectsColors` (
  `idProject_fk` int NOT NULL,
  `primaryColor` varchar(45) NOT NULL,
  `secondaryColor` varchar(45) NOT NULL,
  PRIMARY KEY (`idProject_fk`),
  CONSTRAINT `ProjectsColors_ibfk_1` FOREIGN KEY (`idProject_fk`) REFERENCES `Projects` (`idProjects_pk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Task`
--

DROP TABLE IF EXISTS `Task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Task` (
  `idTask_pk` int NOT NULL AUTO_INCREMENT,
  `taskName` varchar(255) NOT NULL,
  `idUnits_fk` int NOT NULL,
  PRIMARY KEY (`idTask_pk`),
  KEY `fk_Task_1_idx` (`idUnits_fk`),
  CONSTRAINT `fk_Task_1` FOREIGN KEY (`idUnits_fk`) REFERENCES `Units` (`idUnits_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=483 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `TaskByActivities`
--

DROP TABLE IF EXISTS `TaskByActivities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TaskByActivities` (
  `idActivity_fk` int NOT NULL,
  `idTask_fk` int NOT NULL,
  PRIMARY KEY (`idActivity_fk`,`idTask_fk`),
  KEY `fk_TaskByActivities_2_idx` (`idTask_fk`),
  CONSTRAINT `fk_TaskByActivities_1` FOREIGN KEY (`idActivity_fk`) REFERENCES `Activities` (`idActivity_pk`),
  CONSTRAINT `fk_TaskByActivities_2` FOREIGN KEY (`idTask_fk`) REFERENCES `Task` (`idTask_pk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Units`
--

DROP TABLE IF EXISTS `Units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Units` (
  `idUnits_pk` int NOT NULL AUTO_INCREMENT,
  `unitName` varchar(45) NOT NULL,
  PRIMARY KEY (`idUnits_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `idUsers_pk` int NOT NULL AUTO_INCREMENT,
  `username` varchar(512) NOT NULL,
  `password` varchar(512) NOT NULL,
  `email` varchar(512) NOT NULL,
  `emailVerified` tinyint(1) DEFAULT NULL,
  `name` varchar(45) NOT NULL,
  `lastname` varchar(45) DEFAULT NULL,
  `typeUser` varchar(45) NOT NULL,
  `role` varchar(45) NOT NULL,
  `costPerHour` int DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL,
  `picture` varchar(100) DEFAULT NULL,
  `hoursPerWeek` double NOT NULL DEFAULT '0',
  `idUnit_fk` int NOT NULL,
  `realm` varchar(45) DEFAULT NULL,
  `verificationToken` varchar(255) DEFAULT '0',
  `country` varchar(45) DEFAULT NULL,
  `postalCode` varchar(45) DEFAULT NULL,
  `bornDate` varchar(45) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`idUsers_pk`),
  KEY `fk_Users_1_idx` (`idUnit_fk`),
  CONSTRAINT `fk_Users_1` FOREIGN KEY (`idUnit_fk`) REFERENCES `Units` (`idUnits_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=99 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `WorkToDo`
--

DROP TABLE IF EXISTS `WorkToDo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WorkToDo` (
  `idWorkToDo_pk` int NOT NULL AUTO_INCREMENT,
  `toDoDate` date DEFAULT NULL,
  `description` varchar(250) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `idUsers_fk` int NOT NULL,
  `important` tinyint(1) DEFAULT NULL,
  `urgent` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`idWorkToDo_pk`),
  KEY `fk_WorkToDo_Users1_idx` (`idUsers_fk`),
  CONSTRAINT `idUsers_fk` FOREIGN KEY (`idUsers_fk`) REFERENCES `Users` (`idUsers_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=117 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `WorklogByUser`
--

DROP TABLE IF EXISTS `WorklogByUser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WorklogByUser` (
  `idUser_fk` int NOT NULL,
  `idWorklog_fk` int NOT NULL,
  PRIMARY KEY (`idUser_fk`,`idWorklog_fk`),
  KEY `idWorklog_fk` (`idWorklog_fk`),
  CONSTRAINT `WorklogByUser_ibfk_1` FOREIGN KEY (`idUser_fk`) REFERENCES `Users` (`idUsers_pk`),
  CONSTRAINT `WorklogByUser_ibfk_2` FOREIGN KEY (`idWorklog_fk`) REFERENCES `WorklogDependencies` (`idWorklogDependencies_pk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `WorklogDependencies`
--

DROP TABLE IF EXISTS `WorklogDependencies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WorklogDependencies` (
  `idWorklogDependencies_pk` int NOT NULL AUTO_INCREMENT,
  `idProjects_fk` int NOT NULL,
  `idPhase_fk` int NOT NULL,
  `idActivity_fk` int NOT NULL,
  `idTask_fk` int NOT NULL,
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  `description` varchar(250) NOT NULL,
  `spentTime` float NOT NULL,
  `modality` int NOT NULL,
  `status` int NOT NULL,
  PRIMARY KEY (`idWorklogDependencies_pk`),
  KEY `projectsIdx` (`idProjects_fk`),
  KEY `phasesIdx` (`idPhase_fk`),
  KEY `activitiesIdx` (`idActivity_fk`),
  KEY `tasksIdx` (`idTask_fk`),
  CONSTRAINT `fk_WorklogDependencies_1` FOREIGN KEY (`idProjects_fk`) REFERENCES `Projects` (`idProjects_pk`),
  CONSTRAINT `fk_WorklogDependencies_2` FOREIGN KEY (`idPhase_fk`) REFERENCES `Phases` (`idPhases_pk`),
  CONSTRAINT `fk_WorklogDependencies_3` FOREIGN KEY (`idActivity_fk`) REFERENCES `Activities` (`idActivity_pk`),
  CONSTRAINT `fk_WorklogDependencies_4` FOREIGN KEY (`idTask_fk`) REFERENCES `Task` (`idTask_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=272 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping events for database 'DS_Inclutec_Bitacoras'
--

--
-- Dumping routines for database 'DS_Inclutec_Bitacoras'
--
/*!50003 DROP PROCEDURE IF EXISTS `getLastDependency` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getLastDependency`(IN userId INT)
BEGIN
SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));

select idWorklogDependencies_pk, idProjects_fk, idPhase_fk, idActivity_fk, idTask_fk,
Projects.projectName, Phases.phaseName, Activities.activityName, Task.taskName
FROM WorklogDependencies, Projects , Phases, Activities, Task, WorklogByUser
WHERE WorklogByUser.idUser_fk = userId
and WorklogByUser.idWorklog_fk = WorklogDependencies.idWorklogDependencies_pk
and Projects.idProjects_pk = idProjects_fk
AND Phases.idPhases_pk = idPhase_fk
AND Activities.idActivity_pk = idActivity_fk
AND Task.idTask_pk = idTask_fk
ORDER BY idWorklogDependencies_pk
DESC
LIMIT 4;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `getMostCommonsDependencies` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getMostCommonsDependencies`(
IN userId INT
)
BEGIN
SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));

SELECT idWorklogDependencies_pk, idProjects_fk, idPhase_fk, idActivity_fk, idTask_fk,
Projects.projectName, Phases.phaseName, Activities.activityName, Task.taskName,
COUNT(*) AS count
FROM WorklogDependencies, Projects , Phases, Activities, Task, WorklogByUser
WHERE WorklogByUser.idUser_fk = userId
and WorklogByUser.idWorklog_fk = WorklogDependencies.idWorklogDependencies_pk
and Projects.idProjects_pk = idProjects_fk
AND Phases.idPhases_pk = idPhase_fk
AND Activities.idActivity_pk = idActivity_fk
AND Task.idTask_pk = idTask_fk

GROUP BY idProjects_fk, idPhase_fk, idActivity_fk, idTask_fk
ORDER BY count DESC
LIMIT 4;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-07-23  9:31:54
