import express from "express";
import cors from "cors";
import fs from "fs";
import type { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const DATA_FILE = "public/data.json";

interface Transaction {
  id: string;
  name: string;
  category: string;
  date: string;
  price: number;
  type: "ingreso" | "gasto";
}

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

app.get("/transactions", (req: Request, res: Response) => {
  fs.readFile(DATA_FILE, (err, data) => {
    if (!fs.existsSync(DATA_FILE)) {
      return res.status(500).json({ error: "Archivo de datos no encontrado" });
    }
    if (err) return res.status(500).json({ error: "Error reading data" });
    res.json(JSON.parse(data.toString() || "[]"));
  });
});

app.post("/transactions", (req: Request, res: Response) => {
  const newTransaction: Transaction = req.body;
  fs.readFile(DATA_FILE, (err, data) => {
    let transactions: Transaction[] = [];
    transactions = JSON.parse(data.toString() || "[]");
    transactions.push(newTransaction);
    fs.writeFile(DATA_FILE, JSON.stringify(transactions, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Error al guardar datos" });
      res.json({ message: "Datos guardados" });
    });
  });
});

app.delete("/transactions/:id", (req: Request, res: Response) => {
    const transactionId = req.params.id;
    fs.readFile(DATA_FILE, (err, data) => {
      let transactions: Transaction[] = [];
      transactions = JSON.parse(data.toString() || "[]");
      let updateTransactions = transactions.filter(tx => tx.id !== transactionId);
      fs.writeFile(DATA_FILE, JSON.stringify(updateTransactions, null, 2), (err) => {
        if (err) return res.status(500).json({ error: "Error al guardar datos" });
        res.json({ message: "Datos guardados" });
      });
    });
});