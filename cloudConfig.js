const cloudinary=require('cloudinary').v2;
const {CloudinaryStorage}=require('multer-storage-cloudinary')

cloudinary.config({
    cloud_name:'degsb7ajc',
    api_key:'128682929777574',
    api_secret:'33NEzux3YBiZO2VIdRjg26GV_wI',
})


const  storage=new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:'wanderlust_DEV',
        allowedFormats:['png','jpg','jpeg'],
    }
})



module.exports={
    cloudinary,storage
}