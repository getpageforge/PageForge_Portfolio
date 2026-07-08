// supabase-config.js
// ATENÇÃO: Substitua os valores abaixo pelas suas chaves do Supabase.
// Você encontra isso em: Project Settings -> API
// Certifique-se de usar a chave "anon" e "public" aqui, NUNCA a service_role.

const SUPABASE_URL = 'https://iawdkbcrpigaqjcgalqe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlhd2RrYmNycGlnYXFqY2dhbHFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2MTQzOTgsImV4cCI6MjA5NjE5MDM5OH0.j8lXNn92e-jqYGhJLNGZDEZH1MQzrXPdH-Mdf-g6IVc';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
