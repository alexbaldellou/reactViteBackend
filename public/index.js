"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const DATA_FILE = "src/data.json";
// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
app.get("/transactions", (req, res) => {
    fs_1.default.readFile(DATA_FILE, (err, data) => {
        if (!fs_1.default.existsSync(DATA_FILE)) {
            return res.status(500).json({ error: "Archivo de datos no encontrado" });
        }
        if (err)
            return res.status(500).json({ error: "Error reading data" });
        res.json(JSON.parse(data.toString() || "[]"));
    });
});
app.post("/transactions", (req, res) => {
    const newTransaction = req.body;
    fs_1.default.readFile(DATA_FILE, (err, data) => {
        let transactions = [];
        if (!err)
            transactions = JSON.parse(data.toString() || "[]");
        transactions.push(newTransaction);
        fs_1.default.writeFile(DATA_FILE, JSON.stringify(transactions, null, 2), (err) => {
            if (err)
                return res.status(500).json({ error: "Error saving data" });
            res.json({ message: "Transaction saved" });
        });
    });
});

// app.delete("/transactions/:id", async (req, res) => {
//     try {
//       const transactionId = req.params.id;
//       let transactions = JSON.parse(data || "[]");

//     // Buscar si la transacción existe
//     const transactionExists = transactions.some(tx => tx.id === transactionId);
//     if (!transactionExists) {
//       return res.status(404).json({ error: "Transaction not found" });
//     }

//     // Filtrar eliminando la transacción con el ID especificado
//     transactions = transactions.filter(tx => tx.id !== transactionId);

//     // Guardar el nuevo array sin la transacción eliminada
//     await fs.writeFile(DATA_FILE, JSON.stringify(transactions, null, 2));
  
//       res.json({ message: "Transaction deleted" });
//     } catch (error) {
//       res.status(500).json({ error: "Error deleting transaction" });
//     }
//   });

app.delete("/transactions/:id", async (req, res) => {
    try {
      const transactionId = req.params.id; // Captura el ID de la URL
  
      // Leer transacciones desde el archivo
      const data = await fs.readFile(DATA_FILE, "utf8");
      let transactions = JSON.parse(data || "[]");
  
      // Buscar si la transacción existe
      const transactionExists = transactions.some(tx => tx.id === transactionId);
      if (!transactionExists) {
        return res.status(404).json({ error: "Transaction not found" });
      }
  
      // Filtrar eliminando la transacción con el ID especificado
      transactions = transactions.filter(tx => tx.id !== transactionId);
  
      // Guardar el nuevo array sin la transacción eliminada
      await fs.writeFile(DATA_FILE, JSON.stringify(transactions, null, 2));
  
      res.json({ message: "Transaction deleted" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting transaction" });
    }
  });
//# sourceMappingURL=index.js.map