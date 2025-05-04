const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name:'degsb7ajc',
    api_key:'128682929777574',
    api_secret:'33NEzux3YBiZO2VIdRjg26GV_wI',
});

cloudinary.uploader.upload('./logo.png', 
  function(error, result) {console.log(result, error); });