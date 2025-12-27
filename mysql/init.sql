CREATE DATABASE IF NOT EXISTS journal_users;
CREATE DATABASE IF NOT EXISTS messagedb;
CREATE DATABASE IF NOT EXISTS journaldb;

CREATE USER IF NOT EXISTS 'journal'@'%' IDENTIFIED BY 'journal';
GRANT ALL PRIVILEGES ON journaldb.* TO 'journal'@'%';
GRANT ALL PRIVILEGES ON journal_users.* TO 'journal'@'%';
GRANT ALL PRIVILEGES ON messagedb.* TO 'journal'@'%';

FLUSH PRIVILEGES;
