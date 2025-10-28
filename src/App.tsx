import './App.css'
import api from './api/api'
//useffect
import { useState, useEffect } from 'react'
type ProdutoType = {
  _id: string,
  nome: string,
  preco: number,
  urlfoto: string,
  descricao: string
}
function App() {
  const [produtos, setProdutos] = useState<ProdutoType[]>([])
  const isAdmin = localStorage.getItem('isAdmin') === 'true'
  useEffect(() => {
    api.get("/produtos")
      .then((response) => setProdutos(response.data))
      .catch((error) => console.error('Error fetching data:', error))
  }, [])
  function handleForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const data = {
      nome: formData.get('nome') as string,
      preco: Number(formData.get('preco')),
      urlfoto: formData.get('urlfoto') as string,
      descricao: formData.get('descricao') as string
    }
    api.post("/produtos",data)
    .then((response) => setProdutos([...produtos, response.data]))
    .catch((error) => {
      console.error('Error posting data:', error)
      alert('Error posting data:'+error?.mensagem)
    })
    form.reset()
  }
  const adicionarCarrinho = async (produtoId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Se não houver token, redireciona para o login com mensagem
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}&mensagem=${encodeURIComponent('Por favor, faça login para adicionar itens ao carrinho')}`;
        return;
      }
      
      const response = await api.post('/adicionarItem', { produtoId, quantidade: 1 });
      
      // Verifica se a resposta foi bem sucedida (status 2xx)
      if (response.status >= 200 && response.status < 300) {
        // Atualiza o carrinho no header
        const headerElement = document.querySelector('header');
        if (headerElement) {
          // Dispara um evento personalizado para atualizar o carrinho
          window.dispatchEvent(new CustomEvent('carrinhoAtualizado'));
        }
        
        // Mostra mensagem de sucesso apenas se o item foi realmente adicionado
        if (response.data?.sucesso !== false) {
          alert('Produto adicionado ao carrinho com sucesso!');
        }
      }
    } catch (error: any) {
      console.error('Erro ao adicionar ao carrinho:', error);
      
      // Se o erro for 401 (não autorizado), o interceptor já redireciona para o login
      // Para outros erros, mostramos uma mensagem ao usuário
      if (error?.response?.status !== 401) {
        const mensagem = error?.response?.data?.mensagem || 'Erro ao adicionar ao carrinho';
        alert(mensagem);
      }
    }
  }
  return (
    <div className="container">
      {isAdmin && (
        <div className="formulario-cadastro">
          <h2>Cadastro de Produtos</h2>
          <form onSubmit={handleForm}>
            <div className="campos-formulario">
              <div className="grupo-campo">
                <label htmlFor="nome">Nome do Produto</label>
                <input type="text" id="nome" name="nome" placeholder="Ex: Camiseta Estampada" required />
              </div>
              <div className="grupo-campo">
                <label htmlFor="preco">Preço (R$)</label>
                <input type="number" id="preco" name="preco" placeholder="Ex: 99.90" min="0" step="0.01" required />
              </div>
              <div className="grupo-campo">
                <label htmlFor="urlfoto">URL da Imagem</label>
                <input type="url" id="urlfoto" name="urlfoto" placeholder="https://exemplo.com/imagem.jpg" required />
              </div>
              <div className="grupo-campo">
                <label htmlFor="descricao">Descrição</label>
                <textarea id="descricao" name="descricao" placeholder="Descreva o produto" required />
              </div>
            </div>
            <button type="submit" className="botao-enviar">Cadastrar Produto</button>
          </form>
        </div>
      )}
      
      <h2 className="titulo-pagina">Nossos Produtos</h2>
      <div className="produtos-lista">
        {produtos.map((produto) => (
          <div key={produto._id} className="produto-card">
            <div className="produto-imagem-container">
              <img 
                src={produto.urlfoto} 
                alt={produto.nome} 
                className="produto-imagem"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Imagem+Não+Disponível';
                }}
              />
            </div>
            <div className="produto-info">
              <h3 className="produto-nome">{produto.nome}</h3>
              <p className="produto-preco">R$ {Number(produto.preco).toFixed(2).replace('.', ',')}</p>
              <p className="produto-descricao">{produto.descricao}</p>
              <button 
                className="botao-carrinho"
                onClick={() => adicionarCarrinho(produto._id)}
              >
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App;
