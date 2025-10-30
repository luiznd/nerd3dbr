import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const services = [
    'Impressão 3D',
    'Action Figures',
    'Setup Gamer',
    'Cosplay Props',
    'Consultoria Geek',
    'Outro'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envio do formulário
    setTimeout(() => {
      setSubmitStatus('success');
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });
      
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    }, 2000);
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            <span className="title-icon">📞</span>
            Entre em Contato
          </h2>
          <p className="section-subtitle">
            Vamos transformar suas ideias em realidade
          </p>
        </div>

        <div className="contact-content">
          {/* Informações de Contato */}
          <div className="contact-info">
            <div className="info-header">
              <h3>Fale Conosco</h3>
              <p>Estamos prontos para atender você!</p>
            </div>

            <div className="contact-methods">
              <div className="contact-method">
                <div className="method-icon">📱</div>
                <div className="method-content">
                  <h4>WhatsApp</h4>
                  <p>+55 (11) 99999-9999</p>
                  <span>Resposta rápida</span>
                </div>
              </div>

              <div className="contact-method">
                <div className="method-icon">📧</div>
                <div className="method-content">
                  <h4>E-mail</h4>
                  <p>contato@nerd3dbr.com</p>
                  <span>Resposta em até 24h</span>
                </div>
              </div>

              <div className="contact-method">
                <div className="method-icon">📍</div>
                <div className="method-content">
                  <h4>Localização</h4>
                  <p>São Paulo, SP</p>
                  <span>Atendimento presencial</span>
                </div>
              </div>

              <div className="contact-method">
                <div className="method-icon">🕒</div>
                <div className="method-content">
                  <h4>Horário</h4>
                  <p>Seg - Sex: 9h às 18h</p>
                  <span>Sáb: 9h às 14h</span>
                </div>
              </div>
            </div>

            <div className="social-links">
              <h4>Redes Sociais</h4>
              <div className="social-grid">
                <a href="#" className="social-link instagram">
                  <span className="social-icon">📷</span>
                  <span className="social-name">Instagram</span>
                </a>
                <a href="#" className="social-link youtube">
                  <span className="social-icon">📺</span>
                  <span className="social-name">YouTube</span>
                </a>
                <a href="#" className="social-link tiktok">
                  <span className="social-icon">🎵</span>
                  <span className="social-name">TikTok</span>
                </a>
                <a href="#" className="social-link discord">
                  <span className="social-icon">🎮</span>
                  <span className="social-name">Discord</span>
                </a>
              </div>
            </div>
          </div>

          {/* Formulário de Contato */}
          <div className="contact-form-container">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-header">
                <h3>Solicite um Orçamento</h3>
                <p>Preencha o formulário e entraremos em contato</p>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Nome Completo</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Seu nome completo"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">E-mail</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="seu@email.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Telefone/WhatsApp</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="service">Serviço de Interesse</label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione um serviço</option>
                    {services.map(service => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="message">Mensagem</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="5"
                  placeholder="Descreva seu projeto ou dúvida..."
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading-spinner"></span>
                    Enviando...
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    Enviar Mensagem
                  </>
                )}
              </button>

              {submitStatus === 'success' && (
                <div className="submit-success">
                  <span className="success-icon">✅</span>
                  <p>Mensagem enviada com sucesso! Entraremos em contato em breve.</p>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* FAQ Rápido */}
        <div className="quick-faq">
          <h3>Perguntas Frequentes</h3>
          <div className="faq-grid">
            <div className="faq-item">
              <div className="faq-icon">⏱️</div>
              <div className="faq-content">
                <h4>Qual o prazo de entrega?</h4>
                <p>Varia de 24h a 7 dias dependendo da complexidade do projeto</p>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-icon">💰</div>
              <div className="faq-content">
                <h4>Como funciona o orçamento?</h4>
                <p>Orçamento gratuito baseado nas especificações do seu projeto</p>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-icon">🚚</div>
              <div className="faq-content">
                <h4>Fazem entrega?</h4>
                <p>Sim! Entregamos em toda região metropolitana de São Paulo</p>
              </div>
            </div>
            <div className="faq-item">
              <div className="faq-icon">🔧</div>
              <div className="faq-content">
                <h4>Fazem projetos customizados?</h4>
                <p>Claro! Especializamos em projetos únicos e personalizados</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;