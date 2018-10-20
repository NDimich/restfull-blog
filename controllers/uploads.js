const errorHandler = require('../utils/errorHandler');

module.exports.upload = async function (req, res) {
  try{
    if(req.file) {
      const responce = {
        status: true,
        imageUrl: req.file.path,
        msg: 'Image upload successful'
      };
      res.status(200).json(responce);
    } else {
      res.status(500).json({message: 'Error no file in request'})
    }
  } catch (e) {
    errorHandler(res, e);
  }

};
