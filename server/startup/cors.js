var cors = require('cors');
const { clientUrl } = require('../config.json');


module.exports = function(app){
    var corsOptions = {
        origin: clientUrl,
        optionsSuccessStatus: 200
    }

    app.use(cors(corsOptions));
}