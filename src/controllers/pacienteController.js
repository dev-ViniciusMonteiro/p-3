const pacienteModel = require('../models/pacienteModel');
const logger = require('../utils/logger');

// Controller para gerenciamento de pacientes
class PacienteController {
  // Criar novo paciente
  async createPaciente(req, res) {
    try {
      // Obter ID do psicólogo autenticado
      const psicologoId = req.user.id;
      
      // Validar campos obrigatórios
      const { nome, data_nascimento, cpf, telefone, email } = req.body;
      
      if (!nome || !data_nascimento || !cpf || !telefone || !email) {
        return res.status(400).json({ 
          message: 'Campos obrigatórios: nome, data_nascimento, cpf, telefone, email' 
        });
      }
      
      // Criar paciente com vínculo ao psicólogo
      const pacienteData = {
        psicologo_id: psicologoId,
        nome,
        data_nascimento,
        cpf,
        telefone,
        email,
        // Campos opcionais
        endereco: req.body.endereco,
        numero: req.body.numero,
        complemento: req.body.complemento,
        bairro: req.body.bairro,
        cidade: req.body.cidade,
        uf: req.body.uf,
        cep: req.body.cep,
        sexo_genero: req.body.sexo_genero,
        rg: req.body.rg,
        responsavel: req.body.responsavel,
        telefone_responsavel: req.body.telefone_responsavel,
        escolaridade: req.body.escolaridade,
        profissao: req.body.profissao,
        queixa_principal: req.body.queixa_principal,
        cid: req.body.cid,
        historico_desenvolvimento: req.body.historico_desenvolvimento,
        encaminhamento: req.body.encaminhamento,
        status_consentimento: req.body.status_consentimento,
        outras_informacoes: req.body.outras_informacoes
      };
      
      const novoPaciente = await pacienteModel.create(pacienteData);
      
      logger.info('Paciente criado com sucesso', { 
        userId: psicologoId, 
        pacienteId: novoPaciente.id 
      });
      
      res.status(201).json({
        message: 'Paciente cadastrado com sucesso',
        paciente: novoPaciente
      });
    } catch (error) {
      logger.error('Erro ao criar paciente:', { error: error.message });
      
      // Verificar se é erro de duplicidade (CPF já cadastrado)
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'CPF já cadastrado no sistema' });
      }
      
      res.status(500).json({ message: 'Erro ao cadastrar paciente' });
    }
  }

  // Listar pacientes com paginação e busca
  async listPacientes(req, res) {
    try {
      const psicologoId = req.user.id;
      const { page = 1, limit = 10, search = '' } = req.query;
      
      const pacientes = await pacienteModel.findAll(psicologoId, {
        page: parseInt(page),
        limit: parseInt(limit),
        search
      });
      
      res.status(200).json(pacientes);
    } catch (error) {
      logger.error('Erro ao listar pacientes:', { error: error.message });
      res.status(500).json({ message: 'Erro ao listar pacientes' });
    }
  }

  // Obter paciente por ID
  async getPaciente(req, res) {
    try {
      const psicologoId = req.user.id;
      const pacienteId = req.params.id;
      
      const paciente = await pacienteModel.findById(pacienteId, psicologoId);
      
      if (!paciente) {
        return res.status(404).json({ message: 'Paciente não encontrado' });
      }
      
      res.status(200).json(paciente);
    } catch (error) {
      logger.error('Erro ao buscar paciente:', { error: error.message });
      res.status(500).json({ message: 'Erro ao buscar paciente' });
    }
  }

  // Atualizar paciente
  async updatePaciente(req, res) {
    try {
      const psicologoId = req.user.id;
      const pacienteId = req.params.id;
      
      // Verificar se o paciente existe
      const pacienteExistente = await pacienteModel.findById(pacienteId, psicologoId);
      
      if (!pacienteExistente) {
        return res.status(404).json({ message: 'Paciente não encontrado' });
      }
      
      // Atualizar dados do paciente
      const pacienteAtualizado = await pacienteModel.update(pacienteId, psicologoId, req.body);
      
      logger.info('Paciente atualizado com sucesso', { 
        userId: psicologoId, 
        pacienteId 
      });
      
      res.status(200).json({
        message: 'Paciente atualizado com sucesso',
        paciente: pacienteAtualizado
      });
    } catch (error) {
      logger.error('Erro ao atualizar paciente:', { error: error.message });
      
      if (error.message === 'Paciente não encontrado ou não pertence ao psicólogo') {
        return res.status(404).json({ message: error.message });
      }
      
      res.status(500).json({ message: 'Erro ao atualizar paciente' });
    }
  }

  // Desativar paciente (exclusão lógica)
  async deactivatePaciente(req, res) {
    try {
      const psicologoId = req.user.id;
      const pacienteId = req.params.id;
      
      await pacienteModel.deactivate(pacienteId, psicologoId);
      
      logger.info('Paciente desativado com sucesso', { 
        userId: psicologoId, 
        pacienteId 
      });
      
      res.status(200).json({ message: 'Paciente desativado com sucesso' });
    } catch (error) {
      logger.error('Erro ao desativar paciente:', { error: error.message });
      
      if (error.message === 'Paciente não encontrado ou não pertence ao psicólogo') {
        return res.status(404).json({ message: error.message });
      }
      
      res.status(500).json({ message: 'Erro ao desativar paciente' });
    }
  }

  // Obter histórico completo do paciente
  async getFullHistory(req, res) {
    try {
      const psicologoId = req.user.id;
      const pacienteId = req.params.id;
      
      const historico = await pacienteModel.getFullHistory(pacienteId, psicologoId);
      
      res.status(200).json(historico);
    } catch (error) {
      logger.error('Erro ao obter histórico do paciente:', { error: error.message });
      
      if (error.message === 'Paciente não encontrado ou não pertence ao psicólogo') {
        return res.status(404).json({ message: error.message });
      }
      
      res.status(500).json({ message: 'Erro ao obter histórico do paciente' });
    }
  }
}

module.exports = new PacienteController();