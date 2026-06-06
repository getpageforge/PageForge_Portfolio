(function () {
  'use strict';

  const TOTAL_STEPS = 7;
  let currentStep = 1;
  const formData = {};

  /* ── ELEMENTS ─────────────────────────────────── */
  const heroSection   = document.getElementById('heroSection');
  const formSection   = document.getElementById('formSection');
  const reviewSection = document.getElementById('reviewSection');
  const successSection= document.getElementById('successSection');
  const startBtn      = document.getElementById('startBtn');
  const btnNext       = document.getElementById('btnNext');
  const btnBack       = document.getElementById('btnBack');
  const btnReviewBack = document.getElementById('btnReviewBack');
  const btnSubmit     = document.getElementById('btnSubmit');
  const progressFill  = document.getElementById('progressFill');
  const progressLabel = document.getElementById('progressLabel');
  const progressPct   = document.getElementById('progressPct');
  const progressSteps = document.getElementById('progressSteps');
  const stepsContainer= document.getElementById('stepsContainer');
  const reviewGrid    = document.getElementById('reviewGrid');
  const analysisList  = document.getElementById('analysisList');

  /* ── INIT DOTS ────────────────────────────────── */
  for (let i = 1; i <= TOTAL_STEPS; i++) {
    const dot = document.createElement('div');
    dot.className = 'step-dot' + (i === 1 ? ' active' : '');
    dot.dataset.dot = i;
    progressSteps.appendChild(dot);
  }

  /* ── START ────────────────────────────────────── */
  startBtn.addEventListener('click', () => {
    heroSection.classList.add('hidden');
    formSection.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── CHIP TOGGLE ──────────────────────────────── */
  document.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    const group = chip.closest('.chips-group');
    const isMulti = group.dataset.multi === 'true';
    if (!isMulti) {
      group.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
    }
    chip.classList.toggle('selected');
    group.classList.remove('error');
  });

  /* ── VALIDATION ───────────────────────────────── */
  function clearErrors(panel) {
    panel.querySelectorAll('.field-input.error').forEach(f => f.classList.remove('error'));
    panel.querySelectorAll('.chips-group.error').forEach(g => g.classList.remove('error'));
    panel.querySelectorAll('.field-error').forEach(e => e.remove());
  }

  function showError(el, msg) {
    el.classList.add('error');
    const existing = el.parentElement.querySelector('.field-error');
    if (!existing) {
      const err = document.createElement('span');
      err.className = 'field-error';
      err.textContent = msg;
      el.parentElement.appendChild(err);
    }
  }

  function validateStep(step) {
    const panel = document.querySelector(`.step-panel[data-step="${step}"]`);
    clearErrors(panel);
    let valid = true;

    // Required inputs/textareas/selects
    panel.querySelectorAll('[required]').forEach(field => {
      if (field.type === 'checkbox') {
        if (!field.checked) {
          const label = field.closest('.consent-wrap');
          if (label && !label.querySelector('.field-error')) {
            const err = document.createElement('span');
            err.className = 'field-error';
            err.textContent = 'Você precisa concordar para continuar.';
            label.appendChild(err);
          }
          valid = false;
        }
      } else if (!field.value.trim()) {
        showError(field, 'Este campo é obrigatório.');
        valid = false;
      } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) {
        showError(field, 'Insira um e-mail válido.');
        valid = false;
      }
    });

    // Required chip groups
    panel.querySelectorAll('.chips-group[data-required="true"]').forEach(group => {
      const selected = group.querySelector('.chip.selected');
      if (!selected) {
        group.classList.add('error');
        const existing = group.parentElement.querySelector('.field-error');
        if (!existing) {
          const err = document.createElement('span');
          err.className = 'field-error';
          err.textContent = 'Selecione pelo menos uma opção.';
          group.parentElement.appendChild(err);
        }
        valid = false;
      }
    });

    return valid;
  }

  /* ── COLLECT DATA ─────────────────────────────── */
  function collectStep(step) {
    const panel = document.querySelector(`.step-panel[data-step="${step}"]`);

    panel.querySelectorAll('.field-input').forEach(field => {
      if (field.name && field.value.trim()) {
        formData[field.name] = field.value.trim();
      }
    });

    panel.querySelectorAll('.chips-group').forEach(group => {
      const name = group.dataset.name;
      const selected = [...group.querySelectorAll('.chip.selected')].map(c => c.dataset.value);
      if (name && selected.length) {
        formData[name] = selected.join(', ');
      }
    });

    const consent = panel.querySelector('#f_consent');
    if (consent) formData['consentimento'] = consent.checked ? 'Sim' : 'Não';
  }

  /* ── UPDATE PROGRESS ──────────────────────────── */
  function updateProgress(step) {
    const pct = Math.round((step / TOTAL_STEPS) * 100);
    progressFill.style.width = pct + '%';
    progressLabel.textContent = `Etapa ${step} de ${TOTAL_STEPS}`;
    progressPct.textContent   = pct + '%';
    document.querySelectorAll('.step-dot').forEach(dot => {
      const n = parseInt(dot.dataset.dot);
      dot.classList.remove('active', 'done');
      if (n < step) dot.classList.add('done');
      else if (n === step) dot.classList.add('active');
    });
  }

  /* ── SHOW STEP ────────────────────────────────── */
  function showStep(step) {
    document.querySelectorAll('.step-panel').forEach(p => {
      p.classList.add('hidden');
    });
    const panel = document.querySelector(`.step-panel[data-step="${step}"]`);
    panel.classList.remove('hidden');
    // re-trigger animation
    panel.style.animation = 'none';
    panel.offsetHeight;
    panel.style.animation = '';

    btnBack.classList.toggle('hidden', step === 1);
    if (step === TOTAL_STEPS) {
      btnNext.querySelector('span').textContent = 'Revisar Briefing';
    } else {
      btnNext.querySelector('span').textContent = 'Continuar';
    }
    updateProgress(step);
    window.scrollTo({ top: formSection.offsetTop - 80, behavior: 'smooth' });
  }

  /* ── NEXT ─────────────────────────────────────── */
  btnNext.addEventListener('click', () => {
    if (!validateStep(currentStep)) return;
    collectStep(currentStep);

    if (currentStep === TOTAL_STEPS) {
      buildReview();
      formSection.classList.add('hidden');
      reviewSection.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    currentStep++;
    showStep(currentStep);
  });

  /* ── BACK ─────────────────────────────────────── */
  btnBack.addEventListener('click', () => {
    if (currentStep > 1) {
      currentStep--;
      showStep(currentStep);
    }
  });

  /* ── REVIEW BACK ──────────────────────────────── */
  btnReviewBack.addEventListener('click', () => {
    reviewSection.classList.add('hidden');
    formSection.classList.remove('hidden');
    currentStep = TOTAL_STEPS;
    showStep(currentStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── BUILD REVIEW ─────────────────────────────── */
  const REVIEW_MAP = [
    {
      section: 'Informações Básicas',
      fields: [
        { key: 'nome', label: 'Nome' },
        { key: 'empresa', label: 'Empresa' },
        { key: 'segmento', label: 'Segmento' },
        { key: 'email', label: 'E-mail' },
        { key: 'whatsapp', label: 'WhatsApp' },
        { key: 'instagram', label: 'Instagram' },
        { key: 'site', label: 'Site atual' },
        { key: 'origem', label: 'Como conheceu', full: true },
      ]
    },
    {
      section: 'Sobre o Negócio',
      fields: [
        { key: 'tempo', label: 'Tempo de mercado' },
        { key: 'faixa_etaria', label: 'Faixa etária do público' },
        { key: 'descricao', label: 'Descrição da empresa', full: true },
        { key: 'cliente_ideal', label: 'Cliente ideal', full: true },
        { key: 'diferencial', label: 'Diferencial', full: true },
        { key: 'percepcao', label: 'Percepção atual' },
        { key: 'comportamento', label: 'Comportamento do público' },
        { key: 'dores_publico', label: 'Dores e objeções', full: true },
      ]
    },
    {
      section: 'Sobre o Projeto',
      fields: [
        { key: 'servico', label: 'Serviços desejados', full: true },
        { key: 'paginas', label: 'Páginas do site', full: true },
        { key: 'funcionalidades', label: 'Funcionalidades', full: true },
        { key: 'problemas', label: 'Problemas identificados', full: true },
        { key: 'oportunidades', label: 'Oportunidades perdidas', full: true },
      ]
    },
    {
      section: 'Objetivos',
      fields: [
        { key: 'objetivo', label: 'Objetivo principal', full: true },
        { key: 'metas', label: 'Metas', full: true },
        { key: 'expectativas', label: 'Expectativas', full: true },
        { key: 'meta_financeira', label: 'Meta financeira' },
        { key: 'crescimento', label: 'Crescimento esperado', full: true },
      ]
    },
    {
      section: 'Identidade e Posicionamento',
      fields: [
        { key: 'percepcao_desejada', label: 'Percepção desejada', full: true },
        { key: 'autoridade', label: 'Autoridade da marca' },
        { key: 'visao', label: 'Visão de futuro' },
        { key: 'estilo_visual', label: 'Estilo visual', full: true },
        { key: 'cores', label: 'Paleta de cores' },
        { key: 'estilo_evitar', label: 'Estilo a evitar' },
        { key: 'concorrentes', label: 'Concorrentes', full: true },
        { key: 'inspiracoes', label: 'Inspirações', full: true },
        { key: 'marcas_admira', label: 'Marcas admiradas' },
      ]
    },
    {
      section: 'Investimento e Prazo',
      fields: [
        { key: 'urgencia', label: 'Urgência' },
        { key: 'prazo', label: 'Prazo' },
        { key: 'orcamento', label: 'Investimento' },
        { key: 'data_importante', label: 'Data importante' },
        { key: 'dificuldades', label: 'Dificuldades digitais', full: true },
        { key: 'melhorar', label: 'O que mais quer melhorar', full: true },
      ]
    },
    {
      section: 'Observações',
      fields: [
        { key: 'observacoes', label: 'Informações adicionais', full: true },
      ]
    }
  ];

  function buildReview() {
    reviewGrid.innerHTML = '';
    REVIEW_MAP.forEach(section => {
      const titleEl = document.createElement('div');
      titleEl.className = 'review-section-title';
      titleEl.textContent = section.section;
      reviewGrid.appendChild(titleEl);

      section.fields.forEach(f => {
        const val = formData[f.key];
        if (!val) return;
        const block = document.createElement('div');
        block.className = 'review-block' + (f.full ? ' full' : '');
        block.innerHTML = `<div class="review-block-label">${f.label}</div><div class="review-block-value">${escapeHtml(val)}</div>`;
        reviewGrid.appendChild(block);
      });
    });
  }

  /* ── SUBMIT ───────────────────────────────────── */
  btnSubmit.addEventListener('click', () => {
    collectStep(TOTAL_STEPS);
    reviewSection.classList.add('hidden');
    successSection.classList.remove('hidden');
    buildAnalysis();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    sendBriefingToAPI();
  });

  /* ── API SEND ──────────────────────────────────– */
  function sendBriefingToAPI() {
    const API_ENDPOINT = '/api/create-briefing';
    fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => {
        if (!data.success) {
          console.error('Erro ao enviar briefing:', data.error);
        }
      })
      .catch(err => {
        console.error('Erro na requisição:', err);
      });
  }

  /* ── ANALYSIS ─────────────────────────────────── */
  function buildAnalysis() {
    const insights = [];

    const servico = formData['servico'] || '';
    const objetivo = (formData['objetivo'] || '').toLowerCase();
    const dificuldades = (formData['dificuldades'] || '').toLowerCase();
    const orcamento = formData['orcamento'] || '';
    const urgencia = formData['urgencia'] || '';
    const paginas = formData['paginas'] || '';
    const funcionalidades = formData['funcionalidades'] || '';
    const descricao = (formData['descricao'] || '').toLowerCase();
    const percepcao = (formData['percepcao_desejada'] || '').toLowerCase();
    const prazo = formData['prazo'] || '';

    // Base positives
    insights.push({ text: 'Projeto com potencial claro de crescimento digital identificado.', icon: '✦' });

    if (servico.includes('Landing Page') || servico.includes('Site')) {
      insights.push({ text: 'Oportunidades de aumento de conversão com estrutura de página otimizada.', icon: '✦' });
    }
    if (funcionalidades.toLowerCase().includes('integração crm') || funcionalidades.toLowerCase().includes('automação')) {
      insights.push({ text: 'Possibilidade de automação de processos e qualificação automática de leads.', icon: '✦' });
    }
    if (funcionalidades.toLowerCase().includes('seo') || objetivo.includes('visibilidade') || objetivo.includes('google')) {
      insights.push({ text: 'Estratégia de SEO técnico pode ampliar alcance orgânico significativamente.', icon: '✦' });
    }
    if (percepcao.includes('premium') || percepcao.includes('elegante') || percepcao.includes('autoridade')) {
      insights.push({ text: 'Posicionamento premium identificado — alto potencial de diferenciação no mercado.', icon: '✦' });
    }
    if (dificuldades.includes('lead') || dificuldades.includes('contato') || dificuldades.includes('cliente')) {
      insights.push({ text: 'Estratégia de geração de leads pode ser implementada com estrutura de captura otimizada.', icon: '✦' });
    }
    if (orcamento.includes('3.000') || orcamento.includes('5.000') || orcamento.includes('Acima')) {
      insights.push({ text: 'Budget compatível com solução de alta performance e identidade visual profissional.', icon: '✦' });
    }
    if (urgencia.includes('Urgente') || prazo.includes('15 dias')) {
      insights.push({ text: 'Projeto prioritário — alocação imediata possível conforme agenda de produção.', icon: '✦' });
    }
    if (paginas.split(',').length >= 4) {
      insights.push({ text: 'Estrutura de site completa identificada — arquitetura de informação sólida.', icon: '✦' });
    }

    // Fallback
    if (insights.length < 4) {
      insights.push({ text: 'Diagnóstico completo será entregue junto ao primeiro contato da equipe PageForge.', icon: '✦' });
    }

    // Render (max 5)
    analysisList.innerHTML = '';
    insights.slice(0, 5).forEach(item => {
      const li = document.createElement('li');
      li.className = 'analysis-item';
      li.innerHTML = `
        <span class="analysis-check">${item.icon}</span>
        <span>${escapeHtml(item.text)}</span>
      `;
      analysisList.appendChild(li);
    });
  }

  /* ── ESCAPE HTML ──────────────────────────────── */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ── PHONE MASK ───────────────────────────────── */
  const whatsappField = document.getElementById('f_whatsapp');
  if (whatsappField) {
    whatsappField.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 11) v = v.slice(0, 11);
      if (v.length > 7) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
      else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
      else if (v.length > 0) v = `(${v}`;
      e.target.value = v;
    });
  }

  /* ── LIVE REMOVE ERROR ────────────────────────── */
  document.addEventListener('input', (e) => {
    if (e.target.classList.contains('field-input')) {
      e.target.classList.remove('error');
      const err = e.target.parentElement.querySelector('.field-error');
      if (err) err.remove();
    }
  });

  /* ── INIT ─────────────────────────────────────── */
  showStep(1);
  updateProgress(1);

})();
