import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Início', href: '#home' },
    { name: 'Sobre', href: '#about' },
    { name: 'Serviços', href: '#services' },
    { name: 'Galeria', href: '#gallery' },
    { name: 'Contato', href: '#contact' }
  ];

  const services = [
    'Impressão 3D',
    'Action Figures',
    'Setup Gamer',
    'Cosplay Props',
    'Consultoria Geek'
  ];

  const socialLinks = [
    { name: 'Instagram', icon: '📷', href: '#', color: '#E4405F' },
    { name: 'YouTube', icon: '📺', href: '#', color: '#FF0000' },
    { name: 'TikTok', icon: '🎵', href: '#', color: '#000000' },
    { name: 'Discord', icon: '🎮', href: '#', color: '#5865F2' }
  ];

  return (
    <footer className="footer">
      <div className="footer-bg">
        <div className="bg-pattern"></div>
        <div className="bg-glow"></div>
      </div>

      <div className="container">
        <div className="footer-content">
          {/* Logo e Descrição */}
          <div className="footer-brand">
            <div className="footer-logo">
              <img src="/logo-nerd3dbr.png" alt="Nerd 3D BR" />
              <span className="logo-text">Nerd 3D BR</span>
            </div>
            <p className="footer-description">
              Transformando ideias em realidade através da tecnologia 3D, 
              cultura geek e inovação. Sua imaginação é o nosso limite.
            </p>
            <div className="footer-stats">
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Projetos</span>
              </div>
              <div className="stat">
                <span className="stat-number">5</span>
                <span className="stat-label">Anos</span>
              </div>
              <div className="stat">
                <span className="stat-number">98%</span>
                <span className="stat-label">Satisfação</span>
              </div>
            </div>
          </div>

          {/* Links Rápidos */}
          <div className="footer-section">
            <h3 className="section-title">
              <span className="title-icon">🔗</span>
              Links Rápidos
            </h3>
            <ul className="footer-links">
              {quickLinks.map(link => (
                <li key={link.name}>
                  <a href={link.href} className="footer-link">
                    <span className="link-arrow">→</span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Serviços */}
          <div className="footer-section">
            <h3 className="section-title">
              <span className="title-icon">⚡</span>
              Nossos Serviços
            </h3>
            <ul className="footer-links">
              {services.map(service => (
                <li key={service}>
                  <a href="#services" className="footer-link">
                    <span className="link-arrow">→</span>
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato e Redes Sociais */}
          <div className="footer-section">
            <h3 className="section-title">
              <span className="title-icon">📞</span>
              Contato
            </h3>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📱</span>
                <span>+55 (11) 99999-9999</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <span>contato@nerd3dbr.com</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span>São Paulo, SP</span>
              </div>
            </div>

            <div className="social-section">
              <h4>Siga-nos</h4>
              <div className="social-links">
                {socialLinks.map(social => (
                  <a 
                    key={social.name} 
                    href={social.href} 
                    className="social-link"
                    style={{ '--social-color': social.color }}
                    title={social.name}
                  >
                    <span className="social-icon">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="newsletter-section">
          <div className="newsletter-content">
            <div className="newsletter-info">
              <h3>🚀 Fique por dentro das novidades!</h3>
              <p>Receba dicas, tutoriais e lançamentos exclusivos</p>
            </div>
            <form className="newsletter-form">
              <input 
                type="email" 
                placeholder="Seu melhor e-mail"
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-btn">
                <span>📬</span>
                Inscrever
              </button>
            </form>
          </div>
        </div>

        {/* Rodapé Final */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>© {currentYear} Nerd 3D BR. Todos os direitos reservados.</p>
              <p>Desenvolvido com ❤️ e muito ☕</p>
            </div>
            <div className="footer-links-bottom">
              <a href="#" className="footer-link-bottom">Política de Privacidade</a>
              <a href="#" className="footer-link-bottom">Termos de Uso</a>
              <a href="#" className="footer-link-bottom">FAQ</a>
            </div>
          </div>
        </div>
      </div>

      {/* Botão Voltar ao Topo */}
      <button 
        className="back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        title="Voltar ao topo"
      >
        <span>⬆️</span>
      </button>
    </footer>
  );
};

export default Footer;