import React, { useState } from 'react';
import './Gallery.css';

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  const categories = [
    { id: 'all', name: 'Todos', icon: '🎯' },
    { id: 'logos', name: 'Logos', icon: '🎨' },
    { id: 'designs', name: 'Designs', icon: '✨' },
    { id: 'anime', name: 'Anime', icon: '🎌' },
    { id: 'projetos', name: 'Projetos', icon: '🚀' }
  ];

  const galleryItems = [
    {
      id: 1,
      image: '/gallery/logo-futurista-1.jpeg',
      title: 'Logo Futurista 1',
      description: 'Design futurista e high-tech para Nerd 3D BR',
      category: 'logos',
      tags: ['3D', 'Futurista', 'Logo']
    },
    {
      id: 2,
      image: '/gallery/logo-futurista-2.jpeg',
      title: 'Logo Futurista 2',
      description: 'Variação do design futurista com elementos cyberpunk',
      category: 'logos',
      tags: ['3D', 'Futurista', 'Logo']
    },
    {
      id: 3,
      image: '/gallery/logo-cyberpunk-1.jpeg',
      title: 'Logo Cyberpunk 1',
      description: 'Design cyberpunk com elementos neon',
      category: 'logos',
      tags: ['Cyberpunk', 'Neon', 'Logo']
    },
    {
      id: 4,
      image: '/gallery/logo-cyberpunk-2.jpeg',
      title: 'Logo Cyberpunk 2',
      description: 'Estilo cyberpunk com efeitos luminosos',
      category: 'logos',
      tags: ['Cyberpunk', 'Neon', 'Logo']
    },
    {
      id: 5,
      image: '/gallery/logo-cyberpunk-3.jpeg',
      title: 'Logo Cyberpunk 3',
      description: 'Variação cyberpunk com detalhes únicos',
      category: 'logos',
      tags: ['Cyberpunk', 'Neon', 'Logo']
    },
    {
      id: 6,
      image: '/gallery/design-cyberpunk-1.jpeg',
      title: 'Design Cyberpunk 1',
      description: 'Design futurista com estilo cyberpunk',
      category: 'designs',
      tags: ['Design', 'Cyberpunk', 'Arte']
    },
    {
      id: 7,
      image: '/gallery/design-cyberpunk-2.jpeg',
      title: 'Design Cyberpunk 2',
      description: 'Arte digital com elementos cyberpunk',
      category: 'designs',
      tags: ['Design', 'Cyberpunk', 'Arte']
    },
    {
      id: 8,
      image: '/gallery/anime-logo-1.jpg',
      title: 'Logo Anime Style 1',
      description: 'Logo com estilo anime futurista',
      category: 'anime',
      tags: ['Anime', 'Logo', 'Futurista']
    },
    {
      id: 9,
      image: '/gallery/anime-logo-2.jpg',
      title: 'Logo Anime Style 2',
      description: 'Variação do logo com elementos anime',
      category: 'anime',
      tags: ['Anime', 'Logo', 'Futurista']
    },
    {
      id: 10,
      image: '/gallery/lightning-logo.jpg',
      title: 'Logo Lightning',
      description: 'Logo com efeitos de raio e energia',
      category: 'logos',
      tags: ['Lightning', 'Energia', 'Logo']
    },
    {
      id: 11,
      image: '/gallery/phoenix-cyberpunk-1.jpg',
      title: 'Phoenix Cyberpunk 1',
      description: 'Design Phoenix com estilo cyberpunk',
      category: 'designs',
      tags: ['Phoenix', 'Cyberpunk', 'Arte']
    },
    {
      id: 12,
      image: '/gallery/phoenix-cyberpunk-2.jpg',
      title: 'Phoenix Cyberpunk 2',
      description: 'Variação Phoenix cyberpunk',
      category: 'designs',
      tags: ['Phoenix', 'Cyberpunk', 'Arte']
    },
    {
      id: 13,
      image: '/gallery/phoenix-futurista-1.jpg',
      title: 'Phoenix Futurista 1',
      description: 'Design Phoenix com elementos futuristas',
      category: 'designs',
      tags: ['Phoenix', 'Futurista', 'Arte']
    },
    {
      id: 14,
      image: '/gallery/phoenix-futurista-2.jpg',
      title: 'Phoenix Futurista 2',
      description: 'Variação Phoenix futurista',
      category: 'designs',
      tags: ['Phoenix', 'Futurista', 'Arte']
    },
    {
      id: 15,
      image: '/gallery/nerd3dbr-logo.png',
      title: 'Nerd 3D BR Logo',
      description: 'Logo oficial da Nerd 3D BR',
      category: 'logos',
      tags: ['Oficial', 'Logo', 'Nerd3DBR']
    },
    {
      id: 16,
      image: '/gallery/hidden-histories.png',
      title: 'Hidden Histories',
      description: 'Arte conceitual Hidden Histories',
      category: 'projetos',
      tags: ['Projeto', 'Arte', 'Conceitual']
    }
  ];

  const filteredItems = activeCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  const openModal = (item) => {
    setSelectedImage(item);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <section id="gallery" className="gallery">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            <span className="title-icon">🎨</span>
            Nossa Galeria
          </h2>
          <p className="section-subtitle">
            Explore nossos projetos e trabalhos realizados
          </p>
        </div>

        {/* Filtros de Categoria */}
        <div className="gallery-filters">
          {categories.map(category => (
            <button
              key={category.id}
              className={`filter-btn ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              <span className="filter-icon">{category.icon}</span>
              <span className="filter-name">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Grid da Galeria */}
        <div className="gallery-grid">
          {filteredItems.map(item => (
            <div key={item.id} className="gallery-item" onClick={() => openModal(item)}>
              <div className="item-image">
                <img src={item.image} alt={item.title} />
                <div className="item-overlay">
                  <div className="overlay-content">
                    <h3 className="item-title">{item.title}</h3>
                    <p className="item-description">{item.description}</p>
                    <div className="item-tags">
                      {item.tags.map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="view-icon">👁️</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Estatísticas da Galeria */}
        <div className="gallery-stats">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">🏆</div>
              <div className="stat-content">
                <div className="stat-number">150+</div>
                <div className="stat-label">Projetos Concluídos</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <div className="stat-number">98%</div>
                <div className="stat-label">Satisfação dos Clientes</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <div className="stat-number">24h</div>
                <div className="stat-label">Tempo Médio de Entrega</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">🚀</div>
              <div className="stat-content">
                <div className="stat-number">5</div>
                <div className="stat-label">Anos de Experiência</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Visualização */}
      {selectedImage && (
        <div className="gallery-modal" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>✕</button>
            <div className="modal-image">
              <img src={selectedImage.image} alt={selectedImage.title} />
            </div>
            <div className="modal-info">
              <h3 className="modal-title">{selectedImage.title}</h3>
              <p className="modal-description">{selectedImage.description}</p>
              <div className="modal-tags">
                {selectedImage.tags.map(tag => (
                  <span key={tag} className="modal-tag">{tag}</span>
                ))}
              </div>
              <div className="modal-actions">
                <button className="btn btn-primary">
                  <span>💬</span>
                  Solicitar Orçamento
                </button>
                <button className="btn btn-secondary">
                  <span>📤</span>
                  Compartilhar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;