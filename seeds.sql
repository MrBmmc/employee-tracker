DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;
USE employee_tracker;

CREATE TABLE Department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR (30)NOT NULL,
    PRIMARY KEY (id)
);
CREATE TABLE Role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30)NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES Department(id)

);
CREATE TABLE Employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR (30)NOT NULL,
    role_id INTEGER,
    manager_id INTEGER,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES Role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
    
);


SELECT * FROM Employee;
SELECT * FROM Role;
SELECT * FROM Department;

INSERT INTO Department (name)
VALUES ('Sales'),
       ('Engineering'),
       ('Finance'),
       ('Legal');

-- EMPLOYEE ROLE SEEDS -------
INSERT INTO Role (title, salary, department_id)
VALUE ("Sales Lead", 100000, 1);
INSERT INTO Role (title, salary, department_id)
VALUE ("Salesperson", 80000, 1);
INSERT INTO Role (title, salary, department_id)
VALUE ("Lead Engineer", 150000, 2);
INSERT INTO Role (title, salary, department_id)
VALUE ("Software Engineer", 120000, 2);
INSERT INTO role (title, salary, department_id)
VALUE ("Accountant", 125000, 3);
INSERT INTO role (title, salary, department_id)
VALUE ("Legal Team Lead", 250000, 4);
INSERT INTO role (title, salary, department_id)
VALUE ("Lawyer", 190000, 4);
INSERT INTO role (title, salary, department_id)
VALUE ("Software Engineer", 120000, 2);

-- EMPLOYEE SEEDS -------
INSERT INTO Employee (first_name,last_name,role_id, manager_id)
VALUE 
("John", "Doe", 1, NULL),
("Mike", "Chan", 2, 1),
("Ashley","Rodriguez", 3, NULL),
("Kevin", "Tupik", 4, 3),
("Malia", "Brown", 5, NULL),
("Sarah", "Lourd", 6, 5),
("Tom", "Allen", 7, NULL),
("Tammer", "Galal", 8, 7);

