CREATE DATABASE IF NOT EXISTS log_analysis;

USE log_analysis;

CREATE TABLE IF NOT EXISTS logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME NOT NULL,
    log_level VARCHAR(10),
    source_ip VARCHAR(45),
    message TEXT,
    threat_detected BOOLEAN DEFAULT FALSE
);
