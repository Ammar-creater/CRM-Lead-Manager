import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    let result;
    if (isLogin) {
      result = await login(email, password);
    } else {
      if (password.length < 8) {
        setError('Password must be at least 8 characters');
        return;
      }
      result = await register(name, email, password);
    }
    
    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{isLogin ? 'Login' : 'Register'}</h2>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Name</label>
              <input
                type="text"
                style={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {!isLogin && (
              <small style={styles.hint}>
                Password must have: uppercase, lowercase, number, special character
              </small>
            )}
          </div>
          
          <button type="submit" style={styles.button}>
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        
        <button
          style={styles.switchButton}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f2f5'
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px'
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333'
  },
  inputGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#555',
    fontWeight: '500'
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px'
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px'
  },
  switchButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: 'transparent',
    color: '#007bff',
    border: 'none',
    cursor: 'pointer',
    marginTop: '15px'
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '20px',
    textAlign: 'center'
  },
  hint: {
    display: 'block',
    marginTop: '5px',
    color: '#666',
    fontSize: '12px'
  }
};

export default Login;