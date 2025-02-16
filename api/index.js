const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const app = express();



// Choose the correct database URL based on the environment
const MONGO_URI = process.env.NODE_ENV === "production" 
    ? process.env.MONGODB_URI_PROD 
    : process.env.MONGODB_URI_DEV;

if (!MONGO_URI) {
    console.error("MongoDB connection string is missing!");
    process.exit(1);
}

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log(`Connected to MongoDB: ${MONGO_URI}`))
  .catch(err => console.error("Error:", err));

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
    console.log("Received data:", req.body);

    const { name } = req.body;
    if (!name) {
        return res.status(400).send("Name is required");
    }

    try {
        const title = new Title({ title: name });
        await title.save();  // Inserts data & creates database if it doesn’t exist

        console.log("Name saved to database");
        res.render("show", { name });
    } catch (err) {
        console.error("Error saving to database:", err);
        res.status(500).send("Database error");
    }
});


// app.post("/show", async (req, res) => {
//     try {
//         const { name } = req.body;

//         // Save to MongoDB
//         const newTitle = new Title({ title: name });
//         await newTitle.save();

//         // Render response
//         res.render("show", { name });
//     } catch (error) {
//         console.log("Error saving to database:", error);
//         res.status(500).send("Internal Server Error");
//     }
// });

app.listen(3001, () => {
    console.log("LISTENING ON PORT 3001");
});
