// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';

// Firebase config - você deve substituir pelos seus dados do Firebase
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// User management functions
export const userService = {
  // Verificar se usuário existe pelo PRN
  async checkUserExists(prn) {
    try {
      const userDoc = await getDoc(doc(db, 'users', prn));
      return userDoc.exists();
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
      return false;
    }
  },

  // Buscar dados do usuário pelo PRN
  async getUserData(prn) {
    try {
      const userDoc = await getDoc(doc(db, 'users', prn));
      if (userDoc.exists()) {
        return userDoc.data();
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
      await setDoc(doc(db, 'users', userData.prn), {
        ...userData,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      return false;
    }
  },

  // Atualizar último login
  async updateLastLogin(prn) {
    try {
      await setDoc(doc(db, 'users', prn), {
        lastLogin: serverTimestamp()
      }, { merge: true });
      return true;
    } catch (error) {
      console.error('Erro ao atualizar último login:', error);
      return false;
    }
  }
};

// Inspection reports management
export const reportService = {
  // Salvar relatório de inspeção
  async saveReport(reportData) {
    try {
      const docRef = await addDoc(collection(db, 'reports'), {
        ...reportData,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao salvar relatório:', error);
      return null;
    }
  },

  // Buscar relatórios por usuário
  async getUserReports(prn, limit = 10) {
    try {
      // Implementar busca de relatórios por usuário
      // Esta função será expandida conforme necessário
      return [];
    } catch (error) {
      console.error('Erro ao buscar relatórios:', error);
      return [];
    }
  }
};

