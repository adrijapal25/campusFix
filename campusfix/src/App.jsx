import React, { useState } from 'react';
import { 
  AlertCircle, CheckCircle2, Clock, Plus, Search, 
  Wrench, Wifi, Droplets, Zap, Building2, ShieldCheck 
} from 'lucide-react';

const INITIAL_ISSUES = [
  {
    id: 'CF-101',
    title: 'Projector flickering in Lecture Hall 3',
    category: 'Equipment',
    location: 'Main Academic Block - Room 302',
    urgency: 'High',
    status: 'In Progress',
    reportedBy: 'Rohan S.',
    date: '2 hours ago',
    description: 'HDMI port seems loose; screen cuts out every 5 minutes during lectures.'
  },
  {
    id: 'CF-102',
    title: 'Wi-Fi dead zone on 2nd floor',
    category: 'Network',
    location: 'Boys Hostel B - 2nd Floor',
    urgency: 'Critical',
    status: 'Pending',
    reportedBy: 'Ananya M.',
    date: '5 hours ago',
    description: 'Router near Room 214 has a blinking red light. No internet access since morning.'
  },
  {
    id: 'CF-103',
    title: 'Water cooler leaking near library entrance',
    category: 'Plumbing',
    location: 'Central Library - Ground Floor',
    urgency: 'Medium',
    status: 'Resolved',
    reportedBy: 'Karthik V.',
    date: '1 day ago',
    description: 'Continuous drip creating a puddle near the main stairs.'
  }
];

export default function App() {
  const [issues, setIssues] = useState(INITIAL_ISSUES);
  const [role, setRole] = useState('student'); // 'student' | 'admin'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newIssue, setNewIssue] = useState({
    title: '',
    category: 'Equipment',
    location: '',
    urgency: 'Medium',
    description: ''
  });

  // Handle New Issue Submission
  const handleAddIssue = (e) => {
    e.preventDefault();
    const created = {
      id: `CF-${100 + issues.length + 1}`,
      ...newIssue,
      status: 'Pending',
      reportedBy: 'You (Student)',
      date: 'Just now'
    };
    setIssues([created, ...issues]);
    setNewIssue({ title: '', category: 'Equipment', location: '', urgency: 'Medium', description: '' });
    setIsModalOpen(false);
  };

  // Handle Admin Status Update
  const handleStatusChange = (id, newStatus) => {
    setIssues(issues.map(issue => 
      issue.id === id ? { ...issue, status: newStatus } : issue
    ));
  };

  // Filter Logic
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          issue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          issue.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || issue.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || issue.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // UI Helpers
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Resolved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'Critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Medium': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Network': return <Wifi className="w-4 h-4 text-indigo-500" />;
      case 'Plumbing': return <Droplets className="w-4 h-4 text-cyan-500" />;
      case 'Electrical': return <Zap className="w-4 h-4 text-amber-500" />;
      default: return <Wrench className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Wrench className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              Campus<span className="text-indigo-600">Fix</span>
            </span>
          </div>

          {/* Role Toggle (Demo Feature) */}
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
              <button
                onClick={() => setRole('student')}
                className={`px-3 py-1.5 rounded-md transition ${
                  role === 'student' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Student View
              </button>
              <button
                onClick={() => setRole('admin')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1 transition ${
                  role === 'admin' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Staff Admin
              </button>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              Report Issue
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-medium text-slate-500 uppercase">Total Tickets</p>
            <p className="text-2xl font-bold mt-1">{issues.length}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-medium text-amber-600 uppercase">Pending</p>
            <p className="text-2xl font-bold mt-1">{issues.filter(i => i.status === 'Pending').length}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-medium text-blue-600 uppercase">In Progress</p>
            <p className="text-2xl font-bold mt-1">{issues.filter(i => i.status === 'In Progress').length}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-medium text-emerald-600 uppercase">Resolved</p>
            <p className="text-2xl font-bold mt-1">{issues.filter(i => i.status === 'Resolved').length}</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by ID, issue, or building..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Categories</option>
              <option value="Equipment">Equipment</option>
              <option value="Network">Network / Wi-Fi</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Issues List */}
        <div className="space-y-4">
          {filteredIssues.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <p className="text-slate-500 text-sm">No campus issues match your filters.</p>
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <div key={issue.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {issue.id}
                      </span>
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${getStatusBadge(issue.status)}`}>
                        {issue.status}
                      </span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded border ${getUrgencyBadge(issue.urgency)}`}>
                        {issue.urgency} Priority
                      </span>
                    </div>
                    <h3 className="font-semibold text-base text-slate-900 pt-1">{issue.title}</h3>
                    <p className="text-sm text-slate-600">{issue.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
                      <span className="flex items-center gap-1">
                        {getCategoryIcon(issue.category)} {issue.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" /> {issue.location}
                      </span>
                      <span>Reported by {issue.reportedBy} • {issue.date}</span>
                    </div>
                  </div>

                  {/* Admin Controls */}
                  {role === 'admin' && (
                    <div className="sm:border-l sm:pl-4 border-slate-100 flex sm:flex-col gap-2 shrink-0">
                      <label className="text-[11px] font-semibold text-slate-400 uppercase">Update Status</label>
                      <select
                        value={issue.status}
                        onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                        className="text-xs font-medium border border-slate-300 rounded-lg px-2.5 py-1.5 bg-slate-50 hover:bg-white cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Report Issue Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Report a Campus Issue</h2>
            <form onSubmit={handleAddIssue} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g., Broken AC in Lab 2"
                  value={newIssue.title}
                  onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newIssue.category}
                    onChange={(e) => setNewIssue({ ...newIssue, category: e.target.value })}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white"
                  >
                    <option value="Equipment">Equipment</option>
                    <option value="Network">Network / Wi-Fi</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Urgency</label>
                  <select
                    value={newIssue.urgency}
                    onChange={(e) => setNewIssue({ ...newIssue, urgency: e.target.value })}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Exact Location</label>
                <input
                  required
                  type="text"
                  placeholder="e.g., Block A, 2nd Floor, Room 204"
                  value={newIssue.location}
                  onChange={(e) => setNewIssue({ ...newIssue, location: e.target.value })}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Provide details to help maintenance locate and fix the issue..."
                  value={newIssue.description}
                  onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}