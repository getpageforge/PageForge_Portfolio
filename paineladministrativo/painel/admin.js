(function () {
  'use strict';

  /* ──────────────────────────────────────────────── */
  /* ELEMENTOS DO DOM */
  /* ──────────────────────────────────────────────── */

  const searchInput = document.getElementById('search-input');
  const searchClear = document.getElementById('search-clear');
  const refreshBtn = document.getElementById('refresh-btn');
  const briefingsList = document.getElementById('briefings-list');
  const emptyState = document.getElementById('empty-state');
  const noResults = document.getElementById('no-results');
  const resultsCount = document.getElementById('results-count');
  const listView = document.getElementById('list-view');
  const detailView = document.getElementById('detail-view');
  const detailCard = document.getElementById('detail-card');
  const backBtn = document.getElementById('back-btn');
  const metricsTotal = document.getElementById('metric-total');
  const metricsToday = document.getElementById('metric-today');
  const metricsWeek = document.getElementById('metric-week');
  const metricsMonth = document.getElementById('metric-month');

  /* ──────────────────────────────────────────────── */
  /* AUTENTICAÇÃO & PROTEÇÃO */
  /* ──────────────────────────────────────────────– */

  function checkAuth() {
    const token = localStorage.getItem('authToken');
    const expiresAt = localStorage.getItem('tokenExpiresAt');

    if (!token || !expiresAt) {
      redirectToLogin();
      return false;
    }

    // Verificar se token expirou
    if (new Date(expiresAt) < new Date()) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('tokenExpiresAt');
      redirectToLogin();
      return false;
    }

    return true;
  }

  function redirectToLogin() {
    window.location.href = '/paineladministrativo/login/login.html';
  }

  /* ──────────────────────────────────────────────── */
  /* LOGOUT */
  /* ──────────────────────────────────────────────– */

  // Adicionar botão de logout no header
  const headerStatus = document.querySelector('.header-status');
  if (headerStatus) {
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'btn-logout';
    logoutBtn.textContent = 'Logout';
    logoutBtn.style.cssText = `
      background: none;
      border: 1px solid rgba(255,255,255,0.2);
      color: #fff;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      transition: all 0.3s ease;
    `;
    logoutBtn.addEventListener('mouseover', () => {
      logoutBtn.style.borderColor = '#F56A00';
      logoutBtn.style.color = '#F56A00';
    });
    logoutBtn.addEventListener('mouseout', () => {
      logoutBtn.style.borderColor = 'rgba(255,255,255,0.2)';
      logoutBtn.style.color = '#fff';
    });
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('tokenExpiresAt');
      redirectToLogin();
    });
    headerStatus.parentElement.appendChild(logoutBtn);
  }

  /* ──────────────────────────────────────────────── */
  /* BUSCAR BRIEFINGS */
  /* ──────────────────────────────────────────────– */

  async function loadBriefings(searchTerm = '') {
    try {
      let url = '/api/list-briefings?limit=100';
      if (searchTerm.trim()) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }

      const token = localStorage.getItem('authToken');
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        redirectToLogin();
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        showError('Erro ao carregar briefings');
        return;
      }

      renderBriefingsList(data.data);
      updateMetrics(data.data);
      updateResultsCount(data.data.length, data.pagination.total);

    } catch (err) {
      console.error('Erro ao buscar briefings:', err);
      showError('Erro ao conectar com a API');
    }
  }

  function renderBriefingsList(briefings) {
    briefingsList.innerHTML = '';

    if (briefings.length === 0) {
      emptyState.style.display = 'flex';
      noResults.style.display = 'none';
      return;
    }

    emptyState.style.display = 'none';
    noResults.style.display = 'none';

    briefings.forEach(briefing => {
      const card = document.createElement('div');
      card.className = 'briefing-card';
      card.style.cssText = `
        padding: 16px;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 12px;
        background: rgba(255,255,255,0.02);
        cursor: pointer;
        transition: all 0.3s ease;
        margin-bottom: 12px;
      `;
      card.addEventListener('mouseover', () => {
        card.style.backgroundColor = 'rgba(245, 106, 0, 0.05)';
        card.style.borderColor = 'rgba(245, 106, 0, 0.3)';
      });
      card.addEventListener('mouseout', () => {
        card.style.backgroundColor = 'rgba(255,255,255,0.02)';
        card.style.borderColor = 'rgba(255,255,255,0.1)';
      });
      card.addEventListener('click', () => {
        viewBriefingDetail(briefing.id);
      });

      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px;">
          <div style="flex: 1;">
            <div style="font-weight: 600; color: #fff; margin-bottom: 4px;">${escapeHtml(briefing.nome)}</div>
            <div style="font-size: 13px; color: rgba(255,255,255,0.6); margin-bottom: 8px;">${escapeHtml(briefing.empresa)}</div>
            <div style="font-size: 12px; color: rgba(255,255,255,0.4);">${escapeHtml(briefing.email)}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 12px; color: rgba(255,255,255,0.5);">${briefing.created_at}</div>
          </div>
        </div>
      `;

      briefingsList.appendChild(card);
    });
  }

  function updateResultsCount(found, total) {
    if (found === total) {
      resultsCount.textContent = `${total} briefing${total !== 1 ? 's' : ''}`;
    } else {
      resultsCount.textContent = `${found} de ${total} resultado${found !== 1 ? 's' : ''}`;
    }
  }

  /* ──────────────────────────────────────────────── */
  /* VER DETALHES DO BRIEFING */
  /* ──────────────────────────────────────────────– */

  async function viewBriefingDetail(id) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/get-briefing?id=${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        redirectToLogin();
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        showError('Erro ao carregar briefing');
        return;
      }

      renderBriefingDetail(data.data);
      listView.style.display = 'none';
      detailView.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
      console.error('Erro ao buscar detalhes:', err);
      showError('Erro ao carregar detalhes do briefing');
    }
  }

  function renderBriefingDetail(briefing) {
    // Mapa de perguntas correspondentes às respostas
    const questionMap = {
      nome: 'Nome Completo',
      empresa: 'Empresa ou Projeto',
      segmento: 'Segmento de Atuação',
      email: 'E-mail Profissional',
      whatsapp: 'WhatsApp',
      instagram: 'Instagram da Marca',
      site: 'Site Atual',
      origem: 'Como Conheceu a PageForge',
      tempo: 'Tempo de Mercado',
      descricao: 'Descrição da Empresa',
      cliente_ideal: 'Cliente Ideal',
      faixa_etaria: 'Faixa Etária do Público',
      comportamento: 'Comportamento do Público',
      dores_publico: 'Dores e Objeções',
      diferencial: 'Diferencial Competitivo',
      percepcao: 'Percepção Atual da Marca',
      servico: 'Serviços Desejados',
      paginas: 'Páginas do Site',
      funcionalidades: 'Funcionalidades',
      problemas: 'Problemas Identificados',
      oportunidades: 'Oportunidades de Venda',
      objetivo: 'Objetivo Principal',
      metas: 'Metas',
      expectativas: 'Expectativas',
      meta_financeira: 'Meta Financeira',
      crescimento: 'Crescimento Esperado',
      percepcao_desejada: 'Percepção Desejada',
      autoridade: 'Autoridade da Marca',
      visao: 'Visão de Futuro',
      estilo_visual: 'Estilo Visual',
      cores: 'Paleta de Cores',
      estilo_evitar: 'Estilo a Evitar',
      concorrentes: 'Concorrentes Observados',
      inspiracoes: 'Inspirações de Sites',
      marcas_admira: 'Marcas Admiradas',
      urgencia: 'Urgência do Projeto',
      prazo: 'Prazo Desejado',
      orcamento: 'Investimento Previsto',
      data_importante: 'Data Importante',
      dificuldades: 'Dificuldades Digitais',
      melhorar: 'O Que Melhorar',
      observacoes: 'Observações Finais',
      consentimento: 'Consentimento de Dados'
    };

    let html = `
      <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 32px;">
        <div style="margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <h2 style="color: #fff; font-size: 24px; margin-bottom: 8px;">${escapeHtml(briefing.nome)}</h2>
          <p style="color: rgba(255,255,255,0.6); font-size: 14px;">
            <strong>Empresa:</strong> ${escapeHtml(briefing.empresa)} | 
            <strong>E-mail:</strong> ${escapeHtml(briefing.email)} | 
            <strong>WhatsApp:</strong> ${escapeHtml(briefing.whatsapp)}
          </p>
          <p style="color: rgba(255,255,255,0.4); font-size: 12px; margin-top: 12px;">
            Recebido em: ${briefing.created_at}
          </p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr; gap: 24px;">
    `;

    // Exibir respostas estruturadas
    const respostas = briefing.respostas || {};
    const chaves = Object.keys(respostas).sort();

    chaves.forEach(chave => {
      const valor = respostas[chave];
      const pergunta = questionMap[chave] || formatPergunta(chave);

      html += `
        <div style="padding: 16px; background: rgba(245, 106, 0, 0.05); border-left: 3px solid #F56A00; border-radius: 8px;">
          <div style="font-weight: 600; color: #F56A00; font-size: 12px; text-transform: uppercase; margin-bottom: 8px;">${pergunta}</div>
          <div style="color: rgba(255,255,255,0.8); line-height: 1.6; word-break: break-word;">${escapeHtml(String(valor))}</div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    detailCard.innerHTML = html;
  }

  function formatPergunta(chave) {
    return chave
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /* ──────────────────────────────────────────────── */
  /* MÉTRICAS */
  /* ──────────────────────────────────────────────– */

  function updateMetrics(briefings) {
    const hoje = new Date().toDateString();
    const semanaAtrás = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toDateString();
    const mesAtrás = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toDateString();

    let countToday = 0;
    let countWeek = 0;
    let countMonth = 0;

    briefings.forEach(b => {
      const dataBriefing = new Date(b.created_at).toDateString();
      if (dataBriefing === hoje) countToday++;
      if (new Date(dataBriefing) >= new Date(semanaAtrás)) countWeek++;
      if (new Date(dataBriefing) >= new Date(mesAtrás)) countMonth++;
    });

    if (metricsTotal) metricsTotal.textContent = briefings.length;
    if (metricsToday) metricsToday.textContent = countToday;
    if (metricsWeek) metricsWeek.textContent = countWeek;
    if (metricsMonth) metricsMonth.textContent = countMonth;
  }

  /* ──────────────────────────────────────────────── */
  /* UTILITÁRIOS */
  /* ──────────────────────────────────────────────– */

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function showError(msg) {
    console.error(msg);
  }

  /* ──────────────────────────────────────────────── */
  /* EVENT LISTENERS */
  /* ──────────────────────────────────────────────– */

  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      const value = e.target.value;
      searchClear.style.display = value ? 'flex' : 'none';
      searchTimeout = setTimeout(() => {
        loadBriefings(value);
      }, 300);
    });
  }

  if (searchClear) {
    searchClear.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchClear.style.display = 'none';
        loadBriefings();
      }
    });
  }

  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      const searchTerm = searchInput ? searchInput.value : '';
      loadBriefings(searchTerm);
    });
  }

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      detailView.style.display = 'none';
      listView.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ──────────────────────────────────────────────── */
  /* INICIALIZAÇÃO */
  /* ──────────────────────────────────────────────– */

  if (!checkAuth()) return;

  loadBriefings();

  // Recarregar a cada 30 segundos
  setInterval(() => {
    if (listView.style.display !== 'none') {
      const searchTerm = searchInput ? searchInput.value : '';
      loadBriefings(searchTerm);
    }
  }, 30000);

})();
