import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Registro.css'; 

const Registro = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleRegistro = async (e) => {
    e.preventDefault();
    setMensaje('Procesando...');

    const formData = new URLSearchParams();
    formData.append('user', usuario);
    formData.append('password', password);
    formData.append('tipo', 'administrador'); // Modificar a administrador si queremos probar acceso a nuevas cuentas creadas o viceversa a usuario

    try {
      const response = await fetch('/Registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const data = await response.json();

      if (data.status === 'yes') {
        setMensaje('¡Cuenta creada con éxito! Redirigiendo...');
        setTimeout(() => {
          navigate('/Login');
        }, 2000);
      } else {
        setMensaje(data.message || 'Error al crear la cuenta.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje('Error de conexión con el servidor.');
    }
  };

  return (
    <div className="registro-background">
      
      <div className="registro-card">
        <h2 className="registro-title">CREAR CUENTA</h2>
        
        <form onSubmit={handleRegistro} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label className="registro-label">Nuevo Usuario</label>
            <input 
              type="text" 
              className="registro-input"
              placeholder="Ingrese el usuario" 
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required 
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label className="registro-label">Password</label>
            <input 
              type="password" 
              className="registro-input"
              placeholder="Ingrese su contraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="registro-button">
            Registrarse
          </button>

        </form>

        {mensaje && (
          <p style={{ color: '#ffffff', marginTop: '15px', textAlign: 'center', fontWeight: '500', textShadow: '0 1px 3px rgba(0, 0, 0, 0.55)' }}>
            {mensaje}
          </p>
        )}
        
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button 
            type="button"
            onClick={() => navigate('/Login')} 
            style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', textDecoration: 'underline', fontWeight: '500', textShadow: '0 1px 3px rgba(0, 0, 0, 0.55)' }}
          >
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </div>

      </div>
    </div>
  );
};

export default Registro;