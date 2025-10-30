import React, { useEffect, useState } from 'react'
import './Hero.css'

const Hero = () => {
  const [currentText, setCurrentText] = useState(0)
  const texts = [
    'IMPRESSÃO 3D',
    'CONTEÚDO GEEK',
    'GAMES & TECH',
    'ACTION FIGURES'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [texts.length])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="home" className="hero">
      <div className="hero-background">
        <div className="hero-grid"></div>
        <div className="hero-particles"></div>
      </div>
      
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="title-main">NERD 3D BR</span>
              <span className="title-subtitle">
                SEU UNIVERSO DE
                <span className="rotating-text">
                  {texts.map((text, index) => (
                    <span 
                      key={index} 
                      className={`text-item ${index === currentText ? 'active' : ''}`}
                    >
                      {text}
                    </span>
                  ))}
                </span>
              </span>
            </h1>
            
            <p className="hero-description">
              Mergulhe no futuro da tecnologia e entretenimento. Impressão 3D de alta qualidade, 
              conteúdos geek exclusivos, reviews de games e action figures colecionáveis. 
              Sua paixão nerd encontra aqui seu lar digital.
            </p>
            
            <div className="hero-buttons">
              <button 
                className="btn btn-primary"
                onClick={() => scrollToSection('services')}
              >
                Explorar Serviços
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => scrollToSection('gallery')}
              >
                Ver Galeria
              </button>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="hero-logo-container">
              <div className="logo-glow"></div>
              <div className="logo-rings">
                <div className="ring ring-1"></div>
                <div className="ring ring-2"></div>
                <div className="ring ring-3"></div>
              </div>
              <div className="hero-logo">
                <span className="logo-3d">3D</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Projetos 3D</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">1000+</span>
            <span className="stat-label">Conteúdos Geek</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50+</span>
            <span className="stat-label">Reviews Games</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">200+</span>
            <span className="stat-label">Action Figures</span>
          </div>
        </div>
      </div>
      
      <div className="scroll-indicator">
        <div className="scroll-arrow"></div>
      </div>
    </section>
  )
}

export default Hero