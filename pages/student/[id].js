/**
 * Student Dashboard Page
 * Displays student's meals, usage, notifications, and card management
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getStudentDashboard, reportLostCard } from '../../lib/api';
import Loading from '../../components/Loading';
import Error from '../../components/Error';
import NotificationList from '../../components/NotificationList';
import MealTimeWindow from '../../components/MealTimeWindow';

export default function StudentDashboard() {
  const router = useRouter();
  const { id } = router.query;
  
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [reportForm, setReportForm] = useState({
    reason: '',
    contactNumber: '',
    additionalInfo: ''
  });

  // Fetch dashboard data
  useEffect(() => {
    if (!id) return;

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getStudentDashboard(id);
        setDashboardData(data);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [id]);

  // Handle mark notification as read
  const handleMarkAsRead = (notificationId) => {
    if (!dashboardData) return;
    
    setDashboardData({
      ...dashboardData,
      notifications: dashboardData.notifications.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    });
  };

  // Handle mark all notifications as read
  const handleMarkAllAsRead = () => {
    if (!dashboardData) return;
    
    setDashboardData({
      ...dashboardData,
      notifications: dashboardData.notifications.map(notif => ({ ...notif, read: true }))
    });
  };

  // Handle report lost card
  const handleReportLostCard = async (e) => {
    e.preventDefault();
    
    if (!reportForm.reason || !reportForm.contactNumber) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setReporting(true);
      const response = await reportLostCard(id, reportForm);
      alert(response.message);
      setShowReportModal(false);
      setReportForm({ reason: '', contactNumber: '', additionalInfo: '' });
      
      // Refresh dashboard data
      const data = await getStudentDashboard(id);
      setDashboardData(data);
    } catch (err) {
      alert(err.message || 'Failed to report lost card');
    } finally {
      setReporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Loading message="Loading dashboard..." />
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

  if (!dashboardData) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Student Dashboard - Smart Canteen System</title>
        <meta name="description" content="Student dashboard for Smart Canteen System" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
                <p className="text-sm text-gray-600 mt-1">
                  {dashboardData.studentName} • Card: {dashboardData.cardId}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary-600">
                  ₹{dashboardData.balance.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500">Current Balance</div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Meals Today */}
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Meals Today</h2>
                {dashboardData.mealsToday && dashboardData.mealsToday.length > 0 ? (
                  <div className="space-y-3">
                    {dashboardData.mealsToday.map((meal) => (
                      <div
                        key={meal.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                            <span className="text-primary-600 font-semibold">
                              {meal.mealType.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{meal.mealType}</div>
                            <div className="text-sm text-gray-600">
                              {meal.time} • {meal.location}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">₹{meal.amount.toFixed(2)}</div>
                          <div className="text-xs text-green-600">{meal.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No meals recorded today</p>
                )}
              </div>

              {/* Monthly Usage */}
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Monthly Usage - {dashboardData.monthlyUsage.currentMonth}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-primary-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Total Spent</div>
                    <div className="text-2xl font-bold text-primary-600 mt-1">
                      ₹{dashboardData.monthlyUsage.totalSpent.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Total Meals</div>
                    <div className="text-2xl font-bold text-green-600 mt-1">
                      {dashboardData.monthlyUsage.totalMeals}
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Avg per Meal</div>
                    <div className="text-2xl font-bold text-blue-600 mt-1">
                      ₹{dashboardData.monthlyUsage.averagePerMeal.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Daily Average</div>
                    <div className="text-2xl font-bold text-purple-600 mt-1">
                      ₹{dashboardData.monthlyUsage.dailyAverage.toFixed(2)}
                    </div>
                  </div>
                </div>
                
                {/* Usage Breakdown Chart (Simple) */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Days Breakdown</h3>
                  <div className="space-y-2">
                    {dashboardData.monthlyUsage.breakdown.slice(0, 5).map((day, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-24 text-sm text-gray-600">
                          {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div className="flex-1 mx-4">
                          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary-500 rounded-full"
                              style={{
                                width: `${(day.amount / dashboardData.monthlyUsage.totalSpent) * 100}%`
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="w-20 text-right text-sm font-medium text-gray-900">
                          ₹{day.amount.toFixed(2)}
                        </div>
                        <div className="w-16 text-right text-xs text-gray-500">
                          {day.meals} meals
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Next Meal Window */}
              <MealTimeWindow mealWindow={dashboardData.nextMealWindow} />

              {/* Notifications */}
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Notifications</h2>
                <NotificationList
                  notifications={dashboardData.notifications}
                  onMarkAsRead={handleMarkAsRead}
                  onMarkAllAsRead={handleMarkAllAsRead}
                />
              </div>

              {/* Report Lost Card */}
              <div className="card border-2 border-red-200 bg-red-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Card Management</h3>
                <p className="text-sm text-gray-600 mb-4">
                  If you've lost your card, report it immediately to prevent unauthorized use.
                </p>
                <button
                  onClick={() => setShowReportModal(true)}
                  className="btn-danger w-full"
                >
                  Report Lost Card
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Report Lost Card Modal */}
        {showReportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Report Lost Card</h2>
              <form onSubmit={handleReportLostCard}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reason <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={reportForm.reason}
                      onChange={(e) => setReportForm({ ...reportForm, reason: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    >
                      <option value="">Select a reason</option>
                      <option value="lost">Lost Card</option>
                      <option value="stolen">Stolen Card</option>
                      <option value="damaged">Damaged Card</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={reportForm.contactNumber}
                      onChange={(e) => setReportForm({ ...reportForm, contactNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="+91 9876543210"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Information
                    </label>
                    <textarea
                      value={reportForm.additionalInfo}
                      onChange={(e) => setReportForm({ ...reportForm, additionalInfo: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows="3"
                      placeholder="Any additional details..."
                    ></textarea>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowReportModal(false);
                      setReportForm({ reason: '', contactNumber: '', additionalInfo: '' });
                    }}
                    className="btn-secondary flex-1"
                    disabled={reporting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-danger flex-1"
                    disabled={reporting}
                  >
                    {reporting ? 'Reporting...' : 'Report Card'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

