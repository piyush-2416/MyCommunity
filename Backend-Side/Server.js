
import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";
import { ObjectId } from "mongodb"; // top pe

const MONGODB_URI = "Put your db  url"; // apna URI daalo
const Database = "Community-data";
const collection = "Business-data";
const collection2="Complaints-data";
const collection3="Notices-data";
const collection4="Events-data";
const collection5 = "Lost & Found data";
const collection6 = "Society Gallery data";
const collection7 = "Society Polls/Voting Collection";



dotenv.config();

const app = express();
app.use(cors()); // React ko allow karega
app.use(express.json());

const PORT = process.env.PORT || 3000;

const client = new MongoClient(MONGODB_URI);

// // 🔥 Connect DB once
let db;
async function connectDB() {
  try {
    await client.connect();
    console.log("✅ MongoDB Connected");
    db = client.db(Database); // 👈 apna database name
  } catch (error) {
    console.log("❌ DB Error:", error);
  }
}

connectDB();

// // ✅ Route 1: Saare products lao (Home page ke liye)
app.get("/api/products", async (req, res) => {
  try {
    const data = await db
      .collection(collection)
      .find()
      .toArray();
db=client.db(Database);
    res.json(data); // React ko data bhej raha hai
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/Complains", async (req, res) => {
  try {
    const data = await db
      .collection(collection2)
      .find()
      .toArray();
db=client.db(Database);
    res.json(data); // React ko data bhej raha hai
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/Notice", async (req, res) => {
  try {
    const data = await db
      .collection(collection3)
      .find()
      .toArray();
db=client.db(Database);
    res.json(data); // React ko data bhej raha hai
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/Events", async (req, res) => {
  try {
    const data = await db
      .collection(collection4)
      .find()
      .toArray();
db=client.db(Database);
    res.json(data); // React ko data bhej raha hai
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/Lost & Found data", async (req, res) => {
  try {
    const data = await db
      .collection(collection5)
      .find()
      .toArray();
db=client.db(Database);
    res.json(data); // React ko data bhej raha hai
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/Society Gallery data", async (req, res) => {
  try {
    const data = await db
      .collection(collection6)
      .find()
      .toArray();
db=client.db(Database);
    res.json(data); // React ko data bhej raha hai
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/Society_Polls", async (req, res) => {
  try {
    const data = await db
      .collection(collection7)
      .find()
      .toArray();
db=client.db(Database);
    res.json(data); // React ko data bhej raha hai
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// // ✅ Route 2: Single product by ID (Product detail page ke liye)
// app.get("/api/products/:id", async (req, res) => {
//   try {
//     const productId = req.params.id;

//     // Pehle ObjectId se try karo
//     let product = null;

//     try {
//       const { ObjectId } = await import("mongodb");
//       if (ObjectId.isValid(productId)) {
//         product = await db
//           .collection(collection)
//           .findOne({ _id: new ObjectId(productId) });
//       }
//     } catch (e) {}

//     // Agar nahi mila toh string ID se try karo
//     if (!product) {
//       product = await db
//         .collection(collection)
//         .findOne({ _id: productId });
//     }

//     // Agar phir bhi nahi mila toh kisi aur field se try karo
//     if (!product) {
//       product = await db
//         .collection(collection)
//         .findOne({ id: productId });
//     }

//     if (!product) {
//       return res.status(404).json({ error: "Product nahi mila!" });
//     }

//     res.json(product);

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
// // ✅ Route 2: Single product by ID (Product detail page ke liye)
// app.get("/api/Doctorid/:id", async (req, res) => {
//   try {
//     const productId = req.params.id;

//     // Pehle ObjectId se try karo
//     let product = null;

//     try {
//       const { ObjectId } = await import("mongodb");
//       if (ObjectId.isValid(productId)) {
//         product = await db
//           .collection(collection)
//           .findOne({ _id: new ObjectId(productId) });
//       }
//     } catch (e) {}

//     // Agar nahi mila toh string ID se try karo
//     if (!product) {
//       product = await db
//         .collection(collection)
//         .findOne({ _id: productId });
//     }

//     // Agar phir bhi nahi mila toh kisi aur field se try karo
//     if (!product) {
//       product = await db
//         .collection(collection)
//         .findOne({ id: productId });
//     }

//     if (!product) {
//       return res.status(404).json({ error: "Product nahi mila!" });
//     }

//     res.json(product);

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Server start
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
