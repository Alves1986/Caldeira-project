// QR Code Login Component
import React, { useState, useEffect, useRef } from 'react';
import { QRCodeScanner, extractPRNFromQR, validatePRN } from '../utils/qrScanner-mock';
import { useAuth } from '../hooks/useAuth';
import { Camera, AlertCircle, CheckCircle, Loader2 } from './Icons';

const QRLogin = ({ onLoginSuccess, onNeedRegistration }) => {
  const [scannerState, setScannerState] = useState('idle'); // idle, scanning, success, error
  const [message, setMessage] = useState('');
  const [cameraSupported, setCameraSupported] = useState(null);
  const scannerRef = useRef(null);
  const qrScannerInstance = useRef(null);
  const { loginWithPRN, loading } = useAuth();

  // Verificar suporte à câmera ao montar o componente
  useEffect(() => {
    const checkCamera = async () => {
      const supported = await QRCodeScanner.checkCameraSupport();
      setCameraSupported(supported);
      if (!supported) {
        setMessage('Câmera não detectada. Verifique as permissões do navegador.');
        setScannerState('error');
      }
    };

    checkCamera();
  }, []);

  // Limpar scanner ao desmontar
  useEffect(() => {
    return () => {
      if (qrScannerInstance.current) {
        qrScannerInstance.current.stop();
      }
    };
  }, []);

  const startScanning = () => {
    if (!cameraSupported) {
      setMessage('Câmera não suportada neste dispositivo.');
      setScannerState('error');
      return;
    }

    setScannerState('scanning');
    setMessage('Posicione o QR code do seu crachá na frente da câmera');

    // Criar nova instância do scanner
    qrScannerInstance.current = new QRCodeScanner(
      'qr-reader',
      handleScanSuccess,
      handleScanError
    );

    qrScannerInstance.current.start();
  };

  const handleScanSuccess = async (decodedText) => {
    try {
      // Parar o scanner
      if (qrScannerInstance.current) {
        qrScannerInstance.current.stop();
      }

      setScannerState('success');
      setMessage('QR Code lido com sucesso! Processando...');

      // Extrair PRN do QR code
      const prn = extractPRNFromQR(decodedText);
      
      if (!validatePRN(prn)) {
        throw new Error('PRN inválido no QR code');
      }

      // Tentar fazer login
      const result = await loginWithPRN(prn);

      if (result.success) {
        if (result.isNewUser) {
          // Usuário novo - redirecionar para cadastro
          onNeedRegistration(prn);
        } else {
          // Usuário existente - login bem-sucedido
          onLoginSuccess(result.userData);
        }
      } else {
        throw new Error(result.error || 'Erro no login');
      }

    } catch (error) {
      console.error('Erro ao processar QR code:', error);
      setScannerState('error');
      setMessage(`Erro: ${error.message}`);
      
      // Permitir tentar novamente após 3 segundos
      setTimeout(() => {
        setScannerState('idle');
        setMessage('');
      }, 3000);
    }
  };

  const handleScanError = (error) => {
    // Ignorar erros de scan contínuo
    if (error.includes('NotFoundException')) {
      return;
    }
    
    console.error('Erro no scanner:', error);
    setScannerState('error');
    setMessage('Erro ao acessar a câmera. Verifique as permissões.');
    
    setTimeout(() => {
      setScannerState('idle');
      setMessage('');
    }, 3000);
  };

  const stopScanning = () => {
    if (qrScannerInstance.current) {
      qrScannerInstance.current.stop();
    }
    setScannerState('idle');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
            <Camera size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Login com QR Code
          </h1>
          <p className="text-gray-600">
            Escaneie o QR code do seu crachá para acessar o sistema
          </p>
        </div>

        {/* Scanner Area */}
        <div className="mb-6">
          {scannerState === 'idle' && (
            <div className="text-center">
              <button
                onClick={startScanning}
                disabled={!cameraSupported || loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Camera size={20} />
                )}
                {loading ? 'Carregando...' : 'Iniciar Scanner'}
              </button>
            </div>
          )}

          {scannerState === 'scanning' && (
            <div>
              <div id="qr-reader" className="w-full"></div>
              <button
                onClick={stopScanning}
                className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Parar Scanner
              </button>
            </div>
          )}

          {scannerState === 'success' && (
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <CheckCircle className="mx-auto text-green-600 mb-2" size={48} />
              <p className="text-green-800 font-semibold">QR Code lido com sucesso!</p>
            </div>
          )}

          {scannerState === 'error' && (
            <div className="text-center p-6 bg-red-50 rounded-lg">
              <AlertCircle className="mx-auto text-red-600 mb-2" size={48} />
              <p className="text-red-800 font-semibold">Erro no scanner</p>
            </div>
          )}
        </div>

        {/* Message */}
        {message && (
          <div className={`text-center p-3 rounded-lg ${
            scannerState === 'error' 
              ? 'bg-red-50 text-red-700' 
              : scannerState === 'success'
              ? 'bg-green-50 text-green-700'
              : 'bg-blue-50 text-blue-700'
          }`}>
            <p className="text-sm">{message}</p>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 text-center">
          <h3 className="font-semibold text-gray-800 mb-2">Instruções:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Permita o acesso à câmera quando solicitado</li>
            <li>• Posicione o QR code do crachá na área de leitura</li>
            <li>• Mantenha o código estável até a leitura</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QRLogin;

