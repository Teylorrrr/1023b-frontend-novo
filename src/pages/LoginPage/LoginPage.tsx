import React from 'react';
import Login from '../../componentes/login/login';
import LoginAdm from '../../componentes/login/loginadm';
import '../../componentes/login/login.css';

const LoginPage = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <Login />
      </div>
      <div className="login-box">
        <LoginAdm />
      </div>
    </div>
  );
};

export default LoginPage;
