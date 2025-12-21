const express = require("express");
const app = express();
const path = require("path");
const pool = require("./db.js");
const bycrpt = require("bcryptjs");
const session = require("express-session");
const PGsimple = require("connect-pg-simple")(session);
const multer = require("multer");
const fs = require("fs/promises");
const FS = require("fs");
const port = 3000;

app.use(session({
    secret: process.env.SECRET_SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        sameSite: "lax",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        pruneSessionInterval: 1000 * 60 * 60 * 6
    },
    store: new PGsimple({
        pool, pool,
        tableName: "e-marketSession",
        createTableIfMissing: true,
        disableTouch: true
    })
}));
app.use(express.static("public"));
app.use(express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//connect to the database
pool.connect().then(() => {
    console.log("connected to the database")
}).catch((err) => {
    console.log("connection to the database failed", err)
});
//authorize users
const authorization = (req, res, next) => {
    if (!req.session.userId) { return res.status(401).json("please login first") };
    next()
};
const validateAdmin= async (req,res,next)=>{
        if(!req.session.userId)return res.status(403).redirect("/admin")
    const userId=req.session.userId;
    const isadmin=await pool.query(`select * from users where id=$1 and isadmin=true`,[userId]);
    if(isadmin.rowCount===0)return res.status(403).redirect("/admin");
    next();
}
//configure multer for storage 
const pictureLocation = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, "uploads/users-profile-picture");
    },
    filename: (req, file, cb) => {

        const uniqueName = "photo" + Date.now() + "-" + Math.round(Math.random() * 1.e9);
        cb(null, uniqueName + path.extname(file.originalname))
    }
});
const fileFilter = (req, file, cb) => {

    if (!file.mimetype.startsWith("image/")) {
        return res.status(400).json("you must include image file");
    };
    cb(null, true);
};
const uploads = multer({
    storage: pictureLocation,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter
});
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});
app.post("/search/products", async (req, res) => {
    const { limit, offset, id, name } = await req.body;

    let query;
    if (!id && !name) {
        query = `select * from products order by id limit $1 offset $2`;
    }
    else if (id || name) { query = (id !== null && id !== undefined) ? `select * from products WHERE id=$3 order by id limit $1 offset $2 ` : `select * from products WHERE name ilike $3 order by id limit $1 offset $2 `; }

    try {
        let products;


        if (!id && !name) { products = await pool.query(query, [limit, offset]) }
        else if (id || name) { products = (id !== null) ? await pool.query(query, [limit, offset, id]) : await pool.query(query, [limit, offset, `%${name}%`]); };
        return res.status(200).json(products.rows);


    } catch (error) {
        console.log(error)
    }

});
app.get("/products", (req, res) => {
    res.sendFile(path.join(__dirname, "public/products.html"))
});
app.get("/product-detail", (req, res) => {
    res.sendFile(path.join(__dirname, "public/product-detail.html"))
});
app.get("/register", (req, res) => {
    if (req.session.userId) { return res.redirect("/profile"); }
    res.sendFile(path.join(__dirname, "public/register.html"))
});
app.post("/auth/register", async (req, res) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) { return res.status(402).json("fill all the forms") }
    else if (password.length < 8) return res.status(402).json("minimum password is 8");
    const emailFound = await pool.query(`select * from users where email=$1`, [email]);

    if (emailFound.rowCount !== 0) { return res.status(400).json(`email already registered.<a href="/account-recovery> forget password?</a>`) };
    const hashedPassword = await bycrpt.hash(password, 10);
    const insertBuyer = `insert into users(fullName,email,password) values($1,$2,$3)`;

    try {
        await pool.query(insertBuyer, [fullName, email, hashedPassword]);
        return res.status(200).json('registered successfully');
    } catch (error) {
        res.status(400).json('failed to register. please try agin later')
    }

});
app.get("/login", (req, res) => {
    if (req.session.userId) { return res.redirect("/profile"); }
    res.sendFile(path.join(__dirname, "public/login.html"))
});
app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) { return res.status(400).json('fill the forms please'); }
    else if (password.length < 8) return res.status(402).json("minimum password length is 8");
    const searchQuery = `select * from users where email=$1`;
    const result = await pool.query(searchQuery, [email]);
    // console.log(result)
    if (result.rowCount === 0) {
        return res.status(400).json('email or password incorect');
    }
    const isMatch = await bycrpt.compare(password, result.rows[0].password);
    if (!isMatch) { return res.status(400).json('email or password incorect'); };
    const userId = result.rows[0].id;
    req.session.userId = userId;
    return res.status(200).json(`successful login attempt`);
});
app.get("/admin", (req, res) => {
    return res.sendFile(path.join(__dirname, "public/admin-login.html"))
});
app.get("/admin/dashboard",validateAdmin,async(req,res)=>{
    return res.sendFile(path.join(__dirname,"public/admin.html"));
});
app.post("/auth/admin", async (req,res) => {
    let{email,password}=req.body;
     email=email.trim().toUpperCase()
     if (!email || !password) { return res.status(400).json('fill the forms please'); }
    else if (password.length < 10) return res.status(402).json("minimum password length is 10");

    try {

        const query=await pool.query(`select * from users where email=$1 and isadmin=true`,[email]);
        
        if(query.rowCount===0)return res.status(403).json("FORBIDDEN");
        const targetPassword=query.rows[0].password;
        const isMatch=await bycrpt.compare(password,targetPassword);
        if(!isMatch)return res.status(402).json("minimum password length is 10");
        req.session.userId=query.rows[0].id;
        return res.status(200).json('login successful');
    } catch (error) {
        
    }
    
});
app.get("/profile", (req, res) => {
    if (!req.session.userId) { return res.redirect("/register") }
    res.sendFile(path.join(__dirname, "public/profile.html"))
});
app.get("/api/me", async (req, res) => {
    if (!req.session.userId) { return res.status(400).json('please login first'); };
    const userId = req.session.userId;
    try {
        const user = await pool.query(`select fullName,email,balance,isadmin,image from users where id=$1`, [userId]);
        if (user.rowCount === 0) return res.status(500).json("couldn't get your information. try re-loging");
        const imageExist = FS.existsSync(`uploads/users-profile-picture/${user.rows[0].image}`);
        user.rows[0].image = imageExist ? user.rows[0].image : null;
        return res.status(200).json(user.rows[0])
    } catch (error) {
        console.log(error);
    }
});
app.post("/logout", async (req, res) => {
    if (!req.session.userId) { return res.status(400).json("/register"); };
    req.session.destroy();
    res.clearCookie("connect.sid");
    return res.status(200).json('logging out');
});
app.post("/addToCart", async (req, res) => {
    if (!req.session.userId) { return res.status(500).json("you first need to log in") }
    const { productId } = req.body;
    const quantity = req.body.quantity || 1;
    const userId = await req.session.userId;
    const query = `select * from  products where id=$1 order by id`;
    const product = await pool.query(query, [productId]);
    if (product.rowCount === 0) {
        return res.status(404).json('product not found');
    }
    const alreadYInCartQuery = `select * from cart_items where user_id=$1 and product_id=$2;`;
    try {
        const alreadYInCart = await pool.query(alreadYInCartQuery, [userId, productId]);
        if (alreadYInCart.rowCount !== 0) { return res.status(400).json('item is already in cart') }
    } catch (error) {
        console.log(error)
    }


    const insertQuery = `insert into cart_items(user_id,product_id,quantity) values($1,$2,$3)ON CONFLICT (user_id, product_id) DO NOTHING;`
    try {
        pool.query(insertQuery, [userId, productId, quantity]);
        return res.status(200).json('added to cart')
    } catch (error) {
        return res.status(400).json(`Couldn't add to cart. please try again later`);
    }


});
app.get("/cart", (req, res) => {
    if (!req.session.userId) { return res.redirect("/login") };
    return res.sendFile(path.join(__dirname, "public/cart.html"))
});
app.get("/contact-us", (req, res) => {
    return res.sendFile(path.join(__dirname, "public/contact-us.html"));
});
app.post("/api/cart", async (req, res) => {
    if (!req.session.userId) { return res.status(401).json("please login first") };
    const { limit, offset } = req.body;
    if (limit < 1 && limit > 50) { limit = 50 };
    const userId = req.session.userId;
    const cart = await pool.query(`select * from cart_items where user_id=$1 limit $2 offset $3`, [userId, limit, offset]);
    if (cart.rowCount === 0) { return res.status(404).json('No item found in your cart'); };
    let cart_item = [];
    let itemRow;
    const cartRow = cart.rows
    for (let k = 0; k < cart.rowCount; k++) {
        let productId = cart.rows[k].product_id;

        const item = await pool.query(`select * from products where id=$1 `, [productId]);
        itemRow = await item.rows[0];
        cart_item.push(itemRow)


    };
    const data = {
        cart: cartRow,
        products: cart_item
    }
    return res.status(200).json(data)
});
app.post("/api/deleteCart", async (req, res) => {
    if (!req.session.userId) { return res.status(401).json('please login first') }
    const { cartId } = req.body;
    const inCart = await pool.query(`select * from cart_items where id=$1`, [cartId])
    if (inCart === 0) { return res.status(404).json('the item to be removed not found') };
    try {
        const deleted = await pool.query(`delete from cart_items where id=$1`, [cartId]);
        if (deleted.rowCount !== 1) {
            return res.status(400).json("unable to remove item from cart");
        };
    } catch (error) {
        console.log(error)
    }

    return res.status(200).json('item removed from cart');

});
app.post("/api/buy", async (req, res) => {
    if (!req.session.userId) { return res.status(401).json('please login first') };
    const { total, itemId, quantity, price } = req.body;
    const userId = req.session.userId;
    const currentDate = new Date();
    const balanceResult = await pool.query(`select balance from users where id=$1`, [userId]);
    const balance = balanceResult.rows[0].balance;
    const overBalance = total > balance;
    if (overBalance) { return res.status(400).json('total price is over your balance') };
    const quantityQuery = await pool.query(`select * from products where id=$1`, [itemId]);
    if (quantityQuery.rowCount === 0 || quantityQuery.rows[0].quantity === 0) { return res.status(404).json("no product found or sold out") };
    if (quantityQuery.rows[0].quantity < quantity) { return res.status(400).json("your requested quantity is more than available quantity") };
    const newQuantity = quantityQuery.rows[0].quantity - quantity;
    const result = await pool.query(`insert into orders(user_id,total,created_at) values($1,$2,$3) returning id`, [userId, total, currentDate]);
    if (result.rowCount === 0) { return res.status(400).json("transaction failed") };
    const newBalance = balance - total;
    const orderId = result.rows[0].id;
    if (!orderId) { return s = res.status(500).json("internal server error") };
    try {
        const result = await pool.query(`insert into order_items(order_id,product_id,quantity,price)values($1,$2,$3,$4)`, [orderId, itemId, quantity, price])
        if (result.rowCount === 0) { return res.status(500).json("internal server error") };
        await pool.query(`update users set balance=$1 where id=$2;`, [newBalance, userId]);
        await pool.query(`update products set quantity=$1 where id=$2`, [newQuantity, quantityQuery.rows[0].id])
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "error ocoured", error: error })
    }
    return res.status(200).json({ newBalance: newBalance, newQuantity: newQuantity, message: 'successful transaction' });


});
app.post("/api/editName", async (req, res) => {
    if (!req.session.userId) { return res.status(500).json('please login first') };
    const { newName } = req.body;
    const newNameFiltered = newName.trim().toUpperCase();
    const userId = req.session.userId;
    const oldName = await pool.query(`select  fullname from users where id=$1`, [userId]);
    if (oldName.rowCount === 0) { return res.status(400).json("server error. try again later") };
    if (oldName === newNameFiltered) { return res.status(400).json("new name can't be the same as old name") };
    const insert = await pool.query(`update users set fullname=$1 where id=$2 returning fullname`, [newNameFiltered, userId]);
    if (insert.rowCount === 0) { return res.status(400).json("server error. try again later") };
    const data = { Name: insert.rows[0].fullname, message: "name edited successfully" }
    return res.status(200).json(data);
});
app.post("/api/editBalance", async (req, res) => {
    if (!req.session.userId) { return res.status(401).json('you need to login first') };
    const userId = req.session.userId;
    const { newBalance } = req.body;
    if (isNaN(newBalance) || newBalance < 1 || newBalance > 1000) { return res.status(400).json("only numbers between 1 and 1000 allowed") };
    try {
        const result = await pool.query(`update users set balance =$1 where id=$2 returning balance`, [newBalance, userId]);
        if (result.rowCount === 0) { return res.status(400).json("unable to update balance") };
        return res.status(200).json({ message: "balance updated successfully", balance: result.rows[0].balance });

    } catch (error) {
        return res.status(500).json("server error. please try agian later");
    }

});
app.get("/traxHistory/:limit/:offset", async (req, res) => {
    const userId = req.session.userId;

    if (!userId) return res.status(404).json("action requires login");
    const limit = req.params.limit;
    const offset = req.params.offset;
    if (!(limit > 0 && limit <= 50) || !(offset >= 0)) { return res.status(400).json("limit should be between 0 and 50. offset should be positive Number") };

    try {
        const history = await pool.query(`select o.id o_Id,o.*,oi.id oi_Id,oi.quantity order_quantity, oi.*, p.price current_price, p.* from orders o,order_items oi,products p where o.user_id=$1 and o.id=oi.order_id and oi.product_id=p.id order by o.id asc offset $2 limit $3`, [userId, offset, limit]);
        if (history.rowCount === 0) return res.status(404).json("zero transaction history found");

        return res.status(200).json(history.rows);
    } catch (error) {
        return res.status(500).json("database error try again later")
    }
});
app.post("/upload/image", authorization, uploads.single("image"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json("you must include image file");
    };
    try {

        const oldImageQuery = await pool.query(`select image from users where id=$1`, [req.session.userId]);
        const oldImage = oldImageQuery.rows[0] ? oldImageQuery.rows[0].image : null;
        const query = await pool.query(`update users set image=$1 where id =$2`, [req.file.filename, req.session.userId]);
        if (query.rowCount === 0) {
            return res.status(500).json("could't save file to the database");
        };
        const imageExist = oldImage !== null && FS.existsSync(`uploads/users-profile-picture/${oldImage}`);
        const unlink = imageExist ? await fs.unlink(path.join(__dirname, `uploads/users-profile-picture/${oldImage}`)) : null;
        return res.status(200).json({
            message: "upload was successful",
            fileName: req.file.filename
        });
    } catch (error) {

        console.log("catch at /upload/image")
        return res.status(500).json(error);
    }

});
app.post("/admin/statistics",validateAdmin,async(req,res)=>{
    const {required}=req.body;
    if(required==='getTotal')getTotal()
    async function getTotal(){
        try {
            const total=await pool.query(`select total from orders where status != 'declined'`);
            const lastMonTotal=await pool.query(`select total from orders where status !='declined' and created_at < current_timestamp - interval '30 days'`);
            const thisMonTotal=await pool.query(`select total from orders where status !='declined' and created_at >= current_timestamp - interval '30 days'`);
            return res.status(200).json({total:total.rows,lastMonTotal:lastMonTotal.rows,thisMonTotal:thisMonTotal.rows});
        } catch (error) {
        }
    }

})
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json("failed to upload");
    }
    else if (err) {
        
        return res.status(400).json(`ERROR OCCURED ${err}`);
    };
    next();

});
app.listen(port, () => console.log("port opened at ", port));