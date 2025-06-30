// Enhanced Inspection Form Component
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { reportService } from '../utils/firebase-mock';
import { 
  Camera, 
  Upload, 
  Save, 
  Send, 
  Copy, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  LogOut,
  User,
  Clock,
  FileText
} from '../components/Icons';

const InspectionForm = () => {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    chamaVisivel: '',
    chamaMovimento: '',
    corChama: '',
    arraste: '',
    detalhesVisores: '',
    imagenesVisores: [],
    sopragemRealizada: '',
    quantasVezes: '',
    detalhesSopragem: '',
    queimaUniforme: '',
    biomassaUmida: '',
    dificuldadeBiomassa: '',
    detalhesBiomassa: '',
    valoresParametros: '',
    co: '',
    o2: '',
    detalhesGases: '',
    arrasteMaterial: '',
    detalhesArraste: '',
    imagenesArraste: [],
    alcalinidadeAreia: '',
    detalhesAreia: '',
    imagenesAreia: [],
    dificuldadesGerais: ''
  });

  const [currentSection, setCurrentSection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [progress, setProgress] = useState(0);

  const totalSections = 7;

  // Auto-save functionality
  useEffect(() => {
    const autoSave = () => {
      try {
        localStorage.setItem('caldeira_draft', JSON.stringify({
          ...formData,
          lastSaved: new Date().toISOString(),
          userPRN: user?.prn
        }));
        setAutoSaveStatus('Rascunho salvo automaticamente');
        setTimeout(() => setAutoSaveStatus(''), 3000);
      } catch (error) {
        console.error('Erro no auto-save:', error);
      }
    };

    const timer = setTimeout(autoSave, 30000); // Auto-save a cada 30 segundos
    return () => clearTimeout(timer);
  }, [formData, user]);

  // Load draft on mount
  useEffect(() => {
    try {
      const draft = localStorage.getItem('caldeira_draft');
      if (draft) {
        const draftData = JSON.parse(draft);
        if (draftData.userPRN === user?.prn) {
          setFormData(draftData);
          setAutoSaveStatus('Rascunho recuperado');
          setTimeout(() => setAutoSaveStatus(''), 3000);
        }
      }
    } catch (error) {
      console.error('Erro ao recuperar rascunho:', error);
    }
  }, [user]);

  // Calculate progress
  useEffect(() => {
    const filledFields = Object.values(formData).filter(value => 
      value !== '' && value !== null && value !== undefined
    ).length;
    const totalFields = Object.keys(formData).length;
    setProgress(Math.round((filledFields / totalFields) * 100));
  }, [formData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleImageUpload = (field, files) => {
    // Implementar upload de imagens
    const imageFiles = Array.from(files);
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), ...imageFiles]
    }));
  };

  const validateCurrentSection = () => {
    const errors = {};
    
    switch (currentSection) {
      case 1:
        if (!formData.chamaVisivel) errors.chamaVisivel = 'Campo obrigatório';
        if (!formData.corChama) errors.corChama = 'Campo obrigatório';
        if (!formData.arraste) errors.arraste = 'Campo obrigatório';
        break;
      case 2:
        if (!formData.sopragemRealizada) errors.sopragemRealizada = 'Campo obrigatório';
        break;
      case 3:
        if (!formData.queimaUniforme) errors.queimaUniforme = 'Campo obrigatório';
        if (!formData.biomassaUmida) errors.biomassaUmida = 'Campo obrigatório';
        break;
      case 4:
        if (!formData.valoresParametros) errors.valoresParametros = 'Campo obrigatório';
        if (formData.valoresParametros === 'Não' && (!formData.co || !formData.o2)) {
          if (!formData.co) errors.co = 'Campo obrigatório quando parâmetros estão fora';
          if (!formData.o2) errors.o2 = 'Campo obrigatório quando parâmetros estão fora';
        }
        break;
      case 5:
        if (!formData.arrasteMaterial) errors.arrasteMaterial = 'Campo obrigatório';
        break;
      case 6:
        if (!formData.alcalinidadeAreia) errors.alcalinidadeAreia = 'Campo obrigatório';
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextSection = () => {
    if (validateCurrentSection() && currentSection < totalSections) {
      setCurrentSection(prev => prev + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 1) {
      setCurrentSection(prev => prev - 1);
    }
  };

  const generateReport = () => {
    return `📋 *ROTEIRO DE VERIFICAÇÃO – OPERAÇÃO*

👤 *Operador:* ${user?.nomeCompleto}
🏷️ *PRN:* ${user?.prn}
👥 *Turma:* ${user?.turma}
📅 *Data/Hora:* ${new Date().toLocaleString('pt-BR')}

*1. Visores da caldeira:*
• Tem chama visível no superaquecedor? ${formData.chamaVisivel}
• Se sim, a chama está estável ou com movimento? ${formData.chamaMovimento || 'N/A'}
• A cor da chama na fornalha está alaranjada estável? ${formData.corChama}
• Foi observado arraste? Partículas incandescentes? ${formData.arraste}
• Detalhes ou observações: ${formData.detalhesVisores || 'Nenhuma observação'}

*2. Sopragem de fuligem:*
• A sopragem foi realizada neste turno? ${formData.sopragemRealizada}
• Quantas vezes? ${formData.quantasVezes || 'N/A'}
• Detalhes ou observações: ${formData.detalhesSopragem || 'Nenhuma observação'}

*3. Biomassa:*
• A queima está uniforme? ${formData.queimaUniforme}
• Biomassa muito úmida? ${formData.biomassaUmida}
• Alguma dificuldade com a biomassa? ${formData.dificuldadeBiomassa || 'Nenhuma dificuldade'}
• Detalhes ou observações: ${formData.detalhesBiomassa || 'Nenhuma observação'}

*4. Gases na fornalha:*
• Os valores estão dentro dos parâmetros? ${formData.valoresParametros}
• CO: ${formData.co || 'N/A'}
• O²: ${formData.o2 || 'N/A'}
• Detalhes ou observações: ${formData.detalhesGases || 'Nenhuma observação'}

*5. Arraste de materiais:*
• Foi observado arraste de material não queimado e areia no economizador e evaporador? ${formData.arrasteMaterial}
• Detalhes ou observações: ${formData.detalhesArraste || 'Nenhuma observação'}

*6. Areia:*
• Alcalinidade de Areia, está dentro dos limites ideais? ${formData.alcalinidadeAreia}
• Detalhes ou observações: ${formData.detalhesAreia || 'Nenhuma observação'}

*7. Dificuldades gerais ou anormalidades percebidas:*
• Detalhes ou observações: ${formData.dificuldadesGerais || 'Nenhuma dificuldade ou anormalidade'}

---
Relatório gerado em: ${new Date().toLocaleString('pt-BR')}`;
  };

  const handleWhatsAppSend = () => {
    const report = generateReport();
    const url = `https://wa.me/?text=${encodeURIComponent(report)}`;
    window.open(url, '_blank');
  };

  const handleCopyReport = async () => {
    try {
      const report = generateReport();
      await navigator.clipboard.writeText(report);
      setAutoSaveStatus('Relatório copiado para a área de transferência!');
      setTimeout(() => setAutoSaveStatus(''), 3000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
      alert('Erro ao copiar o relatório. Tente novamente.');
    }
  };

  const handleSaveReport = async () => {
    setIsSubmitting(true);
    try {
      const reportData = {
        ...formData,
        userPRN: user.prn,
        userName: user.nomeCompleto,
        userTurma: user.turma,
        completedAt: new Date().toISOString()
      };

      const reportId = await reportService.saveReport(reportData);
      
      if (reportId) {
        // Limpar rascunho após salvar
        localStorage.removeItem('caldeira_draft');
        setAutoSaveStatus('Relatório salvo com sucesso!');
        setTimeout(() => setAutoSaveStatus(''), 3000);
      } else {
        throw new Error('Erro ao salvar relatório');
      }
    } catch (error) {
      console.error('Erro ao salvar relatório:', error);
      alert('Erro ao salvar relatório. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case 1:
        return (
          <SectionVisores 
            data={formData} 
            onChange={handleInputChange}
            onImageUpload={handleImageUpload}
            errors={validationErrors}
          />
        );
      case 2:
        return (
          <SectionSopragem 
            data={formData} 
            onChange={handleInputChange}
            errors={validationErrors}
          />
        );
      case 3:
        return (
          <SectionBiomassa 
            data={formData} 
            onChange={handleInputChange}
            errors={validationErrors}
          />
        );
      case 4:
        return (
          <SectionGases 
            data={formData} 
            onChange={handleInputChange}
            errors={validationErrors}
          />
        );
      case 5:
        return (
          <SectionArraste 
            data={formData} 
            onChange={handleInputChange}
            onImageUpload={handleImageUpload}
            errors={validationErrors}
          />
        );
      case 6:
        return (
          <SectionAreia 
            data={formData} 
            onChange={handleInputChange}
            onImageUpload={handleImageUpload}
            errors={validationErrors}
          />
        );
      case 7:
        return (
          <SectionDificuldades 
            data={formData} 
            onChange={handleInputChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User size={20} className="text-green-600" />
                <span className="font-medium text-gray-800">{user?.nomeCompleto}</span>
                <span className="text-sm text-gray-500">Turma {user?.turma}</span>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut size={18} />
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Seção {currentSection} de {totalSections}
            </span>
            <span className="text-sm text-gray-500">
              {progress}% completo
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentSection / totalSections) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Auto-save Status */}
      {autoSaveStatus && (
        <div className="bg-green-50 border-b border-green-200">
          <div className="max-w-4xl mx-auto px-4 py-2">
            <p className="text-sm text-green-700 flex items-center gap-2">
              <CheckCircle size={16} />
              {autoSaveStatus}
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Section Header */}
          <div className="bg-green-700 text-white p-6">
            <h1 className="text-2xl font-bold mb-2">
              Roteiro de Verificação – Operação
            </h1>
            <p className="text-green-100">
              Preencha as informações durante a rota de inspeção da caldeira
            </p>
          </div>

          {/* Form Content */}
          <div className="p-6">
            {renderSection()}
          </div>

          {/* Navigation */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
            <button
              onClick={prevSection}
              disabled={currentSection === 1}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Anterior
            </button>

            <div className="flex items-center gap-2">
              {currentSection < totalSections ? (
                <button
                  onClick={nextSection}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                >
                  Próxima →
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveReport}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    Salvar
                  </button>
                  <button
                    onClick={handleCopyReport}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium"
                  >
                    <Copy size={16} />
                    Copiar
                  </button>
                  <button
                    onClick={handleWhatsAppSend}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                  >
                    <Send size={16} />
                    WhatsApp
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Section Components (simplified for brevity)
const SectionVisores = ({ data, onChange, onImageUpload, errors }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
      <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">1</span>
      Visores da caldeira
    </h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tem chama visível no superaquecedor? *
        </label>
        <div className="flex gap-4">
          {['Sim', 'Não'].map(option => (
            <label key={option} className="flex items-center gap-2">
              <input
                type="radio"
                name="chamaVisivel"
                value={option}
                checked={data.chamaVisivel === option}
                onChange={(e) => onChange('chamaVisivel', e.target.value)}
                className="text-green-600"
              />
              {option}
            </label>
          ))}
        </div>
        {errors.chamaVisivel && (
          <p className="text-red-600 text-sm mt-1">{errors.chamaVisivel}</p>
        )}
      </div>

      {data.chamaVisivel === 'Sim' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            A chama está estável ou com movimento?
          </label>
          <div className="flex gap-4">
            {['Estável', 'Oscilando'].map(option => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="chamaMovimento"
                  value={option}
                  checked={data.chamaMovimento === option}
                  onChange={(e) => onChange('chamaMovimento', e.target.value)}
                  className="text-green-600"
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        A cor da chama na fornalha está alaranjada estável? *
      </label>
      <div className="flex gap-4">
        {['Sim', 'Não'].map(option => (
          <label key={option} className="flex items-center gap-2">
            <input
              type="radio"
              name="corChama"
              value={option}
              checked={data.corChama === option}
              onChange={(e) => onChange('corChama', e.target.value)}
              className="text-green-600"
            />
            {option}
          </label>
        ))}
      </div>
      {errors.corChama && (
        <p className="text-red-600 text-sm mt-1">{errors.corChama}</p>
      )}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Foi observado arraste? Partículas incandescentes? *
      </label>
      <div className="flex gap-4">
        {['Sim', 'Não'].map(option => (
          <label key={option} className="flex items-center gap-2">
            <input
              type="radio"
              name="arraste"
              value={option}
              checked={data.arraste === option}
              onChange={(e) => onChange('arraste', e.target.value)}
              className="text-green-600"
            />
            {option}
          </label>
        ))}
      </div>
      {errors.arraste && (
        <p className="text-red-600 text-sm mt-1">{errors.arraste}</p>
      )}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Detalhes ou observações com imagem:
      </label>
      <textarea
        value={data.detalhesVisores}
        onChange={(e) => onChange('detalhesVisores', e.target.value)}
        placeholder="Descreva detalhes ou observações relevantes..."
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        rows={3}
      />
      
      <div className="mt-3">
        <label className="flex items-center gap-2 cursor-pointer bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 transition-colors">
          <Upload size={20} className="text-gray-400" />
          <span className="text-gray-600">Adicionar imagens (opcional)</span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => onImageUpload('imagenesVisores', e.target.files)}
            className="hidden"
          />
        </label>
      </div>
    </div>
  </div>
);

// Simplified other section components
const SectionSopragem = ({ data, onChange, errors }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
      <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">2</span>
      Sopragem de fuligem
    </h2>
    {/* Implementar campos da seção 2 */}
  </div>
);

const SectionBiomassa = ({ data, onChange, errors }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
      <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">3</span>
      Biomassa
    </h2>
    {/* Implementar campos da seção 3 */}
  </div>
);

const SectionGases = ({ data, onChange, errors }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
      <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">4</span>
      Gases na fornalha
    </h2>
    {/* Implementar campos da seção 4 */}
  </div>
);

const SectionArraste = ({ data, onChange, onImageUpload, errors }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
      <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">5</span>
      Arraste de materiais
    </h2>
    {/* Implementar campos da seção 5 */}
  </div>
);

const SectionAreia = ({ data, onChange, onImageUpload, errors }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
      <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">6</span>
      Areia
    </h2>
    {/* Implementar campos da seção 6 */}
  </div>
);

const SectionDificuldades = ({ data, onChange }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
      <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">7</span>
      Dificuldades gerais ou anormalidades percebidas
    </h2>
    
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Detalhes ou observações:
      </label>
      <textarea
        value={data.dificuldadesGerais}
        onChange={(e) => onChange('dificuldadesGerais', e.target.value)}
        placeholder="Descreva dificuldades gerais ou anormalidades percebidas..."
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        rows={4}
      />
    </div>
  </div>
);

export default InspectionForm;

