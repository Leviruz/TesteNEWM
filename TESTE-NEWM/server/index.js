const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json()); //request do body

//ROUTES

//function de post: criar o cliente

//req res = request do client side, e response pro client side

app.post("/clientes", async (req, res) => {
  //await = espera a função ser completada antes de prossguir
  try {
    const { nome, cpf, celular, email, endereco, observacao } = req.body;
    const verifiedCPF = await pool.query(
      "SELECT * FROM cliente WHERE (cpf) = $1",
      [cpf]
    );
    if (verifiedCPF.rows.length >= 1) {
      res.status(400).json({
        message: "CPF Já cadastrado no sistema",
      });
    } else {
      const newCliente = await pool.query(
        "INSERT INTO cliente (nome,cpf,celular,email,endereco,observacao) VALUES($1,$2,$3,$4,$5,$6) RETURNING *",
        [nome, cpf, celular, email, endereco, observacao]
      );
      res.status(201).json(newCliente.rows[0]);
    }
  } catch (err) {
    console.error(err.message);
  }
});

// function de get: pegar todos os clientes

app.get("/clientes", async (req, res) => {
  try {
    const allClientes = await pool.query("SELECT * FROM cliente");
    res.json(allClientes.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//function de get: pegar UM cliente em especifico

app.get("/clientes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await pool.query(
      "SELECT * FROM cliente WHERE client_id = $1 ",
      [id]
    );

    if (cliente.rows.length === 0) {
      res.status(404).json({
        message: "ID de cliente não encontrado = " + id,
      });
    } else {
      res.json(cliente.rows[0]);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Erro ao buscar o cliente" });
  }
});

// atualizar um cliente

app.put("/clientes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, cpf, celular, email, endereco, observacao } = req.body;
    const updateClientes = await pool.query(
      "UPDATE cliente SET nome = $1, cpf = $2, celular = $3, email = $4, endereco = $5, observacao = $6 WHERE client_id = $7",
      [nome, cpf, celular, email, endereco, observacao, id]
    );
    res.json("dados do cliente atualizados");
  } catch (err) {
    console.error(err.message);
  }
});

//apagar cliente

app.delete("/clientes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteCliente = await pool.query(
      "DELETE FROM cliente WHERE client_id = $1 ",
      [id]
    );
    res.json("CLIENTE DELETADO");
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(5000, () => {
  console.log("o server foi iniciado na porta 5000");
});
