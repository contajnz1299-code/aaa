const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const FILE = "dados.txt";

// LOGIN SIMPLES
const USER = "moskitao";
const PASS = "123";

app.post("/login", (req, res) => {
  const { user, pass } = req.body;

  if (user === USER && pass === PASS) {
    return res.json({ success: true });
  }

  res.json({ success: false });
});

app.post("/login", (req, res) => {
  const { user, pass } = req.body;

  if (user === "admin" && pass === "123") {
    return res.json({ success: true });
  }

  res.json({ success: false });
});

// Criar arquivo se não existir
if (!fs.existsSync(FILE)) {
  fs.writeFileSync(FILE, JSON.stringify([]));
}

// GET → pegar dados
app.get("/get", (req, res) => {
  const page = req.query.page;

  let data = JSON.parse(fs.readFileSync(FILE));

  res.json(data[page] || []);
});

// POST → salvar dados
app.post("/save", (req, res) => {
  const { page, index, value } = req.body;

  let data = JSON.parse(fs.readFileSync(FILE));

  if (!data[page]) data[page] = [];

  data[page][index] = value;

  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
  res.sendStatus(200);
});

function resetarDados() {

  if (!confirm("Tem certeza que deseja resetar os dados?")) return;

  fetch("http://localhost:3001/reset", {
    method: "POST"
  })
  .then(() => {
    window.location.href = "site.html"; // 🔥 REDIRECIONA
  })
  .catch(err => {
    console.log(err);
    alert("Erro ao resetar");
  });

}

app.post("/reset", (req, res) => {
  fs.writeFileSync(FILE, JSON.stringify({}, null, 2));
  res.sendStatus(200);
});

app.listen(3001, () => {
  console.log("Servidor rodando em http://localhost:3001");
});

