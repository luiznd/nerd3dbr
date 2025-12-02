"use client"
import React, { useState } from 'react'

const Services = () => {
  const [activeService, setActiveService] = useState(0)

  const services = [
    {
      id: 'impressao3d',
      title: 'Impressão 3D',
      icon: '🖨️',
      description: 'Projetos personalizados e impressões de alta qualidade',
      features: [
        'Modelagem 3D personalizada',
        'Impressão em diversos materiais',
        'Protótipos funcionais',
        'Miniaturas e figuras',
        'Peças de reposição',
        'Projetos arquitetônicos'
      ],
      color: 'primary'
    },
    {
      id: 'games',
      title: 'Games & Reviews',
      icon: '🎮',
      description: 'Análises completas e descobertas do mundo gamer',
      features: [
        'Reviews detalhados',
        'Gameplay exclusivo',
        'Análises técnicas',
        'Comparativos de hardware',
        'Dicas e tutoriais',
        'Cobertura de eventos'
      ],
      color: 'secondary'
    },
    {
      id: 'actionfigures',
      title: 'Action Figures',
      icon: '🦸',
      description: 'Coleções exclusivas e reviews das melhores figuras',
      features: [
        'Reviews de colecionáveis',
        'Unboxing exclusivos',
        'Guias de coleção',
        'Comparativos de qualidade',
        'Dicas de conservação',
        'Lançamentos em primeira mão'
      ],
      color: 'accent'
    },
    {
      id: 'conteudo',
      title: 'Conteúdo Geek',
      icon: '🚀',
      description: 'Universo completo da cultura nerd e tecnologia',
      features: [
        'Notícias tech',
        'Análises de gadgets',
        'Cultura pop',
        'Ficção científica',
        'Tutoriais DIY',
        'Comunidade ativa'
      ],
      color: 'gradient'
    }
  ]

  return (
    <section id="services" className="services section">
      <div className="container">
        <h2 className="section-title">Nossos Serviços</h2>
        
        <div className="services-nav">
          {services.map((service, index) => (
            <button
              key={service.id}
              className={`service-nav-btn ${activeService === index ? 'active' : ''}`}
              onClick={() => setActiveService(index)}
            >
              <span className="service-icon">{service.icon}</span>
              <span className="service-name">{service.title}</span>
            </button>
          ))}
        </div>

        <div className="services-content">
          <div className="service-details">
            <div className="service-header">
              <div className="service-icon-large">
                {services[activeService].icon}
              </div>
              <div className="service-info">
                <h3 className="service-title">{services[activeService].title}</h3>
                <p className="service-description">{services[activeService].description}</p>
              </div>
            </div>

            <div className="service-features">
              <h4>O que oferecemos:</h4>
              <div className="features-grid">
                {services[activeService].features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <span className="feature-check">✓</span>
                    <span className="feature-text">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="service-cta">
              <button className="btn btn-primary">
                Saiba Mais
              </button>
              <button className="btn btn-secondary">
                Ver Portfólio
              </button>
            </div>
          </div>

          <div className="service-visual">
            <div className={`service-showcase ${services[activeService].color}`}>
              <div className="showcase-bg"></div>
              <div className="showcase-content">
                <div className="showcase-icon">
                  {services[activeService].icon}
                </div>
                <div className="showcase-particles">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className={`particle particle-${i + 1}`}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="services-stats">
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <span className="stat-number">500+</span>
                <span className="stat-label">Projetos Concluídos</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <span className="stat-number">4.9/5</span>
                <span className="stat-label">Avaliação Média</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Clientes Satisfeitos</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-content">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Suporte Disponível</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services
