"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft, TrendingUp, Users, DollarSign, Target, Lightbulb, Download, AlertCircle, Share2, BarChart3, Globe, Zap, CheckCircle} from "lucide-react";
import Link from "next/link";
import { GoogleIcon } from "@/components/BrandLogos";
import { exportReportToPDF } from "@/lib/utils/exportPDF";

interface Report {
    id: string;
    DomainIdea: string;
    keyword: string;
    status: string;
    overallScore: number;
    viabilityRating: string;
    trendsData: any;
    aiInsights: any;
    createdAt: string;
    updatedAt: string;
}

export default function ReportDetailPage() {

    const params = useParams();
    const router = useRouter();
    const [report, setReport] = useState<Report | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (params.id) {
            fetchReport(params.id as string)
        }
    },[params.id]);


    const fetchReport = async (id: string) => {
        try {
            const response = await axios.get(`/api/reports/${id}`);
            const reportData = response.data.report;
            console.log("Report data",reportData );
            setReport(reportData);
        } catch (error) {
            console.error("Error fetching report", error);
        }finally{
            setIsLoading(false);
        }
    }

    const handleExportPDF = () => {
        if (!report) return;
        try {
            exportReportToPDF(report);
        } catch (error) {
            console.error("Error exporting pdf:", error);
        }

    }

   const getViabilityColor = (rating: string) => {
    switch (rating) {
      case "HIGH":
        return "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700";
      case "MEDIUM":
        return "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700";
      case "LOW":
        return "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-600 dark:text-green-400";
    if (score >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

   if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  } 


  if (error || !report) {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <p>The report you are looking for doesn't exits</p>

            </div>

        </div>
    )
  }

    return (
          
       <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/reports"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Reports
        </Link>
        <div className="flex gap-2">
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </button>
          <button
            disabled
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg cursor-not-allowed"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </button>
        </div>
      </div>

      {/* Report Title & Score */}
      <div className="bg-gradient-to-br from-blue-50 dark:from-gray-950 to-purple-50 dark:to-gray-950 border-2 border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="py-8 px-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">{report?.DomainIdea}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Keyword: <span className="font-semibold">{report?.keyword}</span>
            </p>

            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="text-center">
                <div className={`text-6xl font-bold ${getScoreColor(report.overallScore)} `}>
                 {report?.overallScore}
                  <span className="text-3xl">/100</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Overall Score</p>
              </div>

              <div className="h-20 w-px bg-gray-300 dark:bg-gray-600"></div>

              <div className="text-center">
                <div
                  className={`inline-block px-6 py-3 rounded-full text-2xl font-bold border-2 ${getViabilityColor(report.viabilityRating)} `}
                >
                {report.viabilityRating}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Viability Rating</p>
              </div>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Generated on  {new Date(report.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
    {report.trendsData && ( 
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="py-4 px-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {report.trendsData.averageInterest || "N/A"}  
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Avg. Interest</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="py-4 px-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {(() => {
                        const growth = report.trendsData.growthRate || 0;
                        const displayGrowth = Math.max(-999, Math.min(999, growth));
                        return `${displayGrowth > 0 ? "+" : ""}${displayGrowth.toFixed(1)}%`;
                    })()}                     
                  </div> 
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Growth Rate
                   {Math.abs(report.trendsData.growthRate || 0) > 999 && ( 
                      <span className="text-xs block text-gray-500 dark:text-gray-400">Very High Growth</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="py-4 px-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/40 rounded-lg">
                  <Globe className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                 {report.trendsData?.trend || "N/A"}  
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Trend Status</div>
                </div>
              </div>
            </div>
          </div>
        </div>
     )} 

      {/* AI Insights - Opportunity Assessment */}
     {report.aiInsights?.opportunityAssessment && ( 
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Opportunity Assessment
            </h2>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-1" />
              <div className="flex-1">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
    {report.aiInsights.opportunityAssessment.reasoning || "No Assesment available"}
                </p>
              </div>
            </div>
    {report.aiInsights.opportunityAssessment.score && ( 
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/40 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Opportunity Score</div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {report.aiInsights.opportunityAssessment.score}/100
                </div>
              </div>
             )}
          </div>
        </div>
      )}

      {/* Search Trends */}
      <div className="grid grid-cols-1 gap-6">

 {report.trendsData && (       
<div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
<div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
    <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
    <GoogleIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
    Search Trends
    </h2>
</div>
<div className="px-6 py-4 space-y-4">
    {/* Trend Overview */}
    <div className="grid grid-cols-2 gap-4">
    <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-lg">
        <div className="text-sm text-gray-600 dark:text-gray-400">Avg Interest</div>
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
        {report.trendsData.averageInterest || 0}/100
        </div>
    </div>
    <div className="p-4 bg-green-50 dark:bg-green-950/40 rounded-lg">
        <div className="text-sm text-gray-600 dark:text-gray-400">Growth</div>
        <div className={`text-2xl font-bold ${
            report.trendsData.growthRate > 0 ? "text-green-600 dark:text-green-400" :
            report.trendsData.growthRate < 0 ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-400"
        }`}>
        
         {(() => {
        const growth = report.trendsData.growthRate || 0;
        const displayGrowth = Math.max(-999, Math.min(999, growth));
        return `${displayGrowth > 0 ? "+" : ""}${displayGrowth.toFixed(1)}%`;
        })()}        
        {Math.abs(report.trendsData.growthRate || 0) > 999 && (
            <span className="text-xs block text-gray-500 dark:text-gray-400">Very High Growth</span>
         )}
        </div>
    </div>
    </div>

              {/* Timeline Data */}
    {report.trendsData.timelineData && report.trendsData.timelineData.length > 0 && (           
    <div>
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Search Volume Trend</h4>
        <div className="relative bg-gray-50 dark:bg-gray-950 rounded-lg p-4" style={{ height: '160px' }}>
        {(() => {
            const dataPoints = report.trendsData.timelineData.slice(-12);
            const maxValue = Math.max(...dataPoints.map((d: any) => d.value), 1);
            const cartHeight = 128;
       
        
        return ( 
            <>
                <div className="flex items-end justify-between gap-1" style={{height: `${cartHeight}px`}} >
                
                {dataPoints.map((item: any, index: number) => {
                    const heightPx = (item.value / maxValue) * cartHeight;
                    const isZero = item.value === 0;
            
    return (  
        
        <div key={index}  className="flex-1 group relative">
            <div
            className={`w-full rounded-t transition-all ${
                isZero
                ? "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400"
                : "bg-blue-500 hover:bg-blue-600"
            } `}
            style={{ height: `${heightPx}px`, minHeight:isZero ? "3px" : "5px" }}
            >
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
            {item.time}<br />
                Value:  {item.value} 
            </div>
            </div>
        </div>
    ); 
    })}    
                
                </div>
                <div className="absolute top-2 right-2 text-xs text-gray-400 dark:text-gray-500">
                Peak: {maxValue}
                </div>
            </>
            )  
         })()}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
        Last {Math.min(12, report.trendsData.timelineData.length)} periods • Scaled for visibility
        </div>
        {report.trendsData.timelineData.slice(-12).filter((d: any) => d.value === 0).length > 0 && (
        <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-950/40 border border-yellow-200 dark:border-yellow-800 rounded text-xs text-gray-600 dark:text-gray-400">
            <strong>Note:</strong> Gray bars indicate periods with zero search volume. This is normal for new or very Domian Idea keywords.
        </div>
         )}
    </div>
 )}

    {/* Related Queries */}
{report.trendsData.relatedQueries.top && report.trendsData.relatedQueries.top.length > 0 && ( 
    <div>
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Related Searches</h4>
        <div className="space-y-2">
        {report.trendsData.relatedQueries.top.slice(0,5).map((query: any, index: number) => ( 
            <div key={index}  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-950 rounded">
            <span className="text-sm text-gray-700 dark:text-gray-300">{query.query}</span>
            <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${query.value}`}} ></div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 w-8">{query.value}%</span>
            </div>
            </div>
        ))}
        </div>
    </div>
    )}
</div>
</div>
 )}      
      </div>

      {/* Target Audience */}
     {report.aiInsights.targetAudience && ( 
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Target Audience
            </h2>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {report.aiInsights.targetAudience.demographics && ( 
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Demographics</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                   {report.aiInsights.targetAudience.demographics}
                  </p>
                </div>
              )}
             {report.aiInsights.targetAudience.psychographics && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Psychographics</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                   {report.aiInsights.targetAudience.psychographics}
                  </p>
                </div>
               )}
            {report.aiInsights.targetAudience.painPoints && 
            report.aiInsights.targetAudience.painPoints.length > 0 && (  
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Key Challenges</h4>
                    <ul className="space-y-1">
        {report.aiInsights.targetAudience.painPoints.slice(0,3).map((point:string, index:number) => (            
        <li key={index}   className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
            <span className="text-purple-600 dark:text-purple-400">•</span>
            {point}
        </li>
           ))}            
                    </ul>
                  </div>
                )}  
            </div>
          </div>
        </div>
      )}
 

      {/* Business Ideas */}
    {report.aiInsights?.businessIdeas && report.aiInsights.businessIdeas.length > 0 && (   
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
              <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              Business Ideas
            </h2>
          </div>
          <div className="px-6 py-4">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Based on the Domian Idea analysis, here are specific business ideas you can launch:
            </p>
            <div className="space-y-6">
    {report.aiInsights.businessIdeas.map((idea: any, index: number) => (       
        <div
            key={index}
            className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-yellow-300 dark:hover:border-yellow-700 hover:shadow-md transition"
        >
            <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{idea.idea}</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{idea.description}</p>
            </div>
            <span className={`ml-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/40 ${
                idea.difficulty === "Easy"
                ? "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200"
                : idea.difficulty === "Medium"
                ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200"
                : "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200"

            }`}>
            {idea.difficulty}
            </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Time to Launch</div>
                <div className="font-semibold text-blue-700 dark:text-blue-300">{idea.timeToLaunch}</div>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-950/40 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Estimated Cost</div>
                <div className="font-semibold text-green-700 dark:text-green-300">{idea.estimatedCost}</div>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Revenue Model</div>
                <div className="font-semibold text-purple-700 dark:text-purple-300">{idea.revenueModel}</div>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-950/40 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Target Market</div>
                <div className="font-semibold text-orange-700 dark:text-orange-300">{idea.targetMarket}</div>
            </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                Idea #{index + 1} {idea.difficulty} to implement
                </span>
                <button
                disabled
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg cursor-not-allowed"
                >
                <Lightbulb className="w-4 h-4 mr-2" />
                Save Idea
                </button>
            </div>
            </div>
        </div>
         ))}   
            </div>

            {/* Summary Stats */}
<div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950/40 border border-yellow-200 dark:border-yellow-800 rounded-lg">
    <div className="flex items-center gap-2 mb-2">
    <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
    <h4 className="font-semibold text-gray-900 dark:text-gray-100">Quick Overview</h4>
    </div>
    <div className="grid grid-cols-3 gap-4 text-center">
    <div>
        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
        {report.aiInsights.businessIdeas.length}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">Ideas Generated</div>
    </div>
    <div>
        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
        {report.aiInsights.businessIdeas.filter((i:any) => i.difficulty === "Easy").length}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">Easy to Start</div>
    </div>
    <div>
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
        {report.aiInsights.businessIdeas.filter((i:any) => i.timeToLaunch.includes("week")).length}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">Quick Launch</div>
    </div>
    </div>
</div>
          </div>
        </div>
    )} 

      {/* Go-to-Market Strategy */}
{report.aiInsights.gtmStrategy && (     
<div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
    <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
        <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        Go-to-Market Strategy
    </h2>
    </div>
    <div className="px-6 py-4 space-y-6">
    <p className="text-gray-600 dark:text-gray-400">
        A phased approach to launching and growing your business in this Domian Idea.
    </p>

    {/* Quick Wins */}
    {report.aiInsights.gtmStrategy.quickWins && 
    report.aiInsights.gtmStrategy.quickWins.length > 0 && (  
   
        <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            Quick Wins (Start Immediately)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {report.aiInsights.gtmStrategy.quickWins.map((win: string, index:number) => ( 
                <div key={index}  className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-950/40 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <CheckCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{win}</span>
                </div>
            ))}
            </div>
        </div>
         )}

    {/* Phase 1 */}
    {report.aiInsights.gtmStrategy.phase1 && 
    report.aiInsights.gtmStrategy.phase1.length > 0  && (  
   
        <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
            📍 Phase 1: Foundation (Weeks 1-4)
            </h4>
            <ol className="space-y-2">
            {report.aiInsights.gtmStrategy.phase1.map((step: string, index: number) => (  
           
                <li key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/40 rounded-lg">
                <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-sm font-bold rounded-full flex-shrink-0">
                {index + 1}
                </span>
                <span className="text-gray-700 dark:text-gray-300 pt-0.5">{step}</span>
                </li>
             ))}
            </ol>
        </div>
     )}
    {/* Phase 2 */}
    
     {report.aiInsights.gtmStrategy.phase2 && 
    report.aiInsights.gtmStrategy.phase2.length > 0  && (  
        <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
            🚀 Phase 2: Growth (Weeks 5-12)
            </h4>
            <ol className="space-y-2">
             {report.aiInsights.gtmStrategy.phase2.map((step: string, index: number) => (  
                <li key={index}  className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/40 rounded-lg">
                <span className="flex items-center justify-center w-6 h-6 bg-green-600 text-white text-sm font-bold rounded-full flex-shrink-0">
                    {index + 1}
                </span>
                <span className="text-gray-700 dark:text-gray-300 pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
        </div>
     )}

    {/* Phase 3 */}
     {report.aiInsights.gtmStrategy.phase3 && 
    report.aiInsights.gtmStrategy.phase3.length > 0  && (  
        <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
            📈 Phase 3: Scale (Month 4+)
            </h4>
            <ol className="space-y-2">
             {report.aiInsights.gtmStrategy.phase3.map((step: string, index: number) => (  
                <li key={index}  className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-950/40 rounded-lg">
                <span className="flex items-center justify-center w-6 h-6 bg-purple-600 text-white text-sm font-bold rounded-full flex-shrink-0">
                    {index + 1}
                </span>
                <span className="text-gray-700 dark:text-gray-300 pt-0.5">{step}</span>
                </li>
             ))}
            </ol>
        </div>
        )}
    </div>
</div>
   )}

      {/* Bottom Actions */}
      <div className="flex items-center justify-between py-6 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="/dashboard/reports"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to All Reports
        </Link>
        <div className="flex gap-2">
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </button>
          <button
            disabled
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg cursor-not-allowed"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Report
          </button>
        </div>
      </div>
    </div>
 
    )

}