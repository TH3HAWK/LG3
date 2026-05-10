// Funções Globais do App Web Responsivo
document.addEventListener('DOMContentLoaded', () => {

    // Iniciar Dark Mode baseado no localStorage
    initDarkMode();

    // FAQ (Accordion)
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            const answer = btn.nextElementSibling;
            if (btn.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });

    // WhatsApp Flutuante - Mensagem Dinâmica
    const waBtn = document.getElementById('wa-floating-btn');
    if (waBtn) {
        waBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openDynamicWhatsApp();
        });
    }

    // Modal Overlays - Fechar clicando fora
    const overlays = document.querySelectorAll('.modal-overlay');
    overlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay.id);
            }
        });
    });

    // Iniciar Mapa se estiver na página
    if (document.querySelector('.mock-map')) {
        // Garantir que comece no meio do percurso (parada 3) se for a primeira vez
        if (!localStorage.getItem('j3g_current_stop')) {
            localStorage.setItem('j3g_current_stop', '3');
        }
        renderMapGraph();
    }

    // Iniciar Calendário se o botão existir
    const calIcon = document.querySelector('.fa-calendar-days');
    const innerHeader = document.querySelector('.inner-header');
    
    if (calIcon && innerHeader) {
        innerHeader.addEventListener('click', (e) => {
            e.preventDefault();
            toggleSuspendedCalendar(e, calIcon);
        });
    }
});

/* =========================================
   STATUS E DETALHES DA ENTREGA
========================================= */
function updateDeliveryStatus(status) {
    const statusBox = document.querySelector('.select-box');
    if (statusBox) {
        statusBox.innerHTML = `${status} <i class="fa-solid fa-chevron-down"></i>`;
        mockAction(`Status atualizado para: ${status}`);
    }
}

function concluirEntrega() {
    updateDeliveryStatus('Entregue');

    // Pegar parada atual
    let currentStop = parseInt(localStorage.getItem('j3g_current_stop') || '1');
    if (currentStop < 5) {
        localStorage.setItem('j3g_old_stop', currentStop);
        localStorage.setItem('j3g_current_stop', currentStop + 1);
        localStorage.setItem('j3g_animate_move', 'true');
    }

    mockAction('Sucesso! Entrega finalizada e caminhão avançando.');
}


function viewPDF(name) {
    mockAction(`Abrindo visualizador de PDF: ${name}...`);
    // Simulação de visualizador
    const pdfModal = `
        <div id="pdfModal" class="modal-overlay active dynamic-modal">
            <div class="modal-content" style="max-width: 800px; height: 90vh; display: flex; flex-direction: column;">
                <button class="modal-close" onclick="closeModal('pdfModal')"><i class="fa-solid fa-xmark"></i></button>
                <h3>Visualizador de PDF - ${name}</h3>
                <div style="flex: 1; background: #525659; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; flex-direction: column; gap: 16px;">
                    <i class="fa-solid fa-file-pdf" style="font-size: 64px; color: #ff4d4d;"></i>
                    <p>Simulação do Documento NF-e</p>
                    <div style="width: 80%; height: 20px; background: rgba(255,255,255,0.1); border-radius: 10px;"></div>
                    <div style="width: 60%; height: 20px; background: rgba(255,255,255,0.1); border-radius: 10px;"></div>
                    <div style="width: 70%; height: 20px; background: rgba(255,255,255,0.1); border-radius: 10px;"></div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', pdfModal);
}

/* =========================================
   CALENDÁRIO SUSPENSO
========================================= */
function toggleSuspendedCalendar(e, targetIcon) {
    let calendar = document.getElementById('suspended-calendar');

    const referenceEl = targetIcon || e.currentTarget;
    const rect = referenceEl.getBoundingClientRect();

    if (!calendar) {
        calendar = document.createElement('div');
        calendar.id = 'suspended-calendar';
        calendar.className = 'calendar-suspended';

        // Renderizar conteúdo do calendário
        const date = new Date();
        const month = date.toLocaleString('pt-BR', { month: 'long' });
        const year = date.getFullYear();

        const deliveries = [5, 12, 15, 20, 22, 28]; // Dias com entrega

        let daysHtml = '';
        // Preencher dias vazios do início do mês (exemplo simplificado)
        for (let i = 0; i < 4; i++) daysHtml += '<div class="calendar-day empty"></div>';

        for (let i = 1; i <= 31; i++) {
            const isDelivery = deliveries.includes(i);
            daysHtml += `<div class="calendar-day ${isDelivery ? 'has-delivery' : ''}">${i}</div>`;
        }

        calendar.innerHTML = `
            <div class="calendar-header">
                <span>${month.charAt(0).toUpperCase() + month.slice(1)} ${year}</span>
                <i class="fa-solid fa-chevron-right"></i>
            </div>
            <div class="calendar-grid">
                <div class="calendar-day-label">D</div>
                <div class="calendar-day-label">S</div>
                <div class="calendar-day-label">T</div>
                <div class="calendar-day-label">Q</div>
                <div class="calendar-day-label">Q</div>
                <div class="calendar-day-label">S</div>
                <div class="calendar-day-label">S</div>
                ${daysHtml}
            </div>
        `;

        // Posicionar e anexar
        calendar.style.top = (rect.bottom + 10) + 'px';
        calendar.style.left = (rect.left - 240) + 'px';

        document.body.appendChild(calendar);
    } else {
        // Reposicionar caso a janela tenha mudado ou scroll
        calendar.style.top = (rect.bottom + 10) + 'px';
        calendar.style.left = (rect.left - 240) + 'px';
    }

    calendar.classList.toggle('active');

    // Fechar ao clicar fora
    const closeCal = (ev) => {
        if (!calendar.contains(ev.target) && !e.currentTarget.contains(ev.target)) {
            calendar.classList.remove('active');
            document.removeEventListener('click', closeCal);
        }
    };

    if (calendar.classList.contains('active')) {
        setTimeout(() => document.addEventListener('click', closeCal), 10);
    }
}

/* =========================================
   MAPA GRAPH (LINHAS E PONTOS)
========================================= */
function renderMapGraph() {
    const map = document.querySelector('.mock-map');
    if (!map) return;

    // Remover conteúdo estático antigo
    map.innerHTML = '';

    const points = [
        { id: 1, x: 20, y: 70, name: "Metalúrgica Alfa" },
        { id: 2, x: 45, y: 55, name: "Construtora Brasil" },
        { id: 3, x: 35, y: 35, name: "Indústria Sul" },
        { id: 4, x: 75, y: 25, name: "Comercial Verdes" },
        { id: 5, x: 60, y: 80, name: "Delta" }
    ];

    const currentStop = parseInt(localStorage.getItem('j3g_current_stop') || '3');
    const oldStop = parseInt(localStorage.getItem('j3g_old_stop') || '1');
    const shouldAnimate = localStorage.getItem('j3g_animate_move') === 'true';

    // Atualizar labels do Top Card dinamicamente
    const nextStopLabel = document.getElementById('map-next-stop');
    const progressText = document.getElementById('map-progress-text');
    const progressBar = document.getElementById('map-progress-bar');
    
    if (nextStopLabel) {
        const nextPoint = points[currentStop - 1] || points[points.length - 1];
        nextStopLabel.innerText = nextPoint.name;
    }
    if (progressText) {
        progressText.innerText = `${currentStop} de 12 paradas`;
    }
    if (progressBar) {
        progressBar.style.width = ((currentStop / 12) * 100) + '%';
    }

    // Criar SVG para as linhas
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "graph-svg");
    map.appendChild(svg);

    // Desenhar linhas
    for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        const isCompleted = (i + 2) <= currentStop;

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", p1.x + "%");
        line.setAttribute("y1", p1.y + "%");
        line.setAttribute("x2", p2.x + "%");
        line.setAttribute("y2", p2.y + "%");
        line.setAttribute("class", `graph-line ${isCompleted ? 'completed' : ''}`);
        // Se não completou, garantir que a cor seja preta via style se necessário (ou via CSS)
        svg.appendChild(line);
    }

    // Desenhar pontos
    points.forEach(p => {
        const isCompleted = p.id < currentStop;
        const dot = document.createElement('div');
        dot.className = `map-dot ${isCompleted ? 'completed' : ''}`;
        if (!isCompleted) {
            dot.style.background = '#000000';
            dot.style.color = '#ffffff';
        }
        dot.style.left = p.x + '%';
        dot.style.top = p.y + '%';
        dot.innerHTML = `${p.id} <span class="dot-label">${p.name}</span>`;
        map.appendChild(dot);
    });

    // Truck Marker
    const startPoint = points[shouldAnimate ? oldStop - 1 : currentStop - 1];
    const endPoint = points[currentStop - 1];

    const truck = document.createElement('div');
    truck.className = 'current-location-marker';
    truck.style.left = startPoint.x + '%';
    truck.style.top = startPoint.y + '%';
    truck.style.transition = 'all 2s cubic-bezier(0.4, 0, 0.2, 1)';
    truck.innerHTML = '<i class="fa-solid fa-truck"></i>';
    map.appendChild(truck);

    if (shouldAnimate) {
        setTimeout(() => {
            truck.style.left = endPoint.x + '%';
            truck.style.top = endPoint.y + '%';
            localStorage.setItem('j3g_animate_move', 'false');
        }, 500);
    }
}



/* =========================================
   DARK MODE
========================================= */
function initDarkMode() {
    const savedTheme = localStorage.getItem('j3g_theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
    }
}

function toggleDarkMode() {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    if (isDark) {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('j3g_theme', 'light');
        mockAction("Modo Claro ativado!");
    } else {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('j3g_theme', 'dark');
        mockAction("Modo Escuro ativado!");
    }
}

/* =========================================
   WHATSAPP DINÂMICO E EXTERNAL LINKS
========================================= */
function openDynamicWhatsApp() {
    const hour = new Date().getHours();
    let greeting = "Olá";

    if (hour >= 5 && hour < 12) greeting = "Bom dia";
    else if (hour >= 12 && hour < 18) greeting = "Boa tarde";
    else greeting = "Boa noite";

    const text = encodeURIComponent(`${greeting}, J3G Logística! Vim pelo site e gostaria de saber mais sobre os planos.`);
    // Abre WhatsApp
    window.open(`https://wa.me/556792255911?text=${text}`, '_blank');
}

function openClientWhatsApp() {
    // Simula abrir o whatsapp do cliente (da tela de detalhes)
    window.open(`https://wa.me/556792255911text=Ol%C3%A1%20Jo%C3%A3o%20Silva,%20o%20motorista%20da%20J3G%20est%C3%A1%20a%20caminho!`, '_blank');
}

/* =========================================
   MODAIS E INTERAÇÕES
========================================= */
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('active');
    } else {
        // Fallback: se o modal não existir no HTML, cria um dinamicamente!
        createDynamicModal(id);
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('active');
        // Se for dinâmico, pode remover após a animação
        if (modal.classList.contains('dynamic-modal')) {
            setTimeout(() => modal.remove(), 300);
        }
    }
}

function createDynamicModal(type) {
    let title = "Opções";
    let content = "<p>Selecione uma opção.</p>";

    if (type === 'modalNotificacoes') {
        title = "Notificações";
        content = `<ul class="modal-list">
            <li><strong>Nova Rota!</strong> (Meta. Alfa) - há 5 min</li>
            <li><strong>Alerta:</strong> Ocorrência aprovada. - há 1h</li>
        </ul>`;
    } else if (type === 'modalFiltros') {
        title = "Filtros do Mapa";
        content = `<ul class="modal-list">
            <li><i class="fa-solid fa-check text-green"></i> Ocultar entregas finalizadas</li>
            <li><i class="fa-solid fa-check text-green"></i> Mostrar trânsito pesado</li>
        </ul>`;
    } else if (type === 'modalCalendario') {
        title = "Calendário de Rotas";
        content = `<p>Você está visualizando as rotas de hoje (20/05).</p>
        <button class="lp-btn-outline" style="width:100%" onclick="closeModal('dynamicModal')">Ver amanhã</button>`;
    } else if (type === 'modalStatus') {
        title = "Alterar Status";
        content = `<ul class="modal-list">
            <li onclick="updateDeliveryStatus('Em Rota'); closeModal('dynamicModal')">Em Rota</li>
            <li onclick="updateDeliveryStatus('Entregue'); closeModal('dynamicModal')">Entregue</li>
            <li onclick="updateDeliveryStatus('Problema'); closeModal('dynamicModal')">Problema</li>
        </ul>`;
    } else if (type === 'modalOpcoesDetalhes') {
        title = "Opções Extras";
        content = `<ul class="modal-list">
            <li onclick="mockAction('Imprimindo comprovante...'); closeModal('dynamicModal')"><i class="fa-solid fa-print"></i> Imprimir</li>
            <li onclick="mockAction('Enviando link rastreio por SMS...'); closeModal('dynamicModal')"><i class="fa-solid fa-comment-sms"></i> Enviar SMS</li>
        </ul>`;
    }

    const html = `
        <div id="dynamicModal" class="modal-overlay active dynamic-modal">
            <div class="modal-content">
                <button class="modal-close" onclick="closeModal('dynamicModal')"><i class="fa-solid fa-xmark"></i></button>
                <h3>${title}</h3>
                ${content}
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
}

/* =========================================
   INPUT DE CÂMERA/ARQUIVO
========================================= */
function triggerCamera() {
    // Procura se tem o input escondido
    let input = document.getElementById('hiddenCameraInput');
    if (!input) {
        input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.id = 'hiddenCameraInput';
        input.className = 'hidden-file-input';

        // Quando o usuário selecionar arquivo
        input.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                mockAction(`Foto "${e.target.files[0].name}" anexada com sucesso!`);
            }
        });
        document.body.appendChild(input);
    }
    input.click();
}

/* =========================================
   SISTEMA DE TOASTS
========================================= */
window.mockAction = function (message) {
    let container = document.getElementById('toast-container');

    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${message}`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.style.transition = 'all 0.3s ease';

        setTimeout(() => {
            if (toast.parentNode === container) {
                container.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

