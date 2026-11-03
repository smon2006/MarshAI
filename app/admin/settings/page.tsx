"use client";
import { Settings, Globe, Mail, Database, Shield } from "lucide-react";
import { RedditIcon, GoogleIcon } from "@/components/BrandLogos";

export default function AdminSettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Admin Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Configure platform settings and preferences
        </p>
      </div>

      {/* General Settings */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              General Settings
            </h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Platform-wide configuration
          </p>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Platform Name
            </label>
            <input
              type="text"
              value="MarshAI"
              disabled
              className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-950"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Support Email
            </label>
            <input
              type="email"
              placeholder="support@MarshAI.com"
              disabled
              className="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-950"
            />
          </div>
          <button
            disabled
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg cursor-not-allowed opacity-50"
          >
            Save Changes (Coming Soon)
          </button>
        </div>
      </div>

      {/* Email Configuration */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Email Configuration
            </h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Email service provider settings
          </p>
        </div>
        <div className="px-6 py-4 space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Configure email service (SendGrid, Mailgun, etc.) for sending
            notifications
          </p>
          <button
            disabled
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg cursor-not-allowed opacity-50"
          >
            Configure Email (Coming Soon)
          </button>
        </div>
      </div>

      {/* API Keys */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">API Keys</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Manage external API integrations
          </p>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-950 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">OpenAI API</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  GPT-4 for market insights
                </p>
              </div>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                ✓ Connected
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-950 rounded-lg">
              <div className="flex items-center gap-3">
                <RedditIcon className="w-6 h-6 text-orange-500 dark:text-orange-400" />
                <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Reddit API</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Community analysis</p>
              </div>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Optional
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-950 rounded-lg">
              <div className="flex items-center gap-3">
                <GoogleIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Google Trends</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Search trends data</p>
              </div>
              </div>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                ✓ Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Security</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Platform security settings
          </p>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                Two-Factor Authentication
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Require 2FA for admin accounts
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
              <p className="font-medium text-gray-900 dark:text-gray-100">API Rate Limiting</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Protect against abuse</p>
            </div>
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">
              ✓ Enabled
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}