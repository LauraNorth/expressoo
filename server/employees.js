const employeesRouter = require('express').Router();
module.exports = employeesRouter;

//Returns  all saved currently-employed employees
employeesRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Employee WHERE is_current_employee=1', (err, rows) =>{
    if (err) {
      res.sendStatus(500);
    } else {
      res.send({employees: rows});
    }
  });
});

//valitates data before any data changes are requested
const validateEmployee = (req, res, next) => {
  const employeeValidate = req.body.employee;
  if (!employeeValidate.name || !employeeValidate.position || !employeeValidate.wage)
  {
    return res.sendStatus(400);
  }
  next();
};

//Creates a new employee
employeesRouter.post('/', validateEmployee, (req, res, next) => {
  const employeeToAdd = req.body.employee;
  const sql = 'INSERT INTO Employee (name, position, wage) VALUES ($name, $position, $wage, $isCurrentEmployee)'
  const employeePlaceholder = {
                                $name: employeeToAdd.name,
                                $position: employeeToAdd.position,
                                $wage: employeeToAdd.wage,
                                $isCurrentEmployee: employeeToAdd.isCurrentEmployee
  }
  db.run(sql, employeePlaceholder), function(err){
    if(err){
      return res.sendStatus(400);
    }
    db.get('SELECT * FROM Employee WHERE id = ${this.lastID}', (err, row) =>{
      if(!row) {
        return res.sendStatus(400);
      }
      res.status(201).send({employee: row});
    });
  });
});


//valitates id before any data changes are requested
const validateId = (req, res, next) => {
  const idValidate = req.body.employee.id;
  if (!idValidate)
  {
    return res.sendStatus(400);
  };
  db.get('SELECT * FROM Employee WHERE id = $id', {$id = idValidate}, (err, row) =>{
    if(!row) {
      return res.sendStatus(404);
    };
  next();
};


//gets one employee
employeesRouter.get('/:employeeId', validateId, (req, res, next) => {
  db.get('SELECT * FROM Employee WHERE id = ${this.lastID}', (err, row) =>{
  if(!row) {
    return res.sendStatus(400);
  }
  res.status(201).send({employee: row});
    });
  });

//updates an existing employee
employeesRouter.put('/:employeeId', validateEmployee, validateId, (req, res, next) => {
  const employeeToUpdate = req.body.employee;
  const sql = 'UPDATE Employee SET name = $name, position = $position, wage = $wage, is_current_employee = $isCurrentEmployee WHERE id = $id )'
  const employeePlaceholder = {
                                $name: employeeToUpdate.name,
                                $position: employeeToUpdate.position,
                                $wage: employeeToUpdate.wage,
                                $isCurrentEmployee: employeeToUpdate.isCurrentEmployee,
                                $id = employeeToUpdate.id
                              }
  db.run(sql, employeePlaceholder), function(err){
    if(err){
      return res.sendStatus(400);
    }
    db.get('SELECT * FROM Employee WHERE id = $id', {$id = employeeToUpdate.id}, (err, row) =>{
      if(!row) {
        return res.sendStatus(400);
      }
      res.status(200).send({employee: row});
    });
  });
});


//deletes an existing employee
employeesRouter.delete('/:employeeId', validateEmployee, validateId, (req, res, next) => {
  const employeeToDelete = req.body.employee;
  const sql = 'UPDATE Employee SET is_current_employee = 0 WHERE id = $id )'
  const employeePlaceholder = {
                                $id = employeeToDelete.id
                              }
  db.run(sql, employeePlaceholder), function(err){
    if(err){
      return res.sendStatus(400);
    }
    db.get('SELECT * FROM Employee WHERE id = $id', {$id = employeeToDelete.id}, (err, row) =>{
      if(!row) {
        return res.sendStatus(400);
      }
      res.sendStatus(200);
    });
  });
});
