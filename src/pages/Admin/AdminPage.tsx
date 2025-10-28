import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

interface Usuario {
  _id: string;
  nome: string;
  email: string;
  idade: number;
}

const AdminPage = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    
    if (!token || !isAdmin) {
      navigate('/login', { 
        state: { mensagem: 'Acesso negado. Faça login como administrador.' } 
      });
      return;
    }

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

    carregarUsuarios();
  }, [navigate]);

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="admin-container">
      <h1>Painel de Controle Administrativo</h1>
      
      {error && <div className="error-message">{error}</div>}
      
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
    </div>
  );
};

export default AdminPage;
