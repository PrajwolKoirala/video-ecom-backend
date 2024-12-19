const validateSchema =(schema)=>{
    return (res,req,next)=>{
        let{error} = schema.validate(req.body,{ abortEarly : false, stripUnknown: true})
        if (error){
         let errors = error.details.map(validation_error => {
             return{
                 params: validation_error.context.key,
                 message: validation_error.message
             }
         })
         return res.status(400).send({
             msg:"Bad request",
             errors
         })
        }else{
            next()
        }
    }
}

module.exports = validateSchema;