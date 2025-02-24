
   - Steps to set up the database (migrations, environment variables)
     Install Postgres and setup a database as follows:
     
     CREATE DATABASE tasksdatabase;

     CREATE TABLE tasks (
     id SERIAL PRIMARY KEY,                  
     title VARCHAR(255),                      
     description TEXT,                       
     iscomplete BOOLEAN DEFAULT FALSE,       
     user_id INTEGER,                         
     CONSTRAINT fk_userid FOREIGN KEY (user_id) REFERENCES users(id) 
     );


     CREATE TABLE users (
     id SERIAL PRIMARY KEY,                 
     username VARCHAR(255) NOT NULL,       
     password VARCHAR(255) NOT NULL,         
     );

     Then make required changes to db.js file in project
        const { Pool } = require("pg");
        const pool = new Pool({
        user: "your_postgresql_username", 
        host: "localhost",   
        port: 5432,                      
        database: "tasksdatabase",        
        password: "your_password",       
      });
      Module.exports = pool;

  
   - How to run the backend.
     Navigate to Project Directory in terminal and run the following command:
     node server
   - How to run the frontend.
     Navigate to client folder in Project and run the following command:
     npm start

     
   - Salary Expectations per month (Mandatory) - 25/hr

. **Short Video Demo**
   - LINK - https://drive.google.com/file/d/14y42PYm-rtG00Lt7gCkqDDyvxtJQu6z4/view?usp=sharing
