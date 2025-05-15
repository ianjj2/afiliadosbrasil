import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { validateTicket, getValidatedTickets } from '../api/supabase';
import { TicketIcon, GiftIcon } from '@heroicons/react/24/outline';
import { Howl } from 'howler';

const confettiColors = ['#ef4444', '#fff', '#fbbf24', '#22d3ee', '#a3e635'];

// Sons externos temporários
const suspenseSound = new Howl({ src: ['https://cdn.pixabay.com/audio/2022/10/16/audio_12c6b6b6b6.mp3'], volume: 0.5 });
const winSound = new Howl({ src: ['https://cdn.pixabay.com/audio/2022/03/15/audio_115b9b9b9b.mp3'], volume: 0.7 });

function Confetti({ show }) {
  if (!show) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex justify-center items-center">
      {[...Array(60)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * window.innerWidth - window.innerWidth / 2,
            y: -100,
            rotate: Math.random() * 360,
            opacity: 1
          }}
          animate={{
            y: window.innerHeight + 100,
            rotate: Math.random() * 720,
            opacity: 0.8
          }}
          transition={{
            duration: 2 + Math.random() * 1.5,
            delay: Math.random() * 0.7
          }}
          style={{
            position: 'absolute',
            width: 12,
            height: 12,
            borderRadius: 4,
            background: confettiColors[i % confettiColors.length],
            left: `${Math.random() * 100}%`,
            zIndex: 9999
          }}
        />
      ))}
    </div>
  );
}

function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const ref = React.useRef();
  const enter = () => {
    if (ref.current && ref.current.requestFullscreen) {
      ref.current.requestFullscreen();
      setIsFullscreen(true);
    }
  };
  const exit = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);
  return [ref, isFullscreen, enter, exit];
}

// Função para efeito de reveal progressivo
function useRevealText(finalText, isActive, speed = 160) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    if (!isActive) {
      setDisplayed('');
      return;
    }
    let current = '';
    let i = 0;
    let interval = setInterval(() => {
      if (i < finalText.length) {
        // Efeito embaralhado
        const randomChar = () => String.fromCharCode(65 + Math.floor(Math.random() * 26));
        current = finalText
          .split('')
          .map((c, idx) => (idx <= i ? c : randomChar()))
          .join('');
        setDisplayed(current);
        i++;
      } else {
        setDisplayed(finalText);
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [finalText, isActive, speed]);
  return displayed;
}

const TicketManager = () => {
  const [ticketNumber, setTicketNumber] = useState('');
  const [validatedTickets, setValidatedTickets] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [winner, setWinner] = useState(null);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeTab, setActiveTab] = useState('validar');
  const [fsRef, isFullscreen, enterFullscreen, exitFullscreen] = useFullscreen();
  const [revealActive, setRevealActive] = useState(false);
  const [revealStep, setRevealStep] = useState(0);

  useEffect(() => {
    loadValidatedTickets();
  }, []);

  const loadValidatedTickets = async () => {
    try {
      const tickets = await getValidatedTickets();
      setValidatedTickets(tickets);
    } catch (error) {
      setError('Erro ao carregar tickets validados');
    }
  };

  const handleValidateTicket = async () => {
    try {
      const result = await validateTicket(ticketNumber);
      if (!result || result.length === 0) {
        setError('Código do ticket não existe!');
        return;
      }
      setTicketNumber('');
      setError('');
      loadValidatedTickets();
    } catch (error) {
      setError('Erro ao validar ticket');
    }
  };

  const drawWinner = async () => {
    if (validatedTickets.length === 0) {
      setError('Não há tickets validados para o sorteio');
      return;
    }
    setIsDrawing(true);
    setError('');
    setWinner(null);
    setShowConfetti(false);
    setRevealActive(false);
    setRevealStep(0);
    setTimeout(() => enterFullscreen(), 200);
    suspenseSound.play();
    // Contagem regressiva mais devagar
    for (let i = 3; i > 0; i--) {
      setCountdown(i);
      await new Promise(resolve => setTimeout(resolve, 1600)); // 1.6 segundos por número
    }
    setCountdown(null);
    suspenseSound.stop();
    // Escolhe o vencedor
    const randomIndex = Math.floor(Math.random() * validatedTickets.length);
    const winnerTicket = validatedTickets[randomIndex];
    setWinner(winnerTicket);
    setRevealActive(true);
    setRevealStep(1);
    // Reveal nome
    await new Promise(resolve => setTimeout(resolve, winnerTicket.nome.length * 80 + 600));
    setRevealStep(2);
    // Reveal ticket
    await new Promise(resolve => setTimeout(resolve, winnerTicket.ticket_number.length * 80 + 400));
    setRevealStep(3);
    // Reveal telefone
    await new Promise(resolve => setTimeout(resolve, 1200));
    setRevealStep(4);
    // Reveal email/cpf
    await new Promise(resolve => setTimeout(resolve, 1200));
    setShowConfetti(true);
    winSound.play();
    setTimeout(() => setShowConfetti(false), 3500);
    setTimeout(() => exitFullscreen(), 5000);
    setIsDrawing(false);
  };

  // Funções para mascarar dados
  function maskCpf(cpf) {
    if (!cpf) return '';
    return cpf.slice(0, 3) + '.***.***-' + cpf.slice(-2);
  }
  function maskEmail(email) {
    if (!email) return '';
    const [user, domain] = email.split('@');
    if (!user || !domain) return '';
    return user[0] + '***@' + domain;
  }
  function maskNome(nome) {
    if (!nome) return '';
    const partes = nome.split(' ');
    return partes[0] + (partes.length > 1 ? ' ' + partes[1][0] + '.' : '');
  }

  // Reveal progressivo
  const revealedNome = useRevealText(winner ? maskNome(winner.nome) : '', revealActive && revealStep >= 1);
  const revealedTicket = useRevealText(winner ? winner.ticket_number : '', revealActive && revealStep >= 2);
  const revealedTelefone = useRevealText(winner ? winner.telefone : '', revealActive && revealStep >= 3);
  const revealedEmail = useRevealText(winner ? maskEmail(winner.email) : '', revealActive && revealStep >= 4);
  const revealedCpf = useRevealText(winner ? maskCpf(winner.cpf) : '', revealActive && revealStep >= 4);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 relative" ref={fsRef}>
      <Confetti show={showConfetti} />
      {/* Abas */}
      <div className="flex gap-4 mb-8">
        <button
          className={`px-6 py-2 rounded-t-lg font-bold text-lg transition-all ${activeTab === 'validar' ? 'bg-green-600 text-white shadow' : 'bg-green-900/30 text-green-200 hover:bg-green-800/50'}`}
          onClick={() => setActiveTab('validar')}
        >
          Validar Ticket
        </button>
        <button
          className={`px-6 py-2 rounded-t-lg font-bold text-lg transition-all ${activeTab === 'sorteio' ? 'bg-yellow-400 text-yellow-900 shadow' : 'bg-yellow-900/30 text-yellow-200 hover:bg-yellow-800/50'}`}
          onClick={() => setActiveTab('sorteio')}
        >
          Realizar Sorteio
        </button>
      </div>
      {/* Conteúdo das abas */}
      {activeTab === 'validar' && (
        <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border-2 border-green-500/40 rounded-lg p-6 shadow-lg flex flex-col justify-between min-w-[320px] max-w-md mx-auto">
          <div className="flex items-center mb-4">
            <TicketIcon className="w-8 h-8 text-green-400 mr-2" />
            <h2 className="text-2xl font-bold text-white tech-font">Validar Ticket</h2>
          </div>
          <div className="flex gap-4">
            <input
              type="text"
              value={ticketNumber}
              onChange={(e) => setTicketNumber(e.target.value)}
              placeholder="Digite o número do ticket"
              className="flex-1 bg-green-900/30 border border-green-500 rounded-lg px-4 py-2 text-white placeholder-gray-400"
            />
            <button
              onClick={handleValidateTicket}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-all"
            >
              Validar
            </button>
          </div>
          {error && (
            <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 text-green-500 mt-4">
              {error}
            </div>
          )}
        </div>
      )}
      {activeTab === 'sorteio' && (
        <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 border-2 border-yellow-400/40 rounded-lg p-6 shadow-lg flex flex-col justify-between min-w-[320px] max-w-md mx-auto">
          <div className="flex items-center mb-4">
            <GiftIcon className="w-8 h-8 text-yellow-300 mr-2" />
            <h2 className="text-2xl font-bold text-white tech-font">Realizar Sorteio</h2>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-400">
              Tickets validados: {validatedTickets.length}
            </p>
            <button
              onClick={drawWinner}
              disabled={isDrawing || validatedTickets.length === 0}
              className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-6 py-2 rounded-lg transition-all disabled:opacity-50 font-bold"
            >
              {isDrawing ? 'Sorteando...' : 'Realizar Sorteio'}
            </button>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {countdown && (
          <motion.div
            key={countdown}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-40"
          >
            <span className="text-8xl font-extrabold text-red-500 drop-shadow-lg animate-pulse">
              {countdown}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {revealActive && winner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/95 overflow-auto"
          >
            {/* Efeito de luz/partículas de fundo */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-yellow-400/10 blur-3xl rounded-full animate-pulse" />
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-300/10 blur-2xl rounded-full animate-pulse" />
              <div className="absolute top-10 left-10 w-32 h-32 bg-red-500/10 blur-2xl rounded-full animate-pulse" />
            </div>
            <div className="flex flex-col items-center justify-center p-8 rounded-2xl border-4 border-yellow-400 shadow-[0_0_40px_10px_rgba(255,255,0,0.2)] bg-gradient-to-br from-yellow-900/80 to-yellow-800/90 min-w-[320px] max-w-lg mx-auto relative animate-glow">
              <h3 className="text-5xl md:text-6xl font-extrabold text-yellow-300 mb-8 tech-font drop-shadow-lg animate-neon text-center tracking-widest select-none">
                <span className="bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent">Sorteio Bravo.Bet</span>
              </h3>
              <div className="flex flex-col gap-6 items-center w-full">
                <div className="w-full flex flex-col items-center">
                  <span className="text-lg text-yellow-200 mb-1 font-semibold tracking-wide">Nome do vencedor</span>
                  <span className="text-4xl md:text-5xl font-extrabold text-white tracking-widest font-mono bg-black/40 px-6 py-3 rounded-xl border-2 border-yellow-400 shadow-lg animate-glow-card select-none">
                    {revealedNome}
                  </span>
                </div>
                <div className="w-full flex flex-col items-center">
                  <span className="text-lg text-yellow-200 mb-1 font-semibold tracking-wide">Ticket</span>
                  <span className="text-3xl md:text-4xl font-bold text-yellow-300 tracking-widest font-mono bg-black/40 px-6 py-3 rounded-xl border-2 border-yellow-400 shadow-lg animate-glow-card select-none">
                    {revealedTicket}
                  </span>
                </div>
                <div className="w-full flex flex-col items-center">
                  <span className="text-lg text-yellow-200 mb-1 font-semibold tracking-wide">Telefone</span>
                  <span className="text-2xl md:text-3xl font-bold text-white tracking-widest font-mono bg-black/40 px-6 py-3 rounded-xl border-2 border-yellow-400 shadow-lg animate-glow-card select-none">
                    {revealedTelefone}
                  </span>
                </div>
                <div className="w-full flex flex-col items-center">
                  <span className="text-lg text-yellow-200 mb-1 font-semibold tracking-wide">CPF</span>
                  <span className="text-2xl md:text-3xl font-bold text-white tracking-widest font-mono bg-black/40 px-6 py-3 rounded-xl border-2 border-yellow-400 shadow-lg animate-glow-card select-none">
                    {revealedCpf}
                  </span>
                </div>
                <div className="w-full flex flex-col items-center">
                  <span className="text-lg text-yellow-200 mb-1 font-semibold tracking-wide">Email</span>
                  <span className="text-2xl md:text-3xl font-bold text-white tracking-widest font-mono bg-black/40 px-6 py-3 rounded-xl border-2 border-yellow-400 shadow-lg animate-glow-card select-none">
                    {revealedEmail}
                  </span>
                </div>
              </div>
              <span className="block mt-10 text-3xl md:text-4xl text-yellow-300 animate-bounce font-extrabold drop-shadow-lg text-center select-none">Parabéns ao vencedor!</span>
              {/* Animação de luz passando na borda */}
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-2 bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 rounded-full blur-lg animate-light-move" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão tela cheia */}
      {activeTab === 'sorteio' && !isFullscreen && (
        <button onClick={enterFullscreen} className="fixed top-4 right-4 z-50 bg-yellow-400 text-yellow-900 px-4 py-2 rounded shadow-lg font-bold animate-pulse">
          Tela Cheia
        </button>
      )}
    </div>
  );
};

export default TicketManager; 