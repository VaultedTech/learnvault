const express = require('express');
const secured = require('../../middleware/secured');

const router = express.Router();

/* GET user profile. */
router.get('/user', secured(), (req, res, next) => {
  res.locals.user = req.user;

  return res.json(req.user);
});

module.exports = router;
