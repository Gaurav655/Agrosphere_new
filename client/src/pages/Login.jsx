import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../api';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', role: 'farmer' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const data = await loginUser(formData.email, formData.password);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
      } else {
        const data = await registerUser(formData);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '40px' }}>
      <div className="card" style={{ padding: '32px' }}>
        <h2 className="text-center mb-4">{isLogin ? 'Welcome Back to AgroSphere' : 'Join AgroSphere'}</h2>
        
        {error && <div style={{ color: 'var(--color-danger)', backgroundColor: '#ffe5e5', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="flex-col gap-2">
          {!isLogin && (
            <>
              <label>Full Name</label>
              <input type="text" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required={!isLogin} />
              
              <label className="mt-2">I am a:</label>
              <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                <option value="farmer">Farmer (Looking to Rent)</option>
                <option value="owner">Equipment Owner (Looking to List)</option>
              </select>
            </>
          )}

          <label className={!isLogin ? "mt-2" : ""}>Email Address</label>
          <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />

          <label className="mt-2">Password</label>
          <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />

          <button type="submit" className="btn btn-primary mt-4" style={{ width: '100%', fontSize: '1.2rem', padding: '18px' }}>
            {isLogin ? 'Login Now' : 'Create Account'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p style={{ cursor: 'pointer', color: 'var(--color-primary)' }} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
