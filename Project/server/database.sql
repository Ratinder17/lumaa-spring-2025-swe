CREATE DATABASE tasksdatabase;

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,                  
  title VARCHAR(255),                      
  description TEXT,                       
  iscomplete BOOLEAN DEFAULT FALSE,       
  user_id INTEGER,                         -
  CONSTRAINT fk_userid FOREIGN KEY (user_id) REFERENCES users(id) 
);


CREATE TABLE users (
  id SERIAL PRIMARY KEY,                 
  username VARCHAR(255) NOT NULL,       
  password VARCHAR(255) NOT NULL,         
);
