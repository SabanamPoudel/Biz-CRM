"use client";
import { useState } from "react";

export default function GeneralSettings() {
  const [activeTab, setActiveTab] = useState('company-info');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tab Headers */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-8">
          <div className="flex gap-8 pt-6">
            <button
              onClick={() => setActiveTab('company-info')}
              className={`pb-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'company-info'
                  ? 'text-[#003174] border-[#003174]'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              Company Info
            </button>
            <button
              onClick={() => setActiveTab('email-setup')}
              className={`pb-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'email-setup'
                  ? 'text-[#003174] border-[#003174]'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              Email Setup
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`pb-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'security'
                  ? 'text-[#003174] border-[#003174]'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              Security
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-5xl mx-auto px-8 py-8">
        {activeTab === 'company-info' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Company Information</h2>

            <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
              <div className="p-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">Company Name</label>
                <input type="text" placeholder="Enter company name" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent" />
              </div>
              <div className="p-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">Company Email</label>
                <input type="email" placeholder="company@example.com" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent" />
              </div>
              <div className="p-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">Phone Number</label>
                <input type="tel" placeholder="+1 (555) 000-0000" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent" />
              </div>
              <div className="p-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">Website</label>
                <input type="url" placeholder="https://www.example.com" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent" />
              </div>
              <div className="p-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">Business Address</label>
                <textarea rows={3} placeholder="Enter your business address" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent resize-none" />
              </div>
              <div className="p-6 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">City</label>
                  <input type="text" placeholder="City" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">State/Province</label>
                  <input type="text" placeholder="State" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent" />
                </div>
              </div>
              <div className="p-6 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Postal Code</label>
                  <input type="text" placeholder="12345" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Country</label>
                  <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent">
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Australia</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button className="px-6 py-2.5 bg-[#003174] text-white text-sm font-medium rounded-lg hover:bg-[#002557] transition-colors">Save Changes</button>
            </div>
          </div>
        )}

        {activeTab === 'email-setup' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Email Setup</h2>
            <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
              <div className="p-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">SMTP Host</label>
                <input type="text" placeholder="smtp.example.com" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent" />
              </div>
              <div className="p-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">SMTP Port</label>
                <input type="number" placeholder="587" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent" />
              </div>
              <div className="p-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">SMTP Username</label>
                <input type="text" placeholder="username@example.com" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent" />
              </div>
              <div className="p-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">SMTP Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent" />
              </div>
              <div className="p-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">From Email</label>
                <input type="email" placeholder="noreply@example.com" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent" />
              </div>
              <div className="p-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">From Name</label>
                <input type="text" placeholder="Your Company Name" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent" />
              </div>
              <div className="p-6 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Enable SSL/TLS</div>
                  <div className="text-sm text-gray-600">Secure your email connection</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003174]"></div>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button className="px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">Test Connection</button>
              <button className="px-6 py-2.5 bg-[#003174] text-white text-sm font-medium rounded-lg hover:bg-[#002557] transition-colors">Save Changes</button>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
            <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
              <div className="p-6 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Two-Factor Authentication</div>
                  <div className="text-sm text-gray-600">Add an extra layer of security</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003174]"></div>
                </label>
              </div>
              <div className="p-6 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Login Notifications</div>
                  <div className="text-sm text-gray-600">Get notified of new login attempts</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003174]"></div>
                </label>
              </div>
              <div className="p-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">Session Timeout (minutes)</label>
                <input type="number" defaultValue="30" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent" />
              </div>
              <div className="p-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">Password Requirements</label>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center">
                    <input type="checkbox" className="w-4 h-4 text-[#003174] border-gray-300 rounded focus:ring-[#003174]" defaultChecked />
                    <label className="ml-3 text-sm text-gray-700">Minimum 8 characters</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="w-4 h-4 text-[#003174] border-gray-300 rounded focus:ring-[#003174]" defaultChecked />
                    <label className="ml-3 text-sm text-gray-700">Require uppercase letters</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="w-4 h-4 text-[#003174] border-gray-300 rounded focus:ring-[#003174]" defaultChecked />
                    <label className="ml-3 text-sm text-gray-700">Require numbers</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" className="w-4 h-4 text-[#003174] border-gray-300 rounded focus:ring-[#003174]" />
                    <label className="ml-3 text-sm text-gray-700">Require special characters</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button className="px-6 py-2.5 bg-[#003174] text-white text-sm font-medium rounded-lg hover:bg-[#002557] transition-colors">Save Changes</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
