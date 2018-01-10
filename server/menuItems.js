const menuItemsRouter = require('express').Router();
module.exports = menuItemsRouter;

//valitates Menu before any items are requested
const validateMenu = (req, res, next) => {
  const menuValidate = req.body.menu.id;
  if (!idValidate)
  {
    return res.sendStatus(404);
  };
  next();
};

//Returns  all saved items for a menu
menuItemsRouter.get('/', validateMenu, (req, res, next) => {
  const menuId = req.body.menu.id;
  db.all('SELECT * FROM MenuItem WHERE menu_id=$menu_id', {$menu_id = menuId}, (err, rows) =>{
    if (err) {
      res.sendStatus(500);
    } else {
      res.send({menuItems: rows});
    }
  });
});

//valitates data before any data changes are requested
const validateMenuItem = (req, res, next) => {
  const menuItemValidate = req.body.menuItem;
  if (!menuItemValidate.menuId || !menuItemValidate.name || !menuItemValidate.inventory || !menuItemValidate.price)
  {
    return res.sendStatus(400);
  }
  next();
};

//Creates a new menu item
menuItemsRouter.post('/', validateMenu, validateMenuItem, (req, res, next) => {
  const menuItemToAdd = req.body.menuItem;
  const sql = 'INSERT INTO MenuItem (menu_id, name, description, inventory, price) VALUES ($menuId, $name, $description, $inventory, $price)'
  const menuItemPlaceholder = {
                                $menuId: menuItemToAdd.menuId,
                                $name: menuItemToAdd.name,
                                $description: menuItemToAdd.description,
                                $inventory: menuItemToAdd.inventory,
                                $price: menuItemToAdd.price
  }
  db.run(sql, menuItemPlaceholder), function(err){
    if(err){
      return res.sendStatus(400);
    }
    db.get('SELECT * FROM MenuItem WHERE id = ${this.lastID}', (err, row) =>{
      if(!row) {
        return res.sendStatus(400);
      }
      res.status(201).send({menuItem: row});
    });
  });
});

//valitates id before any data changes are requested
const validateId = (req, res, next) => {
  const idValidate = req.body.menuItem.id;
  if (!idValidate)
  {
    return res.sendStatus(400);
  };
  db.get('SELECT * FROM MenuItem WHERE id = $id', {$id = idValidate}, (err, row) =>{
    if(!row) {
      return res.sendStatus(404);
    };
  next();
};

//updates an existing menu item
menuItemsRouter.put('/:menuItemId', validateMenu, validateId, validateMenuItem, (req, res, next) => {
  const menuItemToUpdate = req.body.menuItem;
  const sql = 'UPDATE MenuItem SET menu_id = $menuId, name = $name, description = $description, inventory = $inventory, price = $price WHERE id = $id )'
  const menuItemPlaceholder = {
                                $menuId: menuItemToUpdate.menuId,
                                $name: menuItemToUpdate.name,
                                $description: menuItemToUpdate.description,
                                $inventory: menuItemToUpdate.inventory,
                                $price: menuItemToUpdate.price,
                                $id: menuToUpdate.id
  }
  db.run(sql, menuItemPlaceholder), function(err){
    if(err){
      return res.sendStatus(400);
    }
    db.get('SELECT * FROM MenuItem WHERE id = $id', {$id = menuItemToUpdate.id}, (err, row) =>{
      if(!row) {
        return res.sendStatus(400);
      }
      res.status(200).send({menuItem: row});
    });
  });
});


//deletes an existing menu item
menuItemsRouter.delete('/:menuItemId', validateMenu, validateId, (req, res, next) => {
  const menuItemToDelete = req.body.menuItem;
  const sql = 'DELETE FROM MenuItem WHERE id = $id )';
  const menuItemPlaceholder = {  $id = menuItemToDelete.id  };
  db.run(sql, menuItemPlaceholder), function(err){
    if(err){
      return res.sendStatus(404);
    }
    db.get('SELECT * FROM MenuItem WHERE id = $id', {$id = menuItemToDelete.id}, (err, row) =>{
      if(!row) {
        return res.sendStatus(204);
      }
      res.sendStatus(400);
    });
  });
});
