/**
 * Admin Dashboard Page
 * Displays user management, transactions, and analytics
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  getAdminStudents,
  getAdminTransactions,
  getAdminRestaurants,
  createStudent,
  updateStudent,
  deleteStudent,
  topUpStudentBalance,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  blockCard,
  unblockCard
} from '../../lib/api';
import Loading from '../../components/Loading';
import Error from '../../components/Error';

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('transactions'); // 'students', 'transactions', 'restaurants'
  const [actionLoading, setActionLoading] = useState(null);
  const [studentForm, setStudentForm] = useState({
    id: '',
    name: '',
    email: '',
    cardId: '',
    balance: '',
    cardStatus: 'active',
    restaurantId: '',
    restaurantAssignedAt: ''
  });
  const [restaurantForm, setRestaurantForm] = useState({
    id: '',
    name: '',
    location: '',
    ownerName: '',
    status: 'active',
    openingHours: ''
  });
  const [showRestaurantModal, setShowRestaurantModal] = useState(false);
  const [restaurantModalMode, setRestaurantModalMode] = useState('create');
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [studentModalMode, setStudentModalMode] = useState('create');
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpStudent, setTopUpStudent] = useState(null);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [restaurantSearch, setRestaurantSearch] = useState('');
  const [transactionSearch, setTransactionSearch] = useState('');
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editingRestaurantId, setEditingRestaurantId] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [studentsData, transactionsData, restaurantsData] = await Promise.all([
        getAdminStudents(),
        getAdminTransactions(),
        getAdminRestaurants()
      ]);

      setStudents(studentsData.students || []);
      setTransactions(transactionsData.transactions || []);
      setRestaurants(restaurantsData.restaurants || []);
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
      setStudents(students.map(user => 
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
    totalUsers: students.length,
    activeUsers: students.filter(u => u.cardStatus === 'active').length,
    blockedUsers: students.filter(u => u.cardStatus === 'blocked').length,
    totalTransactions: transactions.length,
    totalRevenue: transactions.reduce((sum, txn) => sum + txn.amount, 0),
    averageTransaction: transactions.length > 0 
      ? transactions.reduce((sum, txn) => sum + txn.amount, 0) / transactions.length 
      : 0
  };

  const filteredStudents = students.filter((student) => {
    if (!studentSearch.trim()) return true;
    const query = studentSearch.toLowerCase();
    return [
      student.id,
      student.name,
      student.email,
      student.cardId
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));
  });

  const filteredRestaurants = restaurants.filter((restaurant) => {
    if (!restaurantSearch.trim()) return true;
    const query = restaurantSearch.toLowerCase();
    return [
      restaurant.id,
      restaurant.name,
      restaurant.location,
      restaurant.ownerName
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));
  });

  const filteredTransactions = transactions.filter((txn) => {
    if (!transactionSearch.trim()) return true;
    const query = transactionSearch.toLowerCase();
    return [
      txn.id,
      txn.studentName,
      txn.studentId,
      txn.cardId,
      txn.mealType,
      txn.location,
      txn.status
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));
  });


  const resetStudentForm = () => {
    setStudentForm({
      id: '',
      name: '',
      email: '',
      cardId: '',
      balance: '',
      cardStatus: 'active',
      restaurantId: '',
      restaurantAssignedAt: ''
    });
    setEditingStudentId(null);
    setStudentModalMode('create');
  };

  const resetRestaurantForm = () => {
    setRestaurantForm({ id: '', name: '', location: '', ownerName: '', status: 'active', openingHours: '' });
    setEditingRestaurantId(null);
    setRestaurantModalMode('create');
  };

  const handleStudentSubmit = async (event) => {
    event.preventDefault();
    try {
      setActionLoading('student-form');
      const payload = {
        ...studentForm,
        balance: studentForm.balance === '' ? 0 : Number(studentForm.balance)
      };

      if (payload.restaurantId) {
        payload.restaurantAssignedAt = new Date().toISOString();
      }

      if (editingStudentId) {
        const updated = await updateStudent(editingStudentId, payload);
        setStudents((prev) => prev.map((student) => (student.id === editingStudentId ? updated : student)));
      } else {
        const created = await createStudent(payload);
        setStudents((prev) => [created, ...prev]);
      }
      resetStudentForm();
      setShowStudentModal(false);
    } catch (err) {
      alert(err.message || 'Failed to save student');
    } finally {
      setActionLoading(null);
    }
  };

  const handleStudentEdit = (student) => {
    setEditingStudentId(student.id);
    setStudentModalMode('edit');
    setShowStudentModal(true);
    setStudentForm({
      id: student.id,
      name: student.name,
      email: student.email,
      cardId: student.cardId,
      balance: student.balance,
      cardStatus: student.cardStatus,
      restaurantId: student.restaurantId || '',
      restaurantAssignedAt: student.restaurantAssignedAt || ''
    });
  };

  const openStudentModal = () => {
    resetStudentForm();
    setStudentModalMode('create');
    setShowStudentModal(true);
  };

  const closeStudentModal = () => {
    setShowStudentModal(false);
    resetStudentForm();
  };

  const handleStudentDelete = async (studentId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this student?');
    if (!confirmDelete) return;

    try {
      setActionLoading(studentId);
      await deleteStudent(studentId);
      setStudents((prev) => prev.filter((student) => student.id !== studentId));
    } catch (err) {
      alert(err.message || 'Failed to delete student');
    } finally {
      setActionLoading(null);
    }
  };

  const openTopUpModal = (student) => {
    setTopUpStudent(student);
    setTopUpAmount('');
    setShowTopUpModal(true);
  };

  const closeTopUpModal = () => {
    setShowTopUpModal(false);
    setTopUpStudent(null);
    setTopUpAmount('');
  };

  const handleTopUp = async () => {
    if (!topUpStudent) return;

    const amount = Number(topUpAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      alert('Enter a valid amount');
      return;
    }

    try {
      setActionLoading(`topup-${topUpStudent.id}`);
      const updated = await topUpStudentBalance(topUpStudent.id, amount);
      setStudents((prev) => prev.map((student) => (student.id === topUpStudent.id ? updated : student)));
      closeTopUpModal();
    } catch (err) {
      alert(err.message || 'Failed to add amount');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRestaurantSubmit = async (event) => {
    event.preventDefault();
    try {
      setActionLoading('restaurant-form');
      const payload = { ...restaurantForm };

      if (editingRestaurantId) {
        const updated = await updateRestaurant(editingRestaurantId, payload);
        setRestaurants((prev) => prev.map((restaurant) => (restaurant.id === editingRestaurantId ? updated : restaurant)));
      } else {
        const created = await createRestaurant(payload);
        setRestaurants((prev) => [created, ...prev]);
      }
      resetRestaurantForm();
      setShowRestaurantModal(false);
    } catch (err) {
      alert(err.message || 'Failed to save restaurant');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRestaurantEdit = (restaurant) => {
    setEditingRestaurantId(restaurant.id);
    setRestaurantModalMode('edit');
    setShowRestaurantModal(true);
    setRestaurantForm({
      id: restaurant.id,
      name: restaurant.name,
      location: restaurant.location,
      ownerName: restaurant.ownerName,
      status: restaurant.status,
      openingHours: restaurant.openingHours || ''
    });
  };

  const openRestaurantModal = () => {
    resetRestaurantForm();
    setRestaurantModalMode('create');
    setShowRestaurantModal(true);
  };

  const closeRestaurantModal = () => {
    setShowRestaurantModal(false);
    resetRestaurantForm();
  };

  const handleRestaurantDelete = async (restaurantId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this restaurant?');
    if (!confirmDelete) return;

    try {
      setActionLoading(restaurantId);
      await deleteRestaurant(restaurantId);
      setRestaurants((prev) => prev.filter((restaurant) => restaurant.id !== restaurantId));
    } catch (err) {
      alert(err.message || 'Failed to delete restaurant');
    } finally {
      setActionLoading(null);
    }
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
                onClick={() => setActiveTab('students')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'students'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Students ({students.length})
              </button>
              <button
                onClick={() => setActiveTab('restaurants')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'restaurants'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Restaurants ({restaurants.length})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              <div className="card">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Student Management</h2>
                    <p className="text-sm text-gray-500">Create, update, block/unblock, and add balance.</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Search students by name, email, ID, or card"
                    className="input md:max-w-md"
                  />
                  <button className="btn-success" onClick={openStudentModal}>
                    Add Student
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Card ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurant</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Top Up</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.cardId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {restaurants.find((restaurant) => restaurant.id === student.restaurantId)?.name || '—'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                student.cardStatus === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {student.cardStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{Number(student.balance || 0).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => openTopUpModal(student)}
                              className="btn-success text-xs"
                              disabled={actionLoading === `topup-${student.id}`}
                            >
                              Top Up
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex flex-wrap gap-2">
                              {student.cardStatus === 'active' ? (
                                <button
                                  onClick={() => handleCardAction(student.cardId, 'block')}
                                  disabled={actionLoading === student.cardId}
                                  className="btn-danger text-xs"
                                >
                                  {actionLoading === student.cardId ? 'Blocking...' : 'Block'}
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleCardAction(student.cardId, 'unblock')}
                                  disabled={actionLoading === student.cardId}
                                  className="btn-success text-xs"
                                >
                                  {actionLoading === student.cardId ? 'Unblocking...' : 'Unblock'}
                                </button>
                              )}
                              <button
                                onClick={() => handleStudentEdit(student)}
                                className="btn-secondary text-xs"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleStudentDelete(student.id)}
                                disabled={actionLoading === student.id}
                                className="btn-danger text-xs"
                              >
                                {actionLoading === student.id ? 'Deleting...' : 'Delete'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="card">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
                <input
                  type="text"
                  value={transactionSearch}
                  onChange={(e) => setTransactionSearch(e.target.value)}
                  placeholder="Search by student, card, meal, location, status"
                  className="input md:max-w-md"
                />
              </div>
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
                    {filteredTransactions.slice(0, 50).map((txn) => (
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
                {filteredTransactions.length > 50 && (
                  <div className="mt-4 text-center text-sm text-gray-500">
                    Showing first 50 of {filteredTransactions.length} transactions
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'restaurants' && (
            <div className="space-y-6">
              <div className="card">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Restaurant Management</h2>
                    <p className="text-sm text-gray-500">Create, update, or remove restaurants.</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <input
                    type="text"
                    value={restaurantSearch}
                    onChange={(e) => setRestaurantSearch(e.target.value)}
                    placeholder="Search restaurants by name, location, owner, or ID"
                    className="input md:max-w-md"
                  />
                  <button className="btn-success" onClick={openRestaurantModal}>
                    Add Restaurant
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurant</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opening Hours</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredRestaurants.map((restaurant) => (
                        <tr key={restaurant.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{restaurant.name}</div>
                            <div className="text-xs text-gray-500">{restaurant.id}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{restaurant.location}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{restaurant.ownerName}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                restaurant.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {restaurant.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {restaurant.openingHours || '—'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => handleRestaurantEdit(restaurant)}
                                className="btn-secondary text-xs"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleRestaurantDelete(restaurant.id)}
                                disabled={actionLoading === restaurant.id}
                                className="btn-danger text-xs"
                              >
                                {actionLoading === restaurant.id ? 'Deleting...' : 'Delete'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>

        {showTopUpModal && topUpStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Add Balance</h3>
                  <button
                    onClick={closeTopUpModal}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    {topUpStudent.name} • {topUpStudent.id}
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    className="input"
                    placeholder="Enter amount"
                  />
                  <div className="flex justify-end gap-2">
                    <button className="btn-secondary" onClick={closeTopUpModal}>
                      Cancel
                    </button>
                    <button
                      className="btn-success"
                      onClick={handleTopUp}
                      disabled={actionLoading === `topup-${topUpStudent.id}`}
                    >
                      {actionLoading === `topup-${topUpStudent.id}` ? 'Adding...' : 'Add Amount'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showStudentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {studentModalMode === 'edit' ? 'Update Student' : 'Add Student'}
                  </h3>
                  <button
                    onClick={closeStudentModal}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>
                <form onSubmit={handleStudentSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Student ID (optional)"
                    value={studentForm.id}
                    onChange={(e) => setStudentForm({ ...studentForm, id: e.target.value })}
                    disabled={Boolean(editingStudentId)}
                    className="input"
                  />
                  <input
                    type="text"
                    placeholder="Name"
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                    className="input"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                    className="input"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Card ID (optional)"
                    value={studentForm.cardId}
                    onChange={(e) => setStudentForm({ ...studentForm, cardId: e.target.value })}
                    className="input"
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Balance"
                    value={studentForm.balance}
                    onChange={(e) => setStudentForm({ ...studentForm, balance: e.target.value })}
                    className="input"
                  />
                  <select
                    value={studentForm.cardStatus}
                    onChange={(e) => setStudentForm({ ...studentForm, cardStatus: e.target.value })}
                    className="input"
                  >
                    <option value="active">active</option>
                    <option value="blocked">blocked</option>
                  </select>
                  <select
                    value={studentForm.restaurantId}
                    onChange={(e) => setStudentForm({ ...studentForm, restaurantId: e.target.value })}
                    className="input"
                  >
                    <option value="">Select restaurant</option>
                    {restaurants.map((restaurant) => (
                      <option key={restaurant.id} value={restaurant.id}>
                        {restaurant.name}
                      </option>
                    ))}
                  </select>
                  <div className="md:col-span-2 flex justify-end gap-2">
                    <button type="button" className="btn-secondary" onClick={closeStudentModal}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary" disabled={actionLoading === 'student-form'}>
                      {studentModalMode === 'edit' ? 'Update Student' : 'Add Student'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {showRestaurantModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {restaurantModalMode === 'edit' ? 'Update Restaurant' : 'Add Restaurant'}
                  </h3>
                  <button
                    onClick={closeRestaurantModal}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>
                <form onSubmit={handleRestaurantSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Restaurant ID (optional)"
                    value={restaurantForm.id}
                    onChange={(e) => setRestaurantForm({ ...restaurantForm, id: e.target.value })}
                    disabled={Boolean(editingRestaurantId)}
                    className="input"
                  />
                  <input
                    type="text"
                    placeholder="Restaurant Name"
                    value={restaurantForm.name}
                    onChange={(e) => setRestaurantForm({ ...restaurantForm, name: e.target.value })}
                    className="input"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={restaurantForm.location}
                    onChange={(e) => setRestaurantForm({ ...restaurantForm, location: e.target.value })}
                    className="input"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Owner Name"
                    value={restaurantForm.ownerName}
                    onChange={(e) => setRestaurantForm({ ...restaurantForm, ownerName: e.target.value })}
                    className="input"
                    required
                  />
                  <select
                    value={restaurantForm.status}
                    onChange={(e) => setRestaurantForm({ ...restaurantForm, status: e.target.value })}
                    className="input"
                  >
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Opening Hours (e.g. 08:00-20:00)"
                    value={restaurantForm.openingHours}
                    onChange={(e) => setRestaurantForm({ ...restaurantForm, openingHours: e.target.value })}
                    className="input"
                  />
                  <div className="md:col-span-2 flex justify-end gap-2">
                    <button type="button" className="btn-secondary" onClick={closeRestaurantModal}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary" disabled={actionLoading === 'restaurant-form'}>
                      {restaurantModalMode === 'edit' ? 'Update Restaurant' : 'Add Restaurant'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}



