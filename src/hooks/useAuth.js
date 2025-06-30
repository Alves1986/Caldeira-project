// Custom hook for authentication management
import { useState, useEffect, createContext, useContext } from 'react';
import { userService } from '../utils/firebase-mock';

// Context para compartilhar estado de autenticação
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

// Provider de autenticação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar se há usuário logado no localStorage
  useEffect(() => {
    const checkStoredUser = () => {
      try {
        const storedUser = localStorage.getItem('caldeira_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Erro ao recuperar usuário do localStorage:', error);
        localStorage.removeItem('caldeira_user');
      } finally {
        setLoading(false);
      }
    };

    checkStoredUser();
  }, []);

  // Função de login com PRN
  const loginWithPRN = async (prn) => {
    try {
      setLoading(true);
      
      // Verificar se usuário existe
      const userExists = await userService.checkUserExists(prn);
      
      if (userExists) {
        // Usuário existe - fazer login
        const userData = await userService.getUserData(prn);
        if (userData) {
          // Atualizar último login
          await userService.updateLastLogin(prn);
          
          // Salvar no estado e localStorage
          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem('caldeira_user', JSON.stringify(userData));
          
          return { success: true, isNewUser: false, userData };
        }
      }
      
      // Usuário não existe - precisa se cadastrar
      return { success: true, isNewUser: true, prn };
      
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Função de cadastro
  const registerUser = async (userData) => {
    try {
      setLoading(true);
      
      const success = await userService.createUser(userData);
      
      if (success) {
        // Salvar no estado e localStorage
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('caldeira_user', JSON.stringify(userData));
        
        return { success: true };
      }
      
      return { success: false, error: 'Erro ao criar usuário' };
      
    } catch (error) {
      console.error('Erro no cadastro:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('caldeira_user');
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    loginWithPRN,
    registerUser,
    logout
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};

