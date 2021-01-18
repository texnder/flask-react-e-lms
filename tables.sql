-- Adminer 4.7.8 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `administration`;
CREATE TABLE `administration` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(36) NOT NULL,
  `phone` varchar(14) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(10) DEFAULT NULL,
  `user_img` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `application`;
CREATE TABLE `application` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `customer_id` varchar(16) NOT NULL,
  `name` varchar(36) NOT NULL,
  `phone` varchar(14) NOT NULL,
  `Address` text NOT NULL,
  `dob` date NOT NULL,
  `loan_type` varchar(128) NOT NULL,
  `loan_amount` int NOT NULL,
  `loan_term` int NOT NULL,
  `interest_rate` float DEFAULT '18',
  `user_img` text NOT NULL,
  `user_id_num` varchar(16) NOT NULL,
  `user_id_img` text NOT NULL,
  `agent_check` tinyint(1) DEFAULT '0',
  `approved` int DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `customer_id` (`customer_id`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `user_id_num` (`user_id_num`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- 2021-01-17 17:38:58
