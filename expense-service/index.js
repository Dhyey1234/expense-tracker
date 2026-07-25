const express = require("express");
const {Pool} = require("pg");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();


const app = express();

app.use(cors());
app.use(express.json());



const pool = new Pool({

    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME

});


const JWT_SECRET = process.env.JWT_SECRET;



// Create table

async function initDB(){

    await pool.query(`
    
    CREATE TABLE IF NOT EXISTS expenses(

        id SERIAL PRIMARY KEY,

        user_id INTEGER NOT NULL,

        title VARCHAR(255) NOT NULL,

        amount DECIMAL(10,2) NOT NULL,

        category VARCHAR(100),

        expense_date DATE DEFAULT CURRENT_DATE,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

    );

    `);


    console.log("Expenses table ready");

}



// JWT middleware

function authenticate(req,res,next){


    const header=req.headers.authorization;


    if(!header){

        return res.status(401).json({
            error:"Token required"
        });

    }


    const token=header.split(" ")[1];


    try{

        const decoded=jwt.verify(
            token,
            JWT_SECRET
        );


        req.user=decoded;


        next();


    }
    catch(error){

        return res.status(401).json({
            error:"Invalid token"
        });

    }


}



// Health

app.get("/",(req,res)=>{

    res.json({
        service:"expense-service",
        status:"running"
    });

});




// Add expense

app.post("/expenses",
authenticate,
async(req,res)=>{


try{


const {
    title,
    amount,
    category
}=req.body;



const result=await pool.query(

`
INSERT INTO expenses
(user_id,title,amount,category)

VALUES($1,$2,$3,$4)

RETURNING *

`,

[
req.user.id,
title,
amount,
category
]


);


res.status(201).json(
    result.rows[0]
);


}
catch(error){

console.log(error);

res.status(500).json({
    error:"Server error"
});


}


});



// Get expenses

app.get("/expenses",
authenticate,
async(req,res)=>{


try{


const result=await pool.query(

`
SELECT *
FROM expenses
WHERE user_id=$1
ORDER BY created_at DESC
`,

[
req.user.id
]

);


res.json(result.rows);


}
catch(error){

console.log(error);

res.status(500).json({
    error:"Server error"
});


}


});





const PORT=process.env.PORT || 3002;


initDB()
.then(()=>{

app.listen(PORT,()=>{

console.log(
`Expense service running on port ${PORT}`
);

});

});