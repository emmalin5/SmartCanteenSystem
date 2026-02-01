/**
 * Restaurant Owner Dashboard Page
 * Displays menu performance, recent orders, and inventory alerts
 */

import { useEffect, useState } from 'react';
import Head from 'next/head';
import {
  getOwnerDashboard,
  getOwnerStudents,
  getOwnerMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} from '../../lib/api';
import Loading from '../../components/Loading';
import Error from '../../components/Error';

export default function RestaurantOwnerDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [students, setStudents] = useState([]);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [menuModalMode, setMenuModalMode] = useState('create');
  const [editingMenuId, setEditingMenuId] = useState(null);
  const [menuForm, setMenuForm] = useState({
    id: '',
    name: '',
    category: '',
    price: '',
    stock: '',
    available: true
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const [dashboardData, menuData, studentsData] = await Promise.all([
          getOwnerDashboard(),
          getOwnerMenuItems(),
          getOwnerStudents()
        ]);
        setDashboard(dashboardData);
        setMenuItems(menuData.menuItems || []);
        setStudents(studentsData.students || []);
      } catch (err) {
        setError(err.message || 'Failed to load owner dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Loading message="Loading restaurant owner dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <Error message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  const { ownerName, restaurantName, restaurantId, summary, recentOrders } = dashboard;

  const activeMenuItems = menuItems.filter((item) => item.available).length;
  const lowStockItems = menuItems.filter((item) => item.stock <= 10);

  const now = new Date();
  const assignedThisMonth = students.filter((student) => {
    if (!student.restaurantAssignedAt || !student.restaurantId) return false;
    const assignedDate = new Date(student.restaurantAssignedAt);
    return (
      student.restaurantId === restaurantId &&
      assignedDate.getFullYear() === now.getFullYear() &&
      assignedDate.getMonth() === now.getMonth()
    );
  });

  const resetMenuForm = () => {
    setMenuForm({ id: '', name: '', category: '', price: '', stock: '', available: true });
    setEditingMenuId(null);
    setMenuModalMode('create');
  };

  const openMenuModal = () => {
    resetMenuForm();
    setMenuModalMode('create');
    setShowMenuModal(true);
  };

  const closeMenuModal = () => {
    setShowMenuModal(false);
    resetMenuForm();
  };

  const handleMenuEdit = (item) => {
    setEditingMenuId(item.id);
    setMenuModalMode('edit');
    setShowMenuModal(true);
    setMenuForm({
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      stock: item.stock,
      available: item.available
    });
  };

  const handleMenuDelete = async (itemId) => {
    const confirmDelete = window.confirm('Delete this menu item?');
    if (!confirmDelete) return;

    try {
      await deleteMenuItem(itemId);
      setMenuItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      alert(err.message || 'Failed to delete menu item');
    }
  };

  const handleMenuSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...menuForm,
        price: menuForm.price === '' ? 0 : Number(menuForm.price),
        stock: menuForm.stock === '' ? 0 : Number(menuForm.stock),
        available: Boolean(menuForm.available)
      };

      if (editingMenuId) {
        const updated = await updateMenuItem(editingMenuId, payload);
        setMenuItems((prev) => prev.map((item) => (item.id === editingMenuId ? updated : item)));
      } else {
        const created = await createMenuItem(payload);
        setMenuItems((prev) => [created, ...prev]);
      }

      closeMenuModal();
    } catch (err) {
      alert(err.message || 'Failed to save menu item');
    }
  };

  return (
    <>
      <Head>
        <title>Restaurant Owner Dashboard - Smart Canteen System</title>
        <meta name="description" content="Restaurant owner dashboard for Smart Canteen System" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Restaurant Owner Dashboard</h1>
                <p className="text-sm text-gray-600 mt-1">
                  {ownerName} • {restaurantName}
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Today&apos;s Revenue</div>
                <div className="text-2xl font-bold text-primary-600">₹{summary.totalRevenue.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card bg-gradient-to-br from-green-50 to-green-100">
              <div className="text-sm text-green-700 font-medium">Total Orders</div>
              <div className="text-3xl font-bold text-green-900 mt-2">{summary.totalOrders}</div>
              <div className="text-xs text-green-600 mt-1">Last 24 hours</div>
            </div>
            <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="text-sm text-blue-700 font-medium">Average Order</div>
              <div className="text-3xl font-bold text-blue-900 mt-2">₹{summary.avgOrderValue.toFixed(2)}</div>
              <div className="text-xs text-blue-600 mt-1">Per order</div>
            </div>
            <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="text-sm text-purple-700 font-medium">Active Menu Items</div>
              <div className="text-3xl font-bold text-purple-900 mt-2">{activeMenuItems}</div>
              <div className="text-xs text-purple-600 mt-1">Currently available</div>
            </div>
            <div className="card bg-gradient-to-br from-orange-50 to-orange-100">
              <div className="text-sm text-orange-700 font-medium">Low Stock</div>
              <div className="text-3xl font-bold text-orange-900 mt-2">{lowStockItems.length}</div>
              <div className="text-xs text-orange-600 mt-1">Needs restock</div>
            </div>
            <div className="card bg-gradient-to-br from-emerald-50 to-emerald-100">
              <div className="text-sm text-emerald-700 font-medium">Students This Month</div>
              <div className="text-3xl font-bold text-emerald-900 mt-2">{assignedThisMonth.length}</div>
              <div className="text-xs text-emerald-600 mt-1">Selected your restaurant</div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="card">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Menu Items</h2>
                <span className="text-sm text-gray-500">{menuItems.length} items</span>
              </div>
              <button className="btn-success" onClick={openMenuModal}>
                Add Menu Item
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {menuItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{item.price.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.stock}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.available ? 'available' : 'unavailable'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-wrap gap-2">
                          <button className="btn-secondary text-xs" onClick={() => handleMenuEdit(item)}>
                            Edit
                          </button>
                          <button className="btn-danger text-xs" onClick={() => handleMenuDelete(item.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Orders & Low Stock */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Orders</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                          <div className="text-xs text-gray-500">{order.time}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customerName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.itemsCount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{order.total.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              order.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'preparing'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Low Stock Alerts</h2>
              <div className="space-y-3">
                {lowStockItems.length === 0 && (
                  <p className="text-sm text-gray-500">All items are well stocked.</p>
                )}
                {lowStockItems.map((item) => (
                  <div key={item.id} className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.category}</div>
                      </div>
                      <div className="text-sm font-semibold text-orange-700">{item.stock} left</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Students Assigned This Month</h2>
              <span className="text-sm text-gray-500">{assignedThisMonth.length} students</span>
            </div>
            {assignedThisMonth.length === 0 ? (
              <p className="text-sm text-gray-500">No students have selected your restaurant this month.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Card ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned On</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {assignedThisMonth.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-xs text-gray-500">{student.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.cardId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(student.restaurantAssignedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>

        {showMenuModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {menuModalMode === 'edit' ? 'Update Menu Item' : 'Add Menu Item'}
                  </h3>
                  <button
                    onClick={closeMenuModal}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>
                <form onSubmit={handleMenuSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Item ID (optional)"
                    value={menuForm.id}
                    onChange={(e) => setMenuForm({ ...menuForm, id: e.target.value })}
                    disabled={Boolean(editingMenuId)}
                    className="input"
                  />
                  <input
                    type="text"
                    placeholder="Item name"
                    value={menuForm.name}
                    onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                    className="input"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    value={menuForm.category}
                    onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })}
                    className="input"
                    required
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Price"
                    value={menuForm.price}
                    onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })}
                    className="input"
                  />
                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Stock"
                    value={menuForm.stock}
                    onChange={(e) => setMenuForm({ ...menuForm, stock: e.target.value })}
                    className="input"
                  />
                  <select
                    value={menuForm.available ? 'available' : 'unavailable'}
                    onChange={(e) => setMenuForm({ ...menuForm, available: e.target.value === 'available' })}
                    className="input"
                  >
                    <option value="available">available</option>
                    <option value="unavailable">unavailable</option>
                  </select>
                  <div className="md:col-span-2 flex justify-end gap-2">
                    <button type="button" className="btn-secondary" onClick={closeMenuModal}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      {menuModalMode === 'edit' ? 'Update Item' : 'Add Item'}
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
