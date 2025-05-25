-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- HOST： 127.0.0.1
-- EXPORTED DATE： 2023-07-31 14:06:09
-- SERVER VERSION： 10.4.28-MariaDB
-- PHP VERSION： 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- database： `db`
--

DELIMITER $$
--
-- function
--
CREATE DEFINER=`root`@`localhost` FUNCTION `URLDECODE` (`original_text` TEXT CHARSET utf8mb4) RETURNS TEXT CHARSET utf8mb4 COLLATE utf8mb4_general_ci  BEGIN  
    DECLARE new_text TEXT DEFAULT NULL;  
    DECLARE pointer INT DEFAULT 1;  
    DECLARE end_pointer INT DEFAULT 1;  
    DECLARE encoded_text TEXT DEFAULT NULL;  
    DECLARE result_text TEXT DEFAULT NULL;  
    DECLARE rep_text TEXT DEFAULT NULL;  
    DECLARE unhex_text TEXT DEFAULT NULL;  
   
    SET new_text = REPLACE(original_text,'+',' ');  
    SET new_text = REPLACE(new_text,'%0A','\r\n');  
   
    SET pointer = LOCATE('%', new_text);  
    WHILE pointer <> 0 && pointer < (CHAR_LENGTH(new_text) - 2) DO  
        SET end_pointer = pointer + 3;  
        WHILE MID(new_text, end_pointer, 1) = '%' DO  
            SET end_pointer = end_pointer+3;  
        END WHILE;  
   
        SET encoded_text = MID(new_text, pointer, end_pointer - pointer);  
		SET rep_text = REPLACE(encoded_text, '%', '');
		SET unhex_text = UNHEX(rep_text);
        SET result_text = CONVERT(unhex_text USING utf8mb4);  
        SET new_text = REPLACE(new_text, encoded_text, result_text);  
        SET pointer = LOCATE('%', new_text, pointer + CHAR_LENGTH(result_text)); 
				
    END WHILE;  
   
    RETURN new_text;  
  
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `URLENCODE` (`str` VARCHAR(4096) CHARSET utf8mb4) RETURNS VARCHAR(4096) CHARSET utf8mb4 COLLATE utf8mb4_general_ci  BEGIN
  DECLARE sub VARCHAR(1) CHARSET utf8mb4;
  DECLARE val BIGINT DEFAULT 0;
  DECLARE ind INT DEFAULT 1;
  DECLARE oct INT DEFAULT 0;
  DECLARE ret VARCHAR(4096) DEFAULT '';
  DECLARE octind INT DEFAULT 0;
  IF str is NULL THEN
      RETURN NULL;
  ELSE SET ret = '';
      WHILE ind <= CHAR_LENGTH(str) DO
        SET sub = MID(str, ind, 1);
        SET val = ORD(sub);
        IF NOT (val BETWEEN 48 AND 57 OR 
                val BETWEEN 65 AND 90 OR 
                val BETWEEN 97 AND 122 OR 
                val IN (45, 46, 95, 126)) THEN
            SET octind = OCTET_LENGTH(sub);
            WHILE octind > 0 DO
              SET oct = (val >> (8 * (octind - 1)));
              SET ret = CONCAT(ret, '%', LPAD(HEX(oct), 2, 0));
              SET val = (val & (POWER(256, (octind - 1)) - 1));
              SET octind = (octind - 1);
            END WHILE;
        ELSE
          SET ret = CONCAT(ret, sub);
        END IF;
        SET ind = (ind + 1);
    END WHILE;
  END IF;
  RETURN ret;
END$$

DELIMITER ;


CREATE TABLE `aplinfo` (
  `aplid` int(11) NOT NULL,
  `bookid` int(11) NOT NULL,
  `translator` text NOT NULL,
  `publish` text NOT NULL,
  `ISBN` text NOT NULL,
  `lang` text NOT NULL,
  `price` float NOT NULL,
  `usrid` text NOT NULL,
  `quality` text NOT NULL,
  `images` text NOT NULL,
  `aplSta` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `aurinfo` (
  `aurid` int(11) NOT NULL,
  `names` text NOT NULL,
  `picpath` text NOT NULL,
  `contents` text NOT NULL,
  `search_index` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `bklinfo` (
  `bklid` int(11) NOT NULL,
  `label` text NOT NULL,
  `bookid` text NOT NULL,
  `names` text NOT NULL,
  `creator` text NOT NULL,
  `creator_id` text NOT NULL,
  `date` int(11) NOT NULL,
  `fatpic` text NOT NULL,
  `picpath` text NOT NULL,
  `contents` text NOT NULL,
  `search_index` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `bokinfo` (
  `bookid` int(11) NOT NULL,
  `authorid` text NOT NULL,
  `label` text NOT NULL,
  `names` text NOT NULL,
  `picpath` text NOT NULL,
  `contents` text NOT NULL,
  `search_index` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `coninfo` (
  `conid` int(255) UNSIGNED NOT NULL,
  `contributor` text NOT NULL,
  `ip` text NOT NULL,
  `date` int(255) NOT NULL,
  `object` text NOT NULL,
  `status` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `dlvinfo` (
  `dlvid` int(11) NOT NULL,
  `aplid` int(11) NOT NULL,
  `fromUsrid` text NOT NULL,
  `toUsrid` text NOT NULL,
  `bookid` int(11) NOT NULL,
  `rcpt_info` text NOT NULL,
  `sent_info` text NOT NULL,
  `date` int(11) NOT NULL,
  `dateSent` int(11) NOT NULL,
  `dateReceived` int(11) NOT NULL,
  `uid` text NOT NULL,
  `evaid` text NOT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  `returnStatus` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `evainfo` (
  `evaid` int(11) NOT NULL,
  `dlvid` int(11) NOT NULL,
  `usrid` text NOT NULL,
  `bookid` int(11) NOT NULL,
  `usrname` text NOT NULL,
  `contents` text NOT NULL,
  `evanum` int(11) NOT NULL,
  `confirmed` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `fbkinfo` (
  `fbkid` int(11) NOT NULL,
  `content` text NOT NULL,
  `location` text NOT NULL,
  `date` int(11) NOT NULL,
  `contributor` text NOT NULL,
  `ip` text NOT NULL,
  `status` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `lblinfo` (
  `labelid` int(11) NOT NULL,
  `label_name` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `msginfo` (
  `msgid` int(11) NOT NULL,
  `innerHTML` text NOT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `trsinfo` (
  `trsid` int(11) NOT NULL,
  `fromUsrid` text NOT NULL,
  `toUsrid` text NOT NULL,
  `date` int(11) NOT NULL,
  `content` text NOT NULL,
  `value` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `usrinfo` (
  `usrid` text NOT NULL,
  `nickname` text NOT NULL,
  `email` text NOT NULL,
  `email_news` text NOT NULL,
  `time` text NOT NULL,
  `coins` double NOT NULL,
  `deliver_info` text NOT NULL,
  `receipt_info` text NOT NULL,
  `noSellTermMsg` tinyint(1) NOT NULL DEFAULT 0,
  `cart` text NOT NULL,
  `pwd` text NOT NULL,
  `blockInfo` text DEFAULT '0',
  `admStatus` text DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


ALTER TABLE `aplinfo`
  ADD PRIMARY KEY (`aplid`);

ALTER TABLE `aurinfo`
  ADD PRIMARY KEY (`aurid`);

ALTER TABLE `bklinfo`
  ADD PRIMARY KEY (`bklid`);

ALTER TABLE `bokinfo`
  ADD PRIMARY KEY (`bookid`);

ALTER TABLE `coninfo`
  ADD PRIMARY KEY (`conid`);

ALTER TABLE `dlvinfo`
  ADD PRIMARY KEY (`dlvid`);

ALTER TABLE `evainfo`
  ADD PRIMARY KEY (`evaid`);

ALTER TABLE `fbkinfo`
  ADD PRIMARY KEY (`fbkid`);

ALTER TABLE `lblinfo`
  ADD PRIMARY KEY (`labelid`);

ALTER TABLE `msginfo`
  ADD PRIMARY KEY (`msgid`);

ALTER TABLE `trsinfo`
  ADD PRIMARY KEY (`trsid`);

ALTER TABLE `aplinfo`
  MODIFY `aplid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

ALTER TABLE `aurinfo`
  MODIFY `aurid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `bklinfo`
  MODIFY `bklid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `bokinfo`
  MODIFY `bookid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

ALTER TABLE `coninfo`
  MODIFY `conid` int(255) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

ALTER TABLE `dlvinfo`
  MODIFY `dlvid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

ALTER TABLE `evainfo`
  MODIFY `evaid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `fbkinfo`
  MODIFY `fbkid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `lblinfo`
  MODIFY `labelid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=125;

ALTER TABLE `msginfo`
  MODIFY `msgid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

ALTER TABLE `trsinfo`
  MODIFY `trsid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
