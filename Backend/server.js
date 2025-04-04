import express from "express";
import cors from "cors";
import boatRoutes from "./boat";

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use("/boats", boatRoutes);

app.get("/", (req, res) => {
  res.send("API do Sistema VIP Náutica rodando!");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
