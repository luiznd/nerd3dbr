"use client"
import React from 'react'

const About = () => {
  return (
    <section id="about" className="about section">
      <div className="container">
        <h2 className="section-title">Sobre o Nerd 3D BR</h2>
        
        <div className="about-content">
          <div className="about-text">
            <div className="about-intro">
              <h3>Bem-vindo ao futuro da cultura nerd!</h3>
              <p>
                O Nerd 3D BR nasceu da paixão pela tecnologia, games e cultura pop. 
                Somos mais que um canal ou loja - somos uma comunidade dedicada a 
                explorar as fronteiras da impressão 3D, descobrir os melhores games 
                e colecionar as action figures mais incríveis do universo geek.
              </p>
            </div>

            <div className="about-mission">
              <h4>Nossa Missão</h4>
              <p>
                Democratizar o acesso à tecnologia de impressão 3D, compartilhar 
                conhecimento sobre o universo geek e criar uma ponte entre a 
                tecnologia e o entretenimento, sempre com qualidade e paixão.
              </p>
            </div>

            <div className="about-values">
              <h4>Nossos Valores</h4>
              <ul>
                <li><strong>Inovação:</strong> Sempre buscando as últimas tecnologias</li>
                <li><strong>Qualidade:</strong> Excelência em cada projeto e conteúdo</li>
                <li><strong>Comunidade:</strong> Construindo juntos o futuro nerd</li>
                <li><strong>Paixão:</strong> Amor genuíno pela cultura geek</li>
              </ul>
            </div>
          </div>

          <div className="about-features">
            <div className="feature-card">
              <div className="feature-icon">🎮</div>
              <h4>Gaming</h4>
              <p>Reviews, análises e descobertas dos melhores games do momento</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🖨️</div>
              <h4>Impressão 3D</h4>
              <p>Projetos personalizados e tutoriais para makers e entusiastas</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🦸</div>
              <h4>Action Figures</h4>
              <p>Coleções exclusivas e reviews das melhores figuras do mercado</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h4>Tecnologia</h4>
              <p>Explorando as últimas inovações em tech e gadgets futuristas</p>
            </div>
          </div>
        </div>

        <div className="about-stats">
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-icon">📅</div>
              <div className="stat-info">
                <span className="stat-value">2020</span>
                <span className="stat-desc">Fundado em</span>
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <span className="stat-value">10K+</span>
                <span className="stat-desc">Seguidores</span>
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-icon">⭐</div>
              <div className="stat-info">
                <span className="stat-value">4.9</span>
                <span className="stat-desc">Avaliação</span>
              </div>
            </div>

            <div className="stat-box">
              <div className="stat-icon">🏆</div>
              <div className="stat-info">
                <span className="stat-value">50+</span>
                <span className="stat-desc">Prêmios</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
