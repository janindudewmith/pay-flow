import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import { getApiWithToken } from '../utils/axios';

const HeadDashboard = () => {
  // State for requests data
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  // Filter states
  const [statusFilter, setStatusFilter] = useState('pending');
  const [formTypeFilter, setFormTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  // Stats for dashboard
  const [stats, setStats] = useState({
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    departmentMembers: 0
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage] = useState(10);

  // Department head info (would come from auth context in a real app)
  const [departmentInfo, setDepartmentInfo] = useState({
    name: 'Electrical & Information Engineering',
    code: 'eie',
    head: 'Prof. Samantha Perera'
  });

  // Function to fetch requests data
  const fetchRequests = async () => {
    setIsRefreshing(true);
    try {
      // Get authenticated API instance
      const api = await getApiWithToken();

      console.log('HeadDashboard: Fetching forms from API...');

      // Fetch all forms from the backend
      const response = await api.get('/api/forms/all-forms');

      console.log('HeadDashboard: API response received:', response.data);

      if (response.data && response.data.success) {
        const formsData = response.data.data || [];

        console.log('HeadDashboard: Forms data received:', formsData);

        if (formsData.length === 0) {
          console.log('HeadDashboard: No forms data received');
          setRequests([]);
          setStats({
            pendingRequests: 0,
            approvedRequests: 0,
            rejectedRequests: 0,
            departmentMembers: 15
          });
          setIsLoading(false);
          setIsRefreshing(false);
          setLastRefreshed(new Date());
          return;
        }

        // Transform the data to match the expected format
        const transformedData = formsData.map(form => {
          console.log('Processing form:', form);

          // Extract the amount from formData based on form type
          let amount = 0;
          try {
            if (form.formType === 'petty_cash') {
              amount = parseFloat(form.formData.basicInfo?.amountRs || 0);
            } else if (form.formType === 'exam_duty') {
              amount = parseFloat(form.formData.basicInfo?.totalAmount || 0);
            } else if (form.formType === 'transport') {
              amount = parseFloat(form.formData.basicInfo?.totalRequested || 0);
            } else if (form.formType === 'overtime') {
              amount = parseFloat(form.formData.basicInfo?.amountInFigures || 0);
            } else if (form.formType === 'paper_marking') {
              amount = parseFloat(form.formData.basicInfo?.totalAmount || 0);
            }
          } catch (error) {
            console.error('Error parsing amount:', error);
          }

          // Format the form type for display
          const displayFormType = form.formType
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

          return {
            id: form._id,
            formType: displayFormType,
            userEmail: form.submittedBy?.email || 'unknown@example.com',
            submittedAt: form.createdAt || new Date().toISOString(),
            status: form.status === 'pending_hod_approval' ? 'pending' :
              form.status === 'pending_finance_approval' ? 'approved' : form.status,
            currentApprover: form.status === 'pending_hod_approval' ? 'department_head' : 'finance_officer',
            amount: amount,
            formData: {
              requestorName: form.submittedBy?.fullName || 'Unknown User',
              officerName: form.submittedBy?.fullName || 'Unknown User',
              nameOfApplicant: form.submittedBy?.fullName || 'Unknown User',
              examinerName: form.submittedBy?.fullName || 'Unknown User',
              position: form.formData?.basicInfo?.position || 'Faculty Member'
            }
          };
        });

        console.log('HeadDashboard: Transformed data:', transformedData);

        setRequests(transformedData);

        // Calculate stats
        const pendingCount = transformedData.filter(req => req.status === 'pending').length;
        const approvedCount = transformedData.filter(req => req.status === 'approved').length;
        const rejectedCount = transformedData.filter(req => req.status === 'rejected').length;

        setStats({
          pendingRequests: pendingCount,
          approvedRequests: approvedCount,
          rejectedRequests: rejectedCount,
          departmentMembers: 15 // This would come from a separate API call in a real app
        });
      } else {
        console.error('HeadDashboard: API response indicates failure:', response.data);
        throw new Error('Failed to fetch forms data');
      }
    } catch (err) {
      console.error('HeadDashboard: Error fetching requests:', err);
      setError('Failed to fetch requests. Please try again later.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setLastRefreshed(new Date());
    }
  };

  // Fetch requests data on component mount
  useEffect(() => {
    setIsLoading(true);
    fetchRequests();
  }, [departmentInfo.code]);

  // Handle manual refresh
  const handleRefresh = () => {
    fetchRequests();
  };

  // Format date for display
  const formatDateTime = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Apply filters
  useEffect(() => {
    let result = [...requests];

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(req => req.status === statusFilter);
    }

    // Form type filter
    if (formTypeFilter !== 'all') {
      result = result.filter(req => req.formType === formTypeFilter);
    }

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(req =>
        req.formType.toLowerCase().includes(query) ||
        req.userEmail.toLowerCase().includes(query) ||
        req.formData.requestorName?.toLowerCase().includes(query) ||
        req.formData.officerName?.toLowerCase().includes(query) ||
        req.formData.nameOfApplicant?.toLowerCase().includes(query) ||
        req.formData.examinerName?.toLowerCase().includes(query)
      );
    }

    // Date range
    if (dateRange.from) {
      const fromDate = new Date(dateRange.from);
      result = result.filter(req => new Date(req.submittedAt) >= fromDate);
    }

    if (dateRange.to) {
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59);
      result = result.filter(req => new Date(req.submittedAt) <= toDate);
    }

    setFilteredRequests(result);
  }, [requests, statusFilter, formTypeFilter, searchQuery, dateRange]);

  // Get current requests for pagination
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Handle approve/reject actions
  const handleApprove = async (id) => {
    try {
      const api = await getApiWithToken();

      // In a real implementation, we would first request an OTP
      // For now, we'll simulate approval directly
      const response = await api.post(`/api/forms/${id}/action`, {
        action: 'approve',
        comments: 'Approved by department head',
        otp: '123456' // In a real app, this would be entered by the user after receiving it via email
      });

      if (response.data && response.data.success) {
        alert(`Request ${id} approved successfully!`);

        // Update the local state to reflect the change
        setRequests(prevRequests =>
          prevRequests.map(req =>
            req.id === id
              ? { ...req, status: 'approved', currentApprover: 'finance_officer' }
              : req
          )
        );

        // Update stats
        setStats(prevStats => ({
          ...prevStats,
          pendingRequests: prevStats.pendingRequests - 1,
          approvedRequests: prevStats.approvedRequests + 1
        }));
      } else {
        alert('Failed to approve request. Please try again.');
      }
    } catch (error) {
      console.error('Error approving request:', error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleReject = async (id) => {
    try {
      const reason = prompt('Please provide a reason for rejection:');
      if (!reason) return; // User cancelled

      const api = await getApiWithToken();

      // In a real implementation, we would first request an OTP
      // For now, we'll simulate rejection directly
      const response = await api.post(`/api/forms/${id}/action`, {
        action: 'reject',
        comments: reason,
        otp: '123456' // In a real app, this would be entered by the user after receiving it via email
      });

      if (response.data && response.data.success) {
        alert(`Request ${id} rejected successfully!`);

        // Update the local state to reflect the change
        setRequests(prevRequests =>
          prevRequests.map(req =>
            req.id === id
              ? { ...req, status: 'rejected' }
              : req
          )
        );

        // Update stats
        setStats(prevStats => ({
          ...prevStats,
          pendingRequests: prevStats.pendingRequests - 1,
          rejectedRequests: prevStats.rejectedRequests + 1
        }));
      } else {
        alert('Failed to reject request. Please try again.');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="container mx-auto px-4 2xl:px-20 py-8">
      <div className="border border-gray-200 bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Department Head Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">{departmentInfo.name}</p>
          </div>
          <div className="mt-4 md:mt-0 bg-blue-50 px-4 py-2 rounded-lg">
            <p className="text-sm text-gray-700">Welcome, <span className="font-medium">{departmentInfo.head}</span></p>
            <p className="text-xs text-gray-500">Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        {/* Refresh Section */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-lg font-semibold text-indigo-800">Request Dashboard Refresh</h2>
              <p className="text-sm text-gray-600 mt-1">
                Click the button to fetch the latest payment requests submitted by department members.
                This ensures you're viewing the most up-to-date information for approval decisions.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Last refreshed: {formatDateTime(lastRefreshed)}
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 ${isRefreshing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg'
                }`}
              style={{ minWidth: '180px' }}
            >
              {isRefreshing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Refreshing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  Refresh Dashboard
                </>
              )}
            </button>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-xs text-gray-500">New Requests</p>
                  <p className="text-sm font-semibold">Auto-refreshed every session</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-xs text-gray-500">Status Updates</p>
                  <p className="text-sm font-semibold">Real-time status changes</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-full">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-xs text-gray-500">Notifications</p>
                  <p className="text-sm font-semibold">Instant alerts on changes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-blue-600 font-medium">Pending Requests</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.pendingRequests}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Awaiting your review</p>
          </div>

          <div className="bg-green-50 border border-green-100 rounded-lg p-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-green-600 font-medium">Approved Requests</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.approvedRequests}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Forwarded to finance</p>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-lg p-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-red-600 font-medium">Rejected Requests</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.rejectedRequests}</h3>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Denied due to issues</p>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-indigo-600 font-medium">Department Members</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.departmentMembers}</h3>
              </div>
              <div className="bg-indigo-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Active faculty and staff</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Form Type</label>
              <select
                value={formTypeFilter}
                onChange={(e) => setFormTypeFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Form Types</option>
                <option value="Petty Cash">Petty Cash</option>
                <option value="Exam Duty">Exam Duty</option>
                <option value="Transportation">Transportation</option>
                <option value="Overtime">Overtime</option>
                <option value="Paper Marking">Paper Marking</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name, email, or request type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Requests Table */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p>{error}</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No requests found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) :
          (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requestor</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 rounded-full">
                            {request.formType === 'Petty Cash' ? (
                              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                              </svg>
                            ) : request.formType === 'Exam Duty' ? (
                              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                              </svg>
                            ) : (
                              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                              </svg>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{request.formType}</div>
                            <div className="text-xs text-gray-500">ID: {request.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {request.formData.requestorName ||
                            request.formData.officerName ||
                            request.formData.nameOfApplicant ||
                            request.formData.examinerName ||
                            'Unknown'}
                        </div>
                        <div className="text-xs text-gray-500">{request.userEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{request.formData.position || 'Faculty Member'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Rs. {request.amount.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(request.submittedAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            request.status === 'approved' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          to={`/department/requests/${request.id}`}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                          <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                          </svg>
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        {/* Pagination */}
        {filteredRequests.length > 0 && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{indexOfFirstRequest + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(indexOfLastRequest, filteredRequests.length)}
              </span>{' '}
              of <span className="font-medium">{filteredRequests.length}</span> results
            </div>

            <nav className="flex justify-center">
              <ul className="flex space-x-2">
                {Array.from({ length: Math.ceil(filteredRequests.length / requestsPerPage) }).map((_, index) => (
                  <li key={index}>
                    <button
                      onClick={() => paginate(index + 1)}
                      className={`px-3 py-1 rounded-md ${currentPage === index + 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* Recent Activity Section */}
      <div className="border border-gray-200 bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Department Activity</h2>

        {requests.length === 0 ? (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
            <p className="mt-1 text-sm text-gray-500">Any new department activity will appear here</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {requests.slice(0, 5).map((request, index) => (
                <div key={index} className="flex items-start p-3 border-b border-gray-100 last:border-0">
                  <div className={`p-2 rounded-full mr-3 ${request.status === 'approved' ? 'bg-green-100' :
                    request.status === 'rejected' ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                    {request.status === 'approved' ? (
                      <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    ) : request.status === 'rejected' ? (
                      <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {request.formData.requestorName ||
                        request.formData.officerName ||
                        request.formData.nameOfApplicant ||
                        request.formData.examinerName ||
                        'A faculty member'} submitted a {request.formType} request
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(request.submittedAt)} • Amount: Rs. {request.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className={`px-2 py-1 text-xs rounded-full ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-center">
              <Link to="/department/activity" className="text-sm text-blue-600 hover:text-blue-800">
                View All Activity →
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HeadDashboard;
