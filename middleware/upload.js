const moment = require('moment');
const multer = require('multer');

const storage = multer.diskStorage({
  destination(req, file, callBack) {
    callBack(null, 'uploads/')
  },
  filename(req, file, callBack) {
    const date = moment().format('DDMMYYYY-HHmmSS');
    callBack(null, `${date}-${file.originalname}`)
  }
});
const fileFilter = (req, file, callBack) => {
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
    callBack(null, true)
  } else {
    callBack(null, false)
  }
};
const limit = {
  fileSize: 1024*1025*5
};

module.exports = multer({
  storage,
  fileFilter,
  limit
});