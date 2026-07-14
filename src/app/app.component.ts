import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

type ChatMessage = {
  author: 'bot' | 'user';
  text: string;
};

type Currency = 'PEN' | 'USD';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  @ViewChild('chatMessages') private chatMessages?: ElementRef<HTMLDivElement>;

  readonly whatsappNumber = '51955795876';
  readonly githubUrl = 'https://github.com/jehuavalocancino77739';
  readonly portfolioUrl = 'https://jehuavalocancino77739.github.io/jehudev-portafolio/';
  readonly repositoryUrl = 'https://github.com/jehuavalocancino77739/jehudev-portafolio';
  readonly whatsappMessage = 'Hola, vi tu portafolio y quisiera conversar sobre un proyecto web.';

  usdPenRate = 3.4;
  selectedCurrency: Currency = 'PEN';
  exchangeRateStatus = 'TC referencial';
  projectType = 'landing';
  pages = 4;
  connectedFeatures = 2;
  urgency = 'normal';
  chatOpen = false;
  chatInput = '';
  menuOpen = false;
  activeSection = 'inicio';
  contactSubmitted = false;
  contactStatus: 'idle' | 'success' | 'error' = 'idle';

  contactForm = {
    name: '',
    projectType: '',
    message: ''
  };

  navItems = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'servicios', label: 'Servicios' },
    { id: 'paquetes', label: 'Paquetes' },
    { id: 'sobre-mi', label: 'Sobre mí' },
    { id: 'proceso', label: 'Proceso' },
    { id: 'contacto', label: 'Contacto' }
  ];

  benefits = [
    'Diseño profesional',
    'Adaptado a celulares',
    'Carga rápida',
    'Conexión con WhatsApp',
    'Formularios claros',
    'Soporte inicial'
  ];

  services = [
    {
      icon: 'WB',
      title: 'Páginas web empresariales',
      text: 'Sitios modernos para presentar tu negocio, servicios y canales de contacto con claridad.'
    },
    {
      icon: 'LP',
      title: 'Landing pages',
      text: 'Páginas enfocadas en captar prospectos, explicar una oferta y llevar al visitante a contactarte.'
    },
    {
      icon: 'SW',
      title: 'Sistemas web personalizados',
      text: 'Herramientas internas para ordenar procesos, usuarios, datos y tareas repetitivas.'
    },
    {
      icon: 'TV',
      title: 'Tiendas virtuales',
      text: 'Catálogos y experiencias de venta preparadas para mostrar productos y recibir consultas.'
    },
    {
      icon: 'IA',
      title: 'Chatbots e inteligencia artificial',
      text: 'Asistentes demo o conectados a IA para responder consultas y guiar mejor a tus clientes.'
    },
    {
      icon: 'WA',
      title: 'Integración con WhatsApp',
      text: 'Botones, mensajes precargados y flujos para que el contacto sea directo y sencillo.'
    },
    {
      icon: 'MT',
      title: 'Mantenimiento y mejoras',
      text: 'Ajustes visuales, nuevas secciones, correcciones y mejoras continuas para tu web.'
    },
    {
      icon: 'SEO',
      title: 'Velocidad y SEO básico',
      text: 'Optimización inicial para que la página cargue mejor y comunique correctamente en buscadores.'
    }
  ];

  packages = [
    {
      title: 'Presencia digital',
      type: 'Para empezar',
      description: 'Ideal para negocios que necesitan verse profesionales y recibir consultas por WhatsApp.',
      includes: ['1 a 3 secciones', 'Diseño responsive', 'Botón de WhatsApp', 'Formulario de contacto'],
      bestFor: 'Emprendedores, servicios locales y marcas personales'
    },
    {
      title: 'Web comercial',
      type: 'Más vendido',
      description: 'Una página más completa para explicar servicios, generar confianza y guiar al cliente.',
      includes: ['Hasta 6 secciones', 'Cotizador simple', 'SEO básico', 'Animaciones suaves'],
      bestFor: 'Negocios que quieren captar prospectos'
    },
    {
      title: 'Sistema inicial',
      type: 'A medida',
      description: 'Para cuando la web necesita guardar datos, ordenar procesos o conectar funcionalidades.',
      includes: ['Panel administrativo', 'Base de datos', 'API con Spring', 'Usuarios o formularios'],
      bestFor: 'Procesos internos, reservas, catálogos o reportes'
    }
  ];

  processSteps = [
    'Conversamos sobre tu negocio.',
    'Definimos objetivos y funciones.',
    'Diseño una propuesta.',
    'Desarrollo la página o sistema.',
    'Realizamos revisiones.',
    'Publicamos el proyecto.',
    'Brindo soporte inicial.'
  ];

  trustItems = [
    'Desarrollo desde cero',
    'Código organizado',
    'Diseño adaptable',
    'Comunicación durante el proyecto',
    'Entrega por etapas',
    'Soporte inicial'
  ];

  deliveryItems = [
    { title: 'Lista para compartir', items: ['Publicación web', 'Enlace de acceso', 'Vista correcta en celular'] },
    { title: 'Contacto sin fricción', items: ['WhatsApp visible', 'Formulario claro', 'Mensaje directo al negocio'] },
    { title: 'Base para crecer', items: ['Secciones editables', 'Mejoras futuras', 'Código ordenado'] },
    { title: 'Acompañamiento inicial', items: ['Revisión contigo', 'Ajustes básicos', 'Explicación de uso'] }
  ];

  messages: ChatMessage[] = [
    {
      author: 'bot',
      text: 'Hola. Soy el asistente demo de JehuDev. Puedo orientarte sobre precios, servicios, tiempos, entregables, proceso de trabajo o contacto.'
    }
  ];

  ngOnInit(): void {
    this.loadExchangeRate();
    this.updateActiveSection();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.updateActiveSection();
  }

  async loadExchangeRate(): Promise<void> {
    try {
      const response = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!response.ok) {
        throw new Error('Exchange API unavailable');
      }

      const data = await response.json();
      const penRate = Number(data?.rates?.PEN);
      if (!Number.isFinite(penRate) || penRate <= 0) {
        throw new Error('Invalid PEN rate');
      }

      this.usdPenRate = Number(penRate.toFixed(2));
      this.exchangeRateStatus = 'TC actualizado automáticamente';
    } catch {
      this.exchangeRateStatus = 'TC referencial de respaldo';
    }
  }

  get whatsappUrl(): string {
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(this.whatsappMessage)}`;
  }

  get estimatePen(): number {
    const baseByType: Record<string, number> = {
      landing: 450,
      ecommerce: 1500,
      dashboard: 1800,
      custom: 2500
    };
    const urgencyMultiplier = this.urgency === 'express' ? 1.25 : this.urgency === 'flexible' ? 0.92 : 1;
    const rawEstimate = (baseByType[this.projectType] + this.pages * 45 + this.connectedFeatures * 120) * urgencyMultiplier;
    return Math.round(rawEstimate / 10) * 10;
  }

  get estimateUsd(): number {
    return Math.round(this.estimatePen / this.usdPenRate);
  }

  get displayedEstimate(): number {
    return this.selectedCurrency === 'PEN' ? this.estimatePen : this.estimateUsd;
  }

  get secondaryEstimate(): number {
    return this.selectedCurrency === 'PEN' ? this.estimateUsd : this.estimatePen;
  }

  get primaryCurrencyLabel(): string {
    return this.selectedCurrency === 'PEN' ? 'S/' : 'USD';
  }

  get secondaryCurrencyLabel(): string {
    return this.selectedCurrency === 'PEN' ? 'USD' : 'S/';
  }

  get timeline(): string {
    const days = Math.ceil(6 + this.pages * 1.3 + this.connectedFeatures * 2 + (this.projectType === 'custom' ? 6 : 0));
    return this.urgency === 'express' ? `${Math.max(7, days - 5)} días` : `${days} días`;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  submitContact(): void {
    this.contactSubmitted = true;
    this.contactStatus = 'idle';
    if (!this.isContactFormValid()) {
      return;
    }

    try {
      const message = encodeURIComponent(
        `Hola JehuDev, soy ${this.contactForm.name.trim()}.\n` +
        `Quiero consultar por: ${this.contactForm.projectType}.\n\n` +
        `Detalle:\n${this.contactForm.message.trim()}`
      );
      window.open(`https://wa.me/${this.whatsappNumber}?text=${message}`, '_blank', 'noopener');
      this.contactStatus = 'success';
      this.contactSubmitted = false;
      this.contactForm = {
        name: '',
        projectType: '',
        message: ''
      };
    } catch {
      this.contactStatus = 'error';
    }
  }

  isContactFormValid(): boolean {
    return Boolean(
      this.contactForm.name.trim() &&
      this.contactForm.projectType &&
      this.contactForm.message.trim().length >= 15
    );
  }

  sendMessage(): void {
    const question = this.chatInput.trim();
    if (!question) {
      return;
    }

    this.messages = [...this.messages, { author: 'user', text: question }];
    this.chatInput = '';
    this.scrollChatToBottom();

    window.setTimeout(() => {
      this.messages = [...this.messages, { author: 'bot', text: this.buildAssistantAnswer(question) }];
      this.scrollChatToBottom();
    }, 260);
  }

  toggleChat(): void {
    this.chatOpen = !this.chatOpen;
    if (this.chatOpen) {
      this.scrollChatToBottom();
    }
  }

  private scrollChatToBottom(): void {
    window.setTimeout(() => {
      const element = this.chatMessages?.nativeElement;
      if (element) {
        element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
      }
    });
  }

  private buildAssistantAnswer(question: string): string {
    const normalized = this.normalize(question);

    if (this.hasAny(normalized, ['hola', 'buenas', 'saludos', 'hey'])) {
      return '¡Hola! Puedo ayudarte a elegir el tipo de web, estimar un presupuesto inicial o explicarte cómo sería el proceso de trabajo.';
    }

    if (this.hasAny(normalized, ['precio', 'costo', 'cuanto', 'cotiza', 'presupuesto', 'tarifa'])) {
      return `Como referencia, con la configuración actual el proyecto parte desde S/ ${this.estimatePen.toLocaleString('es-PE')} o USD ${this.estimateUsd.toLocaleString('en-US')} aprox. La entrega estimada sería de ${this.timeline}. Para una cifra exacta conviene revisar alcance, cantidad de secciones y funciones conectadas.`;
    }

    if (this.hasAny(normalized, ['servicio', 'haces', 'ofreces', 'puedes hacer', 'desarrollas'])) {
      return 'Puedo ayudarte con páginas web empresariales, landing pages, tiendas virtuales, sistemas web, integraciones con WhatsApp, formularios, chatbots demo o conectados a IA, mantenimiento y optimización básica.';
    }

    if (this.hasAny(normalized, ['tiempo', 'demora', 'entrega', 'plazo', 'dias'])) {
      return `El tiempo referencial para la configuración actual es ${this.timeline}. Una landing pequeña puede salir más rápido; un sistema con usuarios, base de datos o panel administrativo necesita más planificación y pruebas.`;
    }

    if (this.hasAny(normalized, ['proceso', 'trabajaremos', 'trabajo', 'metodologia', 'pasos'])) {
      return 'El proceso es simple: conversamos sobre tu negocio, definimos objetivos, preparo una propuesta, desarrollo la web o sistema, hacemos revisiones, publicamos y doy soporte inicial.';
    }

    if (this.hasAny(normalized, ['whatsapp', 'contacto', 'llamar', 'hablar'])) {
      return 'Puedes contactarme por WhatsApp al +51 955 795 876. El botón verde flotante abre una conversación con mensaje precargado.';
    }

    if (this.hasAny(normalized, ['recibo', 'entrega', 'incluye', 'incluido', 'entregables', 'final'])) {
      return 'La entrega puede incluir la página publicada, diseño responsive, botón de WhatsApp, formulario, secciones necesarias, ajustes básicos y una explicación sencilla para que sepas cómo usarla o compartirla.';
    }

    if (this.hasAny(normalized, ['seo', 'velocidad', 'rapida', 'rendimiento', 'google'])) {
      return 'Puedo aplicar SEO básico y mejoras de velocidad: estructura clara, meta descripción, títulos correctos, carga optimizada, responsive y contenido entendible para buscadores.';
    }

    if (this.hasAny(normalized, ['tienda', 'ecommerce', 'productos', 'catalogo'])) {
      return 'Para una tienda virtual se puede empezar con catálogo, productos, botones de consulta por WhatsApp y luego crecer hacia pagos, panel administrativo o base de datos.';
    }

    if (this.hasAny(normalized, ['sistema', 'dashboard', 'panel', 'administrativo', 'login', 'base de datos'])) {
      return 'Un sistema web puede incluir login, roles, panel administrativo, reportes, base de datos y API. Ahí normalmente conviene definir bien los módulos antes de cotizar.';
    }

    return 'Buena pregunta. Para orientarte mejor necesito saber qué tipo de proyecto tienes en mente: landing, página empresarial, tienda virtual o sistema web. También puedes preguntarme por precio, tiempos, entregables o proceso.';
  }

  private normalize(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  private hasAny(text: string, keywords: string[]): boolean {
    return keywords.some((keyword) => text.includes(keyword));
  }

  private updateActiveSection(): void {
    const sections = this.navItems
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => Boolean(section));

    let current: HTMLElement | undefined;
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= 140) {
        current = section;
      }
    }

    this.activeSection = current?.id ?? 'inicio';
  }
}
