// supabase-config.js
// ATENÇÃO: Substitua os valores abaixo pelas suas chaves do Supabase.
// Você encontra isso em: Project Settings -> API
// Certifique-se de usar a chave "anon" e "public" aqui, NUNCA a service_role.

const SUPABASE_URL = 'https://iawdkbcrpigaqjcgalqe.supabase.co';
const SUPABASE_ANON_KEY = 'COLOQUE_SUA_CHAVE_ANON_AQUI'; 

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
