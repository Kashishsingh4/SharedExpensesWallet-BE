const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes"); 

const app = express();

app.use(express.json());
app.use(cors()); 


mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));


app.use("/user", userRoutes);
app.use("/expenses", expenseRoutes); 

app.get("/api/search", async (req, res) => {

  const { description, username } = req.query;
  
  try {
      const Expense = mongoose.model("Expense");  
      
      const expenses = await Expense.find({
          description: new RegExp(description, "i"),
          settled: true,
          username: new RegExp(username, "i")
      });
      res.json(expenses);
  } catch (error) {
      console.error("Error fetching expenses:", error);
      res.status(500).send("Error fetching data");
  }
});


app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
