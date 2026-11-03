"use client";

import { useState,useEffect } from "react";
import axios from "axios";
import { CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import toast, {Toaster} from "react-hot-toast";

export default function AdminPaymentRequestPage(){

  const [paymentRequests, setPaymentRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);


  useEffect(() => {
    fetchPaymentRequests();
  },[]);
 

  const fetchPaymentRequests = async () => {
    try {
        setLoading(true);
        const response = await axios.get("/api/admin/payment-requests");
        setPaymentRequests(response.data.paymentRequests);
        console.log("Request", response.data.paymentRequests);
        
    } catch (error) {
        console.error("Fetch payment requests error", error);
    } finally {
        setLoading(false);
    }
  }


  const handleApprove = async (id: string) => {

    if (!confirm("Are you sure you want to approved this payment.")) {
        return;
    }

    setProcessingId(id);

    try {
        const response = await axios.patch(`/api/admin/payment-requests/${id}`, {
            action: "approve",
        });
        toast.success(response.data.message);
        fetchPaymentRequests();
    } catch (error) {
        console.error("Approve error", error);
    } finally {
        setProcessingId(null);
    }
  };


  const handleReject = async (id: string) => {

    if (!rejectReason.trim()) {
        toast.error("Please provide a reason for rejection");
    }

    setProcessingId(id);

    try {
        const response = await axios.patch(`/api/admin/payment-requests/${id}`, {
            action: "reject",
            rejectedReason: rejectReason,
        });
        toast.success(response.data.message);
        setShowRejectModal(null);
        setRejectReason("");
        fetchPaymentRequests();
    } catch (error) {
        console.error("Reject error", error);
    } finally {
        setProcessingId(null);
    }
  }


  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600">
            </div>
        </div>
    )
  }


    return (
         <>
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Payment Requests</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Review and manage bank transfer payment requests from users</p>
        </div>

        {/* Payment Requests List */}
        <div className="grid gap-4">
{paymentRequests.length === 0 ? (          
<div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
    <div className="py-10 px-6 text-center text-gray-500 dark:text-gray-400">
    No payment requests found
    </div>
</div>
) : ( 
    paymentRequests.map((request) => ( 
   
   <div key={request.id}  className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
    {/* Card Header */}
    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
        <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {request.user.name || "Unknow user"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {request.user.email }</p>
        </div>
        <div>
            {request.status === "PENDING" && ( 
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                <Clock className="w-3 h-3" />
                Pending
            </span>
          )}
             {request.status === "APPROVED" && ( 
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-600 text-white">
                <CheckCircle className="w-3 h-3" />
                Approved
            </span>
            )}
            {request.status === "REJECTED" && ( 
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200">
                <XCircle className="w-3 h-3" />
                Rejected
            </span>
             )}
        </div>
        </div>
    </div>

    {/* Card Content */}
    <div className="px-6 py-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
        <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Transaction ID
            </label>
            <p className="text-sm text-gray-900 dark:text-gray-100 mt-1 font-mono">
            {request.transactionId}
            </p>
        </div>
        <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Submitted On
            </label>
            <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
           {new Date(request.createdAt).toLocaleString()}
            </p>
        </div>
        </div>

        <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Payment Proof
        </label>
        <a
            href={request.invoicePath}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition"
        >
            <Eye className="w-4 h-4" />
            View Invoice
        </a>
        </div>

        {request.status === "REJECTED" && request.rejectedReason && ( 
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-sm font-medium text-red-900 dark:text-red-100">Rejection Reason:</p>
            <p className="text-sm text-red-800 dark:text-red-200 mt-1">{request.rejectedReason}</p>
        </div>
    )}

        {request.status === "APPROVED" && request.approvedAt && ( 
        <div className="bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <p className="text-sm text-green-800 dark:text-green-200">
            Approved on {new Date(request.approvedAt).toLocaleString()} 
            </p>
        </div>
        )}

        {request.status === "PENDING" && ( 
        <div className="flex gap-2 pt-2">
            <button
            onClick={() => handleApprove(request.id)}
            disabled={processingId === request.id}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
            <CheckCircle className="w-4 h-4 mr-2" />
            {processingId === request.id ? "Processing..." : "Approve & Upgrade to Pro"} 
            </button>
            <button
            onClick={() => setShowRejectModal(request.id)}
            disabled={processingId === request.id}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
            <XCircle className="w-4 h-4 mr-2" />
            Reject
            </button>
        </div>
    )}
    </div>
    </div>
    ))
    )}      
        </div>

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Reject Payment Request
              </h3>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 min-h-[100px]"
                required
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleReject(showRejectModal)}
                  disabled={processingId === showRejectModal}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                Confirm Reject
                </button>
                <button
                 onClick={() => {
                    setShowRejectModal(null);
                    setRejectReason("");
                 }}  
                  disabled={processingId === showRejectModal}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
         )}
      </div>
    </>
    )
}