import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitForm } from '../api/formApi';
import { ChartBarIcon, CurrencyDollarIcon, UserGroupIcon, GlobeAltIcon, ChatBubbleBottomCenterTextIcon, BoltIcon, DocumentTextIcon, EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { trackGoogleConversion } from './GoogleAnalytics';

const validarCPF = (cpf) => {
  cpf = cpf.replace(/[^0-9]/g, '');

  if (cpf.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cpf)) return false;

  // Validação do primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  let digitoVerificador1 = resto > 9 ? 0 : resto;
  if (digitoVerificador1 !== parseInt(cpf.charAt(9))) return false;

  // Validação do segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  let digitoVerificador2 = resto > 9 ? 0 : resto;
  if (digitoVerificador2 !== parseInt(cpf.charAt(10))) return false;

  return true;
};

const AffiliateForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    experiencia_igaming: '',
    faturamento_mensal: '',
    fonte_trafego: '',
    nome: '',
    telefone: '',
    email: '',
  });
  const [ipAddress, setIpAddress] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const stepIcons = [
    ChartBarIcon, // 1 - Experiência
    CurrencyDollarIcon, // 2 - Faturamento
    GlobeAltIcon, // 3 - Fonte de tráfego
    UserGroupIcon, // 4 - Nome
    EnvelopeIcon, // 5 - Email
    ChatBubbleBottomCenterTextIcon, // 6 - Telefone
  ];

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => setIpAddress(data.ip))
      .catch(error => console.error('Erro ao obter IP:', error));

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleChange = (value, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSubmitSuccess(false);

    try {
      // Envia o formulário
      await submitForm(formData, ipAddress);
      
      // Rastrear evento de cadastro no Facebook Pixel
      if (window.fbq) {
        window.fbq('track', 'Cadastro-Feito-Rangel');
        console.log('Evento de cadastro disparado para o Facebook Pixel');
      }

      // Rastrear evento de conversão no Google Analytics
      trackGoogleConversion();

      setSubmitSuccess(true);
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      setError('Erro ao enviar formulário. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressWidth = (currentStep / 6) * 100;

  const renderQuestion = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="w-full relative"
        >
          {/* Botão de voltar */}
          {currentStep > 1 && currentStep < 7 && !submitSuccess && (
            <div className="mb-4">
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex items-center gap-2 bg-red-900/60 hover:bg-red-700 text-white px-4 py-2 rounded-full shadow transition-all z-20 font-bold"
                type="button"
              >
                <ArrowLeftIcon className="w-5 h-5" /> Voltar
              </button>
            </div>
          )}

          {/* Efeito de linhas de conexão */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <svg className="absolute w-full h-full">
              <motion.path
                d={`M ${mousePosition.x} ${mousePosition.y} L ${window.innerWidth / 2} ${window.innerHeight / 2}`}
                stroke="rgba(239, 68, 68, 0.2)"
                strokeWidth="1"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              />
            </svg>
          </div>

          {/* Conteúdo do formulário */}
          <div className="relative z-10">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mr-4 scanner energy-field">
                    <ChartBarIcon className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2 tech-font">
                      Já trabalha como afiliado de igaming?*
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full pulse"></span>
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Seja verdadeiro para que possamos te direcionar.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {['SIM', 'NÃO', 'NÃO SEI O QUE É'].map((option) => (
                    <motion.button
                      key={option}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        handleChange(option, 'experiencia_igaming');
                        if (option === 'NÃO SEI O QUE É') {
                          setFormData(prev => ({
                            ...prev,
                            nome: 'Usuário Interessado',
                            telefone: 'Não informado'
                          }));
                          setCurrentStep(5);
                        } else {
                          setCurrentStep(currentStep + 1);
                        }
                      }}
                      className={`w-full p-4 rounded-lg cyber-button energy-field ${
                        formData.experiencia_igaming === option
                          ? 'bg-red-600 border-red-500'
                          : 'bg-red-900/20 border-red-800 hover:bg-red-900/30'
                      } text-white text-left transition-all backdrop-blur-sm relative overflow-hidden group`}
                    >
                      <span className="relative z-10 flex items-center tech-font">
                        {option}
                        <BoltIcon className="w-4 h-4 ml-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mr-4">
                    <CurrencyDollarIcon className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2 tech-font">
                      Quanto você já faturou no mercado de igaming?*
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Lembrando que você precisa nos falar a verdade.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    '- R$1.000,00',
                    'de 1 a R$5.000,00',
                    'de 5 a R$15.000,00',
                    'de 15 a R$50.000,00',
                    'mais de R$100.000,00'
                  ].map((option) => (
                    <motion.button
                      key={option}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        handleChange(option, 'faturamento_mensal');
                        setCurrentStep(currentStep + 1);
                      }}
                      className={`w-full p-4 rounded-lg cyber-button energy-field ${
                        formData.faturamento_mensal === option
                          ? 'bg-red-600 border-red-500'
                          : 'bg-red-900/20 border-red-800 hover:bg-red-900/30'
                      } text-white text-left transition-all backdrop-blur-sm relative overflow-hidden group`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent group-hover:translate-x-full transition-transform duration-500 ease-in-out" />
                      {option}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mr-4">
                    <GlobeAltIcon className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2 tech-font">
                      Qual sua principal fonte de tráfego?*
                    </h2>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    'Tráfego pago (google, face ads, tik tok ads, google)',
                    'Orgânico (facebook, instagram, tik tok)',
                    'Grupo no telegram',
                    'grupo de whatsapp'
                  ].map((option) => (
                    <motion.button
                      key={option}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        handleChange(option, 'fonte_trafego');
                        setCurrentStep(currentStep + 1);
                      }}
                      className={`w-full p-4 rounded-lg cyber-button energy-field ${
                        formData.fonte_trafego === option
                          ? 'bg-red-600 border-red-500'
                          : 'bg-red-900/20 border-red-800 hover:bg-red-900/30'
                      } text-white text-left transition-all backdrop-blur-sm relative overflow-hidden group`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent group-hover:translate-x-full transition-transform duration-500 ease-in-out" />
                      {option}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mr-4">
                    <UserGroupIcon className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2 tech-font">
                      Nome*
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Digite seu nome e sobrenome
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => handleChange(e.target.value, 'nome')}
                    placeholder="Digite seu nome"
                    className="w-full p-4 rounded-lg border bg-red-900/20 border-red-800 text-white focus:border-red-500 focus:outline-none backdrop-blur-sm placeholder-gray-500"
                  />
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-red-800 overflow-hidden">
                    <div 
                      className="h-full bg-red-500 transition-all duration-300"
                      style={{ width: formData.nome ? '100%' : '0%' }}
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!formData.nome}
                  className={`w-full p-4 rounded-lg ${
                    formData.nome
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-red-800/50 cursor-not-allowed'
                  } text-white font-medium transition-all backdrop-blur-sm`}
                >
                  Próximo
                </motion.button>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mr-4">
                    <EnvelopeIcon className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2 tech-font">
                      Email*
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Digite seu email para contato
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange(e.target.value, 'email')}
                    placeholder="Digite seu email"
                    className="w-full p-4 rounded-lg border bg-red-900/20 border-red-800 text-white focus:border-red-500 focus:outline-none backdrop-blur-sm placeholder-gray-500"
                  />
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-red-800 overflow-hidden">
                    <div 
                      className="h-full bg-red-500 transition-all duration-300"
                      style={{ width: formData.email ? '100%' : '0%' }}
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!formData.email || !formData.email.includes('@')}
                  className={`w-full p-4 rounded-lg ${
                    formData.email && formData.email.includes('@')
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-red-800/50 cursor-not-allowed'
                  } text-white font-medium transition-all backdrop-blur-sm`}
                >
                  Próximo
                </motion.button>
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mr-4">
                    <ChatBubbleBottomCenterTextIcon className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2 tech-font">
                      Telefone*
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Digite seu número de WhatsApp
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => handleChange(e.target.value, 'telefone')}
                    placeholder="Digite seu telefone"
                    className="w-full p-4 rounded-lg border bg-red-900/20 border-red-800 text-white focus:border-red-500 focus:outline-none backdrop-blur-sm placeholder-gray-500"
                  />
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-red-800 overflow-hidden">
                    <div 
                      className="h-full bg-red-500 transition-all duration-300"
                      style={{ width: formData.telefone ? '100%' : '0%' }}
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={!formData.telefone || isSubmitting}
                  className={`w-full p-4 rounded-lg ${
                    formData.telefone && !isSubmitting
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-red-800/50 cursor-not-allowed'
                  } text-white font-medium transition-all backdrop-blur-sm relative overflow-hidden`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </div>
                  ) : (
                    <>
                      Enviar
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-full transition-transform duration-500 ease-in-out" />
                    </>
                  )}
                </motion.button>
              </div>
            )}

            {currentStep === 7 && submitSuccess && (
              <div className="space-y-6">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-red-900/20 border-2 border-red-500 rounded-lg p-6 text-center"
                >
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-white mb-4 tech-font">
                    Cadastro realizado com sucesso!
                  </h2>
                  
                  <p className="text-gray-300 text-lg mb-6">
                    Obrigado por se cadastrar! Nossa equipe entrará em contato em breve.
                  </p>
                  
                  <a
                    href={`https://wa.me/31992626215?text=${encodeURIComponent(`Olá! Tenho interesse em ser um afiliado Bravo.Bet!`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition-all"
                  >
                    Falar no WhatsApp agora
                  </a>
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen relative bg-[#070101]">
      {/* Fundo com efeito de vidro */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/fundo.png" 
          alt="Background" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      </div>

      {/* Conteúdo principal */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        {/* Título */}
        <div className="mb-8 text-center">
          <img 
            src="/logo.png" 
            alt="BRAVO.BET" 
            className="h-20 mx-auto"
          />
          <p className="text-gray-400 mt-2">Conversão Digital</p>
        </div>

        <div className="w-full max-w-md">
          {/* Barra de progresso */}
          <div className="mb-8 relative">
            <div className="h-1 w-full bg-red-900/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-red-500"
                initial={{ width: 0 }}
                animate={{ width: `${progressWidth}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="flex justify-between mt-2">
              {stepIcons.map((Icon, idx) => {
                const step = idx + 1;
                const isActive = step === currentStep;
                const isCompleted = step < currentStep;
                return (
                  <motion.div
                    key={step}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                      ${isActive ? 'bg-white border-red-500 shadow-lg scale-110' : isCompleted ? 'bg-red-500 border-red-700' : 'bg-red-900/20 border-red-800'}
                    `}
                    whileHover={{ scale: 1.1 }}
                  >
                    <Icon className={`w-6 h-6 ${isActive ? 'text-red-600' : 'text-white'}`} />
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Container do formulário */}
          <div className="bg-red-900/20 border border-red-800/20 rounded-lg shadow-xl p-8">
            {renderQuestion()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateForm; 
