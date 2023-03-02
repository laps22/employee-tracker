DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE employee_departments (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    department VARCHAR(30) NOT NULL
);

CREATE TABLE employee_roles (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    role_title VARCHAR(30) NOT NULL,
    role_salary DECIMAL NOT NULL, 
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) 
    REFERENCES employee_departments(id)
    
);

CREATE TABLE employee (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    employee_manager_id INT,
    FOREIGN KEY (employee_manager_id) REFERENCES employee (id), 
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES employee_roles(id)
);