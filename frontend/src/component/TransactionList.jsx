import React from 'react'
import axios from 'axios';
import {  toast } from 'react-toastify';
const API_BASE_URL = 'http://localhost:5000/api';

const TransactionList = ({ transactions, onTransactionDeleted, onEdit }) => {


  // handle delete transaction
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
         try {
          await axios.delete(`${API_BASE_URL}/transactions/${id}`);
        // call onTransactionDeleted to refresh the list
          onTransactionDeleted();
          toast.success('Successfully deleted');

        }
      catch (e) {
        console.log('error in deleting transaction', e);
        toast.error('Failed to delete transaction');
      }
    }
  };
// format date function
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  };




  return (
    <div className="p-6 bg-gray-50 rounded-xl shadow-md ">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Transaction History</h2>

      {
        transactions.length===0?(
          <div className="text-center py-8 text-gray-600 bg-white rounded-lg shadow-sm">
            <p>No transactions found. Add your first transaction above!</p>
          </div>
        ):(
          <div  className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'> 
          {
            transactions.map((transaction)=>(
                <div key={transaction._id} 
                className='bg-white p-5 rounded-xl shadow hover:shadow-lg transition'
                >
                  {/* header */}
                  <div className="flex items-center mb-3">
                   <h3 className="text-lg font-semibold text-gray-800">{transaction.title}</h3>
                  </div>
                  {/* details */}
                  <div className="mb-4">
                    <p className={`text-lg font-bold ${
                    transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>

                    {transaction.amount >=0 ? '+':'-'} INR{transaction.amount.toFixed(2)}
                    </p>
                     <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                <p className="text-sm text-gray-600">{transaction.category}</p>
                  </div>
                  {/* actions */}
                  <div className="flex gap-3">
                    <button onClick={()=>onEdit(transaction)}  className="flex-1 py-2 px-4 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(transaction._id)} className="flex-1 py-2 px-4 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition">
                      Delete
                    </button>

                  </div>
                </div>
                
            ))
          }
          </div>
        )
}
    </div>
  )
}

export default TransactionList