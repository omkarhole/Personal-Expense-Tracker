import React, { useState, useEffect } from 'react'
import axios from "axios";
import TransactionForm from "./component/TransactionForm";
import TransactionList from "./component/TransactionList";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import {  toast } from 'react-toastify';

const API_BASE_URL = "https://personal-expense-tracker-backend-rc20.onrender.com/api";
const App = () => {
    //use state for transactions
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingTransaction, setEditingTransaction] = useState(null);

    useEffect(() => {
        fetchTransactions();
    }, []);
    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/transactions`);
            setTransactions(response.data);
            setError(null);
            setLoading(false);

        }
        catch (e) {
console.log("error in fetching transaction ",e);
          toast.error('error in fetching transactions');
            setError("Failed to fetch transactions");
        }
        finally {
            setLoading(false);
        }
    };


    const handleTransactionAdded = () => {
        fetchTransactions();
    }
    const handleTransactionDeleted = () => {
        fetchTransactions();
    };
    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
    };
    const handleEditComplete = () => {
        setEditingTransaction(null);
        fetchTransactions();
        toast.success('Successfully edited')
    };
    const totalBalance = transactions.reduce(
        (sum, transaction) => sum + transaction.amount,
        0
    );

    const income = transactions
        .filter((t) => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
        .filter((t) => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    if (loading) {
        return <div className="text-center py-10 " > <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box></div>;
    }
    if (error)
        return (
            <div className="text-center text-red-500 py-10">Error: {error}</div>
        );
    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            {/* Header */}
            <header className="bg-white shadow-md py-6 px-4">
                <h1 className="text-3xl font-bold text-center mb-6">
                    Personal Finance Tracker
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                    <div className="bg-blue-50 p-4 rounded-lg shadow text-center">
                        <h3 className="text-lg font-semibold">Total Balance</h3>
                        <p
                            className={`text-2xl font-bold ${totalBalance >= 0 ? "text-green-600" : "text-red-600"
                                }`}
                        >
                            ${totalBalance.toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg shadow text-center">
                        <h3 className="text-lg font-semibold">Income</h3>
                        <p className="text-2xl font-bold text-green-600">
                            ${income.toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg shadow text-center">
                        <h3 className="text-lg font-semibold">Expense</h3>
                        <p className="text-2xl font-bold text-red-600">
                            ${expense.toFixed(2)}
                        </p>
                    </div>
                </div>
            </header>

            {/* main content */}
            <main className="max-w-4xl mx-auto py-10 px-4 space-y-8" >
                <TransactionForm
                    onTransactionAdded={handleTransactionAdded}
                    editingTransaction={editingTransaction}
                    onEditComplete={handleEditComplete}
                />
                <TransactionList 
                transactions={transactions}
                onTransactionDeleted={handleTransactionDeleted}
                onEdit={handleEdit}
                />
            </main>
        </div>
    )
}

export default App