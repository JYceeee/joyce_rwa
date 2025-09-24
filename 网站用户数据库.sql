Create database rwa;
USE rwa;  
CREATE TABLE user (
    user_id VARCHAR(18),         
    user_email VARCHAR(255) PRIMARY KEY, 
    user_password VARCHAR(100) NOT NULL,     
    user_name VARCHAR(10),                   
    user_phone VARCHAR(11)                 
);
