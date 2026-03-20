"use client";
import { useState } from "react";

export default function NotificationsSettings() {
  const [activeTab, setActiveTab] = useState('enable-disable');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tab Headers */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-8">
          <div className="flex gap-8 pt-6">
            <button
              onClick={() => setActiveTab('enable-disable')}
              className={`pb-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'enable-disable'
                  ? 'text-[#003174] border-[#003174]'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              Enable / Disable
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`pb-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'templates'
                  ? 'text-[#003174] border-[#003174]'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              Templates
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-5xl mx-auto px-8 py-8">
        {activeTab === 'enable-disable' && (
          <div className="space-y-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Settings</h2>
            
            <div className="space-y-6">
              {/* Email Notifications */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">New Lead Assigned</p>
                      <p className="text-sm text-gray-600">Receive email when a new lead is assigned to you</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#003174] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003174]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Task Due Reminder</p>
                      <p className="text-sm text-gray-600">Get notified when a task is due soon</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#003174] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003174]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Payment Received</p>
                      <p className="text-sm text-gray-600">Notification when a payment is received</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#003174] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003174]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Invoice Generated</p>
                      <p className="text-sm text-gray-600">Email when a new invoice is created</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#003174] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003174]"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* In-App Notifications */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">In-App Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Lead Status Changed</p>
                      <p className="text-sm text-gray-600">Show notification when lead status is updated</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#003174] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003174]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">New Comments</p>
                      <p className="text-sm text-gray-600">Notify when someone comments on your tasks</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#003174] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003174]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">System Announcements</p>
                      <p className="text-sm text-gray-600">Important system updates and announcements</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#003174] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003174]"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* SMS Notifications */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">SMS Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Urgent Tasks</p>
                      <p className="text-sm text-gray-600">SMS for high-priority tasks</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#003174] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003174]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Payment Alerts</p>
                      <p className="text-sm text-gray-600">SMS for payment confirmations</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#003174] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003174]"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button className="px-6 py-2.5 bg-[#003174] text-white text-sm font-medium rounded-lg hover:bg-[#002557] transition-colors">
                  Save Notification Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Templates</h2>
            
            <div className="space-y-6">
              {/* Email Templates */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Email Templates</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Email Subject</label>
                    <input
                      type="text"
                      defaultValue="Welcome to BizzCRM!"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Email Body</label>
                    <textarea
                      rows={6}
                      defaultValue="Hi {{name}},&#10;&#10;Welcome to BizzCRM! We're excited to have you on board.&#10;&#10;Get started by setting up your profile and exploring the dashboard.&#10;&#10;Best regards,&#10;The BizzCRM Team"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent"
                    />
                    <p className="mt-2 text-sm text-gray-600">Available variables: {`{{name}}, {{email}}, {{company}}`}</p>
                  </div>
                </div>
              </div>

              {/* Lead Assignment Template */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Lead Assignment Template</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject Line</label>
                    <input
                      type="text"
                      defaultValue="New Lead Assigned: {{lead_name}}"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message Body</label>
                    <textarea
                      rows={6}
                      defaultValue="Hi {{assignee_name}},&#10;&#10;A new lead has been assigned to you:&#10;&#10;Lead Name: {{lead_name}}&#10;Company: {{lead_company}}&#10;Email: {{lead_email}}&#10;Phone: {{lead_phone}}&#10;&#10;Please follow up at your earliest convenience."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent"
                    />
                    <p className="mt-2 text-sm text-gray-600">Available variables: {`{{assignee_name}}, {{lead_name}}, {{lead_company}}, {{lead_email}}, {{lead_phone}}`}</p>
                  </div>
                </div>
              </div>

              {/* Task Reminder Template */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Task Reminder Template</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject Line</label>
                    <input
                      type="text"
                      defaultValue="Task Due Soon: {{task_name}}"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message Body</label>
                    <textarea
                      rows={6}
                      defaultValue="Hi {{assignee_name}},&#10;&#10;This is a reminder that your task is due soon:&#10;&#10;Task: {{task_name}}&#10;Due Date: {{due_date}}&#10;Priority: {{priority}}&#10;&#10;Please make sure to complete it on time."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent"
                    />
                    <p className="mt-2 text-sm text-gray-600">Available variables: {`{{assignee_name}}, {{task_name}}, {{due_date}}, {{priority}}`}</p>
                  </div>
                </div>
              </div>

              {/* Payment Confirmation Template */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Confirmation Template</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject Line</label>
                    <input
                      type="text"
                      defaultValue="Payment Received - Invoice {{invoice_number}}"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message Body</label>
                    <textarea
                      rows={6}
                      defaultValue="Hi {{customer_name}},&#10;&#10;We've received your payment. Thank you!&#10;&#10;Invoice Number: {{invoice_number}}&#10;Amount Paid: {{amount}}&#10;Payment Date: {{payment_date}}&#10;Payment Method: {{payment_method}}&#10;&#10;Your payment has been successfully processed."
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003174] focus:border-transparent"
                    />
                    <p className="mt-2 text-sm text-gray-600">Available variables: {`{{customer_name}}, {{invoice_number}}, {{amount}}, {{payment_date}}, {{payment_method}}`}</p>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button className="px-6 py-2.5 bg-[#003174] text-white text-sm font-medium rounded-lg hover:bg-[#002557] transition-colors">
                  Save Templates
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
