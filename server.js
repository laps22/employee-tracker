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
require('console.table');

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
  console.log("⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐");
  console.log("👤 Welcome to the Employee Tracker 👤");
  console.log("⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐");
  menu();
});

// Begin CLI Application

function menu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "select",
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
          console.log(
            "You have ended your session within the 👤 Employee Tracker 👤 "
          );
          db.end();
          break;
      }
    });
}

//Viewing

function viewDept() {
  db.query(`SELECT * FROM employee_departments;`, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    menu();
  });
}

function viewRoles() {
  db.query(`SELECT * FROM employee_roles;`, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    menu();
  });
}

function viewEmployees() {
  db.query(`SELECT * FROM employee;`, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    menu();
  });
}

//Adding

function addDept() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "What is the name of the department?",
      },
    ])
    .then((answer) => {
      db.query(
        `INSERT INTO employee_departments SET ?`,
        answer,
        (err, result) => {
          if (err) {
            console.log(err);
          }
          console.log(
            `${answer.department} has been added to the Department table`
          );
          menu();
        }
      );
    });
}

function addRole() {
  db.query(`SELECT * FROM employee_departments;`, (err, result) => {
    if (err) {
      console.log(err);
    }
    const departmentChoices = result.map(({ department, id }) => ({
      name: department,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "input",
          name: "role_title",
          message: "What is the name of the role?",
        },
        {
          type: "input",
          name: "role_salary",
          message: "What is the salary of the role?",
        },
        {
          type: "list",
          name: "department_id",
          message: "Which department does the role belong to?",
          choices: departmentChoices,
        },
      ])
      .then((answer) => {
        db.query(`INSERT INTO employee_roles SET ?`, answer, (err, result) => {
          if (err) {
            console.log(err);
          }
          console.log(`${answer.role_title} has been added to the Role table`);
          menu();
        });
      });
  });
}

function addEmployee() {
  db.query(`SELECT * FROM employee;`, (err, result) => {
    if (err) {
      console.log(err);
    }
    const roleChoices = result.map(({ role_id, id }) => ({
      name: role_id,
      value: id,
    }));
    const managerChoices = result.map(({ first_name, last_name, id }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "input",
          name: "first_name",
          message: "What is the employees first name?",
        },
        {
          type: "input",
          name: "last_name",
          message: "What is the employees last name?",
        },
        {
          type: "list",
          name: "role_id",
          message: "What is the employees role?",
          choices: roleChoices,
        },
        {
          type: "list",
          name: "employee_manager_id",
          message: "Who is the employees Manager?",
          choices: managerChoices,
        },
      ])
      .then((answer) => {
        db.query(`INSERT INTO employee SET ?`, answer, (err, result) => {
          if (err) {
            console.log(err);
          }
          console.log(
            `${
              answer.first_name + " " + answer.last_name
            } has been added to the database`
          );
          menu();
        });
      });
  });
}

// Update Employee

function updateRole() {
  db.query(`SELECT * FROM employee;`, (err, result) => {
    if (err) {
      console.log(err);
    }
    const employees = result.map(({ first_name, last_name, id }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));
    const roles = result.map(({ role_title, role_id }) => ({
      name: role_title,
      value: role_id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "id",
          message: "Which employees role do you want to update?",
          choices: employees,
        },
        {
          type: "list",
          name: "role_id",
          message: "Which role do you want to assign the selected employee?",
          choices: roles,
        },
      ])
      .then((answer) => {
        db.query(`UPDATE employee SET role_id`, answer, (err, result) => {
          if (err) {
            console.log(err);
          }
          console.log('Updated employees role');
          menu();
        });
      });
  });
};
