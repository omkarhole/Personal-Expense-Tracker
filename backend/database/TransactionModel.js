const{model}=require("mongoose");
const {Schema} =require("mongoose");

// Transaction Schema definition
const transactionSchema = new Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  category: { type: String, required: true }
}, { timestamps: true });

const Transaction =  model('Transaction', transactionSchema);
module.exports = Transaction;