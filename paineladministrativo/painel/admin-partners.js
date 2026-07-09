/* ═══════════════════════════════════════════════════════════
   PageForge — admin-partners.js
   Módulo completo de gestão de parceiros no painel administrativo
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── ESTADO ─────────────────────────────────────────────── */
  let allPartners = [];
  let currentPartnerId = null;
  const token = localStorage.getItem('authToken');

  /* ─── UTILITÁRIOS ────────────────────────────────────────── */
  function escHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function fmtCurrency(val) {
    return 'R$ ' + Number(val || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function fmtDate(dateStr) {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch { return dateStr; }
  }

  function authHeaders() {
    return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
  }

  function statusBadge(status) {
    const map = {
      'Aprovado': 'badge-aprovado',
      'Pendente': 'badge-pendente',
      'Bloqueado': 'badge-bloqueado'
    };
    return `<span class="partner-badge ${map[status] || 'badge-pendente'}">${escHtml(status)}</span>`;
  }

  /* ─── RENDER DA TABELA ───────────────────────────────────── */
  function renderTable(partners) {
    const tbody = document.getElementById('partners-tbody');
    const emptyState = document.getElementById('partners-empty');
    const tableWrap = document.getElementById('partners-table-wrap');
    const countEl = document.getElementById('partners-count');

    if (countEl) countEl.textContent = `${partners.length} parceiro${partners.length !== 1 ? 's' : ''}`;

    if (!partners.length) {
      if (tableWrap) tableWrap.style.display = 'none';
      if (emptyState) emptyState.style.display = 'flex';
      return;
    }

    if (tableWrap) tableWrap.style.display = 'block';
    if (emptyState) emptyState.style.display = 'none';

    tbody.innerHTML = partners.map(p => `
      <tr class="partner-row" data-id="${escHtml(p.id)}">
        <td>
          <div class="partner-cell-name">
            <div class="partner-avatar-sm">${escHtml((p.name || '?').charAt(0).toUpperCase())}</div>
            <div>
              <div class="partner-name-text">${escHtml(p.name)}</div>
              <div class="partner-email-text">${escHtml(p.email || '—')}</div>
            </div>
          </div>
        </td>
        <td><span class="partner-contact">${escHtml(p.whatsapp || '—')}</span></td>
        <td><span class="partner-contact">${escHtml(p.instagram || '—')}</span></td>
        <td class="partner-date">${fmtDate(p.created_at)}</td>
        <td>${statusBadge(p.status)}</td>
        <td class="partner-num">${p.total_referrals ?? 0}</td>
        <td class="partner-num partner-closed">${p.closed_referrals ?? 0}</td>
        <td class="partner-commission">${fmtCurrency(p.total_commission_paid)}</td>
        <td>
          <div class="partner-actions">
            <button class="pa-btn pa-view" data-id="${escHtml(p.id)}" title="Ver detalhes">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
            ${p.status !== 'Aprovado' ? `
            <button class="pa-btn pa-approve" data-id="${escHtml(p.id)}" data-name="${escHtml(p.name)}" title="Aprovar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </button>` : ''}
            ${p.status !== 'Bloqueado' ? `
            <button class="pa-btn pa-block" data-id="${escHtml(p.id)}" data-name="${escHtml(p.name)}" title="Bloquear">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
            </button>` : ''}
            <button class="pa-btn pa-delete" data-id="${escHtml(p.id)}" data-name="${escHtml(p.name)}" title="Excluir">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    // Event listeners
    tbody.querySelectorAll('.pa-view').forEach(btn => {
      btn.addEventListener('click', () => openPartnerDetail(btn.dataset.id));
    });
    tbody.querySelectorAll('.pa-approve').forEach(btn => {
      btn.addEventListener('click', () => updateStatus(btn.dataset.id, btn.dataset.name, 'Aprovado'));
    });
    tbody.querySelectorAll('.pa-block').forEach(btn => {
      btn.addEventListener('click', () => updateStatus(btn.dataset.id, btn.dataset.name, 'Bloqueado'));
    });
    tbody.querySelectorAll('.pa-delete').forEach(btn => {
      btn.addEventListener('click', () => deletePartner(btn.dataset.id, btn.dataset.name));
    });
  }

  /* ─── CARREGAR PARCEIROS ─────────────────────────────────── */
  async function loadPartners(search = '', statusFilter = '') {
    const loadingEl = document.getElementById('partners-loading');
    if (loadingEl) loadingEl.style.display = 'flex';

    try {
      let url = '/api/partner';
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      if (params.toString()) url += '?' + params.toString();

      const resp = await fetch(url, { headers: authHeaders() });

      if (resp.status === 401) {
        window.location.href = '/paineladministrativo/login/login.html';
        return;
      }

      const data = await resp.json();
      if (!resp.ok || !data.success) throw new Error(data.error || 'Erro ao carregar parceiros');

      allPartners = data.data;
      renderTable(allPartners);

      // Atualizar métricas do painel de parceiros
      updatePartnersMetrics(allPartners);

    } catch (err) {
      console.error('[Partners] Erro ao carregar:', err);
      showPartnerError('Erro ao carregar parceiros: ' + err.message);
    } finally {
      if (loadingEl) loadingEl.style.display = 'none';
    }
  }

  /* ─── MÉTRICAS ───────────────────────────────────────────── */
  function updatePartnersMetrics(partners) {
    const total = partners.length;
    const aprovados = partners.filter(p => p.status === 'Aprovado').length;
    const pendentes = partners.filter(p => p.status === 'Pendente').length;
    const totalComm = partners.reduce((s, p) => s + Number(p.total_commission_paid || 0), 0);

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('pm-total', total);
    set('pm-aprovados', aprovados);
    set('pm-pendentes', pendentes);
    set('pm-comissao', fmtCurrency(totalComm));
  }

  /* ─── ATUALIZAR STATUS ───────────────────────────────────── */
  async function updateStatus(id, name, newStatus) {
    const label = newStatus === 'Aprovado' ? 'aprovar' : 'bloquear';
    if (!confirm(`Deseja ${label} o parceiro "${name}"?`)) return;

    try {
      const resp = await fetch(`/api/partner?id=${id}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ status: newStatus })
      });

      const data = await resp.json();
      if (!resp.ok || !data.success) throw new Error(data.error || 'Erro ao atualizar');

      // Atualizar localmente
      const idx = allPartners.findIndex(p => p.id === id);
      if (idx !== -1) allPartners[idx].status = newStatus;
      renderTable(allPartners);
      updatePartnersMetrics(allPartners);

      showPartnerToast(`✓ Parceiro "${name}" ${newStatus === 'Aprovado' ? 'aprovado' : 'bloqueado'} com sucesso`);

    } catch (err) {
      alert('Erro: ' + err.message);
    }
  }

  /* ─── EXCLUIR PARCEIRO ───────────────────────────────────── */
  async function deletePartner(id, name) {
    if (!confirm(`Excluir o parceiro "${name}"?\n\nTodas as indicações associadas também serão removidas.\n\nEssa ação não pode ser desfeita.`)) return;

    try {
      const resp = await fetch(`/api/partner?id=${id}`, {
        method: 'DELETE',
        headers: authHeaders()
      });

      const data = await resp.json();
      if (!resp.ok || !data.success) throw new Error(data.error || 'Erro ao excluir');

      allPartners = allPartners.filter(p => p.id !== id);
      renderTable(allPartners);
      updatePartnersMetrics(allPartners);
      showPartnerToast(`✓ Parceiro "${name}" removido com sucesso`);

    } catch (err) {
      alert('Erro: ' + err.message);
    }
  }

  /* ─── DETALHE DO PARCEIRO ────────────────────────────────── */
  async function openPartnerDetail(id) {
    currentPartnerId = id;
    const modal = document.getElementById('partner-detail-modal');
    const content = document.getElementById('partner-detail-content');

    if (!modal || !content) return;

    // Mostrar modal com loading
    content.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;padding:60px;gap:12px;color:rgba(240,237,232,0.5);">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin .8s linear infinite">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
        Carregando dados do parceiro...
      </div>`;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    try {
      const resp = await fetch(`/api/partner?id=${id}`, { headers: authHeaders() });

      if (resp.status === 401) { window.location.href = '/paineladministrativo/login/login.html'; return; }

      const data = await resp.json();
      if (!resp.ok || !data.success) throw new Error(data.error || 'Erro ao carregar');

      renderPartnerDetail(data.data);
    } catch (err) {
      content.innerHTML = `<div style="padding:40px;text-align:center;color:#ff6b6b;">Erro: ${escHtml(err.message)}</div>`;
    }
  }

  function renderPartnerDetail(d) {
    const { partner, referrals, stats, timeline } = d;
    const content = document.getElementById('partner-detail-content');

    const refRows = referrals.length ? referrals.map(r => {
      const statusClass = ['Pagamento', 'Em desenvolvimento', 'Entregue', 'Finalizado'].includes(r.status)
        ? 'badge-aprovado'
        : r.status === 'Novo Lead' ? 'badge-pendente' : 'badge-negociando';
      const commColor = r.commission_status === 'Paga' ? '#4ade80' : r.commission_status === 'Liberada' ? '#fbbf24' : 'rgba(240,237,232,0.5)';
      return `
        <tr>
          <td>${escHtml(r.client_name)}<br><span style="font-size:0.8rem;color:rgba(240,237,232,0.45)">${escHtml(r.company || '')}</span></td>
          <td>${escHtml(r.phone || '—')}</td>
          <td><span class="partner-badge ${statusClass}">${escHtml(r.status)}</span></td>
          <td style="color:${commColor}">${fmtCurrency(r.commission_value)}<br><span style="font-size:0.75rem;opacity:0.7">${escHtml(r.commission_status)}</span></td>
          <td style="color:rgba(240,237,232,0.5);font-size:0.85rem">${escHtml(r.created_at)}</td>
        </tr>`;
    }).join('') : `<tr><td colspan="5" style="text-align:center;color:rgba(240,237,232,0.4);padding:30px">Nenhuma indicação registrada</td></tr>`;

    const timelineHtml = timeline.slice(0, 10).map(t => {
      const iconMap = { 'cadastro': '#22c55e', 'indicacao': '#F56A00', 'atualizacao': '#3b82f6', 'comissao': '#4ade80' };
      const color = iconMap[t.type] || '#F56A00';
      const dateStr = t.date ? fmtDate(t.date) : '';
      return `
        <div class="timeline-item">
          <div class="timeline-dot" style="background:${color}; box-shadow: 0 0 8px ${color}40;"></div>
          <div class="timeline-content">
            <div class="timeline-label">${escHtml(t.label)}</div>
            <div class="timeline-date">${dateStr}</div>
          </div>
        </div>`;
    }).join('');

    content.innerHTML = `
      <!-- Header do parceiro -->
      <div class="pd-header">
        <div class="pd-avatar">${escHtml((partner.name || '?').charAt(0).toUpperCase())}</div>
        <div class="pd-info">
          <h2 class="pd-name">${escHtml(partner.name)}</h2>
          <div class="pd-meta">${escHtml(partner.email || '—')} · ${escHtml(partner.whatsapp || '—')}</div>
          <div style="margin-top:8px">${statusBadge(partner.status)}</div>
        </div>
        <div class="pd-header-actions">
          ${partner.status !== 'Aprovado' ? `<button class="pd-action-btn pd-approve" onclick="window._updatePartnerStatus('${escHtml(partner.id)}', '${escHtml(partner.name)}', 'Aprovado')">✓ Aprovar</button>` : ''}
          ${partner.status !== 'Bloqueado' ? `<button class="pd-action-btn pd-block" onclick="window._updatePartnerStatus('${escHtml(partner.id)}', '${escHtml(partner.name)}', 'Bloqueado')">⊘ Bloquear</button>` : ''}
        </div>
      </div>

      <!-- Stats do parceiro -->
      <div class="pd-stats">
        <div class="pd-stat">
          <div class="pd-stat-val">${stats.total_referrals}</div>
          <div class="pd-stat-label">Total Indicações</div>
        </div>
        <div class="pd-stat">
          <div class="pd-stat-val" style="color:#4ade80">${stats.closed_referrals}</div>
          <div class="pd-stat-label">Clientes Fechados</div>
        </div>
        <div class="pd-stat">
          <div class="pd-stat-val" style="color:#F56A00">${fmtCurrency(stats.total_revenue)}</div>
          <div class="pd-stat-label">Valor Gerado</div>
        </div>
        <div class="pd-stat">
          <div class="pd-stat-val" style="color:#4ade80">${fmtCurrency(stats.commission_paid)}</div>
          <div class="pd-stat-label">Comissão Paga</div>
        </div>
        <div class="pd-stat">
          <div class="pd-stat-val" style="color:#fbbf24">${fmtCurrency(stats.commission_pending)}</div>
          <div class="pd-stat-label">Comissão Pendente</div>
        </div>
      </div>

      <div class="pd-body">
        <!-- Coluna esquerda: Info pessoal + Indicações -->
        <div class="pd-left">
          <!-- Informações pessoais -->
          <div class="pd-section">
            <h3 class="pd-section-title">Informações Pessoais</h3>
            <div class="pd-info-grid">
              ${[
                ['Nome', partner.name],
                ['E-mail', partner.email],
                ['WhatsApp', partner.whatsapp],
                ['Instagram', partner.instagram || '—'],
                ['Cidade', partner.city || '—'],
                ['Como conheceu', partner.how_knew || '—'],
                ['Experiência', partner.experience || '—'],
                ['Membro desde', partner.created_at],
                ['Status', partner.status]
              ].map(([label, val]) => `
                <div class="pd-info-item">
                  <div class="pd-info-label">${label}</div>
                  <div class="pd-info-val">${escHtml(val || '—')}</div>
                </div>`).join('')}
            </div>
          </div>

          <!-- Indicações -->
          <div class="pd-section">
            <h3 class="pd-section-title">Clientes Indicados (${referrals.length})</h3>
            <div class="pd-table-wrap">
              <table class="pd-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Contato</th>
                    <th>Status CRM</th>
                    <th>Comissão</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>${refRows}</tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Coluna direita: Timeline -->
        <div class="pd-right">
          <div class="pd-section">
            <h3 class="pd-section-title">Timeline</h3>
            <div class="timeline-list">
              ${timelineHtml || '<p style="color:rgba(240,237,232,0.4);font-size:0.9rem">Nenhum evento registrado</p>'}
            </div>
          </div>
        </div>
      </div>
    `;

    // Bind global para os botões dentro do modal
    window._updatePartnerStatus = (id, name, status) => {
      closePartnerModal();
      updateStatus(id, name, status);
    };
  }

  function closePartnerModal() {
    const modal = document.getElementById('partner-detail-modal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
    currentPartnerId = null;
  }

  /* ─── SEARCH & FILTER ────────────────────────────────────── */
  function initPartnerControls() {
    const searchInput = document.getElementById('partners-search');
    const statusFilter = document.getElementById('partners-status-filter');
    const refreshBtn = document.getElementById('partners-refresh');

    if (searchInput) {
      let timeout;
      searchInput.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          loadPartners(searchInput.value, statusFilter ? statusFilter.value : '');
        }, 300);
      });
    }

    if (statusFilter) {
      statusFilter.addEventListener('change', () => {
        loadPartners(searchInput ? searchInput.value : '', statusFilter.value);
      });
    }

    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        loadPartners(
          searchInput ? searchInput.value : '',
          statusFilter ? statusFilter.value : ''
        );
      });
    }

    // Fechar modal
    const modal = document.getElementById('partner-detail-modal');
    if (modal) {
      modal.addEventListener('click', e => {
        if (e.target === modal) closePartnerModal();
      });
    }

    const closeBtn = document.getElementById('partner-modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closePartnerModal);

    // ESC para fechar modal
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closePartnerModal();
    });
  }

  /* ─── TOAST / FEEDBACK ───────────────────────────────────── */
  function showPartnerToast(msg) {
    let toast = document.getElementById('partner-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'partner-toast';
      toast.style.cssText = `
        position:fixed; bottom:28px; right:28px; z-index:99999;
        background: rgba(10,10,10,0.95); border:1px solid rgba(245,106,0,0.4);
        border-radius:12px; padding:14px 20px; color:#F0EDE8; font-size:0.9rem;
        backdrop-filter:blur(20px); box-shadow:0 8px 40px rgba(0,0,0,0.6);
        transform:translateY(20px); opacity:0; transition:all 0.3s ease;
        max-width:360px;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    });
    setTimeout(() => {
      toast.style.transform = 'translateY(20px)';
      toast.style.opacity = '0';
    }, 3500);
  }

  function showPartnerError(msg) {
    const el = document.getElementById('partners-error');
    if (el) { el.textContent = msg; el.style.display = 'block'; }
    else console.error('[Partners]', msg);
  }

  
  /* ─── RANKING ────────────────────────────────────────────── */
  window.loadAdminRanking = async function () {
    const container = document.querySelector('#section-ranking .partners-table-scroll');
    const empty = document.getElementById('ranking-empty');
    if (!container) return;

    try {
      const resp = await fetch('/api/top-partners');
      const json = await resp.json();

      if (!json.success || !json.data || json.data.length === 0) {
        container.innerHTML = '';
        if (empty) empty.style.display = 'block';
        return;
      }
      if (empty) empty.style.display = 'none';

      const top3 = json.data.slice(0, 3);
      const others = json.data.slice(3);
      
      let html = '<div class="podium-container">';
      
      // Top 2 (Silver)
      if (top3[1]) {
        html += `<div class="podium-step podium-silver">
          <i class="ph-fill ph-trophy podium-icon"></i>
          <div class="podium-partner-name">${escHtml(top3[1].display_name)}</div>
          <div class="podium-sales">${top3[1].closed_referrals} Vendas</div>
        </div>`;
      }
      // Top 1 (Gold)
      if (top3[0]) {
        html += `<div class="podium-step podium-gold">
          <i class="ph-fill ph-trophy podium-icon"></i>
          <div class="podium-partner-name">${escHtml(top3[0].display_name)}</div>
          <div class="podium-sales">${top3[0].closed_referrals} Vendas</div>
        </div>`;
      }
      // Top 3 (Bronze)
      if (top3[2]) {
        html += `<div class="podium-step podium-bronze">
          <i class="ph-fill ph-trophy podium-icon"></i>
          <div class="podium-partner-name">${escHtml(top3[2].display_name)}</div>
          <div class="podium-sales">${top3[2].closed_referrals} Vendas</div>
        </div>`;
      }
      html += '</div>';

      if (others.length > 0) {
        html += '<div class="ranking-list">';
        others.forEach((p, index) => {
          html += `<div class="ranking-list-item">
            <div class="rli-left">
              <span class="rli-pos">#${index + 4}</span>
              <span class="rli-name" style="font-weight:600">${escHtml(p.display_name)}</span>
            </div>
            <div class="rli-right">
              <span class="rli-sales" style="color:var(--orange);font-weight:700">${p.closed_referrals} Vendas</span>
            </div>
          </div>`;
        });
        html += '</div>';
      }

      container.innerHTML = html;
    } catch (err) {
      console.error('[Admin Ranking] Erro:', err);
      container.innerHTML = `<div style="text-align:center;padding:40px;color:red">Erro ao carregar ranking.</div>`;
    }
  };

  
  /* ─── LEADS ───────────────────────────────────────────────── */
  window.allLeads = [];
  
  window.loadAdminLeads = async function () {
    const container = document.querySelector('#section-leads .partners-table-scroll');
    const empty = document.getElementById('leads-empty');
    const count = document.getElementById('leads-count');
    if (!container) return;

    const token = localStorage.getItem('authToken');
    try {
      const resp = await fetch('/api/leads', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await resp.json();
      if (!json.success || !json.data || json.data.length === 0) {
        container.innerHTML = '';
        if (empty) empty.style.display = 'block';
        if (count) count.textContent = '';
        return;
      }
      if (empty) empty.style.display = 'none';
      if (count) count.textContent = `${json.total} leads`;
      
      window.allLeads = json.data;

      let html = '<div class="leads-cards-grid">';
      html += json.data.map(r => {
        const val = Number(r.project_value) > 0 ? 'R$ ' + Number(r.project_value).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : 'A definir';
        const date = r.created_at ? new Date(r.created_at).toLocaleDateString('pt-BR') : '—';
        return `
          <div class="lead-card">
            <div class="lead-card-header">
              <div>
                <h4 class="lead-card-title">${escHtml(r.client_name)}</h4>
                <div class="lead-card-company">${escHtml(r.company) || 'Sem empresa'}</div>
              </div>
              <div>${statusBadge(r.status)}</div>
            </div>
            <div class="lead-card-body">
              <div class="lead-card-item">
                <i class="ph-fill ph-users"></i> ${escHtml(r.partner_name)}
              </div>
              <div class="lead-card-item">
                <i class="ph-fill ph-money"></i> ${val}
              </div>
              <div class="lead-card-item">
                <i class="ph-fill ph-calendar-blank"></i> ${date}
              </div>
            </div>
            <div class="lead-card-footer">
              <button class="lead-card-btn" onclick="openLeadModal('${r.id}')">
                <i class="ph-bold ph-gear"></i> Gerenciar Lead
              </button>
            </div>
          </div>
        `;
      }).join('');
      html += '</div>';
      
      container.innerHTML = html;
      
    } catch (err) {
      console.error('[Admin Leads] Erro:', err);
      container.innerHTML = `<div style="text-align:center;color:red;padding:40px">Erro ao carregar leads.</div>`;
    }
  };

  window.openLeadModal = function(id) {
    const lead = window.allLeads.find(l => l.id === id);
    if (!lead) return;
    
    const modal = document.getElementById('lead-detail-modal');
    const content = document.getElementById('lead-detail-content');
    
    const val = Number(lead.project_value) > 0 ? 'R$ ' + Number(lead.project_value).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : 'A definir';
    const comm = Number(lead.commission_value) > 0 ? 'R$ ' + Number(lead.commission_value).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : 'A definir';
    
    content.innerHTML = `
      <div class="pd-header" style="border-bottom: none; padding-bottom: 0;">
        <div class="pd-info">
          <h2 class="pd-name">${escHtml(lead.client_name)}</h2>
          <div class="pd-meta">Indicado por: <strong>${escHtml(lead.partner_name)}</strong></div>
        </div>
        <div class="pd-header-actions">
          ${statusBadge(lead.status)}
        </div>
      </div>
      
      <div class="pd-body" style="grid-template-columns: 1fr;">
        <div class="pd-section">
          <h3 class="pd-section-title"><i class="ph-bold ph-info"></i> Detalhes do Lead</h3>
          <div class="pd-info-grid">
            <div class="pd-info-item"><div class="pd-info-label">Empresa</div><div class="pd-info-val">${escHtml(lead.company) || '—'}</div></div>
            <div class="pd-info-item"><div class="pd-info-label">Telefone</div><div class="pd-info-val">${escHtml(lead.phone) || '—'}</div></div>
            <div class="pd-info-item"><div class="pd-info-label">Serviço</div><div class="pd-info-val">${escHtml(lead.service) || '—'}</div></div>
            <div class="pd-info-item"><div class="pd-info-label">Instagram</div><div class="pd-info-val">${escHtml(lead.instagram) || '—'}</div></div>
            <div class="pd-info-item"><div class="pd-info-label">Valor do Projeto</div><div class="pd-info-val" style="color:var(--text);font-weight:700">${val}</div></div>
            <div class="pd-info-item"><div class="pd-info-label">Comissão Estimada</div><div class="pd-info-val" style="color:var(--orange);font-weight:700">${comm}</div></div>
          </div>
        </div>
        
        <div class="pd-section">
          <h3 class="pd-section-title"><i class="ph-bold ph-arrows-clockwise"></i> Atualizar Status do Projeto</h3>
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px">
            <button class="pd-action-btn" style="background:rgba(74,222,128,0.1);color:#4ade80;border-color:rgba(74,222,128,0.3)" onclick="updateLeadStatus('${lead.id}', 'Aprovado')">Aprovado</button>
            <button class="pd-action-btn" style="background:rgba(251,191,36,0.1);color:#fbbf24;border-color:rgba(251,191,36,0.3)" onclick="updateLeadStatus('${lead.id}', 'Pendente')">Pendente</button>
            <button class="pd-action-btn" style="background:rgba(239,68,68,0.1);color:#f87171;border-color:rgba(239,68,68,0.3)" onclick="updateLeadStatus('${lead.id}', 'Bloqueado')">Bloqueado</button>
          </div>
        </div>
        
      </div>
    `;
    
    modal.classList.add('active');
  };

  window.closeLeadModal = function() {
    document.getElementById('lead-detail-modal').classList.remove('active');
  };

  window.updateLeadStatus = async function(id, newStatus) {
    if (!confirm(`Mudar o status deste lead para "${newStatus}"?`)) return;
    const btn = event.target;
    const oldText = btn.textContent;
    btn.textContent = 'Salvando...';
    btn.disabled = true;
    
    try {
      const token = localStorage.getItem('authToken');
      const resp = await fetch(`/api/leads?id=${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await resp.json();
      if (!resp.ok || !data.success) throw new Error(data.error || 'Erro ao atualizar');
      
      alert('Lead atualizado com sucesso!');
      closeLeadModal();
      loadAdminLeads();
    } catch (err) {
      alert(err.message);
      btn.textContent = oldText;
      btn.disabled = false;
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.getElementById('lead-modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closeLeadModal);
  });

  /* ─── INICIALIZAÇÃO ──────────────────────────────────────── */
  window.initPartnersModule = function () {
    initPartnerControls();
    loadPartners();

    // Auto-refresh a cada 60 segundos (se a aba estiver ativa)
    setInterval(() => {
      const partnersTab = document.getElementById('tab-partners');
      if (partnersTab && partnersTab.classList.contains('active') && !document.hidden) {
        const search = document.getElementById('partners-search');
        const filter = document.getElementById('partners-status-filter');
        loadPartners(search ? search.value : '', filter ? filter.value : '');
      }
    }, 60000);
  };

  // Expor closePartnerModal globalmente
  window.closePartnerModal = closePartnerModal;

})();
