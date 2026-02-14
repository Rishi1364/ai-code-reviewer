import React from 'react';
import { signInWithGoogle } from '../../firebase'; // This goes up one folder to find firebase.js

const Login = () => {
  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0d1117' }}>
      <div style={{ padding: '40px', backgroundColor: '#161b22', borderRadius: '10px', border: '1px solid #30363d', textAlign: 'center' }}>
        <h1 style={{ color: '#fff', marginBottom: '20px' }}>AI Code Reviewer</h1>
        <button 
          onClick={signInWithGoogle} 
          style={{ padding: '12px 24px', fontSize: '16px', cursor: 'pointer', borderRadius: '5px', border: 'none', fontWeight: 'bold' }}
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;