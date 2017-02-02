var express    = require('express');
var router     = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.json());

router.post('/secretsanta', function(request, response) {
	require("../secretsanta.js").run(request.body);
	response.sendStatus(200);
});

module.exports = router;