(function () {
  'use strict';

  const loginForm = document.querySelector('.login-form');
  const senhaField = document.getElementById('senha');
  const btnEnter = document.querySelector('.btn-enter');

  if (!loginForm || !senhaField) return;

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const senha = senhaField.value.trim();

    if (!senha) {
      showError('Digite sua senha');
      return;
    }

    // Desabilitar botão
    btnEnter.disabled = true;
    btnEnter.style.opacity = '0.5';
    btnEnter.style.cursor = 'not-allowed';

    try {
      console.log('[LOGIN] Iniciando autenticação...');
      
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha })
      });

      console.log('[LOGIN] Response status:', response.status);

      const data = await response.json();

      console.log('[LOGIN] Response data:', data);

      if (!response.ok) {
        console.error('[LOGIN] Erro HTTP:', response.status, data.error);
        showError(data.error || `Erro ${response.status}: Falha no servidor`);
        return;
      }

      if (!data.success) {
        console.error('[LOGIN] Autenticação falhou:', data.error);
        showError(data.error || 'Erro ao fazer login');
        return;
      }

      // Salvar token em localStorage
      console.log('[LOGIN] Login bem-sucedido! Salvando token...');
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('tokenExpiresAt', data.expiresAt);

      console.log('[LOGIN] Token salvo. Redirecionando para painel...');

      // Redirecionar para painel administrativo
      setTimeout(() => {
        window.location.href = '/paineladministrativo/painel/admin.html';
      }, 500);

    } catch (err) {
      console.error('[LOGIN] Erro de rede ou parse:', err);
      showError('Erro ao conectar com o servidor. Verifique sua conexão.');
    } finally {
      // Não limpar o campo se houver erro - deixar visível para retry
      if (btnEnter.disabled) {
        btnEnter.disabled = false;
        btnEnter.style.opacity = '1';
        btnEnter.style.cursor = 'pointer';
      }
    }
  });

  function showError(message) {
    console.warn('[LOGIN] Erro exibindo:', message);

    // Remover erro anterior
    const existing = document.querySelector('.login-error');
    if (existing) existing.remove();

    // Criar mensagem de erro
    const errorDiv = document.createElement('div');
    errorDiv.className = 'login-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
      background-color: #fee;
      color: #c33;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 16px;
      font-size: 14px;
      border-left: 3px solid #c33;
      animation: slideDown 0.3s ease-out;
    `;

    loginForm.insertBefore(errorDiv, senhaField.parentElement);

    // Remover após 5 segundos
    setTimeout(() => {
      if (errorDiv.parentElement) {
        errorDiv.remove();
      }
    }, 5000);
  }

})();
