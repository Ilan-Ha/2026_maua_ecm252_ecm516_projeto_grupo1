import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [view, setView] = useState('landing')
  const [theme, setTheme] = useState('dark')

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')

  useEffect(() => {
    // Busca a lista de produtos do backend
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    fetch(`${apiBase}/api/products`)
      .then(res => {
        if (!res.ok) throw new Error('Não foi possível carregar os dados')
        return res.json()
      })
      .then(data => {
        setProducts(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setError('Erro ao conectar com o backend. Certifique-se que o node a.js está rodando.')
        setLoading(false)
      })
  }, [])

  // Extrai todas as categorias únicas do backend
  const categoriesList = ['Todas', ...new Set(products.map(p => p.category))]
  
  // Categorias em destaque para a primeira página (rotativa)
  const featuredCategories = [
    { name: 'Celular', icon: '📱', desc: 'Smarphones e Acessórios' },
    { name: 'Laptop', icon: '💻', desc: 'Notebooks e Workstations' },
    { name: 'Console', icon: '🎮', desc: 'Jogos e Entretenimento' },
    { name: 'Tablet', icon: '📟', desc: 'iPads e Tablets' },
    { name: 'Fones', icon: '🎧', desc: 'Áudio de Alta Qualidade' },
  ]

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    setSearchTerm('')
    setView('search')
  }
  
  // Filtra os produtos com base no termo de pesquisa e categoria selecionada
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  // --- TELA 1: LANDING PAGE (Destaque Rotativo) ---
  if (view === 'landing') {
    return (
      <div className={`landing-container ${theme}`}>
        <div className="landing-overlay"></div>
        <header className="landing-header">
          <h1>Maua<span>Shop</span></h1>
          <div className="header-actions">
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button className="goto-search-btn" onClick={() => setView('search')}>
              Ir para busca completa
            </button>
          </div>
        </header>

        <section className="hero-landing">
          <div className="hero-text">
            <h2>O futuro da tecnologia</h2>
            <p>Escolha uma categoria para começar</p>
          </div>

          <div className="poker-hand">
            {featuredCategories.map((cat, idx) => {
              const total = featuredCategories.length
              const angle = (idx - (total - 1) / 2) * 20   // mais aberto: -40° a +40°
              const offsetY = Math.abs(idx - (total - 1) / 2) * 30  // curva mais pronunciada
              const offsetX = (idx - (total - 1) / 2) * 120  // espaçamento horizontal
              return (
                <div 
                  key={cat.name} 
                  className="poker-card"
                  onClick={() => handleCategorySelect(cat.name)}
                  style={{ 
                    '--angle': `${angle}deg`,
                    '--offsetY': `${offsetY}px`,
                    '--offsetX': `${offsetX}px`,
                    '--i': idx,
                  }}
                >
                  <span className="cat-icon">{cat.icon}</span>
                  <h3>{cat.name}</h3>
                  <p>{cat.desc}</p>
                </div>
              )
            })}
          </div>
        </section>

        <footer className="landing-footer">
          <p>© 2026 Maua Eletronics Group - Inovação Mauá</p>
        </footer>
      </div>
    )
  }

  // --- TELA 2: BUSCA E LISTAGEM (O que tínhamos antes) ---
  return (
    <div className={`app-container fade-in ${theme}`}>
      <header className="main-header">
        <div className="logo-section" onClick={() => setView('landing')} style={{ cursor: 'pointer' }}>
          <h1>ALL<span>CONFIG</span></h1>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="O que você está procurando?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            autoFocus
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="header-actions">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button className="back-btn" onClick={() => setView('landing')}>Voltar</button>
        </div>
      </header>

      <div className="category-bar">
        {categoriesList.map(cat => (
          <button 
            key={cat} 
            className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <main className="content">
        <div className="section-title">
          <h2>{searchTerm ? `Resultados para "${searchTerm}"` : `${selectedCategory} em destaque`}</h2>
          <p>{filteredProducts.length} produtos disponíveis</p>
        </div>

        {loading && <div className="loader">Carregando tecnologia de ponta...</div>}
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="product-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image-container">
                  <img src={product.image} alt={product.name} loading="lazy" />
                  <span className="category-tag">{product.category}</span>
                </div>
                <div className="product-info">
                  <span className="brand-name">{product.brand}</span>
                  <h3>{product.name}</h3>
                  <div className="price-row">
                    <span className="price">{product.price}</span>
                    <button className="buy-button">Detalhes</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && !error && (
          <div className="no-results">
            <h3>Nenhum eletrônico encontrado</h3>
            <p>Tente mudar o filtro ou termo de busca.</p>
          </div>
        )}
      </main>

      <footer className="main-footer">
        <p>© 2026 Maua Eletronics Group - Projeto ECM252 / ECM516</p>
      </footer>
    </div>
  )
}

export default App
