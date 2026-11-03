"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react"; 
import Link from "next/link";
import axios from "axios";
import { TrendingUp, Search, AlertCircle,CheckCircle, Clock, ArrowRight, Sparkles, Icon } from "lucide-react";
import { useRouter } from "next/navigation";

interface Report {
  id: string;
  DomainIdea: string;
  keyword: string;
  status: string;
  overallScore: number | null;
  viabilityRating: string | null;
  createdAt: string;
}

interface UsageData {
  used: number;
  limit: number;
  percentage: number;
  isPro: boolean;
}

interface PaymentRequest {
  id: string;
  status: string;
  transactionId: string;
  createdAt: string;
}

export default function DashboardPage(){

    const router = useRouter();
    const { data: session} = useSession();
    const [DomainIdea, setDomainIdea] = useState("");
    const [keyword, setKeyword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [reports, setReports] = useState<Report[]>([]);
    const [usage, setUsage] = useState<UsageData | null>(null);
    const [isLoadingReports, setIsLoadingReports] = useState(true);

    const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);

    useEffect(() => {
      fetchReports();
      fetchUsage();
      fetchPaymentRequests();
    },[]);

    const fetchPaymentRequests = async () => {
        try {
            const response = await axios.get("/api/subscription/bank-transfer");
            setPaymentRequests(response.data.paymentRequests || []);
           // console.log("payment",response.data.paymentRequests);
        } catch (error) {
            console.error("Fetch payment requests error", error);
        }
    }
    
    const fetchReports = async () => {
      try {
        const response = await axios.get("/api/reports");
        setReports(response.data.reports.slice(0,5)); // Show only 5 report
        //console.log(reponse.data);
      } catch (error) {
        console.error("Error fetching reports", error);
      } finally {
        setIsLoadingReports(false);
      }
    };


    const fetchUsage = async () => {
      try {
        const reponse = await axios.get("/api/usage");
        setUsage(reponse.data);  
        // console.log(reponse.data);
      } catch (error) {
        console.error("Error fetching reports", error);
        // set default for free users 
        setUsage({ used: 0, limit: 3, percentage:0, isPro:false })
      }  
    };







    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setSuccess("");
      setIsSubmitting(true);

      try {

        const response = await axios.post("/api/validate", {
          DomainIdea,
          keyword,
        });

        setSuccess("Validation started analyzing your Domain Idea..");
        setDomainIdea("");
        setKeyword("");

        setTimeout(() => {
          router.push("/dashboard/reports");
        },2000);
        
      } catch (error: any) {
        if (error.response?.data?.error) {
           setError(error.response.data.error);
        }else{
           setError("Something went wrong. plz try again");
        }
      } finally {
        setIsSubmitting(false);
      }
    }


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





    return(
          <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Welcome back, {session?.user?.name?.split(" ")[0] || "there"}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Validate your Domain Idea ideas with AI-powered market research
        </p>
      </div>

      {/* Pending Payment Notice */}
      {!usage?.isPro && paymentRequests.some(r => r.status === "PENDING") && ( 
        <div className="bg-yellow-50 dark:bg-yellow-950/40 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="px-6 py-4">
            <div className="flex items-start gap-3">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">Payment Request Pending</h3>
                <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                  Your payment request is awaiting admin approval. You'll be automatically upgraded to Pro once your payment is approved.
                </p>
                <Link href="/dashboard/settings" className="text-sm text-yellow-700 dark:text-yellow-300 underline mt-2 inline-block">
                  View payment status →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Status Card */}
{usage && ( 
<div className={`rounded-lg border shadow-sm ${usage.isPro ? "border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 dark:from-gray-950 to-blue-50 dark:to-gray-950"
   : "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40" }  `}>
  <div className="px-6 pt-4 pb-2">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${usage.isPro ? "bg-purple-100 dark:bg-purple-900/40" : "bg-blue-100 dark:bg-blue-900/40"} `}>
          <Sparkles className={`w-6 h-6 ${usage.isPro ? "text-purple-600 dark:text-purple-400" : "text-blue-600 dark:text-blue-400"} `} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
             {usage.isPro ? "Pro Plan" : "Free Plan"}  
            </h2>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${usage.isPro ? "bg-purple-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"} `}>
              {usage.isPro ? "ACTIVE" : "FREE"}  
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {usage.isPro 
            ? `Unlimited validations ${usage.used} used this month ` 
            : `${usage.used} of ${usage.limit} validations used this month`
          } 
            
          </p>
        </div>
      </div>
      {!usage.isPro && ( 
        <Link href="/dashboard/settings">
          <button className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1">
            Upgrade to Pro
          </button>
        </Link>
        )}
    </div>
  </div>
  <div className="px-6 pb-4">
  {!usage.isPro ? (
      <>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400 font-medium">Usage Progress</span>
            <span className="text-gray-900 dark:text-gray-100 font-semibold">{usage.percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-300
                ${usage.percentage >= 100
                  ? "bg-red-600"
                  : usage.percentage >= 66
                  ? "bg-yellow-600"
                  : "bg-blue-600"
                 } `}
              style={{ width: `${Math.min(usage.percentage, 100)}%`}}
            />
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {usage.limit - usage.used > 0 
            ? `${usage.limit - usage.used} validation${usage.limit - usage.used !== 1 ? 's' : ""} remaining`
            : "No Validations remaining"
            }  
          </p>
        </div>
        {usage.used >=  usage.limit && ( 
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200 font-medium">
              ⚠️ Monthly limit reached! Upgrade to Pro for unlimited validations.
            </p>
          </div>
        )}
      </>

       ) : (
  
      <div className="p-4 bg-white/60 rounded-lg border border-purple-100 dark:border-purple-900">
        <div className="flex items-center gap-2 text-purple-900 dark:text-purple-100">
          <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <p className="font-medium">Unlimited access to all features</p>
        </div>
        <p className="text-sm text-purple-700 dark:text-purple-300 mt-1 ml-7">
          Enjoy unlimited Domain Idea validations with advanced AI insights
        </p>
      </div>
     )}
  </div>
</div>
) }    

      {/* Validation Form */}
      
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            <Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Validate New Domain Idea
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Enter your Domain Idea and keyword to get comprehensive market insights
          </p>
        </div>
        <div className="px-6 py-4">
          <form onSubmit={handleSubmit}  className="space-y-4">
          {error && (  
              <div className="rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
           )}

            {success && (
              <div className="rounded-lg bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 p-4 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
              </div>
          )}

            <div>
              <label htmlFor="Domain Idea" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Domain Idea Description
              </label>
              <input
                id="Domain Idea"
                type="text"
                value={DomainIdea}
                onChange={(e) => setDomainIdea(e.target.value)}
                placeholder="e.g., AI productivity tools for writers"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
               disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Describe your Domain Idea in a few words
              </p>
            </div>

            <div>
              <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Primary Keyword
              </label>
              <input
                id="keyword"
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)} 
                placeholder="e.g., AI writing assistant"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isSubmitting}
                
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                The main keyword people would search for
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
            >
            {isSubmitting ? ( 
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Starting Validation...
                </>
             ) : ( 
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Validate Domain Idea
                </>
           )}
            </button>
          </form>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Validations</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Your latest Domain Idea validation reports</p>
            </div>
            <Link
              href="/dashboard/reports"
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
        <div className="px-6 py-4">
        {isLoadingReports ? ( 
            <div className="space-y-3">
            {[1,2,3].map((i) => ( 
                <div key={i}  className="animate-pulse">
                  <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
                </div>
             ) )}
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No validations yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Start validating your first Domain Idea to see results here
              </p>
            </div>
         ) : ( 
            <div className="space-y-3">
              {reports.map((report) => ( 
                <Link
                  key={report.id}
                  href={`/dashboard/reports/${report.id}`}
                  className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition"
                >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {getStatusIcon(report.status)}
            <h4 className="font-medium text-gray-900 dark:text-gray-100">{report.DomainIdea}</h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{report.keyword}</p>
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span>
            {new Date(report.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            })}
            </span>
            {report.overallScore !== null && ( 
              <span>Score: {report.overallScore}/100</span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {getStatusBadge(report.status)}
          {report.viabilityRating && ( 
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              report.viabilityRating === "HIGH"
              ? "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200"
              : report.viabilityRating === "MEDIUM"
              ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200"
              : "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200"
            } `}>
              {report.viabilityRating}
            </span>
          )}
        </div>
      </div>
    </Link>
              ) )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm px-6 py-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Validations</p>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{reports.length}</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm px-6 py-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">This Month</p>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{usage?.used || 0}</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm px-6 py-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {reports.filter((r) => r.status === "COMPLETED").length}
          </div>
        </div>
      </div>
    </div>
    )
}