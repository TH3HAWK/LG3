# J3G Logística - MVP

Bem-vindo ao repositório do **MVP da J3G Logística**, uma solução inteligente focada em resolver desafios reais de expedição urbana para frotas próprias, com foco especial no varejo de materiais de construção e cargas pesadas.

## 🚀 Sobre o Projeto

A **J3G Logística** nasceu da necessidade de modernizar e otimizar as entregas diárias que dependem de planilhas, WhatsApp e rotinas manuais. Ao contrário de aplicativos genéricos, este sistema fornece **apoio à decisão logística**.

O grande diferencial do sistema é considerar **restrições reais de peso e volume**, priorização de entregas e reprogramação dinâmica, utilizando a base de inteligência logística (teoria dos grafos, otimização combinatória).

### Principais Funcionalidades do MVP
- **Dashboard de Visão Geral**: Métricas operacionais em tempo real (pedidos, veículos ativos, ocupação média).
- **Expedição & Alocação Inteligente**: Interface Drag-and-Drop (arrastar e soltar) para agrupar pedidos pendentes em caminhões específicos, com bloqueio automático caso a capacidade de peso ou volume seja excedida.
- **Rastreamento de Rotas**: Acompanhamento do progresso de cada veículo, com visibilidade clara de paradas concluídas e pendentes.
- **Conclusão & Notificação**: Simulação de finalização de entregas e envio automatizado de comprovante/Nota Fiscal em PDF via integração (mock) com WhatsApp.

## 🛠️ Tecnologias Utilizadas

Para garantir uma arquitetura limpa, rápida e de fácil manutenção, este MVP foi desenvolvido com as seguintes tecnologias base (sem dependências pesadas):

- **HTML5**: Estrutura semântica e acessível, configurada como Single Page Application (SPA).
- **CSS3 (Vanilla)**: Design Premium utilizando variáveis CSS, Flexbox, Grid Layout, animações dinâmicas e **Glassmorphism** (efeito de vidro) para uma UI moderna e vibrante.
- **JavaScript (Vanilla)**: Lógica de controle do front-end, manipulação de DOM (Drag and Drop), simulação de mock de dados (pedidos e veículos) e transições entre telas.
- **Font Awesome**: Conjunto de ícones vetoriais.
- **Google Fonts (Inter)**: Tipografia profissional.

## 📂 Arquitetura e Versionamento do Código

O projeto foi organizado separando estritamente suas camadas de responsabilidade para facilitar a evolução futura para frameworks como React ou Node.js (backend).

```text
/L3G
│
├── index.html       # Entry-point da aplicação (Views e Layout Base)
│
├── css/
│   └── styles.css   # Regras de estilo globais e componentes visuais
│
├── js/
│   └── app.js       # Regras de negócio do MVP, Mock de Dados e Eventos da Interface
│
└── README.md        # Documentação oficial do sistema
```

## ⚙️ Como Executar

Por ser um projeto puramente Front-end (Vanilla), a execução é extremamente simples:

1. Baixe os arquivos do repositório.
2. Navegue até a pasta `L3G`.
3. Dê um duplo clique no arquivo `index.html` para abri-lo diretamente em qualquer navegador moderno (Chrome, Edge, Firefox, Safari).
   - *Opcional:* Você também pode rodar através de uma extensão como o "Live Server" no VS Code para auto-reload.

## 👥 Equipe
- **Johnny**: Coordenador do Projeto e Especialista Operacional
- **Guilherme**: Full-Stack Developer (Responsável pelo MVP)
- **Glasielly**: Especialista em Modelagem e Otimização (Teoria dos Grafos)
- **Apoio**: TecnoIF e Hub PIME UFMS

---

*Transformando a expedição urbana local de um processo manual em uma decisão logística inteligente, rastreável e eficiente.*
