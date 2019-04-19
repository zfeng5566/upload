var express = require('express');
var router = express.Router();
const formidable = require('formidable');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: 'Express'});
});
router.post('/file/upload', function (req, res) {
  const form = new formidable.IncomingForm();
  form.uploadDir = "../files/";
  form.maxFileSize = 200 * 1024 * 1024 * 1024;
  form.parse(req, function (err, fields, files) {
    res.send({some: 'json'});
  });
  form.on('progress', function (bytesReceived, bytesExpected) {
    console.log(bytesReceived, bytesExpected);
  });
  form.on('end', function () {
    console.log('111111111111');
  });

});
module.exports = router;
