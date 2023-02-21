INSERT INTO employee_departments (department_name)
VALUES  ('SALES'), 
        ('ENGINEERING'), 
        ('FINANCE'), 
        ('LEGAL');

INSERT INTO employee_roles (role_title, role_salary) 
VALUES  ("Sales Lead", 100000),
        ("Salesperson", 80000),
        ("Lead Engineer", 150000),
        ("Software Engineer", 120000),
        ("Account Manager", 160000),
        ("Accountant", 125000),
        ("Legal Team Lead", 250000),
        ("Lawyer", 190000);

INSERT INTO employee (first_name, last_name, role_id, employee_manager_id)
VALUES  ('John', 'Doe', 1, NULL),
        ('Mike', 'Chan', 2, 1),
        ('Ashley', 'Rodriguez', 3, NULL),
        ('Kevin', 'Tupik', 4, 3),
        ('Kunal', 'Singh', 5, NULL),
        ('Malia', 'Brown', 6, 5),
        ('Sarah', 'Lourd', 7, NULL),
        ('Tom', 'Allen', 8, 7);
