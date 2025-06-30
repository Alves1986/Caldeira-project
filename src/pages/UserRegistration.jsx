// User Registration Page Component
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, Phone, Users, CheckCircle, AlertCircle, Loader2 } from '../components/Icons';

const UserRegistration = ({ prn, onRegistrationSuccess }) => {
  const [formData, setFormData] = useState({
    prn: prn || '',
    nomeCompleto: '',
    telefone: '',
    turma: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { registerUser } = useAuth();

  const turmas = ['A', 'B', 'C', 'D', 'E', 'ADM'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar nome completo
    if (!formData.nomeCompleto.trim()) {
      newErrors.nomeCompleto = 'Nome completo é obrigatório';
    } else if (formData.nomeCompleto.trim().length < 3) {
      newErrors.nomeCompleto = 'Nome deve ter pelo menos 3 caracteres';
    }

    // Validar telefone
    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    } else {
      // Remover caracteres não numéricos para validação
      const phoneNumbers = formData.telefone.replace(/\D/g, '');
      if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
        newErrors.telefone = 'Telefone deve ter 10 ou 11 dígitos';
      }
    }

    // Validar turma
    if (!formData.turma) {
      newErrors.turma = 'Turma é obrigatória';
    }

    // Validar PRN
    if (!formData.prn.trim()) {
      newErrors.prn = 'PRN é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatPhone = (value) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({
      ...prev,
      telefone: formatted
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await registerUser(formData);
      
      if (result.success) {
        onRegistrationSuccess(formData);
      } else {
        setErrors({
          submit: result.error || 'Erro ao cadastrar usuário. Tente novamente.'
        });
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      setErrors({
        submit: 'Erro inesperado. Tente novamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
            <User size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Primeiro Acesso
          </h1>
          <p className="text-gray-600">
            Complete seu cadastro para continuar
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* PRN (readonly) */}
          <div>
            <label htmlFor="prn" className="block text-sm font-medium text-gray-700 mb-2">
              PRN (Código de Registro)
            </label>
            <input
              type="text"
              id="prn"
              name="prn"
              value={formData.prn}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
            />
            {errors.prn && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={16} />
                {errors.prn}
              </p>
            )}
          </div>

          {/* Nome Completo */}
          <div>
            <label htmlFor="nomeCompleto" className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              id="nomeCompleto"
              name="nomeCompleto"
              value={formData.nomeCompleto}
              onChange={handleInputChange}
              placeholder="Digite seu nome completo"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.nomeCompleto ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.nomeCompleto && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={16} />
                {errors.nomeCompleto}
              </p>
            )}
          </div>

          {/* Telefone */}
          <div>
            <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
              Telefone *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone size={16} className="text-gray-400" />
              </div>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handlePhoneChange}
                placeholder="(11) 99999-9999"
                maxLength={15}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.telefone ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.telefone && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={16} />
                {errors.telefone}
              </p>
            )}
          </div>

          {/* Turma */}
          <div>
            <label htmlFor="turma" className="block text-sm font-medium text-gray-700 mb-2">
              Turma *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users size={16} className="text-gray-400" />
              </div>
              <select
                id="turma"
                name="turma"
                value={formData.turma}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.turma ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Selecione sua turma</option>
                {turmas.map(turma => (
                  <option key={turma} value={turma}>
                    Turma {turma}
                  </option>
                ))}
              </select>
            </div>
            {errors.turma && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={16} />
                {errors.turma}
              </p>
            )}
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 flex items-center gap-2">
                <AlertCircle size={16} />
                {errors.submit}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Cadastrando...
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                Completar Cadastro
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            * Campos obrigatórios
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;

