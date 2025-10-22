import { Link, useLocation, useNavigate } from 'react-router-dom'
import { route} from '../../router.ts'
import './header.css'
import { useState, useEffect } from 'react'
import api from '../../api/api'

function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const [showCart, setShowCart] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [cartCount, setCartCount] = useState(0)

  // Função para carregar os itens do carrinho
  const loadCart = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const response = await api.get('/carrinho')
        setCartItems(response.data.itens || [])
        setCartCount(response.data.itens?.length || 0)
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error)
    }
  }

  // Carrega o carrinho quando o componente é montado
  useEffect(() => {
    loadCart()
  }, [])

  // Atualiza a contagem do carrinho quando o estado de autenticação muda
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      loadCart()
    } else {
      setCartItems([])
      setCartCount(0)
    }
  }, [location.pathname]) // Recarrega quando a rota muda

  const handleCartClick = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}&mensagem=${encodeURIComponent('Por favor, faça login para ver seu carrinho')}`)
      return
    }
    setShowCart(!showCart)
  }

  return (
    <header>
      <div className="menu-bloco">
        {route.map(route => (
          <Link
            key={route.path}
            to={route.path}
            className={location.pathname === route.path ? 'active' : ''}
          >
            {route.name}
          </Link>
        ))}
      </div>
      <div className="cart-container">
        <button onClick={handleCartClick} className="cart-button">
          🛒 Carrinho {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </button>
        {showCart && (
          <div className="cart-dropdown">
            <h3>Seu Carrinho</h3>
            {cartItems.length === 0 ? (
              <p>Seu carrinho está vazio</p>
            ) : (
              <>
                <ul>
                  {cartItems.map((item: any) => (
                    <li key={item._id} className="cart-item">
                      <span>{item.produto?.nome} x {item.quantidade}</span>
                      <span>R$ {(item.produto?.preco * item.quantidade).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  className="checkout-button"
                  onClick={() => navigate('/checkout')}
                >
                  Finalizar Compra
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

export default Header