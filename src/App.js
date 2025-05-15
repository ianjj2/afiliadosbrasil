import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon, ChartBarIcon, CurrencyDollarIcon, ShieldCheckIcon, UserGroupIcon, RocketLaunchIcon, CpuChipIcon, CommandLineIcon } from '@heroicons/react/24/outline';
import { registerPageView } from './services/pageViewService';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import HomePage from './pages/HomePage';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';

export const LandingPage = ({ onStartForm }) => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [showUnmuteBtn, setShowUnmuteBtn] = useState(false);
  const [showCtaBtn, setShowCtaBtn] = useState(false);
  const [showVsl, setShowVsl] = useState(false);

  useEffect(() => {
    registerPageView();
    // Efeito para rolar e iniciar o vídeo após 5 segundos
    const timer = setTimeout(() => {
      const vslSection = document.getElementById('vsl-section');
      if (vslSection) {
        vslSection.scrollIntoView({ behavior: 'smooth' });
      }
      if (videoRef.current) {
        videoRef.current.muted = true;
        videoRef.current.play();
        setShowUnmuteBtn(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Adiciona evento para mostrar botão ao final do vídeo
  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const handleEnded = () => setShowCtaBtn(true);
    video.addEventListener('ended', handleEnded);
    return () => {
      video.removeEventListener('ended', handleEnded);
    };
  }, [videoRef]);

  useEffect(() => {
    // Teste de velocidade simples (baixa uma imagem pequena)
    const start = Date.now();
    const img = new window.Image();
    img.src = "https://www.google.com/images/phd/px.gif?" + Math.random(); // imagem leve do Google
    img.onload = () => {
      const duration = Date.now() - start;
      const speedMbps = (8 * 35) / (duration / 1000) / 1024; // 35 bytes em Mbps
      if (speedMbps > 0.5) { // ajuste o valor conforme desejar (0.5 Mbps é razoável)
        setShowVsl(true);
      }
    };
    img.onerror = () => setShowVsl(false);
  }, []);

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="min-h-screen bg-[#070101] text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: 'url("/fundo.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: '0.3'
          }}
        />
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        >
          <source src="/background-video.mp4" type="video/mp4" />
        </video>
        {/* Overlay */}
        <div className="absolute inset-0 bg-[#070101] bg-opacity-75" />
        {/* Tech Grid Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 z-10 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-6"
          >
            <span className="bg-red-500/20 text-red-500 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
              PLATAFORMA LÍDER EM APOSTAS
            </span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Seja um Afiliado da <span className="text-red-500">Bravo.Bet</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
            Transforme suas indicações em comissões e ganhe dinheiro com o maior programa de afiliados do Brasil
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartForm}
            className="bg-red-600 text-white px-8 py-4 rounded-full text-lg font-semibold flex items-center mx-auto hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 backdrop-blur-sm"
          >
            Quero me afiliar agora
            <ArrowRightIcon className="w-6 h-6 ml-2" />
          </motion.button>
        </motion.div>
      </section>

      {/* VSL Section */}
      {showVsl && (
        <section
          id="vsl-section"
          className="flex justify-center items-center min-h-[60vh] bg-black relative"
          style={{
            minHeight: '60vh',
            background: 'linear-gradient(180deg, #070101 60%, #1a1a1a 100%)',
          }}
        >
          <div
            className="flex justify-center items-center w-full h-full"
            style={{
              width: '100%',
              height: '100%',
              maxWidth: '100vw',
              maxHeight: '80vh',
            }}
          >
            <video
              id="vsl-video"
              ref={videoRef}
              controls
              muted={isMuted}
              className="rounded-lg shadow-lg bg-black"
              style={{
                width: '100%',
                maxWidth: '420px',
                height: 'auto',
                maxHeight: '80vh',
                objectFit: 'contain',
                background: '#000',
                margin: '0 auto',
                display: 'block',
              }}
            >
              <source src="/vsl.mp4" type="video/mp4" />
              Seu navegador não suporta vídeo.
            </video>
            {showUnmuteBtn && (
              <button
                onClick={handleToggleMute}
                className="absolute top-6 right-6 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg z-20 transition-all"
                style={{ fontWeight: 'bold' }}
              >
                {isMuted ? 'Ativar Som 🔊' : 'Desativar Som 🔇'}
              </button>
            )}
            {showUnmuteBtn && isMuted && (
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded shadow-lg z-10">
                Clique em "Ativar Som" para ouvir o vídeo
              </div>
            )}
            {showCtaBtn && (
              <button
                onClick={onStartForm}
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg z-30 transition-all animate-bounce"
              >
                Quero me afiliar agora
              </button>
            )}
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="relative py-20 bg-gradient-to-b from-[#070101] to-red-900/20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px] opacity-10"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: "R$ 100M+", label: "Em Comissões Pagas", icon: <CurrencyDollarIcon className="w-8 h-8 text-red-500" /> },
              { number: "150+", label: "Afiliados Ativos", icon: <UserGroupIcon className="w-8 h-8 text-red-500" /> },
              { number: "70%", label: "Taxa de Conversão", icon: <ChartBarIcon className="w-8 h-8 text-red-500" /> }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-8 bg-red-900/20 rounded-xl backdrop-blur-sm border border-red-800/20 hover:border-red-500/30 transition-all"
              >
                <div className="flex justify-center mb-4">
                  {stat.icon}
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl font-bold text-red-500 mb-2"
                >
                  {stat.number}
                </motion.div>
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-[#070101] bg-opacity-95" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Por que ser um afiliado da Bravo.Bet?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Uma plataforma completa com todas as ferramentas necessárias para seu sucesso
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <RocketLaunchIcon className="w-12 h-12 text-red-500" />,
                title: "Crescimento Rápido",
                description: "Ferramentas avançadas para escalar seus resultados"
              },
              {
                icon: <CpuChipIcon className="w-12 h-12 text-red-500" />,
                title: "Tecnologia Avançada",
                description: "Plataforma com IA para otimizar suas campanhas"
              },
              {
                icon: <CommandLineIcon className="w-12 h-12 text-red-500" />,
                title: "API Integrada",
                description: "Integração completa com suas ferramentas"
              },
              {
                icon: <ChartBarIcon className="w-12 h-12 text-red-500" />,
                title: "Alcance Global",
                description: "Plataforma líder em apostas de cassinos e esportes no Brasil"
              },
              {
                icon: <CurrencyDollarIcon className="w-12 h-12 text-red-500" />,
                title: "Filiar-se e Lucrar",
                description: "Receba comissões por cadastros e depósitos realizados"
              },
              {
                icon: <ShieldCheckIcon className="w-12 h-12 text-red-500" />,
                title: "Plataforma Segura",
                description: "Monitoramento em tempo real dos seus ganhos e desempenho"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-red-900/20 p-6 rounded-xl hover:bg-red-900/30 transition-all backdrop-blur-sm border border-red-800/20 hover:border-red-500/30"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900 to-red-700 bg-opacity-90" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-bold mb-8">Comece a Ganhar Dinheiro Agora</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Junte-se ao programa de afiliados da Bravo.Bet e transforme suas indicações em lucro
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStartForm}
              className="bg-white text-red-700 px-8 py-4 rounded-full text-lg font-semibold hover:bg-opacity-90 transition-all shadow-lg shadow-white/20 backdrop-blur-sm"
            >
              Quero me afiliar a Bravo.Bet
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App; 