import { useEffect, useState } from 'react';
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
  const [error, setError] = useState('');
  const [produtosLoading, setProdutosLoading] = useState(false);
  const navigate = useNavigate();

  // Função para carregar os usuários
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

  // Função para carregar os produtos
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
      navigate('/login', { 
        state: { mensagem: 'Acesso negado. Faça login como administrador.' } 
      });
      return;
    }

    carregarUsuarios();
    carregarProdutos();
  }, [navigate]);

  // Função para formatar data
  const formatarData = (dataString: string) => {
    return new Date(dataString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Função para deletar um produto
  const handleDeletarProduto = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        setLoading(true);
        await api.delete(`/produtos/${id}`);
        // Atualiza a lista de produtos após a exclusão
        await carregarProdutos();
      } catch (err: any) {
        setError('Erro ao excluir produto: ' + (err.response?.data?.mensagem || 'Erro desconhecido'));
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="admin-container">
      <h1>Painel de Controle Administrativo</h1>
      
      {error && <div className="error-message">{error}</div>}
      
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
                {usuarios.map(usuario => (
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
            
            <div className="produtos-lista">
              <div className="section-header">
                <h3>Lista de Produtos</h3>
              </div>
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
                      <th>Data de Cadastro</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtos.map(produto => (
                      <tr key={produto._id}>
                        <td>{produto.nome}</td>
                        <td>{produto.preco.toFixed(2)}</td>
                        <td>{produto.descricao}</td>
                        <td>{formatarData(produto.dataCriacao)}</td>
                        <td>
                          <button className="action-button edit" title="Editar">
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button 
                            className="action-button delete" 
                            title="Excluir"
                            onClick={() => handleDeletarProduto(produto._id)}
                            disabled={loading}
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            
            
            <div className="cadastro-produto">
              <h3>Cadastrar Novo Produto</h3>
              <CadastroProduto onProdutoCadastrado={carregarProdutos} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
