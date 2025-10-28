import { useEffect, useState } from 'react';
import api from '../../api/api';
import './Home.css';

type ProdutoType = {
  _id: string;
  nome: string;
  preco: number;
  urlfoto: string;
  descricao: string;
};

export function Home() {
  const [produtos, setProdutos] = useState<ProdutoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await api.get("/produtos");
        setProdutos(response.data);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar produtos:', err);
        setError('Erro ao carregar produtos. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  const adicionarCarrinho = async (produtoId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}&mensagem=${encodeURIComponent('Por favor, faça login para adicionar itens ao carrinho')}`;
        return;
      }
      
      await api.post('/adicionarItem', { produtoId, quantidade: 1 });
      window.dispatchEvent(new CustomEvent('carrinhoAtualizado'));
      alert('Produto adicionado ao carrinho com sucesso!');
    } catch (error: any) {
      console.error('Erro ao adicionar ao carrinho:', error);
      if (error?.response?.status !== 401) {
        const mensagem = error?.response?.data?.mensagem || 'Erro ao adicionar ao carrinho';
        alert(mensagem);
      }
    }
  };

  if (loading) return <div className="loading">Carregando produtos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home-container">
      <h1>Nossos Produtos</h1>
      <div className="produtos-grid">
        {produtos.map((produto) => (
          <div key={produto._id} className="produto-card">
            <img 
              src={produto.urlfoto} 
              alt={produto.nome} 
              className="produto-imagem" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=Imagem+Indisponível';
              }}
            />
            <div className="produto-info">
              <h3>{produto.nome}</h3>
              <p className="produto-preco">R$ {produto.preco.toFixed(2)}</p>
              <p className="produto-descricao">{produto.descricao}</p>
              {isAdmin && (
                <button 
                  className="adicionar-carrinho"
                  onClick={() => adicionarCarrinho(produto._id)}
                >
                  Adicionar ao Carrinho
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
