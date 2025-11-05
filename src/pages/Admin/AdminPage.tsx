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
  const [usuarioParaExcluir, setUsuarioParaExcluir] = useState<Usuario | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const [editandoUsuario, setEditandoUsuario] = useState<Usuario | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  // Carregar usuários
  const carregarUsuarios = async () => {
    try {
      console.log('Carregando usuários...');
      const response = await api.get('/usuarios');
      console.log('Usuários carregados:', response.data);
      setUsuarios(response.data);
    } catch (err: any) {
      console.error('Erro ao carregar usuários:', err);
      console.error('Resposta de erro:', err?.response?.data);
      setMensagem({ 
        texto: `Erro ao carregar usuários: ${err?.response?.data?.message || err.message}`, 
        tipo: 'erro' 
      });
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

  const handleEditarUsuario = (usuario: Usuario) => {
    setEditandoUsuario(usuario);
  };

  const handleExcluirUsuario = async () => {
    if (!usuarioParaExcluir) return;
    try {
      console.log('Iniciando exclusão do usuário:', usuarioParaExcluir._id);
      setExcluindo(true);
      const response = await api.delete(`/usuarios/${usuarioParaExcluir._id}`);
      console.log('Resposta da API (excluir):', response);
      setMensagem({ texto: 'Usuário excluído com sucesso!', tipo: 'sucesso' });
      setUsuarioParaExcluir(null);
      await carregarUsuarios();
    } catch (err: any) {
      console.error('Erro ao excluir usuário:', err);
      console.error('Resposta de erro:', err?.response?.data);
      setMensagem({ 
        texto: `Erro ao excluir usuário: ${err?.response?.data?.message || err.message}`, 
        tipo: 'erro' 
      });
    } finally {
      setExcluindo(false);
    }
  };

  const handleSalvarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editandoUsuario) return;
    
    try {
      console.log('Enviando dados para atualização:', editandoUsuario);
      const response = await api.put(`/usuarios/${editandoUsuario._id}`, {
        nome: editandoUsuario.nome,
        email: editandoUsuario.email,
        idade: editandoUsuario.idade
      });
      
      console.log('Resposta da API (atualizar):', response);
      setMensagem({ texto: 'Usuário atualizado com sucesso!', tipo: 'sucesso' });
      setEditandoUsuario(null);
      await carregarUsuarios();
    } catch (err: any) {
      console.error('Erro ao atualizar usuário:', err);
      console.error('Resposta de erro:', err?.response?.data);
      setMensagem({ 
        texto: `Erro ao atualizar usuário: ${err?.response?.data?.message || err.message}`, 
        tipo: 'erro' 
      });
    }
  };

  // Efeito para adicionar/remover a classe no body quando um modal estiver aberto
  useEffect(() => {
    if (editandoUsuario || usuarioParaExcluir || produtoParaExcluir) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [editandoUsuario, usuarioParaExcluir, produtoParaExcluir]);

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="admin-container">
      <h1>Painel de Controle Administrativo</h1>

      {mensagem && (
        <div className={`mensagem ${mensagem.tipo}`}>
          {mensagem.texto}
          <button 
            onClick={() => setMensagem(null)} 
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              marginLeft: '10px',
              color: 'inherit',
              fontSize: '1.2em'
            }}
          >
            &times;
          </button>
        </div>
      )}

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
                            onClick={() => handleEditarUsuario(usuario)}
                          >
                            Editar
                          </button>
                          <button 
                            className="action-button delete" 
                            onClick={() => setUsuarioParaExcluir(usuario)}
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

      {/* Modal de confirmação de exclusão de usuário */}
      {usuarioParaExcluir && (
        <div className="modal-overlay active">
          <div className="modal-content">
            <h3>Confirmar Exclusão</h3>
            <p>Tem certeza que deseja excluir o usuário <strong>{usuarioParaExcluir.nome}</strong>?</p>
            <p className="error-message">Esta ação não pode ser desfeita.</p>
            
            <div className="modal-actions">
              <button 
                className="modal-button cancel"
                onClick={() => setUsuarioParaExcluir(null)}
                disabled={excluindo}
              >
                Cancelar
              </button>
              <button 
                className="modal-button confirm"
                onClick={handleExcluirUsuario}
                disabled={excluindo}
              >
                {excluindo ? 'Excluindo...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de edição de usuário */}
      {editandoUsuario && (
        <div className="modal-overlay active">
          <div className="modal-content">
            <h3>Editar Usuário</h3>
            <form onSubmit={handleSalvarUsuario}>
              <div className="form-group">
                <label>Nome:</label>
                <input
                  type="text"
                  value={editandoUsuario.nome}
                  onChange={(e) => setEditandoUsuario({...editandoUsuario, nome: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={editandoUsuario.email}
                  onChange={(e) => setEditandoUsuario({...editandoUsuario, email: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Idade:</label>
                <input
                  type="number"
                  value={editandoUsuario.idade}
                  onChange={(e) => setEditandoUsuario({...editandoUsuario, idade: parseInt(e.target.value) || 0})}
                  className="form-input"
                  min="1"
                  required
                />
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="modal-button cancel"
                  onClick={() => setEditandoUsuario(null)}
                  disabled={excluindo}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="modal-button save"
                  disabled={excluindo}
                >
                  {excluindo ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Modal de confirmação de exclusão de produto */}
      {produtoParaExcluir && (
        <div className="modal-overlay active">
          <div className="modal-content">
            <h3>Confirmar Exclusão</h3>
            <p>Tem certeza que deseja excluir o produto <strong>{produtoParaExcluir.nome}</strong>?</p>
            <p className="error-message">Esta ação não pode ser desfeita.</p>
            
            <div className="modal-actions">
              <button 
                className="modal-button cancel" 
                onClick={() => setProdutoParaExcluir(null)}
                disabled={excluindo}
              >
                Cancelar
              </button>
              <button 
                className="modal-button confirm" 
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
