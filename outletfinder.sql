-- MySQL dump 10.13  Distrib 5.7.21, for osx10.13 (x86_64)
--
-- Host: localhost    Database: outletfinder
-- ------------------------------------------------------
-- Server version	5.7.21

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `address`
--

DROP TABLE IF EXISTS `address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `address` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `line1` varchar(50) DEFAULT NULL,
  `line2` varchar(50) DEFAULT NULL,
  `administrative_area_1` varchar(50) DEFAULT NULL,
  `administrative_area_2` varchar(50) DEFAULT NULL,
  `administrative_area_3` varchar(50) DEFAULT NULL,
  `administrative_area_4` varchar(50) DEFAULT NULL,
  `postalcode` int(11) DEFAULT NULL,
  `point` point DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `address`
--

LOCK TABLES `address` WRITE;
/*!40000 ALTER TABLE `address` DISABLE KEYS */;
INSERT INTO `address` VALUES (1,'jalan adisucipto no 27','Demangan, Gondokusuman','DI Yogyakarta','DI Yogyakarta','Demangan','Gondokusuman',55281,NULL);
/*!40000 ALTER TABLE `address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business`
--

DROP TABLE IF EXISTS `business`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `business` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT '',
  `owner_id` int(11) unsigned DEFAULT NULL,
  `address_id` int(11) unsigned DEFAULT NULL,
  `category_id` int(11) unsigned DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `website` varchar(100) DEFAULT NULL,
  `contact_no` varchar(20) DEFAULT NULL,
  `description` text,
  `image` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_poeple` (`owner_id`),
  KEY `id_address` (`address_id`),
  KEY `id_category` (`category_id`),
  CONSTRAINT `business_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`),
  CONSTRAINT `business_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `address` (`id`),
  CONSTRAINT `business_ibfk_3` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business`
--

LOCK TABLES `business` WRITE;
/*!40000 ALTER TABLE `business` DISABLE KEYS */;
INSERT INTO `business` VALUES (1,'Wonderlabs',1,1,1,'wonderlabs.io','wonderlabs.io','0251876765','software house','https://pbs.twimg.com/profile_images/778811384775577600/vGv5xSR4_400x400.jpg','2018-05-22 09:46:40');
/*!40000 ALTER TABLE `business` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_category`
--

DROP TABLE IF EXISTS `business_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `business_category` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `business_id` int(11) unsigned DEFAULT NULL,
  `category_id` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `business_id` (`business_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `business_category_ibfk_1` FOREIGN KEY (`business_id`) REFERENCES `business` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `business_category_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_category`
--

LOCK TABLES `business_category` WRITE;
/*!40000 ALTER TABLE `business_category` DISABLE KEYS */;
INSERT INTO `business_category` VALUES (1,1,1);
/*!40000 ALTER TABLE `business_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `description` longtext,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'arts',' Description about is arts','2018-05-21 06:14:08','2018-05-21 13:14:31'),(2,'furniture',' Description about is furniture','2018-05-21 06:14:08','2018-05-21 13:14:29'),(4,'computers',' Description about is computers','2018-05-21 06:14:08','2018-05-21 13:14:27'),(5,'food',' Description about is food','2018-05-21 06:14:08','2018-05-21 13:14:26'),(6,'fashion',' Description about is fashion','2018-05-21 06:14:08','2018-05-21 13:14:25'),(7,'academy',' Description about is academy','2018-05-21 06:14:08','2018-05-21 13:14:23'),(8,'IT',' Description about is Information Technologi','2018-05-21 06:14:08','2018-05-21 13:14:22'),(9,'retail',' Description about is retail','2018-05-21 06:14:08','2018-05-21 06:14:08'),(10,'accesories',' Description about is accesories','2018-05-21 06:14:59',NULL),(11,'freeze food',' Description about is freeze food','2018-05-21 06:18:53',NULL),(12,'otomotif',' Description about is otomotif','2018-05-21 06:19:19',NULL);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `days`
--

DROP TABLE IF EXISTS `days`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `days` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `outlet_id` int(11) unsigned DEFAULT NULL,
  `d1_open` time DEFAULT NULL,
  `d1_close` time DEFAULT NULL,
  `d2_close` time DEFAULT NULL,
  `d2_open` time DEFAULT NULL,
  `d3_open` time DEFAULT NULL,
  `d3_close` time DEFAULT NULL,
  `d4_open` time DEFAULT NULL,
  `d4_close` time DEFAULT NULL,
  `d5_open` time DEFAULT NULL,
  `d5_close` time DEFAULT NULL,
  `d6_open` time DEFAULT NULL,
  `d6_close` time DEFAULT NULL,
  `d7_open` time DEFAULT NULL,
  `d7_close` time DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `outlet_id` (`outlet_id`),
  CONSTRAINT `days_ibfk_1` FOREIGN KEY (`outlet_id`) REFERENCES `outlets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `days`
--

LOCK TABLES `days` WRITE;
/*!40000 ALTER TABLE `days` DISABLE KEYS */;
/*!40000 ALTER TABLE `days` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `keywords`
--

DROP TABLE IF EXISTS `keywords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `keywords` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `keyword` varchar(200) DEFAULT NULL,
  `search_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `keywords`
--

LOCK TABLES `keywords` WRITE;
/*!40000 ALTER TABLE `keywords` DISABLE KEYS */;
INSERT INTO `keywords` VALUES (1,'art','2018-05-18 00:00:00');
/*!40000 ALTER TABLE `keywords` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `outlets`
--

DROP TABLE IF EXISTS `outlets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `outlets` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `id_address` int(11) unsigned DEFAULT NULL,
  `id_category` int(11) unsigned DEFAULT NULL,
  `id_bussines` int(11) unsigned DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `website` varchar(100) DEFAULT NULL,
  `description` longtext,
  `contact_no` varchar(20) DEFAULT NULL,
  `role_public_holiday` tinytext,
  `days_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_address` (`id_address`),
  KEY `id_category` (`id_category`),
  KEY `id_bussines` (`id_bussines`),
  CONSTRAINT `outlets_ibfk_1` FOREIGN KEY (`id_address`) REFERENCES `address` (`id`),
  CONSTRAINT `outlets_ibfk_2` FOREIGN KEY (`id_category`) REFERENCES `categories` (`id`),
  CONSTRAINT `outlets_ibfk_3` FOREIGN KEY (`id_bussines`) REFERENCES `business` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `outlets`
--

LOCK TABLES `outlets` WRITE;
/*!40000 ALTER TABLE `outlets` DISABLE KEYS */;
/*!40000 ALTER TABLE `outlets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `page_views`
--

DROP TABLE IF EXISTS `page_views`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `page_views` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `outlet_id` int(11) unsigned DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `visit_date` datetime DEFAULT NULL,
  `lat_lng` point DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_outlet` (`outlet_id`),
  CONSTRAINT `page_views_ibfk_1` FOREIGN KEY (`outlet_id`) REFERENCES `outlets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `page_views`
--

LOCK TABLES `page_views` WRITE;
/*!40000 ALTER TABLE `page_views` DISABLE KEYS */;
/*!40000 ALTER TABLE `page_views` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review_report`
--

DROP TABLE IF EXISTS `review_report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `review_report` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `review_id` int(11) unsigned DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `report_type` enum('SPAM','INAPPROPRIATE') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `review_id` (`review_id`),
  CONSTRAINT `review_report_ibfk_1` FOREIGN KEY (`review_id`) REFERENCES `reviews` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review_report`
--

LOCK TABLES `review_report` WRITE;
/*!40000 ALTER TABLE `review_report` DISABLE KEYS */;
/*!40000 ALTER TABLE `review_report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reviews` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `outlet_id` int(11) unsigned DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `content` longtext,
  `created_at` datetime DEFAULT NULL,
  `email` varchar(50) DEFAULT '',
  `name` varchar(50) DEFAULT NULL,
  `ver_token` char(30) DEFAULT NULL,
  `ip_address` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_outlet` (`outlet_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`outlet_id`) REFERENCES `outlets` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `search_analysis`
--

DROP TABLE IF EXISTS `search_analysis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `search_analysis` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `keyword` varchar(20) DEFAULT NULL,
  `search_count` int(11) DEFAULT NULL,
  `keywords_id` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `keywords_id` (`keywords_id`),
  CONSTRAINT `search_analysis_ibfk_1` FOREIGN KEY (`keywords_id`) REFERENCES `keywords` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `search_analysis`
--

LOCK TABLES `search_analysis` WRITE;
/*!40000 ALTER TABLE `search_analysis` DISABLE KEYS */;
/*!40000 ALTER TABLE `search_analysis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL DEFAULT '',
  `name` varchar(100) NOT NULL DEFAULT '',
  `email` varchar(100) DEFAULT NULL,
  `contact_no` varchar(20) DEFAULT NULL,
  `photo` longblob,
  `rule` enum('ADMIN','BO') NOT NULL DEFAULT 'BO',
  `password_token` char(50) DEFAULT NULL,
  `password_date` datetime DEFAULT NULL,
  `reg_token` char(50) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `2fa_status` tinyint(1) DEFAULT NULL,
  `2fa_key` char(50) NOT NULL DEFAULT '*',
  `ip_address` varchar(20) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `last_login` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'ayya','tsurayya','ayyaa.ats12@gmail.com','081219823417','https://drive.google.com/file/d/1THDHymyd2UNd4s4exdZlYnA5cb6uVMf7/view','BO',NULL,NULL,NULL,NULL,NULL,'*',NULL,NULL,'2018-05-22 09:43:51','2018-05-22 09:45:46');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-05-22 12:00:29
