const { pool } = require('../config/database');
const logger = require('../utils/logger');

class PacienteModel {
  // Criar um novo paciente
  async create(pacienteData) {
    try {
      const [result] = await pool.query(
        `INSERT INTO pacientes (
          psicologo_id, nome, data_nascimento, cpf, telefone, email, 
          endereco, numero, complemento, bairro, cidade, uf, cep, 
          sexo_genero, rg, responsavel, telefone_responsavel, 
          escolaridade, profissao, queixa_principal, cid, 
          historico_desenvolvimento, encaminhamento, status_consentimento, 
          outras_informacoes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          pacienteData.psicologo_id, pacienteData.nome, pacienteData.data_nascimento, 
          pacienteData.cpf, pacienteData.telefone, pacienteData.email, 
          pacienteData.endereco || null, pacienteData.numero || null, 
          pacienteData.complemento || null, pacienteData.bairro || null, 
          pacienteData.cidade || null, pacienteData.uf || null, 
          pacienteData.cep || null, pacienteData.sexo_genero || null, 
          pacienteData.rg || null, pacienteData.responsavel || null, 
          pacienteData.telefone_responsavel || null, pacienteData.escolaridade || null, 
          pacienteData.profissao || null, pacienteData.queixa_principal || null, 
          pacienteData.cid || null, pacienteData.historico_desenvolvimento || null, 
          pacienteData.encaminhamento || null, 
          pacienteData.status_consentimento || 'Pendente', 
          pacienteData.outras_informacoes || null
        ]
      );
      
      return { id: result.insertId, ...pacienteData };
    } catch (error) {
      logger.error('Erro ao criar paciente:', { error: error.message, pacienteData });
      throw error;
    }
  }

  // Buscar paciente por ID
  async findById(id, psicologoId) {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM pacientes WHERE id = ? AND psicologo_id = ? AND ativo = true`,
        [id, psicologoId]
      );
      
      return rows[0];
    } catch (error) {
      logger.error('Erro ao buscar paciente por ID:', { error: error.message, id, psicologoId });
      throw error;
    }
  }

  // Listar todos os pacientes de um psicólogo com paginação e busca
  async findAll(psicologoId, { page = 1, limit = 10, search = '' }) {
    try {
      const offset = (page - 1) * limit;
      let query = `
        SELECT id, nome, data_nascimento, telefone, email 
        FROM pacientes 
        WHERE psicologo_id = ? AND ativo = true
      `;
      
      const params = [psicologoId];
      
      // Adicionar filtro de busca se fornecido
      if (search) {
        query += ` AND (nome LIKE ? OR cpf LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
      }
      
      // Adicionar ordenação e paginação
      query += ` ORDER BY nome ASC LIMIT ? OFFSET ?`;
      params.push(parseInt(limit), offset);
      
      // Executar consulta paginada
      const [rows] = await pool.query(query, params);
      
      // Contar total de registros para metadados de paginação
      const [countResult] = await pool.query(
        `SELECT COUNT(*) as total FROM pacientes WHERE psicologo_id = ? AND ativo = true ${search ? 'AND (nome LIKE ? OR cpf LIKE ?)' : ''}`,
        search ? [psicologoId, `%${search}%`, `%${search}%`] : [psicologoId]
      );
      
      const total = countResult[0].total;
      const totalPages = Math.ceil(total / limit);
      
      return {
        data: rows,
        pagination: {
          total,
          totalPages,
          currentPage: page,
          limit
        }
      };
    } catch (error) {
      logger.error('Erro ao listar pacientes:', { error: error.message, psicologoId });
      throw error;
    }
  }

  // Atualizar paciente
  async update(id, psicologoId, pacienteData) {
    try {
      let query = 'UPDATE pacientes SET ';
      const values = [];
      const updateFields = [];
      
      // Mapear campos a serem atualizados
      const fields = [
        'nome', 'data_nascimento', 'cpf', 'telefone', 'email', 
        'endereco', 'numero', 'complemento', 'bairro', 'cidade', 
        'uf', 'cep', 'sexo_genero', 'rg', 'responsavel', 
        'telefone_responsavel', 'escolaridade', 'profissao', 
        'queixa_principal', 'cid', 'historico_desenvolvimento', 
        'encaminhamento', 'status_consentimento', 'outras_informacoes'
      ];
      
      fields.forEach(field => {
        if (pacienteData[field] !== undefined) {
          updateFields.push(`${field} = ?`);
          values.push(pacienteData[field]);
        }
      });
      
      // Se não houver campos para atualizar, retorna
      if (updateFields.length === 0) {
        return { id, ...pacienteData };
      }
      
      query += updateFields.join(', ') + ' WHERE id = ? AND psicologo_id = ?';
      values.push(id, psicologoId);
      
      const [result] = await pool.query(query, values);
      
      if (result.affectedRows === 0) {
        throw new Error('Paciente não encontrado ou não pertence ao psicólogo');
      }
      
      return { id, ...pacienteData };
    } catch (error) {
      logger.error('Erro ao atualizar paciente:', { error: error.message, id, psicologoId, pacienteData });
      throw error;
    }
  }

  // Desativar paciente (exclusão lógica)
  async deactivate(id, psicologoId) {
    try {
      const [result] = await pool.query(
        `UPDATE pacientes SET ativo = false WHERE id = ? AND psicologo_id = ?`,
        [id, psicologoId]
      );
      
      if (result.affectedRows === 0) {
        throw new Error('Paciente não encontrado ou não pertence ao psicólogo');
      }
      
      return { success: true };
    } catch (error) {
      logger.error('Erro ao desativar paciente:', { error: error.message, id, psicologoId });
      throw error;
    }
  }

  // Obter histórico completo do paciente
  async getFullHistory(id, psicologoId) {
    try {
      // Buscar dados do paciente
      const [pacienteData] = await pool.query(
        `SELECT * FROM pacientes WHERE id = ? AND psicologo_id = ? AND ativo = true`,
        [id, psicologoId]
      );
      
      if (pacienteData.length === 0) {
        throw new Error('Paciente não encontrado ou não pertence ao psicólogo');
      }
      
      // Buscar sessões do paciente
      const [sessoes] = await pool.query(
        `SELECT * FROM sessoes WHERE paciente_id = ? ORDER BY data_sessao DESC`,
        [id]
      );
      
      // Buscar fichas TCC do paciente
      const [fichasTCC] = await pool.query(
        `SELECT * FROM fichas_tcc WHERE paciente_id = ? ORDER BY data DESC`,
        [id]
      );
      
      // Buscar testes do paciente
      const [testes] = await pool.query(
        `SELECT * FROM testes WHERE paciente_id = ? ORDER BY data_aplicacao DESC`,
        [id]
      );
      
      return {
        paciente: pacienteData[0],
        sessoes,
        fichasTCC,
        testes
      };
    } catch (error) {
      logger.error('Erro ao obter histórico completo do paciente:', { error: error.message, id, psicologoId });
      throw error;
    }
  }
}

module.exports = new PacienteModel();