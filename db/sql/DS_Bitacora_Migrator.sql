USE `DS_Inclutec_Bitacoras`;

DROP TABLE `DS_Inclutec_Bitacoras`.`WorklogInfos`;

ALTER TABLE `DS_Inclutec_Bitacoras`.`Phases` 
CHANGE COLUMN `phaseName` `phaseName` VARCHAR
(255) NOT NULL ;

ALTER TABLE `DS_Inclutec_Bitacoras`.`Activities` 
CHANGE COLUMN `activityName` `activityName` VARCHAR
(255) NOT NULL ;

ALTER TABLE `DS_Inclutec_Bitacoras`.`Task` 
CHANGE COLUMN `taskName` `taskName` VARCHAR
(255) NOT NULL ;

create table WorklogByUser
(
  idUser_fk int NOT NULL,
  idWorklog_fk int NOT NULL,
  PRIMARY KEY (idUser_fk,idWorklog_fk),
  FOREIGN KEY (idUser_fk) REFERENCES Users(idUsers_pk),
  FOREIGN KEY (idWorklog_fk) REFERENCES WorklogDependencies(idWorklogDependencies_pk)
);

CREATE TABLE `Disabilities`
(
	`id` int NOT NULL AUTO_INCREMENT,
	`name` varchar(128) DEFAULT NULL,      
	PRIMARY KEY(`id`)
);

ALTER TABLE `DS_Inclutec_Bitacoras`.`Disabilities` 
CHANGE COLUMN `name` `name` VARCHAR
(128) NOT NULL ;

CREATE TABLE `DisabilitiesByUsers`
(
	`id` int NOT NULL AUTO_INCREMENT,
	`usersIdFk` int NOT NULL,
	`disabilitiesIdFk` int NOT NULL,
	PRIMARY KEY(`id`,`disabilitiesIdFk`, `usersIdFk`),
	FOREIGN KEY(`disabilitiesIdFk`) REFERENCES `Disabilities`(`id`),
	FOREIGN KEY (`usersIdFk`) REFERENCES `Users` (`idUsers_pk`)
);

ALTER TABLE `DS_Inclutec_Bitacoras`.`WorklogDependencies`
DROP FOREIGN KEY `fk_WorklogDependencies_4`,
DROP FOREIGN KEY `fk_WorklogDependencies_5`;
ALTER TABLE `DS_Inclutec_Bitacoras`.`WorklogDependencies`
ADD COLUMN `endDate` DATETIME NOT NULL AFTER `startDate`,
ADD COLUMN `description` VARCHAR
(250) NOT NULL AFTER `endDate`,
ADD COLUMN `spentTime` FLOAT NOT NULL AFTER `description`,
ADD COLUMN `modality` INT NOT NULL AFTER `spentTime`,
ADD COLUMN `status` INT NOT NULL AFTER `modality`,
CHANGE COLUMN `idTask_fk` `idTask_fk` INT NOT NULL;
;
ALTER TABLE `DS_Inclutec_Bitacoras`.`WorklogDependencies`
	ADD CONSTRAINT `fk_WorklogDependencies_4`
	FOREIGN KEY(`idTask_fk`)REFERENCES `DS_Inclutec_Bitacoras`.`Task`(`idTask_pk`);


  ALTER TABLE `DS_Inclutec_Bitacoras`.`Projects` 
ADD COLUMN `status` INT NULL DEFAULT 0 AFTER `idUnits_fk`,
ADD COLUMN `createdAt` DATETIME NULL DEFAULT NULL AFTER `status`,
ADD COLUMN `createdBy` INT NULL DEFAULT NULL AFTER `createdAt`;

ALTER TABLE `DS_Inclutec_Bitacoras`.`Users` 
ADD COLUMN `createdAt` DATETIME NULL AFTER `bornDate`;


DROP procedure IF EXISTS `getLastDependency`;

DELIMITER $$
USE `DS_Inclutec_Bitacoras`$$
CREATE  PROCEDURE `getLastDependency`
(IN userId INT)
BEGIN
  SET sql_mode
  =
  (SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));

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

END$$

  DELIMITER $$

DROP procedure IF EXISTS `getMostCommonsDependencies`;

CREATE PROCEDURE `getMostCommonsDependencies`
(
IN userId INT
)
BEGIN
  SET sql_mode
  =
  (SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));

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

END



