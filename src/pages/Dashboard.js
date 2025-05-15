import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSubmissions, updateContactStatus, deleteLead } from '../api/formApi';
import { supabase } from '../lib/supabase';
import { getIpLocation } from '../services/ipService';
import TicketManager from '../components/TicketManager';

const WhatsAppIcon = () => (
  <svg className="w-5 h-5 text-red-500 hover:text-red-600" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const LocationIcon = () => (
  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ViewsModal = ({ isOpen, onClose, views }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-black bg-opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-[#070101] border border-red-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-red-900/30 px-4 py-3 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg font-medium text-white">Detalhes das Visualizações</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4 sm:p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-red-800">
                <thead className="bg-red-900/50">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Data/Hora
                    </th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      IP
                    </th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Localização
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-800">
                  {views.map((view, index) => (
                    <tr key={view.id || index} className="hover:bg-red-900/40">
                      <td className="px-3 py-2 text-sm text-white whitespace-nowrap">
                        {new Date(view.timestamp).toLocaleString('pt-BR')}
                      </td>
                      <td className="px-3 py-2 text-sm text-white whitespace-nowrap">
                        {view.ip_address}
                      </td>
                      <td className="px-3 py-2 text-sm text-white">
                        {view.location ? (
                          <div className="flex items-center space-x-1">
                            <LocationIcon />
                            <div>
                              <span className="block">
                                {view.location.city}, {view.location.region}
                              </span>
                              <span className="text-gray-400 text-xs block">
                                {view.location.country}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500">Localização indisponível</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [locations, setLocations] = useState({});
  const [pageViews, setPageViews] = useState(0);
  const [isViewsModalOpen, setIsViewsModalOpen] = useState(false);
  const [viewsData, setViewsData] = useState([]);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(null);
  const [aba, setAba] = useState('leads'); // 'leads' ou 'tickets'

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Iniciando busca de submissões...');
      
      const data = await getSubmissions();
      console.log('Dados recebidos:', data);
      
      if (Array.isArray(data)) {
        setSubmissions(data);
        console.log('Submissões atualizadas com sucesso');
      } else {
        console.error('Dados recebidos não são um array:', data);
        setError('Formato de dados inválido');
      }
    } catch (error) {
      console.error('Erro ao buscar submissões:', error.message);
      if (error.message === 'Usuário não autenticado') {
        console.log('Redirecionando para login por falta de autenticação');
        navigate('/login');
      } else {
        setError(`Erro ao carregar dados: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const fetchPageViews = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('page_views')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;

      const uniqueViews = data.reduce((acc, current) => {
        const currentTime = new Date(current.timestamp).getTime();
        const isDuplicate = acc.some(item => {
          const timeDiff = Math.abs(new Date(item.timestamp).getTime() - currentTime);
          return item.ip_address === current.ip_address && timeDiff < 5000;
        });

        if (!isDuplicate) {
          return [...acc, current];
        }
        return acc;
      }, []);

      setPageViews(uniqueViews.length);
      setViewsData(uniqueViews);
    } catch (error) {
      console.error('Erro ao buscar visualizações:', error);
    }
  }, []);

  const fetchLocations = useCallback(async () => {
    if (!submissions.length) return;

    const pendingLocations = submissions.filter(
      submission => 
        submission?.ip_address && 
        submission.ip_address !== 'IP não disponível' && 
        !locations[submission.ip_address]
    );

    if (!pendingLocations.length) return;

    const newLocations = { ...locations };
    let hasNewLocations = false;
    
    for (const submission of pendingLocations) {
      try {
        const location = await getIpLocation(submission.ip_address);
        if (location) {
          newLocations[submission.ip_address] = location;
          hasNewLocations = true;
        }
      } catch (error) {
        console.error('Erro ao buscar localização:', error);
      }
    }
    
    if (hasNewLocations) {
      setLocations(newLocations);
    }
  }, [submissions, locations]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Verificando autenticação...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro na verificação de sessão:', error.message);
          navigate('/login');
          return;
        }

        if (!session) {
          console.log('Sessão não encontrada, redirecionando para login');
          navigate('/login');
          return;
        }

        console.log('Usuário autenticado, buscando dados');
        fetchSubmissions();
        fetchPageViews();
      } catch (error) {
        console.error('Erro na autenticação:', error.message);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate, fetchSubmissions, fetchPageViews]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleWhatsAppClick = (telefone) => {
    if (!telefone) return;
    const numeroLimpo = telefone.replace(/\D/g, '');
    window.open(`https://wa.me/55${numeroLimpo}`, '_blank');
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredSubmissions = submissions.filter((sub) => {
    if (!sub) return false;

    // Filtro por texto (nome, telefone ou IP)
    const searchFilter = searchTerm.toLowerCase();
    const matchesSearch = 
      (sub.nome?.toLowerCase().includes(searchFilter)) ||
      (sub.telefone?.includes(searchFilter)) ||
      (sub.ip_address?.includes(searchFilter));

    // Filtro por experiência
    const matchesExperience = filterType === 'all' || sub.experiencia_igaming === filterType;

    // Filtro por data
    const submissionDate = new Date(sub.submitted_at);
    const startDate = dateRange.startDate ? new Date(dateRange.startDate + 'T00:00:00') : null;
    const endDate = dateRange.endDate ? new Date(dateRange.endDate + 'T23:59:59') : null;

    const matchesDateRange = 
      (!startDate || submissionDate >= startDate) &&
      (!endDate || submissionDate <= endDate);

    return matchesSearch && matchesExperience && matchesDateRange;
  });

  const getExperienceCount = (type) => {
    return filteredSubmissions.filter(s => s?.experiencia_igaming === type).length;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).format(date);
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return '-';
    }
  };

  const formatField = (value) => {
    if (value === undefined || value === null || value === '') {
      return '-';
    }
    return value;
  };

  const handleContactToggle = async (id, currentStatus) => {
    try {
      await updateContactStatus(id, !currentStatus);
      // Atualizar a lista de submissões
      fetchSubmissions();
    } catch (error) {
      console.error('Erro ao atualizar status de contato:', error);
    }
  };

  const handleDeleteConfirm = async (id) => {
    try {
      await deleteLead(id);
      setIsConfirmingDelete(null);
      // Atualizar a lista de submissões
      fetchSubmissions();
    } catch (error) {
      console.error('Erro ao excluir lead:', error);
    }
  };

  return (
    <div className="min-h-screen relative bg-[#070101]">
      {/* Background Container */}
      <div className="fixed inset-0 z-0">
        {/* Background Image */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: 'url("/fundo.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat'
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-[#070101] bg-opacity-85" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="bg-red-900/30 border-b border-red-800 sticky top-0 z-20">
          <div className="max-w-full px-2 sm:px-4 py-2 sm:py-4 relative">
            <div className="flex justify-center items-center relative min-h-[48px]">
              <img src="/logo.png" alt="Logo Bravo.Bet" className="h-10 sm:h-12 md:h-16 mx-auto" />
              <button
                onClick={handleLogout}
                className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm text-white bg-red-600 rounded-md hover:bg-red-700 absolute right-2 sm:right-0 top-1/2 -translate-y-1/2"
                style={{maxWidth: '90px'}}
              >
                Sair
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-2 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4">
            <button
              className={`w-full sm:w-auto px-4 py-2 rounded ${aba === 'leads' ? 'bg-red-600 text-white' : 'bg-red-900 text-gray-300'}`}
              onClick={() => setAba('leads')}
            >
              Leads
            </button>
            <button
              className={`w-full sm:w-auto px-4 py-2 rounded ${aba === 'tickets' ? 'bg-red-600 text-white' : 'bg-red-900 text-gray-300'}`}
              onClick={() => setAba('tickets')}
            >
              Tickets
            </button>
          </div>
          {aba === 'leads' && (
            <>
          {/* Filters */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4">
            <input
              type="text"
              placeholder="Buscar por nome, telefone ou IP..."
              className="w-full px-4 py-2 bg-red-900/30 border border-red-800 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="w-full px-4 py-2 bg-red-900/30 border border-red-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">Todos os Leads</option>
              <option value="SIM">Afiliados Experientes</option>
              <option value="NÃO">Afiliados Iniciantes</option>
              <option value="NÃO SEI O QUE É">Potenciais Afiliados</option>
            </select>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="date"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateChange}
                className="w-full px-4 py-2 bg-red-900/30 border border-red-800 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
              />
              <input
                type="date"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateChange}
                className="w-full px-4 py-2 bg-red-900/30 border border-red-800 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-8">
            <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 md:p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-start">
                <div>
                  <h3 className="text-base md:text-lg font-medium text-white mb-2">Visualizações da Landing</h3>
                  <p className="text-2xl md:text-3xl font-bold text-red-500">{pageViews}</p>
                </div>
                <button
                  onClick={() => {
                    fetchPageViews();
                    setIsViewsModalOpen(true);
                  }}
                  className="text-white bg-red-600 hover:bg-red-700 rounded-md px-3 py-1 text-sm transition-colors mt-2 sm:mt-0"
                >
                  Detalhes
                </button>
              </div>
            </div>
            <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 md:p-6">
              <h3 className="text-base md:text-lg font-medium text-white mb-2">Total no Funil</h3>
              <p className="text-2xl md:text-3xl font-bold text-red-500">{filteredSubmissions.length}</p>
            </div>
            <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 md:p-6">
              <h3 className="text-base md:text-lg font-medium text-white mb-2">Afiliados Experientes</h3>
              <p className="text-2xl md:text-3xl font-bold text-red-500">
                {getExperienceCount('SIM')}
              </p>
            </div>
            <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 md:p-6">
              <h3 className="text-base md:text-lg font-medium text-white mb-2">Afiliados Iniciantes</h3>
              <p className="text-2xl md:text-3xl font-bold text-red-500">
                {getExperienceCount('NÃO')}
              </p>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 text-red-500 mx-auto">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-12">{error}</div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="text-gray-400 text-center py-12">Nenhum lead encontrado no funil</div>
          ) : (
            <div className="w-full overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="bg-red-900/30 border border-red-800 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-red-800 text-xs sm:text-sm">
                    <thead className="bg-red-900/50">
                      <tr>
                        <th scope="col" className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                          Entrada no Funil
                        </th>
                        <th scope="col" className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                          Nome
                        </th>
                        <th scope="col" className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                          Telefone
                        </th>
                        <th scope="col" className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                          IP
                        </th>
                        <th scope="col" className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                          Localização
                        </th>
                        <th scope="col" className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                          Exp.
                        </th>
                        <th scope="col" className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                          Faturamento
                        </th>
                        <th scope="col" className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                          Fonte
                        </th>
                        <th scope="col" className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                          Status
                        </th>
                        <th scope="col" className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-red-800">
                      {filteredSubmissions.map((submission, index) => (
                        <tr key={submission.id || index} className="hover:bg-red-900/40">
                          <td className="px-2 sm:px-3 py-2 text-[10px] sm:text-sm text-gray-300 whitespace-nowrap">
                            {formatDate(submission?.submitted_at)}
                          </td>
                          <td className="px-2 sm:px-3 py-2 text-[10px] sm:text-sm text-white whitespace-nowrap max-w-[80px] sm:max-w-[150px] truncate">
                            {formatField(submission?.nome)}
                          </td>
                          <td className="px-2 sm:px-3 py-2 text-[10px] sm:text-sm text-white whitespace-nowrap">
                            <div className="flex items-center space-x-1">
                              <span className="truncate max-w-[70px] sm:max-w-[120px]">{formatField(submission?.telefone)}</span>
                              {submission?.telefone && (
                                <button
                                  onClick={() => handleWhatsAppClick(submission.telefone)}
                                  className="hover:scale-110 transition-transform flex-shrink-0"
                                  title="Abrir WhatsApp"
                                >
                                  <WhatsAppIcon />
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="px-2 sm:px-3 py-2 text-[10px] sm:text-sm text-gray-300 whitespace-nowrap">
                            {formatField(submission?.ip_address)}
                          </td>
                          <td className="px-2 sm:px-3 py-2 text-[10px] sm:text-sm text-white whitespace-nowrap">
                            {submission?.ip_address && locations[submission.ip_address] ? (
                              <div className="flex items-center space-x-1">
                                <LocationIcon />
                                <div>
                                  <span className="block">
                                    {locations[submission.ip_address].city}, {locations[submission.ip_address].region}
                                  </span>
                                  <span className="text-gray-400 text-[9px] sm:text-xs block">
                                    {locations[submission.ip_address].country}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-500">Localização indisponível</span>
                            )}
                          </td>
                          <td className="px-2 sm:px-3 py-2 text-[10px] sm:text-sm text-white whitespace-nowrap">
                            {formatField(submission?.experiencia_igaming)}
                          </td>
                          <td className="px-2 sm:px-3 py-2 text-[10px] sm:text-sm text-white whitespace-nowrap">
                            {formatField(submission?.faturamento_mensal)}
                          </td>
                          <td className="px-2 sm:px-3 py-2 text-[10px] sm:text-sm text-white whitespace-nowrap max-w-[100px] sm:max-w-[200px] truncate">
                            {formatField(submission?.fonte_trafego)}
                          </td>
                          <td className="px-2 sm:px-3 py-2 text-[10px] sm:text-sm text-white whitespace-nowrap">
                            <div className="relative">
                              <button
                                onClick={() => handleContactToggle(submission.id, submission.contacted)}
                                className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                                  submission.contacted
                                    ? 'bg-green-900/50 text-green-400 hover:bg-green-900/70'
                                    : 'bg-yellow-900/50 text-yellow-400 hover:bg-yellow-900/70'
                                }`}
                              >
                                {submission.contacted ? 'Contactado' : 'Pendente'}
                              </button>
                              {submission.contact_date && (
                                <span className="block text-[9px] sm:text-xs text-gray-400 mt-1">
                                  {new Date(submission.contact_date).toLocaleString('pt-BR')}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-2 sm:px-3 py-2 text-[10px] sm:text-sm text-white whitespace-nowrap">
                            {isConfirmingDelete === submission.id ? (
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleDeleteConfirm(submission.id)}
                                  className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-[10px] sm:text-xs"
                                >
                                  Confirmar
                                </button>
                                <button
                                  onClick={() => setIsConfirmingDelete(null)}
                                  className="px-2 py-1 bg-gray-600 hover:bg-gray-700 rounded text-[10px] sm:text-xs"
                                >
                                  Cancelar
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setIsConfirmingDelete(submission.id)}
                                className="text-red-500 hover:text-red-400"
                                title="Excluir lead"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Views Modal */}
          <ViewsModal
            isOpen={isViewsModalOpen}
            onClose={() => setIsViewsModalOpen(false)}
            views={viewsData}
          />
            </>
          )}
          {aba === 'tickets' && (
            <TicketManager />
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 