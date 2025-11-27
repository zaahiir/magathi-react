// Use relative URL to leverage Vite proxy
const API_BASE_URL = '/api/admin';

class AdminService {
  // Helper method to get headers with auth token
  getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Dashboard endpoints
  async getDashboardStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  // Client Management
  async getAllClients(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/clients?${queryString}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  }

  async createClient(clientData) {
    try {
      const response = await fetch(`${API_BASE_URL}/clients`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(clientData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create client');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  }

  async updateClient(id, clientData) {
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(clientData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update client');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  }

  async deleteClient(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete client');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  }

  // Payment Management
  async getAllPayments(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/payments?${queryString}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  }

  async createPayment(paymentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/payments`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(paymentData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create payment');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  async updatePayment(id, paymentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(paymentData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update payment');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating payment:', error);
      throw error;
    }
  }

  async deletePayment(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete payment');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting payment:', error);
      throw error;
    }
  }

  // Invoice Management
  async getAllInvoices(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/invoices?${queryString}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch invoices');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  }

  async createInvoice(invoiceData) {
    try {
      const response = await fetch(`${API_BASE_URL}/invoices`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(invoiceData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create invoice');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  }

  async updateInvoice(id, invoiceData) {
    try {
      const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(invoiceData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update invoice');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
  }

  async deleteInvoice(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete invoice');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  }

  // Query Management
  async getAllQueries(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/queries?${queryString}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch queries');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching queries:', error);
      throw error;
    }
  }

  async createQuery(queryData) {
    try {
      const response = await fetch(`${API_BASE_URL}/queries`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(queryData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create query');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating query:', error);
      throw error;
    }
  }

  async updateQuery(id, queryData) {
    try {
      const response = await fetch(`${API_BASE_URL}/queries/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(queryData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update query');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating query:', error);
      throw error;
    }
  }

  async deleteQuery(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/queries/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete query');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting query:', error);
      throw error;
    }
  }

  // User Management
  async getAllUsers(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/users?${queryString}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async updateUserStatus(id, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}/status`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({ isActive: status })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user status');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

export default new AdminService();
