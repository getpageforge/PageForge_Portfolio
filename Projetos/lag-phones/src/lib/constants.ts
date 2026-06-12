export const WHATSAPP_NUMBER = '5579999999999' // Substituir pelo número real
export const WHATSAPP_BASE = `https://wa.me/${WHATSAPP_NUMBER}`

export const WHATSAPP_MESSAGES = {
  consultant: `${WHATSAPP_BASE}?text=Ol%C3%A1!%20Gostaria%20de%20falar%20com%20um%20consultor%20de%20smartphone.`,
  assistance: `${WHATSAPP_BASE}?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20um%20orçamento%20de%20assistência%20técnica.`,
  upgrade: `${WHATSAPP_BASE}?text=Ol%C3%A1!%20Tenho%20interesse%20em%20fazer%20um%20upgrade%20do%20meu%20aparelho.`,
  catalog: `${WHATSAPP_BASE}?text=Ol%C3%A1!%20Gostaria%20de%20ver%20o%20catálogo%20de%20produtos.`,
}

export const INSTAGRAM_URL = 'https://instagram.com/lagphones'

export const CATALOG_CATEGORIES = [
  {
    id: 'iphones',
    name: 'iPhones',
    description: 'Linha completa Apple',
    image: '/images/catalog/iphone-placeholder.jpg',
    count: 'Ver modelos',
  },
  {
    id: 'apple-watch',
    name: 'Apple Watch',
    description: 'Saúde e estilo no pulso',
    image: '/images/catalog/apple-watch-placeholder.jpg',
    count: 'Ver modelos',
  },
  {
    id: 'macbook',
    name: 'MacBook',
    description: 'Performance para criar',
    image: '/images/catalog/macbook-placeholder.jpg',
    count: 'Ver modelos',
  },
  {
    id: 'airpods',
    name: 'AirPods',
    description: 'Som sem fronteiras',
    image: '/images/catalog/airpods-placeholder.jpg',
    count: 'Ver modelos',
  },
  {
    id: 'xiaomi',
    name: 'Xiaomi',
    description: 'Tecnologia acessível',
    image: '/images/catalog/xiaomi-placeholder.jpg',
    count: 'Ver modelos',
  },
  {
    id: 'jbl',
    name: 'JBL',
    description: 'Áudio de alta qualidade',
    image: '/images/catalog/jbl-placeholder.jpg',
    count: 'Ver modelos',
  },
  {
    id: 'seminovos',
    name: 'Seminovos Premium',
    description: 'Qualidade com economia',
    image: '/images/catalog/seminovos-placeholder.jpg',
    count: 'Ver modelos',
  },
  {
    id: 'acessorios',
    name: 'Acessórios',
    description: 'Complementos originais',
    image: '/images/catalog/acessorios-placeholder.jpg',
    count: 'Ver modelos',
  },
]

export const REPAIR_SERVICES = [
  {
    id: 'screen',
    name: 'Troca de Tela',
    description: 'Restauramos a clareza do seu display com peças originais e garantia.',
    icon: 'monitor',
  },
  {
    id: 'battery',
    name: 'Troca de Bateria',
    description: 'Autonomia de volta ao normal com baterias certificadas.',
    icon: 'battery',
  },
  {
    id: 'faceid',
    name: 'Face ID',
    description: 'Recuperação e calibração do sistema de reconhecimento facial Apple.',
    icon: 'scan-face',
  },
  {
    id: 'board',
    name: 'Reparo em Placa',
    description: 'Microssoldagem e diagnóstico avançado de placa-mãe.',
    icon: 'cpu',
  },
  {
    id: 'watch',
    name: 'Apple Watch',
    description: 'Tela, bateria e manutenção completa para Apple Watch.',
    icon: 'watch',
  },
  {
    id: 'diagnostic',
    name: 'Diagnóstico Avançado',
    description: 'Análise completa do dispositivo com relatório detalhado.',
    icon: 'search',
  },
]

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Ana Carolina M.',
    handle: '@anacarolina',
    rating: 5,
    text: 'Comprei meu iPhone 15 Pro Max pela LAG PHONES e foi a melhor experiência. Atendimento impecável, produto original e entrega rápida. Recomendo demais!',
    avatar: '/images/testimonials/avatar-1-placeholder.jpg',
    verified: true,
  },
  {
    id: 2,
    name: 'Lucas Rodrigues',
    handle: '@lucasrod',
    rating: 5,
    text: 'Levei meu iPhone com a tela quebrada e em menos de 2 horas estava como novo. Peça original, garantia de 90 dias. Equipe muito competente.',
    avatar: '/images/testimonials/avatar-2-placeholder.jpg',
    verified: true,
  },
  {
    id: 3,
    name: 'Mariana Costa',
    handle: '@maricosta',
    rating: 5,
    text: 'Me ajudaram a escolher o aparelho certo para o meu perfil e orçamento. Sem pressão, sem enrolação. Atendimento que parece de grande empresa.',
    avatar: '/images/testimonials/avatar-3-placeholder.jpg',
    verified: true,
  },
  {
    id: 4,
    name: 'Felipe Santos',
    handle: '@felipesantos',
    rating: 5,
    text: 'Fiz upgrade do meu iPhone 13 para o 15 e eles aceitaram meu aparelho como parte do pagamento. Processo simples e transparente.',
    avatar: '/images/testimonials/avatar-4-placeholder.jpg',
    verified: true,
  },
  {
    id: 5,
    name: 'Juliana Alves',
    handle: '@juliana_a',
    rating: 5,
    text: 'Assistência técnica de primeira. Minha placa estava com problema e eles resolveram quando outros disseram que não tinha conserto.',
    avatar: '/images/testimonials/avatar-5-placeholder.jpg',
    verified: true,
  },
  {
    id: 6,
    name: 'Rafael Lima',
    handle: '@rafaellima',
    rating: 5,
    text: 'Comprei meu AirPods Pro e meu JBL no mesmo dia. Atendimento rápido pelo WhatsApp, produto chegou lacrado e original. Nota 10.',
    avatar: '/images/testimonials/avatar-6-placeholder.jpg',
    verified: true,
  },
]

export const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Contato',
    description: 'Fale com nossa equipe pelo WhatsApp e descreva o que precisa.',
  },
  {
    number: '02',
    title: 'Diagnóstico',
    description: 'Avaliamos seu aparelho e identificamos o problema com precisão.',
  },
  {
    number: '03',
    title: 'Orçamento',
    description: 'Você recebe um orçamento claro e transparente, sem surpresas.',
  },
  {
    number: '04',
    title: 'Execução',
    description: 'Nossos especialistas realizam o serviço com peças originais.',
  },
  {
    number: '05',
    title: 'Entrega',
    description: 'Aparelho devolvido com garantia e relatório do serviço realizado.',
  },
]

export const DIFFERENTIALS = [
  {
    title: 'Produtos Originais',
    description: 'Todos os aparelhos e peças com procedência comprovada e nota fiscal.',
    icon: 'shield-check',
    size: 'normal',
  },
  {
    title: 'Garantia',
    description: 'Garantia em todos os produtos e serviços realizados.',
    icon: 'badge-check',
    size: 'normal',
  },
  {
    title: 'Atendimento Especializado',
    description: 'Equipe treinada para orientar a melhor escolha para seu perfil.',
    icon: 'headset',
    size: 'large',
  },
  {
    title: 'Assistência Própria',
    description: 'Laboratório próprio com equipamentos de última geração.',
    icon: 'wrench',
    size: 'normal',
  },
  {
    title: 'Entrega Segura',
    description: 'Entregamos com segurança para todo o Brasil.',
    icon: 'package-check',
    size: 'normal',
  },
  {
    title: 'Parcelamento Facilitado',
    description: 'Diversas opções de pagamento e parcelamento no cartão.',
    icon: 'credit-card',
    size: 'normal',
  },
]
