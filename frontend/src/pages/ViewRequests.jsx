import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getApiWithToken } from '../utils/axios';
import { assets } from '../assets/assets';
import { toast, Zoom } from 'react-toastify';

const ViewRequests = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const reasonInputRef = useRef(null);

  // Determine if we're in department head or finance context
  const isFinanceOfficer = location.pathname.includes('/finance/');

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const api = await getApiWithToken();
        const response = await api.get(`/api/forms/${requestId}`);

        if (response.data && response.data.success) {
          console.log('Form data:', response.data.data);
          setFormData(response.data.data);
        } else {
          throw new Error('Failed to fetch form data');
        }
      } catch (err) {
        console.error('Error fetching form data:', err);
        setError('Failed to load form data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [requestId]);

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      const api = await getApiWithToken();

      // Determine the role based on the URL path
      const role = isFinanceOfficer ? 'finance_officer' : 'department_head';

      console.log('Approving request with role:', role);
      console.log('Request ID:', requestId);
      console.log('Is Finance Officer:', isFinanceOfficer);
      console.log('Current path:', location.pathname);

      // Prepare the request payload
      const payload = {
        formId: requestId, // Explicitly include formId in the request body
        action: 'approve',
        comments: 'Approved by ' + (isFinanceOfficer ? 'finance officer' : 'department head'),
        userRole: role // Make sure this is explicitly set
      };

      console.log('Sending approval payload:', payload);

      const response = await api.post(`/api/forms/${requestId}/action`, payload);

      console.log('Approval response:', response.data);

      if (response.data && response.data.success) {
        // Show toast with longer duration
        toast.success('Request approved successfully!', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          transition: Zoom
        });

        // Add a longer delay before redirecting to allow time for the toast to complete
        setTimeout(() => {
          // Force a full page reload of the dashboard to ensure fresh data
          const dashboardUrl = isFinanceOfficer ? '/finance/dashboard' : '/department/dashboard';
          console.log('Redirecting to:', dashboardUrl);
          window.location.href = dashboardUrl;
        }, 3500); // 3.5 second delay, slightly longer than the toast duration
      } else {
        toast.error(`Failed to approve request: ${response.data?.message || 'Unknown error'}`, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true
        });
      }
    } catch (error) {
      console.error('Error approving request:', error);
      console.error('Error details:', error.response?.data || 'No response data');
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    const rejectionReason = reasonInputRef.current?.value?.trim();

    if (!rejectionReason) {
      toast.error('Please provide a reason for rejection.', {
        position: "top-center",
        autoClose: 3000
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const api = await getApiWithToken();

      // Determine the role based on the URL path
      const role = isFinanceOfficer ? 'finance_officer' : 'department_head';

      console.log('Rejecting request with role:', role);
      console.log('Request ID:', requestId);

      const response = await api.post(`/api/forms/${requestId}/action`, {
        formId: requestId, // Explicitly include formId in the request body
        action: 'reject',
        comments: rejectionReason,
        userRole: role
      });

      console.log('Rejection response:', response.data);

      if (response.data && response.data.success) {
        // Show toast with longer duration
        toast.success('Request rejected successfully!', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          transition: Zoom
        });
        setShowRejectionModal(false);

        // Add a longer delay before redirecting to allow time for the toast to complete
        setTimeout(() => {
          // Force a full page reload of the dashboard to ensure fresh data
          const dashboardUrl = isFinanceOfficer ? '/finance/dashboard' : '/department/dashboard';
          window.location.href = dashboardUrl;
        }, 3500); // 3.5 second delay, slightly longer than the toast duration
      } else {
        toast.error('Failed to reject request. Please try again.', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true
        });
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Department name mapping function
  const getDepartmentFullName = (shortName) => {
    if (!shortName) return 'Unknown Department';

    console.log('Department mapping input:', shortName);

    // Convert to lowercase for case-insensitive matching
    const deptLower = shortName.toLowerCase();
    let result = shortName;

    // Check for department by keywords
    if (deptLower.includes('eie') || deptLower.includes('electrical') || deptLower.includes('information')) {
      result = 'Department of Electrical and Information Engineering';
    }
    else if (deptLower.includes('cee') || deptLower.includes('civil') || deptLower.includes('environmental')) {
      result = 'Department of Civil and Environmental Engineering';
    }
    else if (deptLower.includes('mme') || deptLower.includes('mechanical') || deptLower.includes('manufacturing')) {
      result = 'Department of Mechanical and Manufacturing Engineering';
    }

    console.log('Department mapping result:', result);
    return result;
  };

  const renderFormContent = () => {
    if (!formData) return null;

    // Format the form type for display
    const displayFormType = formData.formType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Extract amount based on form type
    let amount = 0;
    try {
      if (formData.formType === 'petty_cash') {
        amount = parseFloat(formData.formData.basicInfo?.amountRs || 0);
      } else if (formData.formType === 'exam_duty') {
        amount = parseFloat(formData.formData.basicInfo?.totalAmount || 0);
      } else if (formData.formType === 'transport') {
        amount = parseFloat(formData.formData.basicInfo?.totalRequested || 0);
      } else if (formData.formType === 'overtime') {
        amount = parseFloat(formData.formData.basicInfo?.amountInFigures || 0);
      } else if (formData.formType === 'paper_marking') {
        amount = parseFloat(formData.formData.basicInfo?.totalAmount || 0);
      }
    } catch (error) {
      console.error('Error parsing amount:', error);
    }

    // Get status color and icon
    const getStatusInfo = (status) => {
      if (status.includes('pending')) {
        return {
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          )
        };
      } else if (status === 'approved') {
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          )
        };
      } else {
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          )
        };
      }
    };

    const statusInfo = getStatusInfo(formData.status);

    // Common form details section
    return (
      <>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              {displayFormType} Request Details
            </h2>
          </div>

          <div className="p-6">
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Request ID</p>
                    <p className="font-medium text-gray-800">{formData._id}</p>
                  </div>
                </div>

                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Submitted On</p>
                    <p className="font-medium text-gray-800">{formatDate(formData.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className="font-medium text-gray-800">{formatCurrency(amount)}</p>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/2 px-3">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Submitted By</p>
                    <p className="font-medium text-gray-800">{formData.submittedBy?.fullName || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">{formData.submittedBy?.email || 'No email provided'}</p>
                  </div>
                </div>

                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Department</p>
                    <p className="font-medium text-gray-800">{getDepartmentFullName(formData.submittedBy?.department)}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full ${statusInfo.bgColor} flex items-center justify-center mr-3`}>
                    <div className={statusInfo.textColor}>
                      {statusInfo.icon}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.textColor} border ${statusInfo.borderColor}`}>
                      {formData.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form specific content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 mb-8">
          <div className="bg-gradient-to-r from-gray-700 to-gray-900 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              Form Details
            </h2>
          </div>

          <div className="p-6">
            {formData.formType === 'petty_cash' && renderPettyCashForm()}
            {formData.formType === 'exam_duty' && renderExamDutyForm()}
            {formData.formType === 'transport' && renderTransportForm()}
            {formData.formType === 'overtime' && renderOvertimeForm()}
            {formData.formType === 'paper_marking' && renderPaperMarkingForm()}
          </div>
        </div>

        {/* Approval/Rejection section */}
        {formData.status.includes('pending') && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 mb-8">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Review Decision
              </h2>
            </div>

            <div className="p-6">
              <div className="bg-purple-50 rounded-lg p-4 mb-6 border border-purple-100">
                <p className="text-sm text-gray-700">
                  Please review the request carefully before making a decision.
                  {isFinanceOfficer
                    ? ' As a Finance Officer, your approval will process the payment.'
                    : ' As a Department Head, your approval will forward this request to Finance for payment processing.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleApprove}
                  disabled={isSubmitting}
                  className={`px-6 py-3 rounded-lg text-white font-medium flex items-center justify-center transition-all duration-300
                    ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-md hover:shadow-lg'}`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Approve Request
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowRejectionModal(true)}
                  disabled={isSubmitting}
                  className={`px-6 py-3 rounded-lg text-white font-medium flex items-center justify-center transition-all duration-300
                    ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-md hover:shadow-lg'}`}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  Reject Request
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  // Form specific renderers
  const renderPettyCashForm = () => {
    const basicInfo = formData.formData.basicInfo || {};

    return (
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            Petty Cash Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <p className="text-sm text-gray-600 mb-1">Purpose</p>
              <p className="font-medium text-gray-800">{basicInfo.purpose || 'Not specified'}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <p className="text-sm text-gray-600 mb-1">Amount</p>
              <p className="font-medium text-gray-800">{basicInfo.amountRs ? `Rs. ${basicInfo.amountRs}` : 'Not specified'}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <p className="text-sm text-gray-600 mb-1">Amount in Words</p>
              <p className="font-medium text-gray-800">{basicInfo.amountWords || 'Not specified'}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <p className="text-sm text-gray-600 mb-1">Date Required</p>
              <p className="font-medium text-gray-800">{basicInfo.dateRequired || 'Not specified'}</p>
            </div>
          </div>
        </div>

        {basicInfo.additionalInfo && (
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Additional Information
            </h3>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-gray-800">{basicInfo.additionalInfo}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderExamDutyForm = () => {
    const basicInfo = formData.formData.basicInfo || {};

    return (
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Examination Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <p className="text-sm text-gray-600 mb-1">Course Code</p>
              <p className="font-medium text-gray-800">{basicInfo.courseCode || 'Not specified'}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <p className="text-sm text-gray-600 mb-1">Course Name</p>
              <p className="font-medium text-gray-800">{basicInfo.courseName || 'Not specified'}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <p className="text-sm text-gray-600 mb-1">Academic Year</p>
              <p className="font-medium text-gray-800">{basicInfo.academicYear || 'Not specified'}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <p className="text-sm text-gray-600 mb-1">Semester</p>
              <p className="font-medium text-gray-800">{basicInfo.semester || 'Not specified'}</p>
            </div>
          </div>
        </div>

        <div className="border-b pb-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Exam Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <p className="text-sm text-gray-600 mb-1">Exam Date</p>
              <p className="font-medium text-gray-800">{basicInfo.examDate || 'Not specified'}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <p className="text-sm text-gray-600 mb-1">Hours</p>
              <p className="font-medium text-gray-800">{basicInfo.hours || 'Not specified'}</p>
            </div>
          </div>
        </div>

        <div className="border-b pb-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Payment Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <p className="text-sm text-gray-600 mb-1">Rate per Hour</p>
              <p className="font-medium text-gray-800">{basicInfo.ratePerHour ? `Rs. ${basicInfo.ratePerHour}` : 'Not specified'}</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-100 hover:shadow-md transition-shadow duration-300">
              <p className="text-sm text-gray-600 mb-1">Total Amount</p>
              <p className="font-medium text-green-700 text-lg">{basicInfo.totalAmount ? `Rs. ${basicInfo.totalAmount}` : 'Not specified'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTransportForm = () => {
    const basicInfo = formData.formData.basicInfo || {};

    return (
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            Transport Request Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <p className="text-sm text-gray-600 mb-1">Purpose</p>
              <p className="font-medium text-gray-800">{basicInfo.purpose || 'Not specified'}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <p className="text-sm text-gray-600 mb-1">Date of Travel</p>
              <p className="font-medium text-gray-800">{basicInfo.dateOfTravel || 'Not specified'}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <p className="text-sm text-gray-600 mb-1">From Location</p>
              <p className="font-medium text-gray-800">{basicInfo.fromLocation || 'Not specified'}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <p className="text-sm text-gray-600 mb-1">To Location</p>
              <p className="font-medium text-gray-800">{basicInfo.toLocation || 'Not specified'}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <p className="text-sm text-gray-600 mb-1">Mode of Transport</p>
              <p className="font-medium text-gray-800">{basicInfo.modeOfTransport || 'Not specified'}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <p className="text-sm text-gray-600 mb-1">Distance (km)</p>
              <p className="font-medium text-gray-800">{basicInfo.distance || 'Not specified'}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <p className="text-sm text-gray-600 mb-1">Rate per km</p>
              <p className="font-medium text-gray-800">{basicInfo.ratePerKm ? `Rs. ${basicInfo.ratePerKm}` : 'Not specified'}</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-100 hover:shadow-md transition-shadow duration-300">
              <p className="text-sm text-gray-600 mb-1">Total Requested</p>
              <p className="font-medium text-green-700 text-lg">{basicInfo.totalRequested ? `Rs. ${basicInfo.totalRequested}` : 'Not specified'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderOvertimeForm = () => {
    const basicInfo = formData.formData.basicInfo || {};

    return (
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Overtime Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <p className="text-sm text-gray-600 mb-1">Employee Position</p>
              <p className="font-medium text-gray-800">{basicInfo.position || 'Not specified'}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <p className="text-sm text-gray-600 mb-1">Month</p>
              <p className="font-medium text-gray-800">{basicInfo.month || 'Not specified'}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <p className="text-sm text-gray-600 mb-1">Total Hours</p>
              <p className="font-medium text-gray-800">{basicInfo.totalHours || 'Not specified'}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <p className="text-sm text-gray-600 mb-1">Rate per Hour</p>
              <p className="font-medium text-gray-800">{basicInfo.ratePerHour ? `Rs. ${basicInfo.ratePerHour}` : 'Not specified'}</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-100 hover:shadow-md transition-shadow duration-300">
              <p className="text-sm text-gray-600 mb-1">Amount in Figures</p>
              <p className="font-medium text-green-700 text-lg">{basicInfo.amountInFigures ? `Rs. ${basicInfo.amountInFigures}` : 'Not specified'}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <p className="text-sm text-gray-600 mb-1">Amount in Words</p>
              <p className="font-medium text-gray-800">{basicInfo.amountInWords || 'Not specified'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPaperMarkingForm = () => {
    const basicInfo = formData.formData.basicInfo || {};

    return (
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            Paper Marking Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <p className="text-sm text-gray-600 mb-1">Course Code</p>
              <p className="font-medium text-gray-800">{basicInfo.courseCode || 'Not specified'}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <p className="text-sm text-gray-600 mb-1">Course Name</p>
              <p className="font-medium text-gray-800">{basicInfo.courseName || 'Not specified'}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <p className="text-sm text-gray-600 mb-1">Academic Year</p>
              <p className="font-medium text-gray-800">{basicInfo.academicYear || 'Not specified'}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <p className="text-sm text-gray-600 mb-1">Semester</p>
              <p className="font-medium text-gray-800">{basicInfo.semester || 'Not specified'}</p>
            </div>
          </div>
        </div>

        <div className="border-b pb-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Payment Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <p className="text-sm text-gray-600 mb-1">Number of Scripts</p>
              <p className="font-medium text-gray-800">{basicInfo.numberOfScripts || 'Not specified'}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <p className="text-sm text-gray-600 mb-1">Rate per Script</p>
              <p className="font-medium text-gray-800">{basicInfo.ratePerScript ? `Rs. ${basicInfo.ratePerScript}` : 'Not specified'}</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-100 hover:shadow-md transition-shadow duration-300 col-span-2">
              <p className="text-sm text-gray-600 mb-1">Total Amount</p>
              <p className="font-medium text-green-700 text-lg">{basicInfo.totalAmount ? `Rs. ${basicInfo.totalAmount}` : 'Not specified'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Rejection Modal
  function RejectionModal() {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Reject Request</h3>
          <div className="w-16 h-1 bg-red-500 mb-4"></div>

          <p className="text-sm text-gray-600 mb-4">Please provide a reason for rejecting this request. This will be sent to the requester.</p>

          <textarea
            ref={reasonInputRef}
            placeholder="Enter rejection reason..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-4 transition-all duration-200"
            rows={4}
          />

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowRejectionModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-lg text-white ${isSubmitting ? 'bg-gray-400' : 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700'} transition-all duration-200`}
            >
              {isSubmitting ? 'Processing...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            <span className="font-medium">Back to Dashboard</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
              <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-4 border-b-4 border-blue-300 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-md mb-8">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="font-medium">{error}</p>
            </div>
          </div>
        ) : (
          renderFormContent()
        )}

        {showRejectionModal && <RejectionModal />}
      </div>
    </div>
  );
};

export default ViewRequests;