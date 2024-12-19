const jwt = require("jsonwebtoken");
const { SELLER,BUYER } = require("../constsnts/role");

const checkAuthenctication = (req,res,next)=>{
    if(req.headers.authorization){
      let token = req.headers.authorization.split(" ")[1]
      // console.log(token);
  
      if(token){
  
          try{
  
              var decoded_user_info = jwt.verify(token, process.env.JWT_SECRET);
              req.user = decoded_user_info
              return next()
          }catch(err){
            
          }
      }
  
    }  
  
      
      res.status(401).send({msg:"unauthenticated"})
      
      
      // let logged = false;
      // if(logged){
      //     next()
      // }else{
      //     res.status(401).send({msg:"unauthenticated"})
      // }
  
  
      //req.headers.authorization.split(" ")[1] = yesle chai headers maa bearer garayera rakheko tokens lai call garxa..tara token sngai bearer pani aauxa so split function use garxam
      //split function maa chai bich maa space vako thau bata tukra pardinxa..like bearer_ijsiis(token)...(" ")space le split garne...[1]index 1 maa vako
  
  }

  const isSeller = (req,res,next) => {
    if(req.user.role === SELLER){
        next()
    }else{
        return res.status(403).send({msg:"access denied -only for seller"})
    }
  }
  const isBuyer = (req,res,next) => {
    if(req.user.role === BUYER){
        next()
    }else{
        return res.status(403).send({msg:"access denied -only for buyer"})
    }
  }

  module.exports = {
    checkAuthenctication,
    isSeller,
    isBuyer
  }
  
  