-- MySQL dump 10.13  Distrib 5.6.10, for osx10.7 (x86_64)
--
-- Host: localhost    Database: ASAPP
-- ------------------------------------------------------
-- Server version	5.6.10

--
-- Table structure for table `ChatLog`
--

DROP TABLE IF EXISTS `ChatLog`;
CREATE TABLE `ChatLog` (
  `chatId` int(11) NOT NULL AUTO_INCREMENT,
  `chatRoomId` int(11) NOT NULL,
  `fromUser` int(11) NOT NULL,
  `message` text,
  `messageTime` bigint(20) NOT NULL,
  PRIMARY KEY (`chatId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
CREATE TABLE `User` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `createdOn` datetime DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `lastSeen` bigint(20) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
