// No início de cada arquivo .jsx
import React from 'react';
// Mock Firebase services for local testing
export const db = {
  // Mock database object
};

// Mock user service
export const userService = {
  // Verificar se usuário existe pelo PRN
  async checkUserExists(prn) {
    try {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Para teste, considerar que usuários com PRN "123" já existem
      return prn === "123" || prn === "admin";
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
      return false;
    }
  },

  // Buscar dados do usuário pelo PRN
  async getUserData(prn) {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (prn === "123") {
        return {
          prn: "123",
          nomeCompleto: "João Silva",
          telefone: "(11) 99999-9999",
          turma: "A",
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
      }
      
      if (prn === "admin") {
        return {
          prn: "admin",
          nomeCompleto: "Administrador",
          telefone: "(11) 88888-8888",
          turma: "ADM",
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      return null;
    }
  },

  // Criar novo usuário
  async createUser(userData) {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simular salvamento bem-sucedido
      console.log('Usuário criado (mock):', userData);
      return true;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      return false;
    }
  },

  // Atualizar último login
  async updateLastLogin(prn) {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log('Último login atualizado (mock):', prn);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar último login:', error);
      return false;
    }
  }
};

// Mock report service
export const reportService = {
  // Salvar relatório de inspeção
  async saveReport(reportData) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const reportId = 'mock_report_' + Date.now();
      console.log('Relatório salvo (mock):', reportId, reportData);
      return reportId;
    } catch (error) {
      console.error('Erro ao salvar relatório:', error);
      return null;
    }
  },

  // Buscar relatórios por usuário
  async getUserReports(prn, limit = 10) {
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Retornar relatórios mock
      return [
        {
          id: 'report_1',
          userPRN: prn,
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
          chamaVisivel: 'Sim',
          corChama: 'Sim'
        },
        {
          id: 'report_2',
          userPRN: prn,
          createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
          chamaVisivel: 'Não',
          corChama: 'Não'
        }
      ];
    } catch (error) {
      console.error('Erro ao buscar relatórios:', error);
      return [];
    }
  }
};

