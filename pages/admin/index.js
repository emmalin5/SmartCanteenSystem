/**
 * Admin Dashboard Page
 * Displays user management, transactions, and analytics
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { getAdminUsers, getAdminTransactions, blockCard, unblockCard } from '../../lib/api';
import Loading from '../../components/Loading';
import Error from '../../components/Error';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('users'); // 'users', 'transactions', 'analytics'
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [usersData, transactionsData] = await Promise.all([
        getAdminUsers(),
        getAdminTransactions()
      ]);
      
      setUsers(usersData.users || []);
      setTransactions(transactionsData.transactions || []);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Handle block/unblock card
  const handleCardAction = async (cardId, action) => {
    try {
      setActionLoading(cardId);
      let response;
      
      if (action === 'block') {
        response = await blockCard(cardId);
      } else {
        response = await unblockCard(cardId);
      }
      
      // Update user status in local state
      setUsers(users.map(user => 
        user.cardId === cardId 
          ? { ...user, cardStatus: action === 'block' ? 'blocked' : 'active' }
          : user
      ));
      
      alert(response.message);
    } catch (err) {
      alert(err.message || `Failed to ${action} card`);
    } finally {
      setActionLoading(null);
    }
  };

  // Calculate analytics
  const analytics = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.cardStatus === 'active').length,
    blockedUsers: users.filter(u => u.cardStatus === 'blocked').length,
    totalTransactions: transactions.length,
    totalRevenue: transactions.reduce((sum, txn) => sum + txn.amount, 0),
    averageTransaction: transactions.length > 0 
      ? transactions.reduce((sum, txn) => sum + txn.amount, 0) / transactions.length 
      : 0,
    transactionsByMealType: transactions.reduce((acc, txn) => {
      acc[txn.mealType] = (acc[txn.mealType] || 0) + 1;
      return acc;
    }, {}),
    transactionsByLocation: transactions.reduce((acc, txn) => {
      acc[txn.location] = (acc[txn.location] || 0) + 1;
      return acc;
    }, {})
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Loading message="Loading admin dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <Error message={error} onRetry={fetchData} />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard - Smart Canteen System</title>
        <meta name="description" content="Admin dashboard for Smart Canteen System" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <button
                onClick={fetchData}
                className="btn-secondary"
              >
                Refresh Data
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Analytics Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="text-sm text-blue-700 font-medium">Total Users</div>
              <div className="text-3xl font-bold text-blue-900 mt-2">{analytics.totalUsers}</div>
              <div className="text-xs text-blue-600 mt-1">
                {analytics.activeUsers} active, {analytics.blockedUsers} blocked
              </div>
            </div>
            <div className="card bg-gradient-to-br from-green-50 to-green-100">
              <div className="text-sm text-green-700 font-medium">Total Transactions</div>
              <div className="text-3xl font-bold text-green-900 mt-2">{analytics.totalTransactions}</div>
              <div className="text-xs text-green-600 mt-1">Last 7 days</div>
            </div>
            <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="text-sm text-purple-700 font-medium">Total Revenue</div>
              <div className="text-3xl font-bold text-purple-900 mt-2">
                ₹{analytics.totalRevenue.toFixed(2)}
              </div>
              <div className="text-xs text-purple-600 mt-1">Last 7 days</div>
            </div>
            <div className="card bg-gradient-to-br from-orange-50 to-orange-100">
              <div className="text-sm text-orange-700 font-medium">Avg Transaction</div>
              <div className="text-3xl font-bold text-orange-900 mt-2">
                ₹{analytics.averageTransaction.toFixed(2)}
              </div>
              <div className="text-xs text-orange-600 mt-1">Per transaction</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Users ({users.length})
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'transactions'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Transactions ({transactions.length})
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Analytics
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'users' && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Student Management</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Card ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Balance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transactions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Spent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.cardId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.cardStatus === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {user.cardStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{user.balance.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.totalTransactions}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{user.totalSpent.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {user.cardStatus === 'active' ? (
                            <button
                              onClick={() => handleCardAction(user.cardId, 'block')}
                              disabled={actionLoading === user.cardId}
                              className="btn-danger text-xs py-1 px-2"
                            >
                              {actionLoading === user.cardId ? 'Blocking...' : 'Block'}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleCardAction(user.cardId, 'unblock')}
                              disabled={actionLoading === user.cardId}
                              className="btn-success text-xs py-1 px-2"
                            >
                              {actionLoading === user.cardId ? 'Unblocking...' : 'Unblock'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Transaction History</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Meal Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.slice(0, 50).map((txn) => (
                      <tr key={txn.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(txn.timestamp).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{txn.studentName || txn.studentId}</div>
                          <div className="text-sm text-gray-500">{txn.cardId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {txn.mealType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {txn.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ₹{txn.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {txn.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {transactions.length > 50 && (
                  <div className="mt-4 text-center text-sm text-gray-500">
                    Showing first 50 of {transactions.length} transactions
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Meal Type Distribution */}
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Transactions by Meal Type</h2>
                <div className="space-y-3">
                  {Object.entries(analytics.transactionsByMealType)
                    .sort((a, b) => b[1] - a[1])
                    .map(([mealType, count]) => {
                      const percentage = (count / analytics.totalTransactions) * 100;
                      return (
                        <div key={mealType}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{mealType}</span>
                            <span className="text-sm text-gray-600">{count} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary-500 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Location Distribution */}
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Transactions by Location</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(analytics.transactionsByLocation)
                    .sort((a, b) => b[1] - a[1])
                    .map(([location, count]) => {
                      const percentage = (count / analytics.totalTransactions) * 100;
                      return (
                        <div key={location} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">{location}</span>
                            <span className="text-sm font-bold text-gray-900">{count}</span>
                          </div>
                          <div className="text-xs text-gray-600">{percentage.toFixed(1)}% of total</div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

