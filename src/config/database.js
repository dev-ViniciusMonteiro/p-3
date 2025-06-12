const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuração da conexão com o banco de dados
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Função para inicializar o banco de dados e criar tabelas se não existirem
async function initDatabase() {
  try {
    // Verifica se a conexão está funcionando
    await pool.query('SELECT 1');
    console.log('Conexão com o banco de dados estabelecida com sucesso');
    
    // Cria a tabela de pacientes se não existir
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pacientes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        psicologo_id INT NOT NULL,
        nome VARCHAR(255) NOT NULL,
        data_nascimento DATE NOT NULL,
        cpf VARCHAR(14) NOT NULL UNIQUE,
        telefone VARCHAR(20) NOT NULL,
        email VARCHAR(255) NOT NULL,
        endereco VARCHAR(255),
        numero VARCHAR(20),
        complemento VARCHAR(100),
        bairro VARCHAR(100),
        cidade VARCHAR(100),
        uf CHAR(2),
        cep VARCHAR(10),
        sexo_genero VARCHAR(50),
        rg VARCHAR(20),
        responsavel VARCHAR(255),
        telefone_responsavel VARCHAR(20),
        escolaridade VARCHAR(100),
        profissao VARCHAR(100),
        queixa_principal TEXT,
        cid VARCHAR(20),
        historico_desenvolvimento TEXT,
        encaminhamento VARCHAR(255),
        status_consentimento ENUM('Pendente', 'Assinado', 'Recusado') DEFAULT 'Pendente',
        outras_informacoes TEXT,
        ativo BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (psicologo_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('Tabela de pacientes verificada/criada');
    
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
    throw error;
  }
}

module.exports = {
  pool,
  initDatabase
};