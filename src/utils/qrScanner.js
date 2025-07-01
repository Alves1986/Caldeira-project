// No início de cada arquivo .jsx
import React from 'react';
// QR Code scanner utility using html5-qrcode
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';

export class QRCodeScanner {
  constructor(elementId, onSuccess, onError) {
    this.elementId = elementId;
    this.onSuccess = onSuccess;
    this.onError = onError;
    this.scanner = null;
  }

  // Inicializar o scanner
  start() {
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
      supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
    };

    this.scanner = new Html5QrcodeScanner(
      this.elementId,
      config,
      false // verbose
    );

    this.scanner.render(
      (decodedText, decodedResult) => {
        this.onSuccess(decodedText, decodedResult);
      },
      (error) => {
        // Ignorar erros de scan contínuo
        if (error.includes('NotFoundException')) {
          return;
        }
        this.onError(error);
      }
    );
  }

  // Parar o scanner
  stop() {
    if (this.scanner) {
      this.scanner.clear().catch(error => {
        console.error('Erro ao parar scanner:', error);
      });
    }
  }

  // Verificar se o dispositivo tem câmera
  static async checkCameraSupport() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.some(device => device.kind === 'videoinput');
    } catch (error) {
      console.error('Erro ao verificar suporte à câmera:', error);
      return false;
    }
  }
}

// Função utilitária para extrair PRN do QR code
export const extractPRNFromQR = (qrText) => {
  // Assumindo que o QR code contém apenas o PRN
  // Se o formato for diferente, ajustar esta função
  const prn = qrText.trim();
  
  // Validação básica do PRN (ajustar conforme necessário)
  if (prn && prn.length > 0) {
    return prn;
  }
  
  throw new Error('PRN não encontrado no QR code');
};

// Função para validar formato do PRN
export const validatePRN = (prn) => {
  // Implementar validação específica do formato PRN da empresa
  // Por exemplo: deve ter X dígitos, formato específico, etc.
  if (!prn || prn.length < 3) {
    return false;
  }
  
  // Adicionar mais validações conforme necessário
  return true;
};

