const res = require("express/lib/response");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const producto=require("../models/productos");
const ErrorHandler = require("../utils/errorHandler");
const fetch =(url)=>import('node-fetch').then(({default:fetch})=>fetch(url)); //Usurpación del require

//ver la lista de productos
exports.getProducts=catchAsyncErrors(async (req,res,next) =>{
    const productos= await producto.find();
    if (!productos){
        return next(new ErrorHandler("Informacion no encontrada", 404))
    }

    res.status(200).json({
        success:true,
        cantidad: productos.length,
        productos
        //message: "En esta ruta ud podra ver todos los productos" for show a message
    })
})
          
//ver un prodcuto  por id
exports.getProductById= catchAsyncErrors( async (req, res, next)=>{
    const product= await producto.findById(req.params.id)
    
    if (!product){
            return next(new ErrorHandler("Producto no encontrado", 404))
        }
    
    res.status(200).json({
        success:true,
        message:"Aqui debajo encuentras información sobre tu producto: ",
        product
    })
})


//Crear nuevo producto /api/productos
exports.newProduct=catchAsyncErrors(async(req,res,next)=>{
    req.body.user=req.user.id;
    const product= await producto.create(req.body);
    res.status(201).json({
        success:true,
        product
    })
})

//updating a product
exports.updateProduct= catchAsyncErrors(async (req,res,next) =>{
    let product= await producto.findById(req.params.id) //Variable de tipo modificable
    if (!product){ //Verifico que el objeto no existe para finalizar el proceso
        return next(new ErrorHandler("Producto no encontrado", 404))
    }
    
    //Si el objeto si existia, entonces si ejecuto la actualización
    product= await producto.findByIdAndUpdate(req.params.id, req.body, {
        new:true, //Valido solo los atributos nuevos o actualizados
        runValidators:true
    });
    //Respondo Ok si el producto si se actualizó
    res.status(200).json({
        success:true,
        message:"Producto actualizado correctamente",
        product
    })
})

//Eliminar un producto
exports.deleteProduct= catchAsyncErrors(async (req,res,next) =>{
    const product= await producto.findById(req.params.id) //Variable de tipo modificable
    if (!product){ //check the existnce of the product
        return next(new ErrorHandler("Producto no encontrado", 404))
    }

    await product.remove();//remove in order to respect static order as opposite of delete, the tail is dinamic
    res.status(200).json({
        success:true,
        message:"Producto eliminado correctamente"
    })
})

//FETCH
//Ver todos los productos
function verProductos(){
    fetch('http://localhost:4000/api/productos')
    .then(res=>res.json())
    .then(res=>console.log(res))
    .catch(err=>console.error(err))
}

//verProductos();

//Ver por id
function verProductoPorID(id){
    fetch('http://localhost:4000/api/producto/'+id)
    .then(res=>res.json())
    .then(res=>console.log(res))
    .catch(err=>console.error(err))
}
 
//verProductoPorID('63546690aee8397ce04de0d2'); 

//Crear y actualizar una review

exports.createProdructReview=catchAsyncErrors (async(req,res,next)=>{
    const {rating, comentario,idProducto}=req.body;

    const opinion={
        nombreCliente:req.user.nombre,
        rating:Number(rating),
        comentario
    }

    const product= await producto.findById(idProducto);

    const isReviewed= product.opiniones.find(item=>
        item.nombreCliente===req.user.nombre)

    if(isReviewed){
        product.opiniones.forEach(opinion => {
            if(opinion.nombreCliente===req.user.nombre){
                opinion.comentario=comentario,
                opinion.rating=rating

            }
        })
    } else{
        product.opiniones.push(opinion)
        product.numCalificaciones=product.opiniones.length
    }

    product.calificacion=product.opiniones.reduce((acc,opinion)=>
    opinion.rating+acc,0)/product.opiniones.length

    await product.save({validateBeforeSave:false});

    res.status(200).json({
        success:true,
        message:"Hemos opinado correctamente"
    })

})

//Ver todas la review de un producto
exports.getProductsReview = catchAsyncErrors(async(req,res,next)=>{
    const product = await producto.findById(req.query.id)
    
    res.status(200).json({
        success:true,
        opiniones:product.opiniones
    })
})


//Eliminar review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await producto.findById(req.query.idProducto);

    const opiniones = product.opiniones.filter(opinion =>
        opinion._id.toString() !== req.query.idReview.toString());

    const numCalificaciones = opiniones.length;

    const calificacion = product.opiniones.reduce((acc, Opinion) =>
        Opinion.rating + acc, 0) / opiniones.length;

    await producto.findByIdAndUpdate(req.query.idProducto, {
        opiniones,
        calificacion,
        numCalificaciones
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
        message: "review eliminada correctamente"
    })

})