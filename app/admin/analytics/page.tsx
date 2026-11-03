"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { BarChart3, Users, FileText, TrendingUp, DollarSign, Activity,CheckCircle, XCircle,Clock, RefreshCw, ArrowUpRight, Target, Zap } from "lucide-react";

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


function StatCard({ 
    title,
    value,
    subtitle,
    icon: Icon,
    iconColor,
    trend, 
  } : {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ElementType;
    iconColor: string;
    trend?: {value: number; label: string}

}) {

    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="px-6 pt-5 pb-1 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
                <div className={`p-2 rounded-lg ${iconColor} bg-opacity-10`}>
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                </div> 
            </div>

        <div className="px-6 pb-5">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {value}
            </div>
        {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
        )}
        {trend && (
            <div className="flex items-center gap-1 mt-2">
        <ArrowUpRight className="w-3 h-3 text-gray-500 dark:text-gray-400" />
           <span>+{trend.value} {trend.label}</span>
            </div> 
        )} 
        </div>
        </div>
    ); 
}



function ProgressBar({
  label,
  value,
  max,
  color,
  showPercent = false,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  showPercent?: boolean;
}) {
  const percent = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {showPercent ? `${Math.round(percent)}%` : value}
        </span>
      </div>
      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
        <div
          className={`${color} h-2.5 rounded-full transition-all duration-700`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}


function StatusBadge({
  status,
  count,
  icon: Icon,
  color,
  bg,
}: {
  status: string;
  count: number;
  icon: React.ElementType;
  color: string;
  bg: string;
}) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-lg ${bg}`}>
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${color}`} />
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{status}</span>
      </div>
      <span className={`text-2xl font-bold ${color}`}>{count}</span>
    </div>
  );
}






export default function AdminAnalyticsPage(){

     const [analytics, setAnalytics] = useState<Analytics | null>(null);
     const [loading, setLoading] = useState(true);
     const [refreshing, setRefreshing] = useState(true);
     const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    useEffect(() => {
    fetchAnalytics();
  },[]);

  const fetchAnalytics = async (isRefresh = false) => {
    if(isRefresh) setRefreshing(true);    
    else setLoading(true);
    try {
      const response = await axios.get("/api/admin/analytics");
      setAnalytics(response.data);
      setLastUpdated(new Date());
       console.log("total data",response.data);

    } catch (error) {
      console.error("Error fetching analytics", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }


    if (loading) {
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

  const proRevenue = analytics.planBreakdown.PRO * 29;
  const successRate = 
        analytics.totalReports > 0 
        ? Math.round((analytics.reportsBreakdown.COMPLETED / analytics.totalReports) * 100)
        : 0;
  const proConversionRate = 
        analytics.totalUsers > 0 
         ? Math.round((analytics.planBreakdown.PRO / analytics.totalUsers) * 100)
        : 0;
  const failureRate = 
        analytics.totalReports > 0
        ? Math.round((analytics.reportsBreakdown.FAILED / analytics.totalReports) * 100)
        : 0;

return (
      <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Detailed platform analytics and insights</p>
        </div>
        <div className="flex items-center gap-3">
         
            <span className="text-xs text-gray-400 dark:text-gray-500">
              Updated  
            </span>
          
          <button
            
            
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4  `} />
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
        title="Total Users" 
        value={analytics.totalUsers} 
        icon= {Users}
        iconColor="text-blue-600 dark:text-blue-400"
        trend={{ value: analytics.newUsersThisMonth, label: "This month" }}
        />
        <StatCard
        title="Total Reports" 
        value={analytics.totalReports} 
        subtitle={`${analytics.recentReports} in last 7 days`}
        icon= {FileText}
        iconColor="text-green-600 dark:text-green-400"        
        />

        <StatCard
        title="Pro Subscribers" 
        value={analytics.planBreakdown.PRO} 
        icon= {TrendingUp}
        subtitle={`${analytics.planBreakdown.FREE} free users`}
        iconColor="text-purple-600 dark:text-purple-400"        
        />

        <StatCard
        title="Monthly Revenue" 
        value={analytics.totalMRR} 
        subtitle={`${analytics.totalMRR} Total month`}
        icon= {DollarSign}
        iconColor="text-emerald-600 dark:text-emerald-400"      
        />
        
       
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm px-6 py-5">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Report Score</p>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{analytics.averageScore}<span className="text-lg text-gray-400 dark:text-gray-500 font-normal">/100</span></div>
          <div className="mt-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${analytics.averageScore}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm px-6 py-5">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Validations</p>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{analytics.monthlyValidations}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Current month total</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm px-6 py-5">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pro Conversion Rate</p>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{proConversionRate}<span className="text-lg text-gray-400 dark:text-gray-500 font-normal">%</span></div>
          <div className="mt-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full"
              style={{ width: `${proConversionRate}%`  }}
            />
          </div>
        </div>
      </div>

      {/* Reports & Users breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reports by Status */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Reports by Status</h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Breakdown of all validation reports</p>
          </div>
          <div className="px-6 py-4 space-y-3">
        <StatusBadge
            status="Completed"
            count={analytics.reportsBreakdown.COMPLETED}
            icon={CheckCircle}
            color="text-green-600 dark:text-green-400"
            bg="bg-green-50 dark:bg-green-950/40"        
        />
        <StatusBadge
            status="Processing"
            count={analytics.reportsBreakdown.PROCESSING}
            icon={Activity}
            color="text-blue-600 dark:text-blue-400"
            bg="bg-blue-50 dark:bg-blue-950/40"        
        />
        <StatusBadge
            status="Pending"
            count={analytics.reportsBreakdown.PENDING}
            icon={Clock}
            color="text-yellow-600 dark:text-yellow-400"
            bg="bg-yellow-50 dark:bg-yellow-950/40"        
        />
        <StatusBadge
            status="Failed"
            count={analytics.reportsBreakdown.FAILED}
            icon={XCircle}
            color="text-red-600 dark:text-red-400"
            bg="bg-red-50 dark:bg-red-950/40"        
        />        
            
          </div>
        </div>

        {/* User Plan Breakdown */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">User Breakdown</h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Plan distribution across all users</p>
          </div>
          <div className="px-6 py-4 space-y-5">
        <ProgressBar
            label="Pro Users"
            value={analytics.planBreakdown.PRO}
            max={analytics.totalUsers}
            color="bg-purple-500"
            showPercent
        />
        <ProgressBar
            label="Free Users"
            value={analytics.planBreakdown.FREE}
            max={analytics.totalUsers}
            color="bg-blue-500"
            showPercent
        />
           

            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/40 rounded-lg">
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{analytics.planBreakdown.PRO}</div>
                <div className="text-xs text-purple-600 dark:text-purple-400 mt-0.5">Pro Users</div>
              </div>
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/40 rounded-lg">
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{analytics.planBreakdown.FREE}</div>
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">Free Users</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Platform Performance</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Key health metrics at a glance</p>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
            <ProgressBar
            label="Report Success Rate"
            value={successRate}
            max={100}
            color="bg-green-500"
            showPercent
        />
              
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {analytics.reportsBreakdown.COMPLETED} of {analytics.totalReports} reports completed
              </p>
            </div>
            <div className="space-y-2">
            <ProgressBar
            label="Report Failer Rate"
            value={failureRate}
            max={100}
            color="bg-red-500"
            showPercent
        />
              
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {analytics.reportsBreakdown.FAILED}  failed reports
              </p>
            </div>
            <div className="space-y-2">
          <ProgressBar
            label="Aveage Score Quality"
            value={analytics.averageScore}
            max={100}
            color="bg-blue-500"
            showPercent
          />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Based on all completed reports
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-600 rounded-lg px-5 py-4 text-white">
          <p className="text-blue-200 text-xs font-medium uppercase tracking-wide">New Users</p>
          <div className="text-3xl font-bold mt-1">{analytics.newUsersThisMonth}</div>
          <p className="text-blue-200 text-xs mt-1">This month</p>
        </div>
        <div className="bg-green-600 rounded-lg px-5 py-4 text-white">
          <p className="text-green-200 text-xs font-medium uppercase tracking-wide">Recent Reports</p>
          <div className="text-3xl font-bold mt-1">{analytics.recentReports}</div>
          <p className="text-green-200 text-xs mt-1">Last 7 days</p>
        </div>
        <div className="bg-purple-600 rounded-lg px-5 py-4 text-white">
          <p className="text-purple-200 text-xs font-medium uppercase tracking-wide">MRR</p>
          <div className="text-3xl font-bold mt-1">${analytics.totalMRR}</div>
          <p className="text-purple-200 text-xs mt-1">Monthly recurring revenue</p>
        </div>
        <div className="bg-orange-500 rounded-lg px-5 py-4 text-white">
          <p className="text-orange-100 text-xs font-medium uppercase tracking-wide">Success Rate</p>
          <div className="text-3xl font-bold mt-1">{successRate}%</div>
          <p className="text-orange-100 text-xs mt-1">Reports completed</p>
        </div>
      </div>
    </div>
)


}