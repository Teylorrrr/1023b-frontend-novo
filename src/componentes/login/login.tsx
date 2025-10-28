import React, { useState } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/api";
import './login.css';

function Login() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const mensagem = searchParams.get("mensagem");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;
        const senha = formData.get("senha") as string;
        const redirectUrl = searchParams.get('redirect') || '/';
        
        try {
            const resposta = await api.post("/login", { email, senha });
            if (resposta.status === 200) {
                localStorage.setItem("token", resposta?.data?.token);
                window.location.href = redirectUrl;
            }
        } catch (error: any) {
            const msg = error?.response?.data?.mensagem || 
                       error?.mensagem || 
                       "Erro ao realizar login. Tente novamente.";
            navigate(`/login?redirect=${encodeURIComponent(redirectUrl)}&mensagem=${encodeURIComponent(msg)}`);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="login-form">
            <h2>Área do Cliente</h2>
            {mensagem && <div className="error-message">{mensagem}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">E-mail</label>
                    <input 
                        type="email" 
                        name="email" 
                        id="email" 
                        placeholder="Digite seu e-mail"
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="senha">Senha</label>
                    <input 
                        type="password" 
                        name="senha" 
                        id="senha" 
                        placeholder="Digite sua senha"
                        required 
                    />
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Entrando...' : 'Acessar Minha Conta'}
                </button>
            </form>
        </div>
    );
}
export default Login;