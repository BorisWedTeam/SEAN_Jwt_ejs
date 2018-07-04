/*
SQLyog Professional v12.08 (64 bit)
MySQL - 10.1.32-MariaDB : Database - playlist
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`playlist` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `playlist`;

/*Table structure for table `advertisement` */

DROP TABLE IF EXISTS `advertisement`;

CREATE TABLE `advertisement` (
  `colName` varchar(256) DEFAULT NULL,
  `colValue` varchar(256) DEFAULT NULL,
  `colCheck` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `advertisement` */

insert  into `advertisement`(`colName`,`colValue`,`colCheck`) values ('preRoll','http://localhost1ll',0),('midRoll','http://localhost2',1),('postRoll','http://localhost3',1),('displayAds','http://localhost4',1);

/*Table structure for table `channels` */

DROP TABLE IF EXISTS `channels`;

CREATE TABLE `channels` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

/*Data for the table `channels` */

insert  into `channels`(`id`,`name`) values (1,'chanel1'),(2,'chanel2'),(3,'chanel3'),(4,'chanel4'),(5,'chanel5'),(6,'chanel6'),(7,'chanel7');

/*Table structure for table `county` */

DROP TABLE IF EXISTS `county`;

CREATE TABLE `county` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) DEFAULT NULL,
  `language` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

/*Data for the table `county` */

insert  into `county`(`id`,`name`,`language`) values (1,'United State','English'),(2,'France','French'),(3,'German','Germany'),(4,'United Kingdom','English'),(5,'Canada','English');

/*Table structure for table `customers` */

DROP TABLE IF EXISTS `customers`;

CREATE TABLE `customers` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `customer_id` varchar(8) NOT NULL,
  `channel` varchar(256) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=latin1;

/*Data for the table `customers` */

insert  into `customers`(`id`,`name`,`customer_id`,`channel`,`status`) values (23,'Sivaa','NL3Oc1vg','channel-siva','1');

/*Table structure for table `package` */

DROP TABLE IF EXISTS `package`;

CREATE TABLE `package` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(128) DEFAULT NULL,
  `details` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

/*Data for the table `package` */

insert  into `package`(`id`,`title`,`details`) values (10,'title2','detail2');

/*Table structure for table `package_sub` */

DROP TABLE IF EXISTS `package_sub`;

CREATE TABLE `package_sub` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `packageId` int(11) DEFAULT NULL,
  `subscriptionId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `package_sub` */

/*Table structure for table `platforms` */

DROP TABLE IF EXISTS `platforms`;

CREATE TABLE `platforms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `config_parameter` varchar(256) NOT NULL,
  `friendly_name` varchar(256) NOT NULL,
  `value` varchar(256) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '0',
  `customer_id` int(11) NOT NULL,
  `app_title` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=latin1;

/*Data for the table `platforms` */

insert  into `platforms`(`id`,`config_parameter`,`friendly_name`,`value`,`status`,`customer_id`,`app_title`) values (5,'aef','sdf','wefs','1',19,'vsdf'),(6,'ef','we','fs','0',19,'vsdf'),(19,'a','f','s','1',21,'a'),(20,'s','fsd','fsdf','1',21,'a'),(21,'efrt','sdfwe','sdf','1',21,'n'),(22,'sdf','sfe','fsdf','1',21,'n'),(23,'awe','sdfsd','sdfs','1',23,'Samsung');

/*Table structure for table `subscription` */

DROP TABLE IF EXISTS `subscription`;

CREATE TABLE `subscription` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `duration` int(11) DEFAULT NULL,
  `title` varchar(128) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `description` text,
  `banner` varchar(128) DEFAULT NULL,
  `country` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

/*Data for the table `subscription` */

insert  into `subscription`(`id`,`duration`,`title`,`price`,`description`,`banner`,`country`) values (1,NULL,NULL,NULL,NULL,NULL,NULL);

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `type` enum('1','2') DEFAULT '1',
  `phone_number` varchar(30) NOT NULL,
  `last_login` datetime NOT NULL,
  `customers` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

/*Data for the table `user` */

insert  into `user`(`id`,`email`,`username`,`password`,`type`,`phone_number`,`last_login`,`customers`) values (8,'joensen19727@gmail.com','tt','7ZaOhA0Q0tMTqHC8ExpOLDEdetCb3zKzQYFHIh9RpuI=','2','9698864912','2018-07-04 23:00:47','chanel1,chanel3'),(9,'sivaa@gmail.com','sivaa','7ZaOhA0Q0tMTqHC8ExpOLDEdetCb3zKzQYFHIh9RpuI=','1','9698864912','2018-07-04 22:47:14','Luo Tong,Sivaa');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
