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
    <>
      <div>Cadastro de Produtos</div>
      <form onSubmit={handleForm}>
        <input type="text" name="nome" placeholder="Nome" />
        <input type="number" name="preco" placeholder="Preço" />
        <input type="text" name="urlfoto" placeholder="URL da Foto" />
        <input type="text" name="descricao" placeholder="Descrição" />
        <button type="submit">Cadastrar</button>
      </form>
      <div>Lista de Produtos</div>
      {
        produtos.map((produto) => (
          <div key={produto._id}>
            <h2>{produto.nome}</h2>
            <p>R$ {produto.preco}</p>
            <img src={produto.urlfoto} alt={produto.nome} width="200" />
            <p>{produto.descricao}</p>
            <button onClick={()=>adicionarCarrinho(produto._id)}>Adicionar ao carrinho</button>
          </div>
        ))
      }
    </>
  )
}

export default App;
