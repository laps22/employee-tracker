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
          "Remove Employee",
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
        case "Remove Employee":
          removeEmployee();
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
  db.query(`SELECT r.id, r.role_title, r.role_salary, d.department
  FROM employee_roles r
  INNER JOIN employee_departments d ON r.department_id = d.id;`, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    menu();
  });
}

function viewEmployees() {
  db.query(`SELECT e.id, e.first_name, e.last_name, r.role_title, d.department, r.role_salary, CONCAT(m.first_name, ' ', m.last_name) AS Manager 
  FROM employee e
  LEFT JOIN employee_roles r ON e.role_id = r.id
  LEFT JOIN employee_departments d ON r.department_id = d.id
  LEFT JOIN employee m ON e.employee_manager_id = m.id;`,
    (err, result) => {
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
  db.query(`SELECT e.*, r.role_title FROM employee e LEFT JOIN employee_roles r ON e.role_id = r.id;`, (err, result) => {
    if (err) {
      console.log(err);
    }
    const roleChoices = result.map(({ id, role_title }) => ({
      name: role_title,
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
            `${answer.first_name + " " + answer.last_name
            } has been added to the database`
          );
          menu();
        });
      });
  });
}


// Update Employee
function updateRole() {
  db.query(
    `SELECT e.id, e.first_name, e.last_name, r.role_title, r.id AS role_id
     FROM employee e
     INNER JOIN employee_roles r ON e.role_id = r.id;`,
    (err, result) => {
      if (err) {
        console.log(err);
      }
      const employees = result.map(({ first_name, last_name, id }) => ({
        name: `${first_name} ${last_name}`,
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
            message: "Which employee's role do you want to update?",
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
          db.query(
            `UPDATE employee SET role_id = ${answer.role_id} WHERE id = ${answer.id}`,
            (err, result) => {
              if (err) {
                console.log(err);
              }
              console.log("Updated employee's role");
              menu();
            }
          );
        });
    }
  );
}


// Removing (Deleting)


function removeEmployee() {
  db.query(`SELECT * FROM employee;`, (err, result) => {
    if (err) {
      console.log(err);
    }
    const employees = result.map(({ first_name, last_name, id }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "id",
          message: "Which employee do you want to delete?",
          choices: employees,
        },
        {
          type: "confirm",
          name: "confirmDelete",
          message: "Are you sure you want to delete this employee?",
        },
      ])
      .then((answer) => {
        if (answer.confirmDelete) {
          db.query(`DELETE FROM employee WHERE id = ?`, [answer.id], (err, result) => {
            if (err) {
              console.log(err);
            }
            console.log("Employee has been removed from the database");
            menu();
          });
        } else {
          menu();
        };
      });
  });
}
