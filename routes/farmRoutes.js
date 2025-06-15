const express = require('express');
const farmControl = require('../controller/farmController');
const requireAuth = require('../middlewares/authMiddleware');  // Middleware de autenticação
const requireOwner = require('../middlewares/ownerMiddleware');  // Middleware de proprietário

const router = express.Router();

// Rota para pegar todas as fazendas (acessível apenas por usuários autenticados)
router.get("/farms", requireAuth, farmControl.funcGetAllFarms);

// Rota para pegar uma fazenda específica (acessível apenas por usuários autenticados)
router.get("/farm/:id", requireAuth, farmControl.funcGetAFarm);

// Rota para criar uma nova fazenda (acessível apenas por usuários do tipo "OWNER" e autenticados)
router.post("/createFarm", requireAuth, requireOwner, farmControl.funcPostFarm);

// Rota para deletar uma fazenda (acessível apenas por usuários do tipo "OWNER" e autenticados)
router.delete("/farm/:id", requireAuth, requireOwner, farmControl.funcDelFarm);

// Rota para obter coordenadas (acessível apenas por usuários autenticados)
router.get('/geocode', requireAuth, farmControl.funcGetCoord);

// Rota para obter o endereço a partir de coordenadas (acessível apenas por usuários autenticados)
router.get('/reverse-geocode', requireAuth, farmControl.funcGetAdd);

module.exports = router;
