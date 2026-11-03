"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { FileText, Trash2, Eye,AlertCircle, CheckCircle, Clock, Filter } from "lucide-react";
import Link from "next/link";

interface Report {
  id: string;
  DomainIdea: string;
  keyword: string;
  status: string;
  overallScore: number | null;
  viabilityRating: string | null;
  createdAt: string;
  updatedAt: string;
}


export default function ReportsPage(){

    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
      fetchReports(); 
    },[]);

    // Auto refesh only when there are processing reports
    useEffect(() => {
        const hasProcessing = reports.some((r) => r.status === "PROCESSING" || r.status === "PENDING");

        if (!hasProcessing) {
            return;
        }

        const interval = setInterval(() => {
             fetchReports();
        }, 5000);

    return () => clearInterval(interval); } , [reports.length, reports.filter(r => r.status === "PROCESSING" || r.status === "PENDING").length]);

    const fetchReports = async () => {
      try {
        const reponse = await axios.get("/api/reports");
        setReports(reponse.data.reports); // Show only 5 report
        //console.log(reponse.data);
      } catch (error) {
        console.error("Error fetching reports", error);
      } finally {
        setIsLoading(false);
      }
    };


    const handleDelete = async (id: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this report? this action cannot be undone"
        );

        if (!confirmed) {
            return;
        }

        setDeletingId(id);

        try {
            await axios.delete(`/api/reports/${id}`);
            setReports(reports.filter((r) => r.id !== id))
            alert("Report deleted successfully");
        } catch (error) {
            console.error("Error deleting report", error);
        } finally {
            setDeletingId(null);
        }
    };


    const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200">Completed</span>
     
      case "PROCESSING":
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200">Processing</span>

      case "PENDING":
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200">Pending</span>

      case "FAILED":
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200">Failed</span>
       
      default:
       return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">{status}</span>
    } 
  };


  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400"/>;

      case "PROCESSING":
      return <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin"/>;

      case "PENDING":
      return <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400"/>;

      case "FAILED":
      return <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400"/>; 
    
      default:
        return null;
    }
  }

  const filteredReports = reports.filter((report) => {
    if (filter === "all") return true;  
    return report.status === filter;
  })


    return (
        <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">All Reports</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage your Domain Idea validation reports</p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
        >
          New Validation
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
            <div className="flex gap-2">
    {["all", "COMPLETED","PROCESSING","PENDING","FAILED"].map((status) => ( 
    
                <button
                  key={status}
                  onClick={() => setFilter(status)} 
                  className={`px-3 py-1 text-sm rounded-lg transition 
                   ${
                    filter === status 
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                   } `}
                >
                {status === "all" ? "All" : status.charAt(0) + status.slice(1).toLocaleLowerCase()}  
                </button>
                ))}  
            </div>
          </div>
        </div>
      </div>

      {/* Reports List */}
    {isLoading ? (   
        <div className="space-y-4">
        {[1,2,3,4,5].map((i) => ( 
            <div key={i}  className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="py-6 px-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredReports.length === 0 ? ( 
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="py-12 px-6">
            <div className="text-center">
              <FileText className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            {filter === "all" ? "No reports found" : `No ${filter.toLocaleLowerCase()} reports`}
                
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {filter === "all"
                ? "Start validating your first Domain Idea to see reports here"
                : "Try changing the filter to see other reports"
            }              
              </p>
               {filter === "all" && (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
                >
                  Create First Validation
                </Link>
                )}
            </div>
          </div>
        </div>
      ) : ( 
        <div className="space-y-4">
        {filteredReports.map((report) => (  
    <div key={report.id}  className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition">
        <div className="py-6 px-6">
        <div className="flex items-start justify-between">
            {/* Report Info */}
            <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
                {getStatusIcon(report.status)}
                <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{report.DomainIdea}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{report.keyword}</p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
            {getStatusBadge(report.status)}    
               {report.viabilityRating && ( 
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        report.viabilityRating === "HIGH"
                        ? "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200"
                        : report.viabilityRating === "MEDIUM"
                        ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200"
                        : "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200"
                    } `}>
                        {report.viabilityRating} Viability
                    </span>
                )} 
                </div>
            {report.overallScore !== null && (
                <span className="font-medium">Score: {report.overallScore}/100</span>
              )}
                <span>
            Created: {new Date(report.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            })}
                </span>
            </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 ml-4">
            {report.status === "COMPLETED" && ( 
                <Link
                href={`/dashboard/reports/${report.id}`}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
                >
                <Eye className="w-4 h-4 mr-2" />
                View
                </Link>
            )}
            <button
                onClick={() => handleDelete(report.id)}
                disabled={deletingId === report.id } 
                className="inline-flex items-center justify-center p-1.5 text-white bg-red-600 hover:bg-red-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
            {deletingId === report.id ? ( 
                <Clock className="w-4 h-4 animate-spin" />
              ) : ( 
                <Trash2 className="w-4 h-4" />
               )}   
            </button>
            </div>
        </div>
        </div>
    </div>
    ))} 
        </div>
     )} 

      {/* Stats Summary */}
     {!isLoading && reports.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm px-6 py-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
            <div className="text-2xl font-bold">{reports.length}</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm px-6 py-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
             {reports.filter((r) => r.status === "COMPLETED").length}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm px-6 py-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Processing</p>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {reports.filter((r) => r.status === "PROCESSING").length}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm px-6 py-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Failed</p>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {reports.filter((r) => r.status === "FAILED").length}
            </div>
          </div>
        </div>
     )}
    </div>
    )
}