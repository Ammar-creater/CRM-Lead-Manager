import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/leads/analytics');
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading analytics...</div>;
  }

  const total = analytics?.overview?.totalLeads || 0;
  const newLeads = analytics?.overview?.newLeads || 0;
  const contacted = analytics?.overview?.contactedLeads || 0;
  const converted = analytics?.overview?.convertedLeads || 0;
  const conversionRate = analytics?.overview?.conversionRate || 0;

  return (
    <div>
      <div style={styles.statsGrid}>
        <div style={{...styles.statCard, backgroundColor: '#007bff'}}>
          <h3 style={styles.statTitle}>Total Leads</h3>
          <div style={styles.statNumber}>{total}</div>
        </div>
        
        <div style={{...styles.statCard, backgroundColor: '#17a2b8'}}>
          <h3 style={styles.statTitle}>New Leads</h3>
          <div style={styles.statNumber}>{newLeads}</div>
        </div>
        
        <div style={{...styles.statCard, backgroundColor: '#ffc107'}}>
          <h3 style={styles.statTitle}>Contacted</h3>
          <div style={styles.statNumber}>{contacted}</div>
        </div>
        
        <div style={{...styles.statCard, backgroundColor: '#28a745'}}>
          <h3 style={styles.statTitle}>Converted</h3>
          <div style={styles.statNumber}>{converted}</div>
        </div>
      </div>

      <div style={styles.chartContainer}>
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Conversion Rate</h3>
          <div style={styles.progressContainer}>
            <div style={{...styles.progressBar, width: `${conversionRate}%`}}>
              {conversionRate}%
            </div>
          </div>
        </div>

        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Lead Distribution</h3>
          <div style={styles.distributionList}>
            <div style={styles.distributionItem}>
              <span>New</span>
              <span style={styles.distributionBadge}>{newLeads}</span>
            </div>
            <div style={styles.distributionItem}>
              <span>Contacted</span>
              <span style={styles.distributionBadge}>{contacted}</span>
            </div>
            <div style={styles.distributionItem}>
              <span>Converted</span>
              <span style={styles.distributionBadge}>{converted}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  statCard: {
    padding: '20px',
    borderRadius: '8px',
    color: 'white',
    textAlign: 'center'
  },
  statTitle: {
    fontSize: '14px',
    marginBottom: '10px',
    opacity: 0.9
  },
  statNumber: {
    fontSize: '36px',
    fontWeight: 'bold'
  },
  chartContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px'
  },
  chartCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  chartTitle: {
    marginBottom: '20px',
    color: '#333',
    fontSize: '18px'
  },
  progressContainer: {
    backgroundColor: '#e9ecef',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  progressBar: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '10px',
    textAlign: 'center',
    transition: 'width 0.3s'
  },
  distributionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  distributionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px'
  },
  distributionBadge: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '4px',
    fontSize: '14px'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px'
  }
};

export default Analytics;