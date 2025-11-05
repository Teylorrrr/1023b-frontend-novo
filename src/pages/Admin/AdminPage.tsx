import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import CadastroProduto from '../../componentes/produtos/CadastroProduto';
import './AdminPage.css';

interface Usuario {
  _id: string;
  nome: string;
  email: string;
  idade: number;
}

interface Produto {
  _id: string;
  nome: string;
  preco: number;
  descricao: string;
  urlfoto: string;
  dataCriacao: string;
}

const AdminPage = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [activeTab, setActiveTab] = useState<'usuarios' | 'produtos'>('usuarios');
  const [loading, setLoading] = useState(true);
  const [produtosLoading, setProdutosLoading] = useState(false);
  const [error, setError] = useState('');
  const [mensagem, setMensagem] = useState<{ texto: string; tipo: 'sucesso' | 'erro' } | null>(null);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);

  const formRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();

  // Carregar usuários
  const carregarUsuarios = async () => {
    try {
      const response = await api.get('/usuarios');
      setUsuarios(response.data);
    } catch (err: any) {
      setError('Erro ao carregar usuários: ' + (err.response?.data?.mensagem || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  // Carregar produtos
  const carregarProdutos = async () => {
    try {
      setProdutosLoading(true);
      const response = await api.get('/produtos');
      setProdutos(response.data);
    } catch (err: any) {
      setError('Erro ao carregar produtos: ' + (err.response?.data?.mensagem || 'Erro desconhecido'));
    } finally {
      setProdutosLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    if (!token || !isAdmin) {
      navigate('/login', { state: { mensagem: 'Acesso negado. Faça login como administrador.' } });
      return;
    }

    carregarUsuarios();
    carregarProdutos();
  }, [navigate]);

  // Excluir produto
  const handleExcluirProduto = async (id: string) => {
    try {
      await api.delete(`/produtos/${id}`);
      setMensagem({ texto: 'Produto excluído com sucesso!', tipo: 'sucesso' });
      carregarProdutos();
    } catch {
      setMensagem({ texto: 'Erro ao excluir produto.', tipo: 'erro' });
    }
  };

  // Abrir edição de produto e rolar para o formulário
  const handleAbrirEdicao = (produto: Produto) => {
    setProdutoEditando(produto);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Produto cadastrado
  const handleProdutoCadastrado = () => {
    carregarProdutos();
    setMensagem({ texto: 'Produto cadastrado com sucesso!', tipo: 'sucesso' });
  };

  // Produto atualizado
  const handleProdutoAtualizado = () => {
    carregarProdutos();
    setMensagem({ texto: 'Produto atualizado com sucesso!', tipo: 'sucesso' });
    setProdutoEditando(null);
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="admin-container">
      <h1>Painel de Controle Administrativo</h1>

      {error && <div className="error-message">{error}</div>}
      {mensagem && <div className={`mensagem ${mensagem.tipo}`}>{mensagem.texto}</div>}

      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === 'usuarios' ? 'active' : ''}`}
          onClick={() => setActiveTab('usuarios')}
        >
          Gerenciar Usuários
        </button>
        <button
          className={`tab-button ${activeTab === 'produtos' ? 'active' : ''}`}
          onClick={() => setActiveTab('produtos')}
        >
          Gerenciar Produtos
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'usuarios' ? (
          <div className="usuarios-list">
            <h2>Usuários Cadastrados</h2>
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Idade</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario._id}>
                    <td>{usuario.nome}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.idade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="produtos-section">
            <h2>Gerenciar Produtos</h2>

            {produtosLoading ? (
              <div className="loading">Carregando produtos...</div>
            ) : produtos.length === 0 ? (
              <p>Nenhum produto cadastrado.</p>
            ) : (
              <table className="produtos-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Preço (R$)</th>
                    <th>Descrição</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.map((produto) => (
                    <tr key={produto._id}>
                      <td>{produto.nome}</td>
                      <td>{produto.preco.toFixed(2)}</td>
                      <td>{produto.descricao}</td>
                      <td className="actions-cell">
                        <button className="action-button edit" onClick={() => handleAbrirEdicao(produto)}>
                          Editar
                        </button>
                        <button className="action-button delete" onClick={() => handleExcluirProduto(produto._id)}>
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="cadastro-produto-container" ref={formRef}>
              <h3>{produtoEditando ? 'Editar Produto' : 'Cadastrar Novo Produto'}</h3>
              <CadastroProduto
                produto={produtoEditando}
                onProdutoCadastrado={handleProdutoCadastrado}
                onProdutoAtualizado={handleProdutoAtualizado}
                onCancelarEdicao={() => setProdutoEditando(null)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
