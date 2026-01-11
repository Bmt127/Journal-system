-- ==============================
-- DATABASES
-- ==============================

CREATE DATABASE IF NOT EXISTS journal_users;
CREATE DATABASE IF NOT EXISTS messagedb;
CREATE DATABASE IF NOT EXISTS journaldb;

CREATE USER IF NOT EXISTS 'journal'@'%' IDENTIFIED BY 'journal';

GRANT ALL PRIVILEGES ON journaldb.* TO 'journal'@'%';
GRANT ALL PRIVILEGES ON journal_users.* TO 'journal'@'%';
GRANT ALL PRIVILEGES ON messagedb.* TO 'journal'@'%';

FLUSH PRIVILEGES;

-- ==============================
-- USERS SERVICE
-- ==============================

USE journal_users;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       keycloak_id VARCHAR(255) NOT NULL,
                       username VARCHAR(255),
                       email VARCHAR(255),
                       role VARCHAR(50),
                       patient_id BIGINT,
                       practitioner_id BIGINT
);

-- Keycloak IDs:
-- bemnet  (PATIENT): 63458b40-8d63-4d9b-abee-be3f19062644
-- doctor  (DOCTOR):  be1e10ac-8468-4ec5-a709-52c25fb3233c
-- staff   (STAFF):   7efd97ab-9b8e-481a-bbe4-b7b68a623290

INSERT INTO users (id, keycloak_id, username, email, role, patient_id, practitioner_id) VALUES
                                                                                            (1, '63458b40-8d63-4d9b-abee-be3f19062644', 'bemnet', 'bemnett@kth.se', 'PATIENT', 1, NULL),
                                                                                            (2, 'be1e10ac-8468-4ec5-a709-52c25fb3233c', 'doctor', 'doctor@journal.se', 'DOCTOR', NULL, 1),
                                                                                            (3, '7efd97ab-9b8e-481a-bbe4-b7b68a623290', 'staff', 'staff@journal.se', 'STAFF', NULL, NULL);

-- ==============================
-- JOURNAL SERVICE
-- ==============================

USE journaldb;

DROP TABLE IF EXISTS observations;
DROP TABLE IF EXISTS conditions;
DROP TABLE IF EXISTS patients;
DROP TABLE IF EXISTS practitioners;

CREATE TABLE patients (
                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                          keycloak_id VARCHAR(255),
                          username VARCHAR(255),
                          email VARCHAR(255),
                          first_name VARCHAR(255),
                          last_name VARCHAR(255)
);

CREATE TABLE practitioners (
                               id BIGINT AUTO_INCREMENT PRIMARY KEY,
                               keycloak_id VARCHAR(255),
                               username VARCHAR(255),
                               email VARCHAR(255),
                               first_name VARCHAR(255),
                               last_name VARCHAR(255)
);

CREATE TABLE observations (
                              id BIGINT AUTO_INCREMENT PRIMARY KEY,
                              observation_date DATE,
                              patient_id BIGINT,
                              type VARCHAR(255),
                              value VARCHAR(255)
);

CREATE TABLE conditions (
                            id BIGINT AUTO_INCREMENT PRIMARY KEY,
                            diagnosis VARCHAR(255),
                            notes VARCHAR(255),
                            onset_date DATE,
                            patient_id BIGINT
);

-- PATIENT
INSERT INTO patients (id, keycloak_id, username, email, first_name, last_name)
VALUES (
           1,
           '63458b40-8d63-4d9b-abee-be3f19062644',
           'bemnet',
           'bemnett@kth.se',
           'Bemnet',
           'Tadesse'
       );

-- DOCTOR
INSERT INTO practitioners (id, keycloak_id, username, email, first_name, last_name)
VALUES (
           1,
           'be1e10ac-8468-4ec5-a709-52c25fb3233c',
           'doctor',
           'doctor@journal.se',
           'John',
           'Doe'
       );

-- MEDICAL DATA
INSERT INTO observations (patient_id, type, value, observation_date) VALUES
                                                                         (1, 'Blood Pressure', '120/80 mmHg', CURDATE()),
                                                                         (1, 'Heart Rate', '72 bpm', CURDATE());

INSERT INTO conditions (patient_id, diagnosis, notes, onset_date) VALUES
                                                                      (1, 'Hypertension', 'Patienten har förhöjt blodtryck', '2025-11-15'),
                                                                      (1, 'Asthma', 'Mild ansträngningsutlöst astma', '2024-06-03');
