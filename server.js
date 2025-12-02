const express=require("express");
const app=express();
const path=require("path");
const pool= require("./db.js");
const bycrpt=require("bcryptjs");
const session=require("express-session");
const PGsimple=require("connect-pg-simple")(session);
const port=3000;

app.use(session({
    secret:process.env.SECRET_SESSION_KEY, 
    resave:false,
    saveUninitialized:false,
    cookie:{
        secure:true,
        sameSite:"lax",
        httpOnly:true,
        maxAge:1000*60*60*24,
        pruneSessionInterval:1000*60*60*6
    },
    store:new PGsimple({
        pool,pool,
        tableName:"e-marketSession",
        createTableIfMissing:true,
        disableTouch:true
    })
}));
app.use(express.static("public"));
app.use(express.json()); 
app.use(express.urlencoded({extended:true}))
//connect to the database
pool.connect().then(()=>{
    console.log("connected to the database")}).catch((err)=>{
    console.log("connection to the database failed",err)});

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"public/index.html"));
})

app.post("/api/products",async(req,res)=>{
    const{limit,offset,id,name}= await req.body;

    let query;
if(!id&&!name){
  query=`select * from products limit $1 offset $2`;}
 else if(id||name){  query=(id!==null)?`select * from products WHERE id=$3 limit $1 offset $2 `:`select * from products WHERE name ilike $3 limit $1 offset $2 `;}

try {    
    let products;


    if(!id&&!name){ products= await pool.query(query,[limit,offset])}
    else if(id||name){products=(id!==null)? await pool.query(query,[limit,offset,id]):await pool.query(query,[limit,offset,`%${name}%`]);};

     return res.status(200).json(products.rows);
     

} catch (error) {
    console.log(error)
}

});

app.get("/products",(req,res)=>{
    res.sendFile(path.join(__dirname,"public/products2.html"))
});
app.get("/product-detail",(req,res)=>{
    res.sendFile(path.join(__dirname,"public/product-detail.html"))
});
app.get("/profile",(req,res)=>{
    if(!req.session.userId){return res.redirect("/register")}
    res.sendFile(path.join(__dirname,"public/profile.html"))
});
app.get("/register",(req,res)=>{
    if(req.session.userId){return res.redirect("/profile");}
    res.sendFile(path.join(__dirname,"public/register.html"))
});
app.post("/api/register",async (req,res)=>{
    const {fullName,email,password}=req.body;
    if(!fullName||!email||!password){return res.status(400).json("fill all the forms")};
    const emailFound=await pool.query(`select * from buyers where email=$1`,[email]);
    
    if(emailFound.rowCount!==0){return res.status(400).json(`email already registered.<a href="/account-recovery> forget password?</a>`)};
    const hashedPassword= await bycrpt.hash(password,10);
    const insertBuyer=`insert into buyers(fullName,email,password) values($1,$2,$3)`;
    
    try {
        await pool.query(insertBuyer,[fullName,email,hashedPassword]);
       return res.status(200).json('registered successfully');
    } catch (error) {
        res.status(400).json('failed to register. please try agin later')
    }
    
});
app.get("/login",(req,res)=>{
    if(req.session.userId){return res.redirect("/profile");}
    res.sendFile(path.join(__dirname,"public/login.html"))
});
app.post("/api/login",async(req,res)=>{
    const { email,password }= req.body;

    if(!email||!password){return res.status(400).json('fill the forms please') ;};
    const searchQuery=`select * from buyers where email=$1`;
    const result=await pool.query(searchQuery,[email]);
    // console.log(result)
    if(result.rowCount===0){
        return res.status(400).json('email or password incorect');
    }
    const isMatch=await bycrpt.compare(password,result.rows[0].password);
    if(!isMatch){return res.status(400).json('email or password incorect');};
    const userId=result.rows[0].id;
    req.session.userId=userId;
    return res.status(200).json(`successful login attempt`);
});
app.post("/logout",async(req,res)=>{
    if(!req.session.userId){return res.redirect("/register");};
    req.session.destroy();
    res.clearCookie("connect.sid");
    return res.status(200).json('logging out')
});
app.post("/addToCart",async(req,res)=>{
    if(!req.session.userId){console.log("returned");return res.status(400).json("you first need to log in")}
    const{productId}=req.body;
    const quantity=req.body.quantity||1;
    const userId=await req.session.userId;
    const query=`select * from products where id=$1`;
    const product= await pool.query(query,[productId]);
    if(product.rowCount===0){
        return res.status(404).json('product not found');
    }
    const alreadYInCartQuery=`select * from cart_items where user_id=$1 and product_id=$2;`;
    try {
            const alreadYInCart=await pool.query(alreadYInCartQuery,[userId,productId]);
        if(alreadYInCart.rowCount!==0){return res.status(400).json('item is already in cart')}
    } catch (error) {
        console.log(error)
    }


    const insertQuery=`insert into cart_items(user_id,product_id,quantity) values($1,$2,$3)ON CONFLICT (user_id, product_id) DO NOTHING;`
    try {
        pool.query(insertQuery,[userId,productId,quantity]);
        return res.status(200).json('added to cart')
    } catch (error) {
        return res.status(400).json(`Couldn't add to cart. please try again later`)
    }
    

})


app.listen(port,()=>console.log("port opened at ",port));
