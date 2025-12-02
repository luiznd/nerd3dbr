"use client";

import React, { useState, useEffect } from 'react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Navegação por âncoras e páginas
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <span className="logo-text">NERD 3D BR</span>
          </div>

          <nav className={`nav ${isMobileMenuOpen ? 'nav-open' : ''}`}>
            <ul className="nav-list">
              <li><a href="/" onClick={closeMobileMenu}>Home</a></li>
              <li><a href="/#about" onClick={closeMobileMenu}>Sobre</a></li>
              <li><a href="/#services" onClick={closeMobileMenu}>Serviços</a></li>
              <li><a href="/#gallery" onClick={closeMobileMenu}>Galeria</a></li>
              <li><a href="/contato" onClick={closeMobileMenu}>Contato</a></li>
              <li><a href="/produtos" onClick={closeMobileMenu}>Produtos</a></li>
              <li><a href="/login" onClick={closeMobileMenu}>Entrar</a></li>
            </ul>
          </nav>

          <div className="header-actions">
            <a href="/carrinho" className="cart-btn" aria-label="Carrinho">
              {/* Ícone de carrinho (SVG) */}
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M7 18c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm10 0c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zM6.2 6h13.1a1 1 0 0 1 .97 1.243l-1.8 7.2A2 2 0 0 1 16.53 16H8.47a2 2 0 0 1-1.94-1.557L4.3 5H2a1 1 0 1 1 0-2h3.3a1 1 0 0 1 .97.757L7.3 10h8.91l1.25-5H6.2z"/>
              </svg>
            </a>
            <button 
              className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
              onClick={toggleMobileMenu}
              aria-label="Menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
