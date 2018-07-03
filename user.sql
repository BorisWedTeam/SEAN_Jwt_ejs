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

/*Table structure for table `channels` */

DROP TABLE IF EXISTS `channels`;

CREATE TABLE `channels` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

/*Data for the table `channels` */

insert  into `channels`(`id`,`name`) values (1,'chanel1'),(2,'chanel2'),(3,'chanel3'),(4,'chanel4'),(5,'chanel5'),(6,'chanel6'),(7,'chanel7');

/*Table structure for table `customers` */

DROP TABLE IF EXISTS `customers`;

CREATE TABLE `customers` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `customer_id` varchar(8) NOT NULL,
  `channel` varchar(256) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=latin1;

/*Data for the table `customers` */

insert  into `customers`(`id`,`name`,`customer_id`,`channel`,`status`) values (21,'Luo Tong','KEdpFcFw','chanel2','1');

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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

/*Data for the table `platforms` */

insert  into `platforms`(`id`,`config_parameter`,`friendly_name`,`value`,`status`,`customer_id`,`app_title`) values (5,'aef','sdf','wefs','1',19,'vsdf'),(6,'ef','we','fs','0',19,'vsdf'),(7,'test1','test2','test3','0',21,'Samsung'),(8,'test4','test5','test6','1',21,'Samsung'),(9,'test10','test11','test12','0',21,'Apple'),(10,'test7','test8','test9','1',21,'Apple');

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
  `channels` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

/*Data for the table `user` */

insert  into `user`(`id`,`email`,`username`,`password`,`type`,`phone_number`,`last_login`,`channels`) values (8,'joensen19727@gmail.com','tt','7ZaOhA0Q0tMTqHC8ExpOLDEdetCb3zKzQYFHIh9RpuI=','2','9698864912','2018-07-03 18:37:50','chanel1,chanel3'),(9,'sivaa@gmail.com','sivaa','7ZaOhA0Q0tMTqHC8ExpOLDEdetCb3zKzQYFHIh9RpuI=','1','9698864912','2018-07-02 23:47:21','chanel1,chanel3');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
