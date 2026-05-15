import React from 'react';

function LeadTable({ leads, loading, onDelete, onStatusUpdate, search, setSearch, statusFilter, setStatusFilter }) {
  
  const getStatusBadge = (status) => {
    const colors = {
      new: '#007bff',
      contacted: '#ffc107',
      converted: '#28a745'
    };
    return {
      backgroundColor: colors[status],
      padding: '5px 10px',
      borderRadius: '4px',
      color: status === 'contacted' ? '#333' : 'white',
      fontSize: '12px',
      fontWeight: 'bold'
    };
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div>
      <div style={styles.filters}>
        <input
          type="text"
          style={styles.searchInput}
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        <select
          style={styles.filterSelect}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
        </select>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Assigned To</th>
              <th style={styles.th}>Created</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan="7" style={styles.noData}>No leads found</td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead._id} style={styles.tableRow}>
                  <td style={styles.td}><strong>{lead.name}</strong></td>
                  <td style={styles.td}>{lead.email}</td>
                  <td style={styles.td}>{lead.phone}</td>
                  <td style={styles.td}>
                    <select
                      style={styles.statusSelect}
                      value={lead.status}
                      onChange={(e) => onStatusUpdate(lead._id, e.target.value)}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="converted">Converted</option>
                    </select>
                  </td>
                  <td style={styles.td}>{lead.assignedToName || 'Unassigned'}</td>
                  <td style={styles.td}>{new Date(lead.createdAt).toLocaleDateString()}</td>
                  <td style={styles.td}>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => onDelete(lead._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  filters: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px'
  },
  searchInput: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  filterSelect: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    width: '150px'
  },
  tableContainer: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white'
  },
  tableHeader: {
    backgroundColor: '#f8f9fa',
    borderBottom: '2px solid #dee2e6'
  },
  th: {
    padding: '12px',
    textAlign: 'left',
    fontWeight: '600'
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #dee2e6'
  },
  tableRow: {
    transition: 'background-color 0.3s'
  },
  statusSelect: {
    padding: '5px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    cursor: 'pointer'
  },
  deleteBtn: {
    padding: '5px 10px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px'
  },
  noData: {
    textAlign: 'center',
    padding: '40px',
    color: '#666'
  }
};

export default LeadTable;