
module.exports = function(){
    const { db } = require('../config.json');
    const mongoose = require('mongoose');
    
    mongoose.connect(db)
    .then(()=> console.log('mongodb connected..') )
    .catch((err)=> console.log(err) );
}