import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

type ChatMessage = {
  author: 'bot' | 'user';
  text: string;
};

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  usdPenRate = 3.4;
  selectedCurrency: 'PEN' | 'USD' = 'PEN';
  exchangeRateStatus = 'TC referencial';
  projectType = 'landing';
  pages = 4;
  integrations = 2;
  urgency = 'normal';
  chatOpen = true;
  chatInput = '';

  services = [
    {
      title: 'Aplicaciones Web',
      text: 'Interfaces modernas, rapidas y preparadas para vender desde el primer scroll.',
      tag: 'Angular'
    },
    {
      title: 'Automatizacion',
      text: 'Flujos internos, paneles y herramientas que reducen trabajo repetitivo.',
      tag: 'APIs'
    },
    {
      title: 'Backend y Datos',
      text: 'Servicios con Spring Boot, autenticacion, bases de datos e integraciones.',
      tag: 'Spring'
    }
  ];

  projects = [
    'Dashboard SaaS con metricas en tiempo real',
    'Landing de alto impacto para servicios digitales',
    'Cotizador inteligente conectado a WhatsApp',
    'Portal administrativo con roles y reportes'
  ];

  stack = ['Angular', 'TypeScript', 'Spring Boot', 'REST APIs', 'UI Motion', 'Responsive UX'];

  messages: ChatMessage[] = [
    {
      author: 'bot',
      text: 'Hola. Soy una demo de IA: puedo recomendarte un tipo de proyecto, explicar el proceso o estimar una idea.'
    }
  ];

  ngOnInit(): void {
    this.loadExchangeRate();
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
      this.exchangeRateStatus = 'TC actualizado automaticamente';
    } catch {
      this.exchangeRateStatus = 'TC referencial de respaldo';
    }
  }

  get estimatePen(): number {
    const baseByType: Record<string, number> = {
      landing: 450,
      ecommerce: 1500,
      dashboard: 1800,
      custom: 2500
    };
    const urgencyMultiplier = this.urgency === 'express' ? 1.25 : this.urgency === 'flexible' ? 0.92 : 1;
    const rawEstimate = (baseByType[this.projectType] + this.pages * 45 + this.integrations * 120) * urgencyMultiplier;
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
    const days = Math.ceil(6 + this.pages * 1.3 + this.integrations * 2 + (this.projectType === 'custom' ? 6 : 0));
    return this.urgency === 'express' ? `${Math.max(7, days - 5)} dias` : `${days} dias`;
  }

  sendMessage(): void {
    const question = this.chatInput.trim();
    if (!question) {
      return;
    }

    this.messages = [...this.messages, { author: 'user', text: question }];
    this.chatInput = '';

    const normalized = question.toLowerCase();
    let answer = 'Puedo ayudarte a convertir esa idea en una propuesta clara: alcance, pantallas, integraciones, tiempos y una primera version lista para validar.';

    if (normalized.includes('precio') || normalized.includes('costo') || normalized.includes('cotiza')) {
      answer = `Segun el cotizador, una version inicial estaria cerca de S/ ${this.estimatePen.toLocaleString('es-PE')} o USD ${this.estimateUsd.toLocaleString('en-US')} aprox., con entrega estimada de ${this.timeline}.`;
    } else if (normalized.includes('angular') || normalized.includes('spring')) {
      answer = 'Uso Angular para interfaces fluidas y Spring Boot cuando el proyecto necesita API, usuarios, base de datos o integraciones serias.';
    } else if (normalized.includes('whatsapp') || normalized.includes('contacto')) {
      answer = 'El boton flotante lleva directo a WhatsApp con un mensaje precargado. Solo cambia el numero por el tuyo para recibir leads.';
    }

    window.setTimeout(() => {
      this.messages = [...this.messages, { author: 'bot', text: answer }];
    }, 350);
  }
}
