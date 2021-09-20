const { validationResult } = require('express-validator');


exports.validationError = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next()
}

exports.commonError=(err, req, res, next) =>{
    console.error(err.stack);
  
    res.status(500).json({ errors: err })
  }