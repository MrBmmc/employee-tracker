const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'nono',
  database: 'employee_tracker',
})

connection.connect((err) => {
  if (err) throw err;
  console.log(`
  -----------------------------------------------------------
  |    _____                 _                              |
  |   | ____|_ __ ___  _ __ | | ___  _   _  ___  ___        |
  |   | _|  | '_ ' _ \| '  \| |/ _ \| | | |/ _ \/ _ \       |
  |   | |___| | | | | | |_) | | (_) | |_| |  __/  __/       |
  |   |_____|_| |_| |_| .__/|_|\_._/\___, |\___|\___|       |
  |                   |_|                                   |
  |    __  __                                               |
  |   |  \/  | __ _ _ __   __ _  __ _  ___ _  __            |
  |   | |\/| |/  ' | '_ \ /  ' |/ _' |/ _ \ ' __|           |
  |   | |  | | (_| | | | | (_| | (_| |  __/  |              |
  |   |_|  |_|\__,_|_| |_|\__,_|\__| |\____|_|              |
  |                             |___/                       |
  |                                                         |
  ,_________________________________________________________,
  
`);



  const mainMenu = () => {
    inquirer.prompt({
      name: 'mainMenu',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View all Employees',
        'View all Departments',
        'View all Roles',
        'Add Employee',
        'Add Department',
        'Add Role',
        'Remove Employee',
        'Remove Department',
        'Update Employee Role',
        'Exit'
      ]
    })
      .then((answer) => {
        switch (answer.mainMenu) {
          case 'View all Employees':
            viewEmployees();
            break;
          case 'View all Departments':
            viewDepartments();
            break;
          case 'View all Roles':
            viewRoles();
            break;
          case 'Add Employee':
            addEmployee();
            break;
          case 'Add Department':
            addDepartment();
            break;
          case 'Add Role':
            addRole();
            break;
          case 'Remove Employee':
            removeEmployee();
            break;
          case 'Remove Department':
            removeDepartment();
            break;
          case 'Update Employee Role':
            updateEmployeeRole();
            break;
          case 'Exit':
            connnection.end();
            break;
        }
      })
  };

  mainMenu();

  const viewEmployees = () => {
    let query = 'SELECT * FROM Employee';
    connection.query(query, (err, res) => {
      if (err) throw err;
      console.log(res.length + ' employees found!');
      console.table('All Employees;', res);
      mainMenu();
    })
  };
  const viewDepartments = () => {
    let query = 'SELECT * FROM Department';
    connection.query(query, (err, res) => {
      if (err) throw err;
      console.table('All Departments:', res);
      mainMenu();
    })
  };
  const viewRoles = () => {
    let query = 'SELECT * FROM Role';
    connection.query(query, (err, res) => {
      if (err) throw err;
      console.table('All Roles:', res);
      mainMenu();
    })
  };
  const addEmployee = () => {
    inquirer
      .prompt([
        {
          message: 'Enter first name of new employee:',
          type: 'input',
          name: 'employeeFirstName',
        },
        {
          message: 'Enter last name of new employee:',
          type: 'input',
          name: 'employeeLastName',
        },
        {
          message: 'Enter Role ID of new employee:',
          type: 'input',
          name: 'employeeRole',
        },
        {
          message: 'Enter Manager ID of new employee:',
          type: 'input',
          name: 'employeeManagerId',
        },
      ])
      .then(answer => {
        connection.query(
          'INSERT INTO employee SET ?',
          {
            first_name: answer.employeeFirstName,
            last_name: answer.employeeLastName,
            role_id: answer.employeeRole,
            manager_id: answer.employeeManagerId,
          },
          function (err, res) {
            if (err) throw err;
            console.log(
              `You have added ${answer.employeeFirstName} ${answer.employeeLastName} in the employee database.`
            );
            mainMenu();
          }
        );
      });
  };

  const removeEmployee = () => {
    const employeeArray = [];
    connection.query(
      `SELECT CONCAT (employee.id, ': ', employee.first_name, ' ', employee.last_name) as employee FROM Employee`,
      (err, res) => {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
          employeeArray.push(res[i].employee);
        }

        inquirer
          .prompt([
            {
              name: 'remove',
              message: 'Please Select Employee to be Removed.',
              type: 'list',
              choices: employeeArray,
            }]
          )
          .then(answers => {
            const employeeIdToDelete = answers.remove.split(':')[0];

            connection.query(
              `UPDATE Employee SET manager_id = NULL WHERE manager_id = ${employeeIdToDelete}`,

              (err, res) => {

                if (err) throw err;
                connection.query(
                  `DELETE FROM Employee WHERE id = ${employeeIdToDelete}`,
                  (err, res) => {
                    if (err) throw err;
                    console.log(`You have successfully Deleted and Employee`);
                    mainMenu();
                  }
                )

              }
            );
          }
          );
      });
  };

  const removeDepartment = () => {
    const departmentArray = [];
    connection.query(
      `SELECT CONCAT (department.id, ': ', department.name) as department FROM Department`,
      (err, res) => {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
          departmentArray.push(res[i].department);
        }
        inquirer
          .prompt([
            {
              name: 'remove',
              message: 'Please Select Department to be Removed.',
              type: 'list',
              choices: departmentArray,
            }]
          )
          .then(answers => {
            const departmentIdToDelete = answers.remove.split(':')[0];

            connection.query(
              `UPDATE Role SET department_id = NULL WHERE department_id = ${departmentIdToDelete}`,

              (err, res) => {

                if (err) throw err;
                connection.query(
                  `DELETE FROM Department WHERE id = ${departmentIdToDelete}`,
                  (err, res) => {
                    if (err) throw err;
                    console.log(`You have successfully Deleted and Department`);
                    mainMenu();
                  }
                )

              }
            );
          }
          );
      });
  };
  const addDepartment = () => {
    inquirer.prompt([
      {
        type: 'input',
        name: 'departmentName',
        message: "Please state name of Department you'll be adding",
      },
    ])
      .then(answer => {
        connection.query(
          'INSERT INTO department (name) VALUES (?)',
          answer.departmentName,
          function (err, res) {
            if (err) throw err;
            console.log(
              `You have entered ${answer.departmentname} into the Department Database.`
            );
            mainMenu();

          }
        );
      });
  };

  const addRole = () => {
    inquirer.prompt([
      {
        type: 'input',
        name: 'addRole',
        message: 'What role would you like to add?',
      },
      {
        type: 'input',
        name: 'roleSalary',
        message: 'Please enter salary.',
      },
      {
        type: 'input',
        name: 'departmentID',
        message: 'Which department?',

      },

    ])
      .then(answer => {
        connection.query(
          'INSERT INTO role SET ?',
          {
            title: answer.addRole,
            salary: answer.roleSalary,
            department_id: answer.departmentID,
          },
          function (err, res) {
            if (err) throw err;
            console.log(
              `You have entered ${answer.addRole} into your Role Database.`
            );
            mainMenu();
          }
        );
      });
  };

  const updateEmployeeRole = () => {
    const employeeArray = [];
    const roleArray = [];
    connection.query(
      `SELECT CONCAT (employee.first_name, ' ', employee.last_name) as employee FROM Employee`,
      (err, res) => {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
          employeeArray.push(res[i].employee);
        }
        connection.query(
          `SELECT title FROM Role`,
          (err, res) => {
            if (err) throw err;
            for (let i = 0; i < res.length; i++) {
              roleArray.push(res[i].title);
            }

            inquirer
              .prompt([
                {
                  name: 'name',
                  type: 'list',
                  message: `Who's role would you like to change?`,
                  choices: employeeArray,
                },
                {
                  name: 'role',
                  type: 'list',
                  message: 'What would you like to change their role to?',
                  choices: roleArray,
                },
              ])
              .then(answers => {
                let currentRole;
                const name = answers.name.split(' ');
                connection.query(
                  `SELECT id FROM Role WHERE title = '${answers.role}'`,
                  (err, res) => {
                    if (err) throw err;
                    for (let i = 0; i < res.length; i++) {
                      currentRole = res[i].id;
                    }
                    connection.query(
                      `UPDATE Employee SET role_id = ${currentRole} WHERE first_name= '${name[0]}' AND last_name= '${name[1]}';`,
                      (err, res) => {
                        if (err) throw err;
                        console.log(`You have successfully upated the role.`);
                        mainMenu();
                      }
                    );
                  }
                );
              });
          }
        );
      }
    );
  }
});


