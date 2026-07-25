const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


// PostgreSQL connection

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


const JWT_SECRET = process.env.JWT_SECRET;


// Initialize Database

async function initDB(){

    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    console.log("Users table ready");
}


// Health check

app.get("/",(req,res)=>{
    res.json({
        service:"auth-service",
        status:"running"
    });
});


// Signup

app.post("/signup", async(req,res)=>{

    try{

        const {email,password}=req.body;


        if(!email || !password){
            return res.status(400).json({
                error:"Email and password required"
            });
        }


        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email=$1",
            [email]
        );


        if(existingUser.rows.length){
            return res.status(409).json({
                error:"User already exists"
            });
        }


        const hashedPassword = await bcrypt.hash(password,10);


        const result = await pool.query(
            `
            INSERT INTO users(email,password_hash)
            VALUES($1,$2)
            RETURNING id,email
            `,
            [
                email,
                hashedPassword
            ]
        );


        const user=result.rows[0];


        const token=jwt.sign(
            {
                id:user.id,
                email:user.email
            },
            JWT_SECRET,
            {
                expiresIn:"7d"
            }
        );


        res.status(201).json({
            message:"User created",
            token,
            user
        });


    }
    catch(error){

        console.log(error);

        res.status(500).json({
            error:"Server error"
        });

    }

});


// Login

app.post("/login",async(req,res)=>{

    try{

        const {email,password}=req.body;


        const result=await pool.query(
            "SELECT * FROM users WHERE email=$1",
            [email]
        );


        if(result.rows.length===0){

            return res.status(401).json({
                error:"Invalid credentials"
            });

        }


        const user=result.rows[0];


        const validPassword=await bcrypt.compare(
            password,
            user.password_hash
        );


        if(!validPassword){

            return res.status(401).json({
                error:"Invalid credentials"
            });

        }


        const token=jwt.sign(
            {
                id:user.id,
                email:user.email
            },
            JWT_SECRET,
            {
                expiresIn:"7d"
            }
        );


        res.json({
            token,
            user:{
                id:user.id,
                email:user.email
            }
        });


    }
    catch(error){

        console.log(error);

        res.status(500).json({
            error:"Server error"
        });

    }

});


// Verify Token

app.get("/verify",(req,res)=>{


    const authHeader=req.headers.authorization;


    if(!authHeader){

        return res.status(401).json({
            error:"No token"
        });

    }


    const token=authHeader.split(" ")[1];


    try{

        const decoded=jwt.verify(
            token,
            JWT_SECRET
        );


        res.json({
            valid:true,
            user:decoded
        });


    }
    catch(error){

        res.status(401).json({
            valid:false
        });

    }

});



const PORT=process.env.PORT || 3001;


initDB()
.then(()=>{

    app.listen(PORT,()=>{

        console.log(
            `Auth service running on port ${PORT}`
        );

    });

})
.catch(err=>{

    console.log("Database error",err);

});