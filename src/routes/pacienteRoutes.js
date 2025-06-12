const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');
const { isAuthenticated, logAccess } = require('../middlewares/authMiddleware');

// Todas as rotas requerem autenticação
router.use(isAuthenticated);

// Rota para criar um novo paciente
router.post('/', logAccess('criar_paciente'), pacienteController.createPaciente);

// Rota para listar pacientes com paginação e busca
router.get('/', logAccess('listar_pacientes'), pacienteController.listPacientes);

// Rota para obter um paciente específico por ID
router.get('/:id', logAccess('visualizar_paciente'), pacienteController.getPaciente);

// Rota para atualizar um paciente
router.put('/:id', logAccess('atualizar_paciente'), pacienteController.updatePaciente);

// Rota para desativar um paciente (exclusão lógica)
router.delete('/:id', logAccess('desativar_paciente'), pacienteController.deactivatePaciente);

// Rota para obter o histórico completo de um paciente
router.get('/:id/historico', logAccess('visualizar_historico_paciente'), pacienteController.getFullHistory);

module.exports = router;