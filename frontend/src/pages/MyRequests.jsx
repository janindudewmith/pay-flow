import React, { useState, useEffect } from 'react';
import { useClerk } from '@clerk/clerk-react';
import axios from 'axios';
import useRealTimeUpdates from '../hooks/useRealTimeUpdates';

const MyRequests = () => {
  const { user } = useClerk();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user's requests
  const fetchRequests = async () => {
    try {
      const response = await axios.get('/api/forms/user');
      setRequests(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch requests');
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle real-time updates
  const handleUpdate = (data) => {
    switch (data.type) {
      case 'form_approved':
      case 'form_rejected':
        // Update the specific form in the list
        setRequests(prevRequests =>
          prevRequests.map(request =>
            request._id === data.form._id ? data.form : request
          )
        );
        break;
      case 'new_form':
        // Add new form to the list
        setRequests(prevRequests => [...prevRequests, data.form]);
        break;
      default:
        break;
    }
  };

  // Initialize real-time updates
  useRealTimeUpdates(handleUpdate);

  // Fetch initial data
  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Requests</h1>

      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <div
              key={request._id}
              className="bg-white rounded-lg shadow p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold capitalize">
                    {request.formType.replace('_', ' ')}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Submitted: {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${request.status === 'approved_by_finance'
                    ? 'bg-green-100 text-green-800'
                    : request.status === 'rejected_by_finance' || request.status === 'rejected_by_dept'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                  {request.status.replace(/_/g, ' ')}
                </div>
              </div>

              {request.rejectionReason && (
                <div className="mt-2 text-sm text-red-600">
                  <strong>Rejection Reason:</strong> {request.rejectionReason}
                </div>
              )}

              <div className="mt-4 text-sm">
                <strong>Current Approver:</strong> {request.currentApprover}
              </div>

              {request.departmentHeadApproval && (
                <div className="mt-2 text-sm">
                  <strong>Department Head Approval:</strong>{' '}
                  {new Date(request.departmentHeadApproval.approvedAt).toLocaleDateString()}
                </div>
              )}

              {request.financeApproval && (
                <div className="mt-2 text-sm">
                  <strong>Finance Approval:</strong>{' '}
                  {new Date(request.financeApproval.approvedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRequests; 