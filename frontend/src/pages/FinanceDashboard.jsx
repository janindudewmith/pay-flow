import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const FinanceDashboard = () => {
  // State for requests data
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('pending');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  
  // Stats for dashboard
  const [stats, setStats] = useState({
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    totalAmount: 0
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage] = useState(10);

  // Fetch requests data
  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/finance/requests');
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockData = [
          {
            id: '1',
            formType: 'Petty Cash',
            userEmail: 'john@eie.ruh.ac.lk',
            submittedAt: '2025-04-10T09:30:00',
            status: 'pending',
            currentApprover: 'finance_officer',
            amount: 2500,
            department: 'Electrical',
            formData: {
              requestorName: 'John Smith',
              amountRs: '2500',
              reasonForRequest: 'Office supplies purchase'
            }
          },
          {
            id: '2',
            formType: 'Exam Duty',
            userEmail: 'sarah@cee.ruh.ac.lk',
            submittedAt: '2025-04-09T14:15:00',
            status: 'pending',
            currentApprover: 'finance_officer',
            amount: 5000,
            department: 'Civil',
            formData: {
              officerName: 'Sarah Johnson',
              totalAmount: '5000',
              venue: 'Drawing Office 1'
            }
          },
          {
            id: '3',
            formType: 'Transportation',
            userEmail: 'mike@mme.ruh.ac.lk',
            submittedAt: '2025-04-08T11:45:00',
            status: 'pending',
            currentApprover: 'finance_officer',
            amount: 3200,
            department: 'Mechanical',
            formData: {
              officerName: 'Mike Brown',
              totalRequested: '3200',
              destination: 'Colombo'
            }
          },
          {
            id: '4',
            formType: 'Overtime',
            userEmail: 'lisa@eie.ruh.ac.lk',
            submittedAt: '2025-04-07T16:20:00',
            status: 'approved',
            amount: 4500,
            department: 'Electrical',
            formData: {
              nameOfApplicant: 'Lisa Wong',
              amountInFigures: '4500',
              description: 'System maintenance'
            }
          },
          {
            id: '5',
            formType: 'Paper Marking',
            userEmail: 'david@cee.ruh.ac.lk',
            submittedAt: '2025-04-06T10:00:00',
            status: 'rejected',
            amount: 7500,
            department: 'Civil',
            formData: {
              examinerName: 'David Miller',
              totalAmount: '7500',
              subject: 'Structural Engineering'
            }
          }
        ];
        
        setRequests(mockData);
        
        // Calculate stats
        const pendingCount = mockData.filter(req => req.status === 'pending').length;
        const approvedCount = mockData.filter(req => req.status === 'approved').length;
        const rejectedCount = mockData.filter(req => req.status === 'rejected').length;
        const total = mockData.reduce((sum, req) => sum + req.amount, 0);
        
        setStats({
          pendingRequests: pendingCount,
          approvedRequests: approvedCount,
          rejectedRequests: rejectedCount,
          totalAmount: total
        });
        
      } catch (err) {
        setError('Failed to fetch requests. Please try again later.');
        console.error('Error fetching requests:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRequests();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...requests];
    
    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(req => req.status === statusFilter);
    }
    
    // Department filter
    if (departmentFilter !== 'all') {
      result = result.filter(req => req.department === departmentFilter);
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
  }, [requests, statusFilter, departmentFilter, searchQuery, dateRange]);

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
  
  // Extract department from email
  const getDepartmentFromEmail = (email) => {
    const domain = email.split('@')[1];
    const deptCode = domain.split('.')[0];
    
    const departments = {
      'eie': 'Electrical & Information Engineering',
      'cee': 'Civil & Environmental Engineering',
      'mme': 'Mechanical & Manufacturing Engineering'
    };
    
    return departments[deptCode] || deptCode.toUpperCase();
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
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Finance Officer Dashboard</h1>
        
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
            <p className="text-xs text-gray-500 mt-2">Successfully processed</p>
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
          
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-purple-600 font-medium">Total Amount</p>
                <h3 className="text-2xl font-bold text-gray-800">Rs. {stats.totalAmount.toLocaleString()}</h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Total processed value</p>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select 
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Departments</option>
                <option value="Electrical">Electrical & Information</option>
                <option value="Civil">Civil & Environmental</option>
                <option value="Mechanical">Mechanical & Manufacturing</option>
                <option value="Marine">Marine Engineering</option>
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input 
                type="date" 
                value={dateRange.from}
                onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input 
                type="date" 
                value={dateRange.to}
                onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
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
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requestor</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
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
                      <div className="text-sm text-gray-900">{getDepartmentFromEmail(request.userEmail)}</div>
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
                        <Link to={`/finance/requests/${request.id}`} className="text-blue-600 hover:text-blue-900">
                          View
                        </Link>
                        
                        {request.status === 'pending' && request.currentApprover === 'finance_officer' && (
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
                      className={`px-3 py-1 rounded-md ${
                        currentPage === index + 1
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
    </div>
  );
};

export default FinanceDashboard;
