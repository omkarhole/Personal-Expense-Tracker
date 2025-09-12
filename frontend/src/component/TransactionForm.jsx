import  { useState, useEffect } from "react";
import axios from "axios";
import {  toast } from 'react-toastify';

const API_BASE_URL = "https://personal-expense-tracker-backend-rc20.onrender.com/api";

const TransactionForm = ({
    onTransactionAdded,
    editingTransaction,
    onEditComplete,

}) => {

    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        date: '',
        category: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (editingTransaction) {
            setFormData({
                title: editingTransaction.title,
                amount: editingTransaction.amount,
                date: editingTransaction.date
                    ? new Date(editingTransaction.date).toISOString().split('T')[0]
                    : '',
                category: editingTransaction.category,
            });
        }
    }, [editingTransaction]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        //handle form editingTransaction
        try {
            if (editingTransaction) {
                await axios.put(
                    `${API_BASE_URL}/transactions/${editingTransaction._id}`,
                    formData
                );
                onEditComplete();
            } else {
                await axios.post(`${API_BASE_URL}/transactions`, formData);
                onTransactionAdded();
                toast.success("Added New Data")
            }
            setFormData({ title: "", amount: "", date: "", category: "" });
        } catch (error) {
            console.error("Error saving transaction:", error);
            toast.error("Failed to save transaction");
        } finally {
            setIsSubmitting(false);
        }

    };
    // handle cancel button click
    const handleCancel = () => {
        setFormData({ title: "", amount: "", date: "", category: "" });
        onEditComplete();
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-6" >
            <form action="" onSubmit={handleSubmit} className="space-y-5" >
                <h2 className="text-xl font-semibold mb-4" >
                    {editingTransaction ? " Edit Transaction " : " Add New Transaction"}
                </h2>
                {/* title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1" >
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="e.g. Salary, Groceries, Coffee"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                    {/* amount */}
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1 mt-4" >
                            Amount
                        </label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            placeholder="Enter amount (positive for income, negative for expense)"
                            value={formData.amount}
                            onChange={handleChange}
                            step="0.01"
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        />

                    </div>
                    {/* Date */}
                    <div>
                        <label
                            htmlFor="date"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Date
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label
                            htmlFor="category"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Category
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Category</option>
                            <option value="Food">Food</option>
                            <option value="Transportation">Transportation</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Bills">Bills</option>
                            <option value="Salary">Salary</option>
                            <option value="Freelance">Freelance</option>
                            <option value="Investment">Investment</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    {/* Buttons */}
                    <div className="mt-3 flex gap-3">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isSubmitting
                                ? "Saving..."
                                : editingTransaction
                                    ? "Update"
                                    : "Add Transaction"}
                        </button>

                        {editingTransaction && (
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                        )}
                    </div>

                </div>

            </form>
        </div>
    )
}

export default TransactionForm