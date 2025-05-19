import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Requests = () => {
  const [requests, setRequests] = useState([
    {
      id: 'REQ-2025-001',
      type: 'Petty Cash',
      amount: 'Rs.120',
      date: '2025-03-28',
      status: 'Pending',
      deptApproval: 'Pending',
      financeApproval: 'Not Started',
      details: 'Office supplies reimbursement'
    },
    {
      id: 'REQ-2025-002',
      type: 'Exam Duty',
      amount: 'Rs.350',
      date: '2025-03-25',
      status: 'Approved',
      deptApproval: 'Approved',
      financeApproval: 'Approved',
      details: 'Final examination supervision'
    },
    {
      id: 'REQ-2025-003',
      type: 'Transportation',
      amount: 'Rs.75',
      date: '2025-03-20',
      status: 'Rejected',
      deptApproval: 'Rejected',
      financeApproval: 'Not Started',
      details: 'Travel to conference'
    },
  ]);

  const [expandedRequest, setExpandedRequest] = useState(null);

  const toggleDetails = (id) => {
    if (expandedRequest === id) {
      setExpandedRequest(null);
    } else {
      setExpandedRequest(id);
    }
  };

  // const handleCancelRequest = (id) => {
  //   // Implement cancellation logic here
  //   const updatedRequests = requests.map(req =>
  //     req.id === id ? { ...req, status: 'Cancelled' } : req
  //   );
  //   setRequests(updatedRequests);
  //   alert(Request ${ id } has been cancelled);
  // };

  // const handleDownloadPDF = (id) => {
  //   // Implement PDF generation and download logic
  //   alert(Downloading PDF for request ${ id });
  // };

  return (
      <div className="container 2xl:px-20 mx-auto my-8">
      <div className="bg-gradient-to-r from-blue-900 via-blue-750 to-blue-600 text-white py-8 px-6 rounded-xl mb-6">
        <h2 className="text-2xl md:text-3xl font-medium">My Payment Requests</h2>
        <p className="text-sm text-white/80 mt-2">
          Track and manage all your submitted payment requests
        </p>
      </div>
      <div className="border border-blue-200 shadow-lg rounded-lg bg-white p-6">
        {requests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="py-3 px-4 font-medium">Application ID</th>
                  <th className="py-3 px-4 font-medium">Payment type</th>
                  <th className="py-3 px-4 font-medium">Amount</th>
                  <th className="py-3 px-4 font-medium">Date submitted</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <React.Fragment key={request.id}>
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-sm">{request.id}</td>
                      <td className="py-3 px-4">{request.type}</td>
                      <td className="py-3 px-4">{request.amount}</td>
                      <td className="py-3 px-4">{request.date}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            request.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                              request.status === 'Cancelled' ? 'bg-gray-100 text-gray-800' :
                                'bg-yellow-100 text-yellow-800'
                          }`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleDetails(request.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {expandedRequest === request.id ? 'Hide details' : 'View details'}
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Details Section */}
                    {expandedRequest === request.id && (
                      <tr className="bg-blue-50">
                        <td colSpan="6" className="p-4">
                          <div className="transition-all duration-300 ease-in-out">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <h3 className="font-medium text-gray-800 mb-2">Request Details</h3>
                                <p className="text-sm text-gray-600 mb-1">{request.details}</p>
                                <p className="text-sm text-gray-600">Submitted on: {request.date}</p>
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-800 mb-2">Approval Status</h3>
                                <div className="flex items-center mb-1">
                                  <span className="text-sm text-gray-600 w-40">Department Head:</span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${request.deptApproval === 'Approved' ? 'bg-green-100 text-green-800' :
                                      request.deptApproval === 'Rejected' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {request.deptApproval}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <span className="text-sm text-gray-600 w-40">Finance Section:</span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${request.financeApproval === 'Approved' ? 'bg-green-100 text-green-800' :
                                      request.financeApproval === 'Rejected' ? 'bg-red-100 text-red-800' :
                                        request.financeApproval === 'Not Started' ? 'bg-gray-100 text-gray-800' :
                                          'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {request.financeApproval}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-3 mt-4">
                              <button
                                onClick={() => handleDownloadPDF(request.id)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                Download
                              </button>

                              {request.status !== 'Cancelled' && request.status !== 'Approved' && (
                                <button
                                  onClick={() => handleCancelRequest(request.id)}
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