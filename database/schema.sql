-- ---
-- Table 'reservations'
-- 
-- ---

DROP DATABASE IF EXISTS reservations;
CREATE DATABASE reservations;
USE reservations;

CREATE TABLE IF NOT EXISTS reservations (
  id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nights INTEGER NOT NULL,
  guests INTEGER NOT NULL,
  price INTEGER NOT NULL,
  startDate INTEGER NOT NULL,
  endDate INTEGER NOT NULL,
  homeId INTEGER NOT NULL
);
