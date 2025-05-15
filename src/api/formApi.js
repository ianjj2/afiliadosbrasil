import { supabase } from '../lib/supabase';

export const submitForm = async (formData, ipAddress) => {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .insert([
        {
          nome: formData.nome,
          telefone: formData.telefone,
          experiencia_igaming: formData.experiencia_igaming,
          faturamento_mensal: formData.faturamento_mensal,
          fonte_trafego: formData.fonte_trafego,
          cpf: formData.cpf,
          email: formData.email,
          ip_address: ipAddress,
          submitted_at: new Date().toISOString(),
        }
      ])
      .select();

    if (error) {
      console.error('Erro ao enviar formulário:', error);
      throw error;
    }
    return data[0];
  } catch (error) {
    console.error('Error submitting form:', error);
    throw error;
  }
};

export const getSubmissions = async () => {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar submissões:', error);
    throw error;
  }
};

export const updateContactStatus = async (id, contacted) => {
  try {
    const { error } = await supabase
      .from('submissions')
      .update({ contacted, contact_date: contacted ? new Date().toISOString() : null })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao atualizar status de contato:', error);
    throw error;
  }
};

export const deleteLead = async (id) => {
  try {
    const { error } = await supabase
      .from('submissions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao excluir lead:', error);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      console.error('Erro no login:', error.message);
      throw error;
    }

    if (!data?.session?.access_token) {
      throw new Error('Token de acesso não encontrado');
    }

    return { token: data.session.access_token };
  } catch (error) {
    console.error('Error logging in:', error.message);
    throw error;
  }
};

export const findTicketByCpfEmailOrTelefone = async ({ cpf, email, telefone }) => {
  try {
    const filters = [];
    if (cpf) filters.push(`cpf.eq.${cpf}`);
    if (email) filters.push(`email.eq.${email}`);
    if (telefone) filters.push(`telefone.eq.${telefone}`);
    if (filters.length === 0) return null;

    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .or(filters.join(','))
      .limit(1);
    if (error) throw error;
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Erro ao buscar ticket:', error);
    throw error;
  }
}; 