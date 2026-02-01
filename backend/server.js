import express from 'express'
// import session from 'express-session'
// import MongoStore from 'connect-mongo'
import mongoose from 'mongoose';
import userRouter from './routes/userAuth.js';
import recruiterRouter from './routes/recruiterAuth.js';
import jobRouter from './routes/jobRoutes.js'
import dotenv from 'dotenv';
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth',userRouter);
app.use('/auth/recruiter',recruiterRouter);
app.use('/api/jobs',jobRouter);

// const DatabaseURL = "mongodb://127.0.0.1:27017/jobapplication" ;
const dbURL = process.env.ATLASDB_URL;

main()
.then(()=>{
    console.log('database connected successfully');    
})
.catch((err)=>{
    console.log('database connection failed',err);    
});
async function main(){
    await mongoose.connect(dbURL);
}

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(5000,()=>{
    console.log('server running on port 5000');    
})