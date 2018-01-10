const menusRouter = require('express').Router();
module.exports = menusRouter;

//Returns  all saved currently-employed menus
menusRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Menu', (err, rows) =>{
    if (err) {
      res.sendStatus(500);
    } else {
      res.send({menus: rows});
    }
  });
});

//valitates data before any data changes are requested
const validateMenu = (req, res, next) => {
  const menuValidate = req.body.menu;
  if (!menuValidate.title)
  {
    return res.sendStatus(400);
  }
  next();
};

//Creates a new menu
menusRouter.post('/', validateMenu, (req, res, next) => {
  const menuToAdd = req.body.menu;
  const sql = 'INSERT INTO Menu (title) VALUES ($title)'
  const menuPlaceholder = {
                                $title: menuToAdd.title

  }
  db.run(sql, menuPlaceholder), function(err){
    if(err){
      return res.sendStatus(400);
    }
    db.get('SELECT * FROM Menu WHERE id = ${this.lastID}', (err, row) =>{
      if(!row) {
        return res.sendStatus(400);
      }
      res.status(201).send({menu: row});
    });
  });
});

//valitates id before any data changes are requested
const validateId = (req, res, next) => {
  const idValidate = req.body.menu.id;
  if (!idValidate)
  {
    return res.sendStatus(400);
  };
  db.get('SELECT * FROM Menu WHERE id = $id', {$id = idValidate}, (err, row) =>{
    if(!row) {
      return res.sendStatus(404);
    };
  next();
};


//gets one menu
menusRouter.get('/:menuId', validateId, (req, res, next) => {
  db.get('SELECT * FROM Menu WHERE id = ${this.lastID}', (err, row) =>{
  if(!row) {
    return res.sendStatus(400);
  }
  res.status(201).send({menu: row});
    });
  });

//updates an existing menu
menusRouter.put('/:menuId', validateMenu, validateId, (req, res, next) => {
  const menuToUpdate = req.body.menu;
  const sql = 'UPDATE menu SET title = $title WHERE id = $id )'
  const menuPlaceholder = {
                                $title: menuToUpdate.title

                              }
  db.run(sql, menuPlaceholder), function(err){
    if(err){
      return res.sendStatus(400);
    }
    db.get('SELECT * FROM Menu WHERE id = $id', {$id = menuToUpdate.id}, (err, row) =>{
      if(!row) {
        return res.sendStatus(400);
      }
      res.status(200).send({menu: row});
    });
  });
});


//find menu children
const findChildren = (validateId, (req, res, next)) => {
  const menuId= req.body.menu.id;
  const sql = 'SELECT * FROM MenuItem WHERE menu_id = $menuId';
  const menuId = {$id = menuId.id};
  db.get(sql, menuId), (err, row) =>{
    if(!row) {
      return res.sendStatus(400);
    };
  next();
};

//deletes an existing menu
menusRouter.delete('/:menuId', validateId, findChildren, (req, res, next) => {
  const menuToDelete = req.body.menu;
  const sql = 'DELETE FROM Menu WHERE id = $id )'
  const menuPlaceholder = {$id = menuToDelete.id };
  db.run(sql, menuPlaceholder), function(err){
    if(err){
      return res.sendStatus(404);
    }
    db.get('SELECT * FROM Menu WHERE id = $id', {$id = menuPlaceholder.id}, (err, row) =>{
      if(!row) {
        return res.sendStatus(204);
      }
      res.sendStatus(400);
    });
  });
});
