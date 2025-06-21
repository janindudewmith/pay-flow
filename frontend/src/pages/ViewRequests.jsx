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

      const response = await api.post(`/api/forms/${requestId}/action`, {
        action: 'approve',
        comments: 'Approved by ' + (isFinanceOfficer ? 'finance officer' : 'department head'),
        userRole: role
      });

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
          window.location.href = dashboardUrl;
        }, 3500); // 3.5 second delay, slightly longer than the toast duration
      } else {
        toast.error('Failed to approve request. Please try again.', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true
        });
      }
    } catch (error) {
      console.error('Error approving request:', error);
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

      const response = await api.post(`/api/forms/${requestId}/action`, {
        action: 'reject',
        comments: rejectionReason,
        userRole: role
      });

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

    // Common form details section
    return (
      <>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{displayFormType} Request Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600">Request ID</p>
              <p className="font-medium">{formData._id}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Submitted On</p>
              <p className="font-medium">{formatDate(formData.createdAt)}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${formData.status.includes('pending') ? 'bg-yellow-100 text-yellow-800' :
                  formData.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'}`}>
                {formData.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </span>
            </div>

            <div>
              <p className="text-sm text-gray-600">Amount</p>
              <p className="font-medium">{formatCurrency(amount)}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Submitted By</p>
              <p className="font-medium">{formData.submittedBy?.fullName || 'Unknown'}</p>
              <p className="text-xs text-gray-500">{formData.submittedBy?.email || 'No email provided'}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Department</p>
              <p className="font-medium">{getDepartmentFullName(formData.submittedBy?.department)}</p>
            </div>
          </div>
        </div>

        {/* Form specific content */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Form Details</h2>

          {formData.formType === 'petty_cash' && renderPettyCashForm()}
          {formData.formType === 'exam_duty' && renderExamDutyForm()}
          {formData.formType === 'transport' && renderTransportForm()}
          {formData.formType === 'overtime' && renderOvertimeForm()}
          {formData.formType === 'paper_marking' && renderPaperMarkingForm()}
        </div>

        {/* Approval/Rejection section */}
        {formData.status.includes('pending') && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Review Decision</h2>
            <p className="text-sm text-gray-600 mb-6">
              Please review the request carefully before making a decision.
              {isFinanceOfficer
                ? 'As a Finance Officer, your approval will process the payment.'
                : 'As a Department Head, your approval will forward this request to Finance for payment processing.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleApprove}
                disabled={isSubmitting}
                className={`px-6 py-3 rounded-md text-white font-medium flex items-center justify-center
                  ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
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
                className={`px-6 py-3 rounded-md text-white font-medium flex items-center justify-center
                  ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Reject Request
              </button>
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
          <h3 className="text-lg font-medium text-gray-800 mb-3">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Purpose</p>
              <p className="font-medium">{basicInfo.purpose || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Amount (Rs.)</p>
              <p className="font-medium">{basicInfo.amountRs || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Amount in Words</p>
              <p className="font-medium">{basicInfo.amountWords || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date Required</p>
              <p className="font-medium">{basicInfo.dateRequired || 'Not specified'}</p>
            </div>
          </div>
        </div>

        {formData.formData.attachments && (
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Attachments</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm">
                {formData.formData.attachments.length > 0
                  ? `${formData.formData.attachments.length} attachment(s) provided`
                  : 'No attachments provided'}
              </p>
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
          <h3 className="text-lg font-medium text-gray-800 mb-3">Examination Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Course Code</p>
              <p className="font-medium">{basicInfo.courseCode || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Course Name</p>
              <p className="font-medium">{basicInfo.courseName || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Academic Year</p>
              <p className="font-medium">{basicInfo.academicYear || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Semester</p>
              <p className="font-medium">{basicInfo.semester || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Exam Date</p>
              <p className="font-medium">{basicInfo.examDate || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Hours</p>
              <p className="font-medium">{basicInfo.hours || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Rate per Hour</p>
              <p className="font-medium">{basicInfo.ratePerHour ? `Rs. ${basicInfo.ratePerHour}` : 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="font-medium">{basicInfo.totalAmount ? `Rs. ${basicInfo.totalAmount}` : 'Not specified'}</p>
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
          <h3 className="text-lg font-medium text-gray-800 mb-3">Transport Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Purpose</p>
              <p className="font-medium">{basicInfo.purpose || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">From Location</p>
              <p className="font-medium">{basicInfo.fromLocation || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">To Location</p>
              <p className="font-medium">{basicInfo.toLocation || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date of Travel</p>
              <p className="font-medium">{basicInfo.dateOfTravel || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Mode of Transport</p>
              <p className="font-medium">{basicInfo.modeOfTransport || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Distance (km)</p>
              <p className="font-medium">{basicInfo.distance || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Rate per km</p>
              <p className="font-medium">{basicInfo.ratePerKm ? `Rs. ${basicInfo.ratePerKm}` : 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Requested</p>
              <p className="font-medium">{basicInfo.totalRequested ? `Rs. ${basicInfo.totalRequested}` : 'Not specified'}</p>
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
          <h3 className="text-lg font-medium text-gray-800 mb-3">Overtime Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Employee Position</p>
              <p className="font-medium">{basicInfo.position || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Month</p>
              <p className="font-medium">{basicInfo.month || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Hours</p>
              <p className="font-medium">{basicInfo.totalHours || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Rate per Hour</p>
              <p className="font-medium">{basicInfo.ratePerHour ? `Rs. ${basicInfo.ratePerHour}` : 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Amount in Figures</p>
              <p className="font-medium">{basicInfo.amountInFigures ? `Rs. ${basicInfo.amountInFigures}` : 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Amount in Words</p>
              <p className="font-medium">{basicInfo.amountInWords || 'Not specified'}</p>
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
          <h3 className="text-lg font-medium text-gray-800 mb-3">Paper Marking Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Course Code</p>
              <p className="font-medium">{basicInfo.courseCode || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Course Name</p>
              <p className="font-medium">{basicInfo.courseName || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Academic Year</p>
              <p className="font-medium">{basicInfo.academicYear || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Semester</p>
              <p className="font-medium">{basicInfo.semester || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Number of Scripts</p>
              <p className="font-medium">{basicInfo.numberOfScripts || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Rate per Script</p>
              <p className="font-medium">{basicInfo.ratePerScript ? `Rs. ${basicInfo.ratePerScript}` : 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="font-medium">{basicInfo.totalAmount ? `Rs. ${basicInfo.totalAmount}` : 'Not specified'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Rejection Modal
  function RejectionModal() {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Reject Request</h3>
          <p className="text-sm text-gray-600 mb-4">Please provide a reason for rejecting this request.</p>

          <textarea
            ref={reasonInputRef}
            placeholder="Enter rejection reason..."
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 mb-4"
            rows={4}
          />

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowRejectionModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-md text-white ${isSubmitting ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'}`}
            >
              {isSubmitting ? 'Processing...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to Dashboard
      </button>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      ) : (
        renderFormContent()
      )}

      {showRejectionModal && <RejectionModal />}
    </div>
  );
};

export default ViewRequests;