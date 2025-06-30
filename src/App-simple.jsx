// Simplified App Component for testing
import React from 'react';

const SimpleApp = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
            📷
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Login com QR Code
          </h1>
          <p className="text-gray-600">
            Escaneie o QR code do seu crachá para acessar o sistema
          </p>
        </div>

        <div className="mb-6">
          <div className="text-center">
            <button
              onClick={() => alert('Scanner iniciado!')}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              📷 Iniciar Scanner
            </button>
          </div>
        </div>

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

export default SimpleApp;

