// GIVEN a command-line application that accepts user input
// WHEN I start the application
// THEN I am presented with the following options:
// view all departments,
// view all roles,
// view all employees,
// add a department,
// add a role,
// add an employee,
// and update an employee role

// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids

// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role

// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database

// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database

// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database

// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database

const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "password",
    database: "employees_db",
  },
  console.log(`Connected to the employees_db database.`)
);

db.connect(function (err) {
  if (err) throw err;
  console.log("⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐");
  console.log("👤 Welcome to the Employee Tracker 👤");
  console.log("⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐");
  menu();
});

// Begin CLI Application

function menu() {
  inquirer
    .createPromptModule([
      {
        type: "list",
        name: "Options",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "Add Employee",
          "Update Employee Role",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
          "Quit",
        ],
      },
    ])
    .then((selected) => {
      switch (selected.select) {
        case "View All Employees":
          viewEmployees();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Update Employee":
          updateEmployee();
          break;
        case "Update Employee Role":
          updateRole();
          break;
        case "View All Roles":
          viewRoles();
          break;
        case "Add Role":
          addRole();
          break;
        case "View All Departments":
          viewDept();
          break;
        case "Add Department":
          addDept();
          break;
        case "Quit":
          console.log("You have ended your session within the 👤 Employee Tracker 👤 ");
          db.end();
          break;
      }
    });
}


function addDept(){
    inquirer.prompt([
        {
            type: 'input',
            name: 'dept',
            message: 'What is the name of the department?',
        },
        console.log('Added' + answer.dept + 'to the database'),
        menu(),
    ]);

};

function addRole(){
    inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: 'What is the name of the role?',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the role?',
        },
        {
            type: 'select',
            name: 'department',
            message: 'Which department does the role belong to?',
            choices: [],
        },
        console.log('Added' + answer.role + 'to the database'),
        menu(),
    ]);
};

function addEmployee(){
    inquirer.prompt([
        {
            type: 'input',
            name: 'first',
            message: 'What is the employees first name?',
        },
        {
            type: 'input',
            name: 'last',
            message: 'What is the employees last name?',
        },
        {
            type: 'select',
            name: 'departments',
            message: 'What is the employees role?',
            choices: ,
        },
        {
            type: 'select',
            name: 'Manager',
            message: 'Who is the employees Manager?',
            choices: ,
        },
        console.log('Added employee to the database'),
        console.log('Added' + answer.first + " " + answer.last +'to the database'),
        menu(),
    ]);
};