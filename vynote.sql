SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;


CREATE TABLE `documents` (
  `user_id` int(11) UNSIGNED NOT NULL,
  `doc_type` tinyint(4) NOT NULL,
  `doc_id` int(11) UNSIGNED NOT NULL,
  `folder_id` int(11) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `encrypt` varchar(6) NOT NULL,
  `created` int(10) UNSIGNED NOT NULL,
  `syntax` tinyint(3) UNSIGNED NOT NULL,
  `color` tinyint(3) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `document_changes` (
  `doc_id` int(11) UNSIGNED NOT NULL,
  `version` bigint(13) NOT NULL,
  `change_object` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `document_content` (
  `doc_id` int(11) UNSIGNED NOT NULL,
  `content` mediumtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `document_contributors` (
  `doc_id` int(11) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED NOT NULL,
  `folder_id` int(11) UNSIGNED NOT NULL,
  `encrypt` varchar(6) NOT NULL,
  `can_write` tinyint(1) NOT NULL,
  `can_delete` tinyint(1) NOT NULL,
  `can_update` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `document_versions` (
  `doc_id` int(11) UNSIGNED NOT NULL,
  `name` varchar(20) NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `content` mediumtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `folders` (
  `user_id` int(11) UNSIGNED NOT NULL,
  `parent_id` int(11) UNSIGNED NOT NULL,
  `folder_id` int(11) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `color` tinyint(3) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `shortcuts` (
  `user_id` int(11) UNSIGNED NOT NULL,
  `name` varchar(15) NOT NULL,
  `content` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `users` (
  `xyfir_id` varchar(64) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `user_id` int(11) UNSIGNED NOT NULL,
  `email` varchar(64) NOT NULL,
  `config` text NOT NULL,
  `subscription` bigint(13) NOT NULL COMMENT 'Unix timestamp of when the user''s subscription expires'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


ALTER TABLE `documents`
  ADD PRIMARY KEY (`doc_id`),
  ADD KEY `fk_document` (`user_id`),
  ADD KEY `fk_folder` (`folder_id`);

ALTER TABLE `document_changes`
  ADD UNIQUE KEY `change` (`doc_id`,`version`);

ALTER TABLE `document_content`
  ADD KEY `fk_document` (`doc_id`);

ALTER TABLE `document_contributors`
  ADD UNIQUE KEY `doc_id` (`doc_id`,`user_id`),
  ADD KEY `fk_folder` (`folder_id`),
  ADD KEY `fk_user` (`user_id`);

ALTER TABLE `document_versions`
  ADD UNIQUE KEY `doc_id` (`doc_id`,`name`);

ALTER TABLE `folders`
  ADD PRIMARY KEY (`folder_id`),
  ADD KEY `fk_user` (`user_id`),
  ADD KEY `fk_parent_folder` (`parent_id`);

ALTER TABLE `shortcuts`
  ADD UNIQUE KEY `shortcut` (`user_id`,`name`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);


ALTER TABLE `documents`
  MODIFY `doc_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;
ALTER TABLE `folders`
  MODIFY `folder_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
ALTER TABLE `users`
  MODIFY `user_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `documents`
  ADD CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `documents_ibfk_2` FOREIGN KEY (`folder_id`) REFERENCES `folders` (`folder_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `document_changes`
  ADD CONSTRAINT `document_changes_ibfk_1` FOREIGN KEY (`doc_id`) REFERENCES `documents` (`doc_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `document_content`
  ADD CONSTRAINT `document_content_ibfk_1` FOREIGN KEY (`doc_id`) REFERENCES `documents` (`doc_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `document_contributors`
  ADD CONSTRAINT `document_contributors_ibfk_1` FOREIGN KEY (`doc_id`) REFERENCES `documents` (`doc_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `document_contributors_ibfk_2` FOREIGN KEY (`folder_id`) REFERENCES `folders` (`folder_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `document_contributors_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `document_versions`
  ADD CONSTRAINT `document_versions_ibfk_1` FOREIGN KEY (`doc_id`) REFERENCES `documents` (`doc_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `folders`
  ADD CONSTRAINT `folders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `shortcuts`
  ADD CONSTRAINT `shortcuts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
