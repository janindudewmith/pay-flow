import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const HeadDashboard = () => {
  // State for requests data
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Fetch requests data
  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/department/${departmentInfo.code}/requests`);
        // const data = await response.json();

        // Mock data for demonstration
        const mockData = [
          {
            id: '1',
            formType: 'Petty Cash',
            userEmail: 'john@eie.ruh.ac.lk',
            submittedAt: '2025-04-10T09:30:00',
            status: 'pending',
            currentApprover: 'department_head',
            amount: 2500,
            formData: {
              requestorName: 'John Smith',
              amountRs: '2500',
              reasonForRequest: 'Office supplies purchase'
            }
          },
          {
            id: '2',
            formType: 'Exam Duty',
            userEmail: 'lisa@eie.ruh.ac.lk',
            submittedAt: '2025-04-09T14:15:00',
            status: 'pending',
            currentApprover: 'department_head',
            amount: 4500,
            formData: {
              officerName: 'Lisa Wong',
              totalAmount: '4500',
              venue: 'Lab 3B'
            }
          },
          {
            id: '3',
            formType: 'Transportation',
            userEmail: 'alex@eie.ruh.ac.lk',
            submittedAt: '2025-04-08T11:45:00',
            status: 'pending',
            currentApprover: 'department_head',
            amount: 3000,
            formData: {
              officerName: 'Alex Johnson',
              totalRequested: '3000',
              destination: 'Galle'
            }
          },
          {
            id: '4',
            formType: 'Overtime',
            userEmail: 'maria@eie.ruh.ac.lk',
            submittedAt: '2025-04-07T16:20:00',
            status: 'approved',
            currentApprover: 'finance_officer',
            amount: 5500,
            formData: {
              nameOfApplicant: 'Maria Rodriguez',
              amountInFigures: '5500',
              description: 'Weekend lab supervision'
            }
          },
          {
            id: '5',
            formType: 'Paper Marking',
            userEmail: 'robert@eie.ruh.ac.lk',
            submittedAt: '2025-04-06T10:00:00',
            status: 'rejected',
            amount: 6000,
            formData: {
              examinerName: 'Robert Chen',
              totalAmount: '6000',
              subject: 'Digital Electronics'
            }
          }
        ];

        setRequests(mockData);

        // Calculate stats
        const pendingCount = mockData.filter(req => req.status === 'pending').length;
        const approvedCount = mockData.filter(req => req.status === 'approved').length;
        const rejectedCount = mockData.filter(req => req.status === 'rejected').length;

        setStats({
          pendingRequests: pendingCount,
          approvedRequests: approvedCount,
          rejectedRequests: rejectedCount,
          departmentMembers: 15 // Mock data - would come from API
        });

      } catch (err) {
        setError('Failed to fetch requests. Please try again later.');
        console.error('Error fetching requests:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [departmentInfo.code]);

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
    // In a real app, this would call an API
    alert(`Approved request ${id}`);
  };

  const handleReject = async (id) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      // In a real app, this would call an API with the reason
      alert(`Rejected request ${id}. Reason: ${reason}`);
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
                        <div className="flex space-x-2">
                          <Link to={`/department/requests/${request.id}`} className="text-blue-600 hover:text-blue-900">
                            View
                          </Link>

                          {request.status === 'pending' && request.currentApprover === 'department_head' && (
                            <>
                              <button
                                onClick={() => handleApprove(request.id)}
                                className="text-green-600 hover:text-green-900"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(request.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
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
      </div>
    </div>
  );
};

export default HeadDashboard;
