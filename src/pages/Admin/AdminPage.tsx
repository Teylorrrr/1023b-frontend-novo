import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import CadastroProduto from '../../componentes/produtos/CadastroProduto';
import './AdminPage.css';

interface Usuario {
  _id: string;
  nome: string;
  email: string;
  idade: number;
  isAdmin?: boolean;
}

interface Produto {
  _id: string;
  nome: string;
  preco: number;
  descricao: string;
  urlfoto: string;
}

const AdminPage = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [activeTab, setActiveTab] = useState<'usuarios' | 'produtos'>('usuarios');
  const [loading, setLoading] = useState(true);
  const [produtosLoading, setProdutosLoading] = useState(false);
  const [mensagem, setMensagem] = useState<{ texto: string; tipo: 'sucesso' | 'erro' } | null>(null);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
  const [produtoParaExcluir, setProdutoParaExcluir] = useState<Produto | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  // Carregar usuários
  const carregarUsuarios = async () => {
    try {
      const response = await api.get('/usuarios');
      setUsuarios(response.data);
    } catch (err: any) {
      setMensagem({ texto: 'Erro ao carregar usuários.', tipo: 'erro' });
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
      setMensagem({ texto: 'Erro ao carregar produtos.', tipo: 'erro' });
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

  // Funções de produto
  const handleEditarProduto = (produto: Produto) => {
    setProdutoEditando(produto);
    // Rolar suavemente até o formulário
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleProdutoCadastrado = () => {
    carregarProdutos();
    setMensagem({ texto: 'Produto cadastrado com sucesso!', tipo: 'sucesso' });
  };

  const handleProdutoAtualizado = () => {
    carregarProdutos();
    setMensagem({ texto: 'Produto atualizado com sucesso!', tipo: 'sucesso' });
    setProdutoEditando(null);
  };

  const handleExcluirProduto = async () => {
    if (!produtoParaExcluir) return;
    try {
      setExcluindo(true);
      await api.delete(`/produtos/${produtoParaExcluir._id}`);
      setMensagem({ texto: 'Produto excluído com sucesso!', tipo: 'sucesso' });
      setProdutoParaExcluir(null);
      carregarProdutos();
    } catch (err) {
      console.error(err);
      setMensagem({ texto: 'Erro ao excluir produto.', tipo: 'erro' });
    } finally {
      setExcluindo(false);
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="admin-container">
      <h1>Painel de Controle Administrativo</h1>

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
            <table className="usuarios-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Idade</th>
                  <th>Administrador</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(usuario => (
                  <tr key={usuario._id}>
                    <td>{usuario.nome}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.idade}</td>
                    <td>{usuario.isAdmin ? 'Sim' : 'Não'}</td>
                    <td className="actions-cell">
                      {!usuario.isAdmin && (
                        <>
                          <button 
                            className="action-button edit" 
                            onClick={() => console.log('Editar usuário:', usuario._id)}
                          >
                            Editar
                          </button>
                          <button 
                            className="action-button delete" 
                            onClick={() => console.log('Excluir usuário:', usuario._id)}
                          >
                            Excluir
                          </button>
                        </>
                      )}
                    </td>
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
                  {produtos.map(produto => (
                    <tr key={produto._id}>
                      <td>{produto.nome}</td>
                      <td>{produto.preco.toFixed(2)}</td>
                      <td>{produto.descricao}</td>
                      <td className="actions-cell">
                        <button 
                          className="action-button edit" 
                          onClick={() => handleEditarProduto(produto)}
                        >
                          Editar
                        </button>
                        <button className="action-button delete" onClick={() => setProdutoParaExcluir(produto)}>
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Formulário de cadastro/edição */}
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

      {/* Modal de confirmação de exclusão */}
      {produtoParaExcluir && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmar Exclusão</h3>
            <p>Tem certeza que deseja excluir o produto <strong>{produtoParaExcluir.nome}</strong>?</p>
            <div className="modal-buttons">
              <button 
                className="btn-cancelar" 
                onClick={() => setProdutoParaExcluir(null)}
                disabled={excluindo}
              >
                Cancelar
              </button>
              <button 
                className="btn-confirmar" 
                onClick={handleExcluirProduto}
                disabled={excluindo}
              >
                {excluindo ? 'Excluindo...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
