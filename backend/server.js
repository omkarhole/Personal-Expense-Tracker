require('dotenv').config();

const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const Transaction=require('./database/TransactionModel')
const app=express();
const PORT=process.env.PORT||5000;

//middlewares
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());


//mongodb connection

mongoose.connect(process.env.MONGODB_URI,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(()=>console.log('MongoDB connected'))
.catch((err)=>console.log(err));



//get all transactions
app.get('/api/transactions',async(req,res)=>{
    try{
        const transaction=await Transaction.find().sort({date:-1});
        res.json(transaction);
    }
    catch(e){
        res.status(400).json({error:e.message});
    }
   
})

//create new Transaction
app.post('/api/transactions',async (req,res)=>{
    try{

        const transaction=new Transaction(req.body);
        await transaction.save();
        res.status(201).json(transaction);
    }
    catch(e){
        res.status(400).json({error:e.message});
    }
})

//get single transaction by id
app.get('/api/transactions/:id',async(req,res)=>{
try{
    const transaction=await Transaction.findById(req.params.id);
    if(!transaction){
        return res.status(404).json({error:'Transaction not found'});
    }
    res.json(transaction);
}
catch(e){
    res.status(400).json({error:e.message});
}
})
//update transaction by id
app.put("/api/transactions/:id",async(req,res)=>{
    try{
        const transaction=await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if(!transaction){
            return res.status(404).json({error:'Transaction not found'});
        }
        res.json(transaction);

    }
    catch(e){
        res.status(400).json({error:e.message});
    }
})

//delete transaction by id

app.delete('/api/transactions/:id', async (req, res) => {
  try{
    const transaction=await Transaction.findByIdAndDelete(req.params.id);
    if(!transaction){
        return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted successfully' });
  }
  catch(e){
    res.status(400).json({ error: 'Failed to delete transaction' });
  }

});


//routes 
app.listen(PORT,()=>{
console.log(`server is running on port :${PORT}`);
});
