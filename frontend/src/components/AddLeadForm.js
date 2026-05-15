import React, { useState, useEffect } from 'react';
import api from '../services/api';

function AddLeadForm({ onLeadAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    assignedTo: '',
    notes: '',
    source: 'other'
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/leads/users');
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      setError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    try {
      await api.post('/leads', formData);
      setFormData({ name: '', email: '', phone: '', assignedTo: '', notes: '', source: 'other' });
      onLeadAdded();
      alert('Lead added successfully!');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to add lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>Add New Lead</h3>
      
      {error && <div style={styles.error}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div style={styles.row}>
          <div style={styles.col}>
            <label style={styles.label}>Name *</label>
            <input
              type="text"
              name="name"
              style={styles.input}
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div style={styles.col}>
            <label style={styles.label}>Email *</label>
            <input
              type="email"
              name="email"
              style={styles.input}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div style={styles.col}>
            <label style={styles.label}>Phone *</label>
            <input
              type="tel"
              name="phone"
              style={styles.input}
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div style={styles.row}>
          <div style={styles.col}>
            <label style={styles.label}>Assign To</label>
            <select
              name="assignedTo"
              style={styles.input}
              value={formData.assignedTo}
              onChange={handleChange}
            >
              <option value="">Unassigned</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>{user.name}</option>
              ))}
            </select>
          </div>
          
          <div style={styles.col}>
            <label style={styles.label}>Source</label>
            <select
              name="source"
              style={styles.input}
              value={formData.source}
              onChange={handleChange}
            >
              <option value="website">Website</option>
              <option value="referral">Referral</option>
              <option value="cold_call">Cold Call</option>
              <option value="email">Email</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        
        <div style={styles.row}>
          <div style={styles.fullCol}>
            <label style={styles.label}>Notes (Optional)</label>
            <textarea
              name="notes"
              style={styles.textarea}
              rows="3"
              value={formData.notes}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
        
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Adding...' : 'Add Lead'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  cardTitle: {
    marginBottom: '20px',
    color: '#333'
  },
  row: {
    display: 'flex',
    gap: '15px',
    marginBottom: '15px',
    flexWrap: 'wrap'
  },
  col: {
    flex: 1,
    minWidth: '200px'
  },
  fullCol: {
    width: '100%'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#555',
    fontWeight: '500'
  },
  input: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  textarea: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    resize: 'vertical'
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px'
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '15px'
  }
};

export default AddLeadForm;