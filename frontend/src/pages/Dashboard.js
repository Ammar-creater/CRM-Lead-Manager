import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import LeadTable from '../components/LeadTable';
import AddLeadForm from '../components/AddLeadForm';
import Analytics from '../components/Analytics';
import api from '../services/api';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('leads');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { user, logout } = useAuth();

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await api.get('/leads', {
        params: { page: currentPage, limit: 10, search, status: statusFilter }
      });
      setLeads(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [currentPage, search, statusFilter]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await api.delete(`/leads/${id}`);
        fetchLeads();
      } catch (error) {
        alert('Failed to delete lead');
      }
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.patch(`/leads/${id}/status`, { status: newStatus });
      fetchLeads();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  return (
    <div>
      <nav style={styles.navbar}>
        <div style={styles.navContainer}>
          <span style={styles.logo}>Lead Manager CRM</span>
          <div style={styles.navRight}>
            <span style={styles.welcome}>Welcome, {user?.name}</span>
            <button onClick={logout} style={styles.logoutBtn}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div style={styles.container}>
        <div style={styles.tabs}>
          <button
            style={{...styles.tab, ...(activeTab === 'leads' ? styles.activeTab : {})}}
            onClick={() => setActiveTab('leads')}
          >
            Leads Management
          </button>
          <button
            style={{...styles.tab, ...(activeTab === 'analytics' ? styles.activeTab : {})}}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics Dashboard
          </button>
        </div>

        {activeTab === 'leads' && (
          <>
            <div style={styles.addLeadSection}>
              <AddLeadForm onLeadAdded={fetchLeads} />
            </div>
            
            <LeadTable
              leads={leads}
              loading={loading}
              onDelete={handleDelete}
              onStatusUpdate={handleStatusUpdate}
              search={search}
              setSearch={setSearch}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />
            
            <div style={styles.pagination}>
              <button
                style={styles.pageBtn}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                style={styles.pageBtn}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}

        {activeTab === 'analytics' && <Analytics />}
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    backgroundColor: '#333',
    padding: '15px 0',
    marginBottom: '30px'
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px'
  },
  logo: {
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold'
  },
  navRight: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center'
  },
  welcome: {
    color: '#ddd'
  },
  logoutBtn: {
    padding: '5px 15px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
    borderBottom: '1px solid #ddd'
  },
  tab: {
    padding: '10px 20px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px'
  },
  activeTab: {
    borderBottom: '2px solid #007bff',
    color: '#007bff'
  },
  addLeadSection: {
    marginBottom: '30px'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '30px'
  },
  pageBtn: {
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default Dashboard;