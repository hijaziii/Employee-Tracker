use employee_tracker_db;

-- Departments --
insert into departments (department_name) values ("Engineering");
insert into departments (department_name) values ("SALES ");
insert into departments (department_name) values ("Finance");
insert into departments (department_name) values ("Legal");
insert into departments (department_name) values ("None");


-- Roles -- 
insert into roles (title, salary, departmentId) values ("Lead Engineer",140000,1);
insert into roles (title, salary, departmentId) values ("software Engineer",110000,1);
insert into roles (title, salary, departmentId) values ("Sales Lead",100000,2);
insert into roles (title, salary, departmentId) values ("Salesperson",80000,2);
insert into roles (title, salary, departmentId) values ("Accountant",120000,3);
insert into roles (title, salary, departmentId) values ("legal Team Lead",240000,4);
insert into roles (title, salary, departmentId) values ("lawyer",170000,4);
insert into roles (title, salary, departmentId) values ("None",0,5);


-- Employees --
insert into employees (first_name, last_name, role_id, manager_id) values ("Samer","Falkon", 1, null);
insert into employees (first_name, last_name, role_id, manager_id) values ("Sara","Bold", 2, null);
insert into employees (first_name, last_name, role_id, manager_id) values ("John","Zorba",3, null);
insert into employees (first_name, last_name, role_id, manager_id) values ("David","Luka",4, null);
insert into employees (first_name, last_name, role_id, manager_id) values ("Tina","Gala", 2, 1);
insert into employees (first_name, last_name,role_id, manager_id) values ("Cali","Davis", 4, 2);
insert into employees (first_name, last_name, role_id, manager_id) values ("Omar","Rodriguez", 2, 1);
insert into employees (first_name, last_name, role_id, manager_id) values ("Tony","Mati",4,2);
insert into employees (first_name, last_name, role_id, manager_id) values ("Bob","Brown",7,4);
insert into employees (first_name, last_name, role_id) values ("None"," ",8);
