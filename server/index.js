const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000
app.use(cors());
app.use(express.json());

const companyRoutes = require('./routes/companyRoutes');
app.use('/api/companies', companyRoutes);

mongoose.connect(process.env.DB_URL).then(
  ()=>{console.log("Database connected successfully")}
).catch(
  (err) => console.log("Database connection failed",err)
)
app.listen(PORT,()=>{
  console.log(`Server is running on port ${PORT}`);
})