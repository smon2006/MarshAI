"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { useSession, signOut } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  User,
  CreditCard,
  Shield,
  Bell,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import PasswordInput from "@/components/PasswordInput";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [showBankTransfer, setShowBankTransfer] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [paymentRequests, setPaymentRequests] = useState<any[]>([]);

  const [isRefreshingStatus, setIsRefreshingStatus] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const subscription = (session?.user as any)?.subscription;
  const isPro = subscription?.planType === "PRO" && subscription?.isActive;
  //console.log("user data",isPro);
  useEffect(() => {
    fetchPaymentRequests();
  }, []);

  const fetchPaymentRequests = async () => {
    try {
      const response = await axios.get("/api/subscription/bank-transfer");
      setPaymentRequests(response.data.paymentRequests);
      // console.log("payment",response.data.paymentRequests);
    } catch (error) {
      console.error("Fetch payment requests error", error);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/user/profile");
        setProfileName(response.data.user.name || "");
      } catch (error) {
        setDisplayName(session?.user?.name || "");
      }
    };
    fetchProfile();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingPassword(true);

    try {
      const response = await axios.put("/api/user/password", {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      toast.success(response.data.message);
      setIsChangingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Password change error", error);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const startEditingProfile = () => {
    setProfileName(session?.user?.name || "");
    setIsEditingProfile(true);
  };

  const cancelEditingProfile = () => {
    setIsEditingProfile(false);
    setProfileName("");
  };

  const cancelChangingPassword = () => {
    setIsChangingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);

    try {
      const response = await axios.put("/api/user/profile", {
        name: profileName,
      });
      // Fetch fresh name directly form database
      const fresh = await axios.get("/api/user/profile");
      setProfileName(fresh.data.user.name || profileName);
      await update();
      toast.success(response.data.message);
      setIsEditingProfile(false);
    } catch (error) {
      console.error("Profile updated error", error);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "application/pdf",
      ];
      const fileExtension = file.name.toLowerCase().split(".").pop();
      const allowedExtensions = ["jpeg", "jpg", "png", "webp", "pdf"];
      if (
        !allowedTypes.includes(file.type) &&
        !allowedExtensions.includes(fileExtension || "")
      ) {
        toast.error("Only JPG, PNG, PDF files are allowed");
        return;
      }
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("File size must be less then 5MB");
        return;
      }
      setInvoiceFile(file);
    }
  };

  const handleBankTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceFile) {
      toast.error("Please upload payment proof/invoice");
      return;
    }
    if (!transactionId || transactionId.trim().length < 5) {
      toast.error("Please enter a vaid transaction id (min 5 characters)");
      return;
    }
    setIsSubmittingPayment(true);

    try {
      const formData = new FormData();
      formData.append("invoice", invoiceFile);
      formData.append("transactionId", transactionId);
      const response = await axios.post(
        "/api/subscription/bank-transfer",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      toast.success(response.data.message);
      setShowBankTransfer(false);
      setTransactionId("");
      setInvoiceFile(null);
    } catch (error) {
      console.log("Bank Transfer error:", error);
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const handleRefreshStatus = async () => {
    setIsRefreshingStatus(true);
    try {
      await update();
      await fetchPaymentRequests();
      toast.success("Status refreshed successfully");
      router.refresh();
    } catch (error) {
      console.error("Refresh error", error);
    } finally {
      setIsRefreshingStatus(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to downgrade to the free plan?"))
      return;
    setIsCanceling(true);
    try {
      const response = await axios.post("/api/subscription/cancel");
      await update();
      router.refresh();
      toast.success(response.data.message);
    } catch (error) {
      console.error("Cancel error", error);
    } finally {
      setIsCanceling(false);
    }
  };

  const closeDeleteModal = () => {
    if (isDeletingAccount) return;
    setShowDeleteModal(false);
    setDeletePassword("");
    setDeleteConfirmText("");
    setShowDeletePassword(false);
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirmText !== "DELETE") {
      toast.error('Type "DELETE" to confirm');
      return;
    }
    if (!deletePassword) {
      toast.error("Please enter your password");
      return;
    }
    setIsDeletingAccount(true);
    try {
      await axios.delete("/api/user/delete", {
        data: { password: deletePassword },
      });
      toast.success("Account deleted. Sorry to see you go!");
      await signOut({ redirect: true, callbackUrl: "/" });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || "Failed to delete account. Try again."
      );
      setIsDeletingAccount(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Profile Section */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Profile Information
              </h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Your account details and information
            </p>
          </div>
          <div className="px-6 py-4 space-y-4">
            {!isEditingProfile ? (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  <p className="text-gray-900 dark:text-gray-100 mt-1">
                    {profileName || session?.user?.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <p className="text-gray-900 dark:text-gray-100 mt-1">{session?.user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Role
                  </label>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200">
                      {(session?.user as any)?.role || "USER"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={startEditingProfile}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
                >
                  Edit Profile
                </button>
              </>
            ) : (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    minLength={2}
                    maxLength={50}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email (cannot be changed)
                  </label>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">{session?.user?.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isUpdatingProfile ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEditingProfile}
                    disabled={isUpdatingProfile}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Subscription Section */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Subscription
              </h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Manage your subscription and billing
            </p>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Plan
              </label>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isPro
                      ? "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                  } `}
                >
                  {isPro ? "PRO" : "FREE"}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {isPro ? "Unlimited validations" : "3 Validations per month"}
                </span>
              </div>
            </div>

            {/* Pending Payment Notice */}
            {!isPro && paymentRequests.some((r) => r.status === "PENDING") && (
              <div className="bg-yellow-50 dark:bg-yellow-950/40 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">
                        Payment Pending
                      </h4>
                      <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                        Your payment request is awaiting admin approval. You'll
                        be upgraded to Pro once approved.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRefreshStatus}
                    disabled={isRefreshingStatus}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isRefreshingStatus ? "Refreshing..." : "Refresh Status"}
                  </button>
                </div>
              </div>
            )}

            {/* Approved Payment Notice */}
            {!isPro && paymentRequests.some((r) => r.status === "APPROVED") && (
              <div className="bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-900 dark:text-green-100">
                        Payment Approved!
                      </h4>
                      <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                        Your payment has been approved. Click "Refresh Status"
                        to update your plan to Pro.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRefreshStatus}
                    disabled={isRefreshingStatus}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isRefreshingStatus ? "Refreshing..." : "Refresh Status"}
                  </button>
                </div>
              </div>
            )}

            {isPro ? (
              <>
                {subscription?.endDate && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your Pro plan is active until{" "}
                    {new Date(subscription.endDate).toLocaleDateString()}
                  </p>
                )}
                <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Pro Plan Benefits
                  </h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>✓ Unlimited Domain Idea validations</li>
                    <li>✓ Deep AI-powered analysis</li>
                    <li>✓ Export reports to PDF</li>
                    <li>✓ Priority support</li>
                    <li>✓ Trending Domain Ideas alerts</li>
                  </ul>
                </div>
                <button
                  onClick={handleCancelSubscription}
                  disabled={isCanceling}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isCanceling ? "Processing.." : "Downgrade to Free"}
                </button>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Upgrade to Pro for unlimited validations, deep analysis, and
                  export features
                </p>
                <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Pro Plan Includes:
                  </h4>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>✓ Unlimited Domain Idea validations</li>
                    <li>✓ Deep AI-powered analysis</li>
                    <li>✓ Export reports to PDF</li>
                    <li>✓ Priority support</li>
                    <li>✓ Trending Domain Ideas alerts</li>
                  </ul>
                  <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">₹2500/month</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowBankTransfer(!showBankTransfer)}
                  className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all"
                >
                  {showBankTransfer
                    ? "Hide Payment Form"
                    : "Upgrade via Bank Transfer"}
                </button>

                {/* Bank Transfer Form */}
                {showBankTransfer && (
                  <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 space-y-4 bg-white dark:bg-gray-900">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Bank Transfer Details
                      </h4>
                      <div className="bg-gray-50 dark:bg-gray-950 p-3 rounded text-sm space-y-1">
                        <p>
                          <strong>Bank Name:</strong> Example Bank
                        </p>
                        <p>
                          <strong>Account Name:</strong> MarshAI Ltd
                        </p>
                        <p>
                          <strong>Account Number:</strong> 1234567890
                        </p>
                        <p>
                          <strong>Amount:</strong> ₹2500.00
                        </p>
                      </div>
                    </div>

                    <form
                      onSubmit={handleBankTransferSubmit}
                      className="space-y-4"
                    >
                      <div>
                        <label
                          htmlFor="transactionId"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Transaction ID / Reference Number
                        </label>
                        <input
                          type="text"
                          id="transactionId"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your transaction ID"
                          required
                          minLength={5}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="invoice"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Upload Payment Proof (JPG, PNG, or PDF)
                        </label>
                        <div className="flex items-center gap-2">
                          <label className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                            <Upload className="w-4 h-4 mr-2" />
                            {invoiceFile ? invoiceFile.name : "Choose file"}
                            <input
                              type="file"
                              id="invoice"
                              accept="image/jpeg,image/jpg,image/png,application/pdf"
                              onChange={handleFileChange}
                              className="hidden"
                              required
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Max file size: 5MB
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={isSubmittingPayment}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {isSubmittingPayment
                            ? "Submitting..."
                            : "Submit Payment Request"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowBankTransfer(false);
                            setTransactionId("");
                            setInvoiceFile(null);
                          }}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Payment Requests History */}
                {paymentRequests.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                      Payment Requests
                    </h4>
                    <div className="space-y-2">
                      {paymentRequests.map((request) => (
                        <div
                          key={request.id}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-950 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              Transaction: {request.transactionId}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
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
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Security</h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Manage your password and security settings
            </p>
          </div>
          <div className="px-6 py-4 space-y-4">
            {!isChangingPassword ? (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">••••••••</p>
                </div>
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
                >
                  Change Password
                </button>
              </>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Current Password
                  </label>
                  <PasswordInput
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    New Password
                  </label>
                  <PasswordInput
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    minLength={6}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Must be at least 6 characters
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Confirm New Password
                  </label>
                  <PasswordInput
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    minLength={6}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isUpdatingPassword ? "Changing..." : "Change Password"}
                  </button>
                  <button
                    type="button"
                    onClick={cancelChangingPassword}
                    disabled={isUpdatingPassword}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Notifications
              </h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Manage your notification preferences
            </p>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Email Notifications</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive email when validations are complete
                </p>
              </div>
              <button
                disabled
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  Trending Domain Ideas Alert
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get notified about trending Domain Ideas (Pro only)
                </p>
              </div>
              <button
                disabled
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-red-200 dark:border-red-800 shadow-sm">
          <div className="px-6 py-4 border-b border-red-200 dark:border-red-800">
            <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Irreversible actions</p>
          </div>
          <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                Delete your account
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Permanently remove your account, reports and subscription data.
                This cannot be undone.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={closeDeleteModal}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg border border-red-200 dark:border-red-800 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleDeleteAccount}>
              <div className="px-6 py-4 border-b border-red-200 dark:border-red-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
                  Delete account?
                </h3>
              </div>

              <div className="px-6 py-4 space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This will permanently delete your profile, all validation
                  reports, usage history and payment records.
                  {isPro && " Your Pro subscription will also be lost with no refund."}{" "}
                  This action cannot be undone.
                </p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Enter your password
                  </label>
                  <div className="relative">
                    <input
                      type={showDeletePassword ? "text" : "password"}
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      autoComplete="current-password"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowDeletePassword((v) => !v)}
                      className="absolute inset-y-0 right-0 px-3 text-gray-500 dark:text-gray-400"
                      aria-label="Toggle password visibility"
                    >
                      {showDeletePassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type <span className="font-bold text-red-600 dark:text-red-400">DELETE</span> to confirm
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={isDeletingAccount}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    isDeletingAccount ||
                    deleteConfirmText !== "DELETE" ||
                    !deletePassword
                  }
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeletingAccount ? "Deleting..." : "Delete My Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}