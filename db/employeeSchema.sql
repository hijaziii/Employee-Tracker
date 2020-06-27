drop database if exists employee_tracker_db;

create database employee_tracker_db;

use employee_tracker_db;

create table departments (
   id integer not null auto_increment,
   department_name varchar(30) not null,
   primary key(id)
);




create table roles (
id integer not null auto_increment,
title varchar(30) not null,
salary decimal(9,2) not null,
departmentId integer,
primary key(id),
foreign key (departmentId) references departments(id)
);




create table employees (
id integer not null auto_increment,
first_name varchar(30) not null,
last_name varchar(30) not null,
role_id integer,
manager_id integer,
primary key(id),
foreign key (role_id) references roles(id),
foreign key (manager_id) references employees(id)
);

