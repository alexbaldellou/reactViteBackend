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
const DATA_FILE = "./data.json"; //const DATA_FILE = "public/data.json";
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
        transactions = JSON.parse(data.toString() || "[]");
        transactions.push(newTransaction);
        fs_1.default.writeFile(DATA_FILE, JSON.stringify(transactions, null, 2), (err) => {
            if (err)
                return res.status(500).json({ error: "Error al guardar datos" });
            res.json({ message: "Datos guardados" });
        });
    });
});
app.delete("/transactions/:id", (req, res) => {
    const transactionId = req.params.id;
    fs_1.default.readFile(DATA_FILE, (err, data) => {
        let transactions = [];
        transactions = JSON.parse(data.toString() || "[]");
        let updateTransactions = transactions.filter(tx => tx.id !== transactionId);
        fs_1.default.writeFile(DATA_FILE, JSON.stringify(updateTransactions, null, 2), (err) => {
            if (err)
                return res.status(500).json({ error: "Error al guardar datos" });
            res.json({ message: "Datos guardados" });
        });
    });
});
//# sourceMappingURL=index.js.map