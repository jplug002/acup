"use client"

import { useState } from "react"
import Link from "next/link"
import BranchManager from "@/components/admin/BranchManager"
import IdeologyManager from "@/components/admin/IdeologyManager"
import EventManager from "@/components/admin/EventManager"
import ArticleManager from "@/components/admin/ArticleManager"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "branches", label: "Branches", icon: "🏢" },
    { id: "ideologies", label: "Ideologies", icon: "💡" },
    { id: "events", label: "Events", icon: "📅" },
    { id: "articles", label: "Articles", icon: "📝" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-blue-600 hover:text-blue-800 mr-4">
                ← Back to Site
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">ACUP Admin Dashboard</h1>
            </div>
            <div className="text-sm text-gray-500">Welcome, Admin</div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === "overview" && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <div className="text-blue-600 text-2xl mr-3">🏢</div>
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total Branches</p>
                      <p className="text-2xl font-bold text-blue-900">12</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <div className="text-green-600 text-2xl mr-3">💡</div>
                    <div>
                      <p className="text-sm font-medium text-green-600">Ideologies</p>
                      <p className="text-2xl font-bold text-green-900">8</p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <div className="text-purple-600 text-2xl mr-3">📅</div>
                    <div>
                      <p className="text-sm font-medium text-purple-600">Upcoming Events</p>
                      <p className="text-2xl font-bold text-purple-900">5</p>
                    </div>
                  </div>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <div className="text-orange-600 text-2xl mr-3">📝</div>
                    <div>
                      <p className="text-sm font-medium text-orange-600">Published Articles</p>
                      <p className="text-2xl font-bold text-orange-900">24</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "branches" && (
            <div className="p-6">
              <BranchManager />
            </div>
          )}

          {activeTab === "ideologies" && (
            <div className="p-6">
              <IdeologyManager />
            </div>
          )}

          {activeTab === "events" && (
            <div className="p-6">
              <EventManager />
            </div>
          )}

          {activeTab === "articles" && (
            <div className="p-6">
              <ArticleManager />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
