/**
 * Home Page / Landing Page
 * Provides navigation to student and admin dashboards
 */

import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>Smart Canteen System - RFID Cashless Payment</title>
        <meta name="description" content="RFID-based IoT cashless university canteen payment system" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Smart Canteen System
            </h1>
            <p className="text-xl text-gray-600">
              RFID-based IoT Cashless University Canteen Payment System
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Access Dashboard
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Student Dashboard Card */}
              <Link href="/student/STU001">
                <div className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer border-2 border-primary-200 hover:border-primary-400">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Student Dashboard</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      View meals, transactions, notifications, and manage your card
                    </p>
                    <div className="btn-primary inline-block">
                      Go to Dashboard
                    </div>
                  </div>
                </div>
              </Link>

              {/* Admin Dashboard Card */}
              <Link href="/admin">
                <div className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer border-2 border-purple-200 hover:border-purple-400">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Admin Dashboard</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Manage users, view transactions, and access analytics
                    </p>
                    <div className="btn-primary inline-block bg-purple-600 hover:bg-purple-700">
                      Go to Dashboard
                    </div>
                  </div>
                </div>
              </Link>

              {/* Restaurant Owner Dashboard Card */}
              <Link href="/owner">
                <div className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer border-2 border-emerald-200 hover:border-emerald-400">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Restaurant Owner</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Track orders, manage menu items, and monitor stock
                    </p>
                    <div className="btn-primary inline-block bg-emerald-600 hover:bg-emerald-700">
                      Go to Dashboard
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-500">
                <strong>Note:</strong> This is a demo system with mock data. 
                Student ID: STU001 (you can change it in the URL)
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}



