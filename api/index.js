const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/profileDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log("Error:", err));

// Define Mongoose Schema & Model
const titleSchema = new mongoose.Schema({
    title: String
});
const Title = mongoose.model("Title", titleSchema);

app.set("view engine", "ejs");
app.set("views", __dirname + "/../views");
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/show", async (req, res) => {
    try {
        const { name } = req.body;

        // Save to MongoDB
        const newTitle = new Title({ title: name });
        await newTitle.save();

        // Render response
        res.render("show", { name });
    } catch (error) {
        console.log("Error saving to database:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(3001, () => {
    console.log("LISTENING ON PORT 3001");
});
