const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const util = require("util");

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "employee_tracker_db"
});

connection.queryPromise = util.promisify(connection.query);
// connect to the mysql server and sql database
// Inquirer prompt and promise
const askeQuestions = function () {
  inquirer
    .prompt({
      type: "list",
      name: "startQuestions",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Roles",
        "View All Departments",
        "Add Employee",
        "Remove Employee",
        "Add Department",
        "Remove Department",
        "Add Role",
        "Remove Role",
        "Update Employee Role",
        "Update Employee Manager",
        "View The Total Utilized Budget of All Departments"


      ]
    })
    .then(function (answer) {
      //console.log(answer);
      // start of switch statment for user choice
      switch (answer.startQuestions) {

        case "View All Employees":
          viewEmployees();
          break;

        case "View All Roles":
          viewRoles();
          break;

        case "View All Departments":
          viewDepartments();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Remove Employee":
          removeEmployee();
          break;

        case "Add Department":
          addDepartment();
          break;

        case "Remove Department":
          removeDepartment();
          break;

        case "Add Role":
          addRole();
          break;

        case "Remove Role":
          removeRole();
          break;

        case "Update Employee Role":
          updateEmployeeRole();
          break;

        case "Update Employee Manager":
          updateEmployeeManager();
          break;

        case "View The Total Utilized Budget of All Departments":
          viewDepartmentsBudget();
          break;
      }
    });
};
askeQuestions();


// View all employees.
function viewEmployees() {
  // console.log(`Selecting all Employees...\n`);
  connection.query("SELECT  e.ID, e.First_Name, e.Last_Name, r.Title," +
    'r.Salary ,d.Department_Name,concat(m.first_name , (" "), m.last_name) As Manager ' +
    "from employees e  left join employees m on m.id = e.manager_id" +
    " join roles r  join departments d on  r.departmentId = d.id and e.role_id = r.id where  e.first_name != 'None'", (err, res) => {
      if (err) throw err;
      // console.log(res);
      console.table(res);
      askeQuestions();
    });
}

// View all roles.
function viewRoles() {

  // console.log(`Selecting all roles...\n`);
  connection.query(`SELECT * FROM roles where title !='None'`, (err, res) => {
    if (err) throw err;
    // Log all roles of the SELECT statement
    // console.log(res);
    console.table(res);

    askeQuestions();
  });
}

//  View all departments.
function viewDepartments() {
  // console.log(`Selecting all departments...\n`);
  connection.query(`SELECT * FROM departments where department_name != 'None'`, (err, res) => {
    if (err) throw err;
    // console.log(res);
    console.table(res);

    askeQuestions();
  });
}

// Add Employee.
async function addEmployee() {
  try {
    const employee = await inquirer.prompt([
      {
        message: 'Please enter the employee\'s first name: ',
        name: 'firstName',
        type: 'input',
      },
      {
        message: 'Please enter the employee\'s last name: ',
        name: 'lastName',
        type: 'input',
      },
    ])

    let roles = await connection.queryPromise(`SELECT * FROM roles`);
    roles = roles.map(role => ({
      name: role.title,
      value: role.id
    }))


    const chosenRole = await inquirer.prompt({
      message: 'Please enter the role of the employee',
      name: 'roleId',
      type: 'list',
      choices: roles,
    })

    let employees = await connection.queryPromise('SELECT * FROM employees');
    employees = employees.map(employee => {
      return {
        name: `${employee.id} ${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      }
    });

    const manager = await inquirer.prompt({
      message: 'Please enter the employee\'s manager',
      type: 'list',
      choices: employees,
      name: 'managerId'
    });

    await connection.queryPromise('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [
      employee.firstName,
      employee.lastName,
      chosenRole.roleId,
      manager.managerId,
    ])
  }
  catch (err) {
    console.log(err);
  }

  askeQuestions();
}

// Remove Employee.
async function removeEmployee() {

  let employees = await connection.queryPromise('SELECT * FROM employees');
  employees = employees.map(employee => {
    return {
      name: `${employee.id} ${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }
  });

  const emp = await inquirer.prompt({
    message: 'Please remove employee',
    type: 'list',
    choices: employees,
    name: 'empId'
  });

  await connection.queryPromise(`DELETE FROM employees WHERE id = ?`, emp.empId);

  askeQuestions();
}

// Add Department.
async function addDepartment() {
  try {
    const addDepartment = await inquirer.prompt([
      {
        message: 'Please add department: ',
        name: 'departmentId',
        type: 'input',
      },
    ])

    await connection.queryPromise('INSERT INTO departments (department_name) VALUES (?)', addDepartment.departmentId);
  }
  catch (err) {
    console.log(err);
  }

  askeQuestions();
}

// Remove Department.
async function removeDepartment() {
  let departments = await connection.queryPromise('SELECT * FROM departments');
  departments = departments.map(department => {
    return {
      name: `${department.id} ${department.department_name}`,
      value: department.id,
    }
  });

  const removeDepartment = await inquirer.prompt({
    message: 'Please remove department',
    type: 'list',
    choices: departments,
    name: 'departmentId',
  });

  await connection.queryPromise(`DELETE FROM departments WHERE id = ?`, removeDepartment.departmentId);

  askeQuestions();
}

// Add Role.
async function addRole() {
  try {
    const addTitle = await inquirer.prompt([
      {
        message: 'Please add role: ',
        name: 'title',
        type: 'input',
      },
    ])

    const addSalary = await inquirer.prompt([
      {
        message: 'Please add salary: ',
        name: 'salary',
        type: 'input',
      },
    ])

    const addDepartmentId = await inquirer.prompt([
      {
        message: 'Please add departmentId: ',
        name: 'departmentId',
        type: 'input',
      },
    ])

    await connection.queryPromise('INSERT INTO roles (title, salary, departmentId) VALUES (?, ?, ?)', [
      addTitle.title,
      addSalary.salary,
      addDepartmentId.departmentId,

    ])

  }
  catch (err) {
    console.log(err);
  }

  askeQuestions();
}

// Remove Role.
async function removeRole() {
  let roles = await connection.queryPromise('SELECT * FROM roles');
  roles = roles.map(role => {
    return {
      name: `${role.id} ${role.title} `,
      value: role.id,
    }
  });

  const removeRole = await inquirer.prompt({
    message: 'Please remove role',
    type: 'list',
    choices: roles,
    name: 'role',
  });

  await connection.queryPromise(`DELETE FROM roles WHERE id = ?`, removeRole.role);


  askeQuestions();
}

// Update Employee Role.
async function updateEmployeeRole() {
  try {
    let employees = await connection.queryPromise('select * from employees');
    employees = employees.map(employee => {
      return {
        name: ` ${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      }
    });

    const emp = await inquirer.prompt({
      message: 'Choose employee you want to update role: ',
      type: 'list',
      choices: employees,
      name: 'empId'
    });
    console.log(emp.empId);
    let roles = await connection.queryPromise('select * from roles');
    roles = roles.map(role => {
      return {
        name: `${role.title}`,
        value: role.id,
      }
    });

    const addNewRole = await inquirer.prompt({
      message: 'Please choose  your new employee role',
      type: 'list',
      choices: roles,
      name: 'role',
    });

    console.log(addNewRole.role);

    await connection.queryPromise(`update employees set role_id = ? WHERE id =?`,
      [
        addNewRole.role,
        emp.empId,


      ]);
  }
  catch (err) {
    console.log(err);
  }
  askeQuestions();
}

// Update employee manager.
async function updateEmployeeManager() {
  try {
    let employees = await connection.queryPromise('select * from employees');
    employees = employees.map(employee => {
      return {
        name: ` ${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      }
    });

    const emp = await inquirer.prompt({
      message: 'Choose employee you want to update manager: ',
      type: 'list',
      choices: employees,
      name: 'empId'
    });

    let managers = await connection.queryPromise('select * from employees');
    managers = managers.map(manager => {
      return {
        name: `${manager.first_name} ${manager.last_name}`,
        value: manager.id,
      }
    });

    const addNewManager = await inquirer.prompt({
      message: 'Please choose  your new employee manager',
      type: 'list',
      choices: managers,
      name: 'manager',
    });


    await connection.queryPromise(`update employees set manager_id = ? WHERE id =?`,
      [
        addNewManager.manager,
        emp.empId,


      ]);
  }
  catch (err) {
    console.log(err);
  }
  askeQuestions();
}

// View The Total Utilized Budget of All Department.
function viewDepartmentsBudget() {
  // console.log(`Selecting all departments...\n`);
  connection.query(`SELECT d.department_name ,sum(r.salary) FROM employees e LEFT JOIN roles r on e.role_id = r.id JOIN ` + `departments d on d.id=r.departmentId where d.department_name !='None' GROUP BY d.department_name `, (err, res) => {
    if (err) throw err;
    // console.log(res);
    console.table(res);

    askeQuestions();
  });
}
