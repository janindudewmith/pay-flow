import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { downloadSubmittedFormPdf } from '../utils/pdfUtils';

const Requests = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [canceledRequests, setCanceledRequests] = useState([]);

  // Fetch user's requests when component mounts
  useEffect(() => {
    const fetchRequests = async () => {
      if (!user) {
        console.log('No user found, skipping request fetch');
        return;
      }

      try {
        setIsLoading(true);
        console.log('Fetching requests for user:', user.id);
        const token = await getToken();

        // API request to fetch forms
        console.log('Making API request to fetch forms');
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await axios({
          method: 'get',
          url: `${API_URL}/api/forms/my-forms`,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('API response received');

        if (response.data.success) {
          if (response.data.data && response.data.data.length > 0) {
            console.log(`Received ${response.data.data.length} forms`);
            setRequests(response.data.data);
          } else {
            console.log('No forms found for this user');
            setRequests([]);
          }
        } else {
          console.error('Error response from API:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching requests:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [user, getToken]);

  const toggleDetails = (id) => {
    if (expandedRequest === id) {
      setExpandedRequest(null);
    } else {
      setExpandedRequest(id);
    }
  };

  const handleCancelRequest = (id) => {
    setExpandedRequest(null);
  };

  const handleDownloadPDF = async (id, formType) => {
    try {
      // Show loading indicator
      alert('Generating PDF...');

      // Get token from Clerk
      const token = await getToken();

      // Use the utility function to download the PDF
      await downloadSubmittedFormPdf(id, token, formType);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error generating PDF: ' + error.message);
    }
  };

  // Function to get display status from backend status
  const getDisplayStatus = (status) => {
    switch (status) {
      case 'pending_hod_approval':
        return 'PENDING HOD APPROVAL';
      case 'pending_finance_approval':
        return 'PENDING FINANCE APPROVAL';
      case 'approved':
        return 'APPROVED';
      case 'rejected':
        return 'REJECTED';
      case 'cancelled':
        return 'CANCELLED';
      default:
        return status.toUpperCase();
    }
  };

  // Function to get status class based on status
  const getStatusClass = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'pending_finance_approval':
        return 'bg-blue-100 text-blue-800';
      case 'pending_hod_approval':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Calculate summary counts
  const pendingHodCount = requests.filter(r => r.status === 'pending_hod_approval').length;
  const pendingFinanceCount = requests.filter(r => r.status === 'pending_finance_approval').length;
  const pendingCount = pendingHodCount + pendingFinanceCount;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;
  const totalCount = requests.length;

  return (
    <div className="container 2xl:px-20 mx-auto my-8">
      <div className="bg-gradient-to-r from-blue-900 via-blue-750 to-blue-600 text-white py-8 px-6 rounded-xl mb-6">
        <h2 className="text-2xl md:text-3xl font-medium">My Payment Requests</h2>
        <p className="text-sm text-white/80 mt-2">
          Track and manage all your submitted payment requests
        </p>
      </div>
      {/* Summary Section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-100 text-blue-900 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold">{pendingCount}</div>
          <div className="text-sm font-medium">Pending</div>
        </div>
        <div className="bg-green-100 text-green-900 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold">{approvedCount}</div>
          <div className="text-sm font-medium">Approved</div>
        </div>
        <div className="bg-red-100 text-red-900 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold">{rejectedCount}</div>
          <div className="text-sm font-medium">Rejected</div>
        </div>
        <div className="bg-gray-100 text-gray-900 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold">{totalCount}</div>
          <div className="text-sm font-medium">Total</div>
        </div>
      </div>
      <div className="border border-blue-200 shadow-lg rounded-lg bg-white p-6">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading your requests...</p>
          </div>
        ) : requests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="py-3 px-4 font-medium">Application ID</th>
                  <th className="py-3 px-4 font-medium">Payment type</th>
                  <th className="py-3 px-4 font-medium">Date submitted</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <React.Fragment key={request._id}>
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-sm">{request._id.substring(0, 8)}</td>
                      <td className="py-3 px-4">{request.formType.replace('_', ' ').toUpperCase()}</td>
                      <td className="py-3 px-4">{new Date(request.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(request.status)}`}>
                          {getDisplayStatus(request.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleDetails(request._id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {expandedRequest === request._id ? 'Hide details' : 'View details'}
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Details Section */}
                    {expandedRequest === request._id && (
                      <tr className="bg-blue-50">
                        <td colSpan="6" className="p-4">
                          <div className="transition-all duration-300 ease-in-out">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <h3 className="font-medium text-gray-800 mb-2">Request Details</h3>
                                <p className="text-sm text-gray-600 mb-1">
                                  Submitted by: {request.submittedBy?.fullName || 'Unknown'}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Submitted on: {new Date(request.createdAt).toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-800 mb-2">Approval Status</h3>
                                <div className="flex items-center mb-1">
                                  <span className="text-sm text-gray-600 w-40">Current Status:</span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(request.status)}`}>
                                    {getDisplayStatus(request.status)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-3 mt-4">
                              <button
                                onClick={() => handleDownloadPDF(request._id, request.formType)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                Download
                              </button>

                              {(request.status === 'pending_hod_approval' || request.status === 'pending_finance_approval') && !canceledRequests.includes(request._id) && (
                                <button
                                  onClick={() => handleCancelRequest(request._id)}
                                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                  </svg>
                                  Cancel
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You haven't submitted any payment requests yet.</p>
            <Link
              to="/"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Submit New Request
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;