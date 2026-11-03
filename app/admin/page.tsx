"use client";

import { useState,useEffect } from "react";
import axios from "axios";
import { Users, FileText, TrendingUp, DollarSign, Activity, CheckCircle } from "lucide-react";

interface Analytics {
  totalUsers: number;
  planBreakdown: {
    FREE: number;
    PRO: number;
  };
  totalReports: number;
  reportsBreakdown: {
    COMPLETED: number;
    PROCESSING: number;
    PENDING: number;
    FAILED: number;
  };
  monthlyValidations: number;
  newUsersThisMonth: number;
  recentReports: number;
  averageScore: number;
  totalMRR: number;
}

export default function AdminDashboardPage(){

  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  },[]);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get("/api/admin/analytics");
      setAnalytics(response.data);
      //console.log("total data",response.data);

    } catch (error) {
      console.error("Error fetching analytics", error);
    } finally {
      setIsLoading(false);
    }
  }


   if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="py-6 px-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

    if (!analytics) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="py-12 px-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">Failed to load analytics</p>
          </div>
        </div>
      </div>
    );
  }




    return (
         <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Platform overview and key metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex flex-row items-center justify-between px-6 pt-4 pb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="px-6 pb-4">
            <div className="text-2xl font-bold">{analytics.totalUsers}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              +{analytics.newUsersThisMonth} this month
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex flex-row items-center justify-between px-6 pt-4 pb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reports</p>
            <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <div className="px-6 pb-4">
            <div className="text-2xl font-bold">{analytics.totalReports}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {analytics.recentReports} last 7 days
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex flex-row items-center justify-between px-6 pt-4 pb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pro Users</p>
            <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="px-6 pb-4">
            <div className="text-2xl font-bold">{analytics.planBreakdown.PRO}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {analytics.planBreakdown.FREE} free users
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex flex-row items-center justify-between px-6 pt-4 pb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">MRR</p>
            <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <div className="px-6 pb-4">
            <div className="text-2xl font-bold">${analytics.totalMRR}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Monthly recurring revenue</p>
          </div>
        </div>
      </div>

      {/* Reports Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Reports by Status</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Current state of all validation reports</p>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium">Completed</span>
                </div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                 {analytics.reportsBreakdown.COMPLETED}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium">Processing</span>
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                 {analytics.reportsBreakdown.PROCESSING}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm font-medium">Pending</span>
                </div>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                 {analytics.reportsBreakdown.PENDING}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <span className="text-sm font-medium">Failed</span>
                </div>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {analytics.reportsBreakdown.FAILED}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Platform Statistics</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Additional metrics and insights</p>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Monthly Validations</span>
                  <span className="text-lg font-bold">{analytics.monthlyValidations}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${Math.min((analytics.monthlyValidations / 100) * 100, 100)}%` }}                    
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Average Report Score</span>
                  <span className="text-lg font-bold">{analytics.averageScore}/100</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${analytics.averageScore}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Pro Conversion Rate</span>
                  <span className="text-lg font-bold">
                  {analytics.totalUsers > 0 
                  ? Math.round((analytics.planBreakdown.PRO / analytics.totalUsers) * 100)
                  : 0 }
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
              style={{ width: `${analytics.totalUsers > 0 
                ? (analytics.planBreakdown.PRO / analytics.totalUsers) * 100
                : 0
              }%` }}     
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Success Rate:</span>{" "}
                  {analytics.totalReports > 0 
                  ? Math.round(
                    (analytics.reportsBreakdown.COMPLETED / analytics.totalReports) * 100
                  )
                  : 0 }
                  % of reports completed successfully
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Quick Actions</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Common administrative tasks</p>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/users"
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition text-center"
            >
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Manage Users</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">View and edit user accounts</p>
            </a>
            <a
              href="/admin/analytics"
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition text-center"
            >
              <Activity className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">View Analytics</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Detailed platform insights</p>
            </a>
            <a
              href="/admin/settings"
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition text-center"
            >
              <Activity className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Settings</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Platform configuration</p>
            </a>
          </div>
        </div>
      </div>
    </div>
    )
}