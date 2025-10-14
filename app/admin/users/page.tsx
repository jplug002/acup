"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  phone: string | null
  role: string
  status: string
  created_at: string
}

interface EmailFormData {
  recipients: string[] | "all"
  subject: string
  message: string
}

interface SMSFormData {
  recipients: number[] | "all"
  message: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Email modal state
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailForm, setEmailForm] = useState<EmailFormData>({
    recipients: [],
    subject: "",
    message: "",
  })
  const [sendingEmail, setSendingEmail] = useState(false)
  const [emailResult, setEmailResult] = useState<string | null>(null)

  // SMS modal state
  const [showSMSModal, setShowSMSModal] = useState(false)
  const [smsForm, setSmsForm] = useState<SMSFormData>({
    recipients: [],
    message: "",
  })
  const [sendingSMS, setSendingSMS] = useState(false)
  const [smsResult, setSmsResult] = useState<string | null>(null)

  // Fetch users from API
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/users")
      if (!response.ok) throw new Error("Failed to fetch users")
      const data = await response.json()
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  // Open email modal for single user
  const openEmailModal = (user?: User) => {
    if (user) {
      setEmailForm({
        recipients: [user.email],
        subject: "",
        message: `Dear ${user.first_name},\n\n`,
      })
    } else {
      // Send to all users
      setEmailForm({
        recipients: "all",
        subject: "",
        message: "Dear {name},\n\n",
      })
    }
    setEmailResult(null)
    setShowEmailModal(true)
  }

  // Open SMS modal for single user
  const openSMSModal = (user?: User) => {
    if (user) {
      setSmsForm({
        recipients: [user.id],
        message: `Hi ${user.first_name}, `,
      })
    } else {
      // Send to all users
      setSmsForm({
        recipients: "all",
        message: "Hi {name}, ",
      })
    }
    setSmsResult(null)
    setShowSMSModal(true)
  }

  // Handle email submission
  const handleSendEmail = async () => {
    try {
      setSendingEmail(true)
      setEmailResult(null)

      const response = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailForm),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send email")
      }

      setEmailResult(data.message || "Email sent successfully!")

      // Reset form after 2 seconds
      setTimeout(() => {
        setShowEmailModal(false)
        setEmailForm({ recipients: [], subject: "", message: "" })
      }, 2000)
    } catch (err) {
      setEmailResult(err instanceof Error ? err.message : "Failed to send email")
    } finally {
      setSendingEmail(false)
    }
  }

  // Handle SMS submission
  const handleSendSMS = async () => {
    try {
      setSendingSMS(true)
      setSmsResult(null)

      const response = await fetch("/api/admin/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(smsForm),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send SMS")
      }

      setSmsResult(data.message || "SMS sent successfully!")

      // Reset form after 2 seconds
      setTimeout(() => {
        setShowSMSModal(false)
        setSmsForm({ recipients: [], message: "" })
      }, 2000)
    } catch (err) {
      setSmsResult(err instanceof Error ? err.message : "Failed to send SMS")
    } finally {
      setSendingSMS(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={fetchUsers} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="flex h-auto md:h-16 items-center justify-between px-4 sm:px-6 py-3 md:py-0 flex-col md:flex-row gap-3 md:gap-0">
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <Link
              href="/admin"
              className="text-red-600 hover:text-red-700 font-medium transition-colors text-sm md:text-base"
            >
              ← Back to Admin
            </Link>
            <div className="h-6 w-px bg-gray-300 hidden md:block"></div>
            <h1 className="text-lg md:text-xl font-semibold text-gray-900">User Management</h1>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => openEmailModal()}
              className="flex-1 md:flex-none px-3 md:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs md:text-sm"
            >
              📧 Email All
            </button>
            <button
              onClick={() => openSMSModal()}
              className="flex-1 md:flex-none px-3 md:px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-xs md:text-sm"
            >
              💬 SMS All
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-3 md:p-6">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <h2 className="text-base md:text-lg font-semibold text-gray-900">Registered Users</h2>
            <p className="text-xs md:text-sm text-gray-600 mt-1">Total: {users.length} users</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Full Name
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Registration Date
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-xs md:text-sm font-medium text-gray-900">
                        {user.first_name} {user.last_name}
                      </div>
                      <div className="text-xs text-gray-500">{user.role}</div>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-xs md:text-sm text-gray-900 truncate max-w-[150px] md:max-w-none">
                        {user.email}
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-xs md:text-sm text-gray-900">
                        {user.phone || <span className="text-gray-400 italic">No phone</span>}
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-xs md:text-sm text-gray-900">
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm">
                      <div className="flex flex-col md:flex-row gap-1 md:gap-2">
                        <button
                          onClick={() => openEmailModal(user)}
                          className="px-2 md:px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs whitespace-nowrap"
                        >
                          Send Email
                        </button>
                        {user.phone && (
                          <button
                            onClick={() => openSMSModal(user)}
                            className="px-2 md:px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-xs whitespace-nowrap"
                          >
                            Send SMS
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-sm md:text-base">No users found</p>
            </div>
          )}
        </div>
      </main>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 md:p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6 border-b border-gray-200">
              <h3 className="text-base md:text-lg font-semibold text-gray-900">Send Email</h3>
              <p className="text-xs md:text-sm text-gray-600 mt-1">
                {emailForm.recipients === "all"
                  ? `Sending to all ${users.length} users`
                  : `Sending to ${Array.isArray(emailForm.recipients) ? emailForm.recipients.length : 0} user(s)`}
              </p>
            </div>

            <div className="p-4 md:p-6 space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Subject *</label>
                <input
                  type="text"
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                  placeholder="Enter email subject"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Message *</label>
                <textarea
                  value={emailForm.message}
                  onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                  placeholder="Enter your message here..."
                  rows={6}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tip: Use {"{name}"} to personalize the message with the recipient's name
                </p>
              </div>

              {emailResult && (
                <div
                  className={`p-3 md:p-4 rounded-md text-sm ${
                    emailResult.includes("success") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                  }`}
                >
                  {emailResult}
                </div>
              )}
            </div>

            <div className="p-4 md:p-6 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => setShowEmailModal(false)}
                disabled={sendingEmail}
                className="px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                disabled={sendingEmail || !emailForm.subject || !emailForm.message}
                className="px-3 md:px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingEmail ? "Sending..." : "Send Email"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SMS Modal */}
      {showSMSModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 md:p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6 border-b border-gray-200">
              <h3 className="text-base md:text-lg font-semibold text-gray-900">Send SMS</h3>
              <p className="text-xs md:text-sm text-gray-600 mt-1">
                {smsForm.recipients === "all"
                  ? `Sending to all users with phone numbers`
                  : `Sending to ${Array.isArray(smsForm.recipients) ? smsForm.recipients.length : 0} user(s)`}
              </p>
            </div>

            <div className="p-4 md:p-6 space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  Message * (Max 160 characters)
                </label>
                <textarea
                  value={smsForm.message}
                  onChange={(e) => setSmsForm({ ...smsForm, message: e.target.value })}
                  placeholder="Enter your SMS message here..."
                  rows={4}
                  maxLength={160}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {smsForm.message.length}/160 characters
                  <br />
                  Tip: Use {"{name}"} to personalize the message with the recipient's name
                </p>
              </div>

              {smsResult && (
                <div
                  className={`p-3 md:p-4 rounded-md text-sm ${
                    smsResult.includes("success") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                  }`}
                >
                  {smsResult}
                </div>
              )}
            </div>

            <div className="p-4 md:p-6 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => setShowSMSModal(false)}
                disabled={sendingSMS}
                className="px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendSMS}
                disabled={sendingSMS || !smsForm.message}
                className="px-3 md:px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingSMS ? "Sending..." : "Send SMS"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
