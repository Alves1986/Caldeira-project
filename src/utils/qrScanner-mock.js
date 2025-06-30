// Mock QR Code scanner for testing without camera
export class QRCodeScanner {
  constructor(elementId, onSuccess, onError) {
    this.elementId = elementId;
    this.onSuccess = onSuccess;
    this.onError = onError;
    this.scanner = null;
  }

  // Inicializar o scanner mock
  start() {
    const element = document.getElementById(this.elementId);
    if (!element) {
      this.onError('Elemento não encontrado');
      return;
    }

    // Criar interface mock do scanner
    element.innerHTML = `
      <div style="
        border: 2px dashed #059669;
        border-radius: 8px;
        padding: 40px;
        text-align: center;
        background: #f0fdf4;
        margin: 20px 0;
      ">
        <div style="margin-bottom: 20px;">
          <div style="
            width: 200px;
            height: 200px;
            border: 2px solid #059669;
            border-radius: 8px;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #ffffff;
            font-size: 14px;
            color: #059669;
          ">
            📷 Área de Scan
          </div>
        </div>
        
        <p style="color: #059669; margin-bottom: 20px; font-weight: 500;">
          Modo de Teste - Clique em um PRN para simular leitura:
        </p>
        
        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
          <button onclick="window.mockQRScan('123')" style="
            background: #059669;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
          ">PRN: 123 (Usuário Existente)</button>
          
          <button onclick="window.mockQRScan('456')" style="
            background: #dc2626;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
          ">PRN: 456 (Novo Usuário)</button>
          
          <button onclick="window.mockQRScan('admin')" style="
            background: #7c3aed;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
          ">PRN: admin (Admin)</button>
        </div>
        
        <p style="color: #6b7280; margin-top: 15px; font-size: 12px;">
          Em produção, isso seria substituído pela câmera real
        </p>
      </div>
    `;

    // Configurar função global para simular scan
    window.mockQRScan = (prn) => {
      console.log('Mock QR Scan:', prn);
      this.onSuccess(prn, { text: prn });
    };
  }

  // Parar o scanner mock
  stop() {
    const element = document.getElementById(this.elementId);
    if (element) {
      element.innerHTML = '';
    }
    if (window.mockQRScan) {
      delete window.mockQRScan;
    }
  }

  // Verificar se o dispositivo tem câmera (mock)
  static async checkCameraSupport() {
    // Em modo de teste, sempre retornar true
    return true;
  }
}

// Função utilitária para extrair PRN do QR code
export const extractPRNFromQR = (qrText) => {
  // No mock, o texto já é o PRN
  const prn = qrText.trim();
  
  if (prn && prn.length > 0) {
    return prn;
  }
  
  throw new Error('PRN não encontrado no QR code');
};

// Função para validar formato do PRN
export const validatePRN = (prn) => {
  // Validação básica para o mock
  if (!prn || prn.length < 1) {
    return false;
  }
  
  return true;
};

