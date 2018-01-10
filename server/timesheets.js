const timesheetRouter = require('express').Router();
module.exports = timesheetRouter;

//valitates employee id - I may want to also use this to validate is_current_employee?
const validateEmployee = (req, res, next) => {
  const idValidate = req.body.employee.id;
  if (!idValidate)
  {
    return res.sendStatus(400);
  };
  next();
};


//Returns  all saved timesheets for an employee
timesheetRouter.get('/', validateEmployee, (req, res, next) => {
  const employeeId = req.body.timesheet.id;
  db.all('SELECT * FROM Timesheet WHERE employee_id=$employeeId', {$employeeId = employeeId}, (err, rows) =>{
    if (err) {
      res.sendStatus(500);
    } else {
      res.send({timesheet: rows});
    }
  });
});

//valitates data before any data changes are requested
const validateTimesheet = (req, res, next) => {
  const timesheetValidate = req.body.timesheet;
  if (!timesheetValidate.hours || !timesheetValidate.rate || !timesheetValidate.date)
  {
    return res.sendStatus(400);
  }
  next();
};

//Creates a new timesheet
timesheetRouter.post('/', validateEmployee, validateTimesheet, (req, res, next) => {
  const timesheetToAdd = req.body.timesheet;
  const sql = 'INSERT INTO Timesheet (employee_id, hours, rate, date) VALUES ($employeeId, $hours, $rate, $date)'
  const timesheetPlaceholder = {
                                $employeeId: timesheetToAdd.employeeId,
                                $hours: timesheetToAdd.hours,
                                $rate: timesheetToAdd.rate,
                                $date: timesheetToAdd.date
  }
  db.run(sql, timesheetPlaceholder), function(err){
    if(err){
      return res.sendStatus(400);
    }
    db.get('SELECT * FROM Timesheet WHERE id = ${this.lastID}', (err, row) =>{
      if(!row) {
        return res.sendStatus(400);
      }
      res.status(201).send({timesheet: row});
    });
  });
});

//valitates id before any data changes are requested
const validateId = (req, res, next) => {
  const idValidate = req.body.timesheet.id;
  if (!idValidate)
  {
    return res.sendStatus(400);
  };
  db.get('SELECT * FROM Timesheet WHERE id = $id', {$id = idValidate}, (err, row) =>{
    if(!row) {
      return res.sendStatus(404);
    };
  next();
};

//updates an existing timesheet
timesheetRouter.put('/:timesheetId', validateEmployee,  validateId, validateTimesheet, (req, res, next) => {
  const timesheetToUpdate = req.body.timesheet;
  const sql = 'UPDATE Timesheet SET hours = $hours, rate = $rate, date = $date, employee_id = $employeeId WHERE id = $id )'
  const timesheetPlaceholder = {
                                $employeeId: timesheetToAdd.employeeId,
                                $hours: timesheetToAdd.hours,
                                $rate: timesheetToAdd.rate,
                                $date: timesheetToAdd.date
                                $id = timesheetToAdd.id
                              }
  db.run(sql, timesheetPlaceholder), function(err){
    if(err){
      return res.sendStatus(400);
    }
    db.get('SELECT * FROM Timesheet WHERE id = $id', {$id = timesheetToUpdate.id}, (err, row) =>{
      if(!row) {
        return res.sendStatus(400);
      }
      res.status(200).send({timesheet: row});
    });
  });
});


//deletes an existing timesheet
timesheetRouter.delete('/:timesheetId', validateEmployee, validateId, (req, res, next) => {
  const timesheetToDelete = req.body.timesheet;
  const sql = 'DELETE FROM Timesheet WHERE id = $id )';
  const timesheetPlaceholder = {$id = timesheetToDelete.id};
  db.run(sql, timesheetPlaceholder), function(err){
    if(err){
      return res.sendStatus(404);
    }
    db.get('SELECT * FROM Timesheet WHERE id = $id', {$id = timesheetToDelete.id}, (err, row) =>{
      if(!row) {
        return res.sendStatus(204);
      }
      res.sendStatus(400);
    });
  });
});
