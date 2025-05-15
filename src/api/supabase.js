import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const generateTicket = async (formData) => {
  const ticketNumber = Math.floor(100000 + Math.random() * 900000); // Gera número de 6 dígitos
  
  const { data, error } = await supabase
    .from('tickets')
    .insert([
      {
        ticket_number: ticketNumber,
        nome: formData.nome,
        telefone: formData.telefone,
        cpf: formData.cpf,
        email: formData.email,
        validado: false,
        created_at: new Date().toISOString()
      }
    ]);

  if (error) throw error;
  return ticketNumber;
};

export const validateTicket = async (ticketNumber) => {
  const { data, error } = await supabase
    .from('tickets')
    .update({ validado: true })
    .eq('ticket_number', ticketNumber)
    .select();

  if (error) throw error;
  return data;
};

export const getValidatedTickets = async () => {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('validado', true);

  if (error) throw error;
  return data;
}; 