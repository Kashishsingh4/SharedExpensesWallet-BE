const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    username: { type: String, required: true },  
    settled: { type: Boolean, default: false },
    participants: [
        {
            username: { type: String, required: true },
            amountOwed: { type: Number, required: true }
        }
    ]
});

module.exports = mongoose.model("Expense", expenseSchema);
