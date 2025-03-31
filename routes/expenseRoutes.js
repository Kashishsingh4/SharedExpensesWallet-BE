const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

router.post("/", async (req, res) => {
    try {
        const { amount, description, username, participants } = req.body;

        if (!amount || !description || !username || !participants || participants.length === 0) {
            return res.status(400).json({ error: "Amount, description, username, and participants are required" });
        }
        const totalOwed = participants.reduce((sum, participant) => sum + participant.amountOwed, 0);
        if (totalOwed > amount) {
            return res.status(400).json({ error: "The total amount owed by participants cannot exceed the total expense amount." });
        }

        const expense = new Expense({ amount, description, username, participants });
        await expense.save();

        res.status(201).json({ message: "Expense added", expense });
    } catch (error) {
        console.error("Error adding expense:", error);
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/", async (req, res) => {
    try {
        const { username } = req.query;

        if (!username) {
            return res.status(400).json({ error: "Username is required" });
        }

        const expenses = await Expense.find({ username });

        res.status(200).json({ expenses });
    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ error: "Expense not found" });
        }
        res.status(200).json({ expense });
    } catch (error) {
        console.error("Error fetching expense:", error);
        res.status(500).json({ error: "Server error" });
    }
});

router.put("/settle/:id", async (req, res) => {
    try {
        const expenseId = req.params.id;
        const expense = await Expense.findById(expenseId);

        if (!expense) {
            return res.status(404).json({ error: "Expense not found" });
        }

        expense.settled = true;  
        await expense.save();  

        res.status(200).json({ message: "Expense settled", expense });
    } catch (error) {
        console.error("Error settling expense:", error);
        res.status(500).json({ error: "Server error" });
    }
});



module.exports = router;
