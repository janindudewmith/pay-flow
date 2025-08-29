import htmlPdf from 'html-pdf';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration for PDF generation
const pdfOptions = {
  format: 'A4',
  border: {
    top: '1cm',
    right: '1cm',
    bottom: '1cm',
    left: '1cm'
  },
  footer: {
    height: '1cm',
    contents: {
      default: '<div style="text-align: center; font-size: 10px;">Page {{page}} of {{pages}}</div>'
    }
  }
};

/**
 * Generate a PDF file from form data
 * @param {Object} formData - The form data to include in the PDF
 * @param {String} formType - The type of form (e.g., petty_cash, exam_duty)
 * @param {Object} user - User information
 * @returns {Promise<String>} - Path to the generated PDF
 */
export const generatePdf = (formData, formType, user, status = 'DRAFT', approvals = null) => {
  return new Promise((resolve, reject) => {
    try {
                // Generate HTML content based on form type
        const htmlContent = generateHtmlContent(formData, formType, user, status, approvals);

      // Create a unique filename
      const timestamp = Date.now();
      const filename = `${formType}_${timestamp}.pdf`;
      const filePath = path.join(__dirname, '../temp', filename);

      // Ensure temp directory exists
      if (!fs.existsSync(path.join(__dirname, '../temp'))) {
        fs.mkdirSync(path.join(__dirname, '../temp'), { recursive: true });
      }

      // Generate PDF from HTML
      htmlPdf.create(htmlContent, pdfOptions).toFile(filePath, (err, res) => {
        if (err) {
          console.error('Error generating PDF:', err);
          reject(err);
        } else {
          console.log('PDF generated successfully:', res.filename);
          resolve(res.filename);
        }
      });
    } catch (error) {
      console.error('Error in PDF generation service:', error);
      reject(error);
    }
  });
};

/**
 * Generate HTML content for the PDF based on form type
 * @param {Object} formData - The form data
 * @param {String} formType - The type of form
 * @param {Object} user - User information
 * @returns {String} - HTML content
 */
const generateHtmlContent = (formData, formType, user, status = 'DRAFT', approvals = null) => {
  // Derive approval states
  const normalizedStatus = (status || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');
  const hodApproved = Boolean(approvals && approvals.hodApproval && approvals.hodApproval.approvedAt);
  const hodApprovedAt = approvals && approvals.hodApproval && approvals.hodApproval.approvedAt
    ? new Date(approvals.hodApproval.approvedAt)
    : null;
  const financeApproved = Boolean(approvals && approvals.financeApproval && approvals.financeApproval.approvedAt);
  const financeApprovedAt = approvals && approvals.financeApproval && approvals.financeApproval.approvedAt
    ? new Date(approvals.financeApproval.approvedAt)
    : null;

  const hodIsApproved = hodApproved || normalizedStatus === 'pending_finance_approval' || normalizedStatus === 'approved';
  const financeIsApproved = financeApproved || normalizedStatus === 'approved';
  const isRejected = normalizedStatus === 'rejected';
  const rejectedByFinance = isRejected && hodIsApproved;
  const rejectedByHod = isRejected && !hodIsApproved;
  // Common header and styling
  const commonHeader = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${formType.replace('_', ' ').toUpperCase()} Form</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #2c3e50;
          line-height: 1.6;
          margin: 0;
          padding: 30px;
          background-color: #ffffff;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 3px solid #3498db;
          padding-bottom: 20px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 10px;
          padding: 20px;
        }
        .logo-section {
          margin-bottom: 20px;
        }
        .logo {
          font-size: 32px;
          font-weight: bold;
          color: #3498db;
          margin-bottom: 10px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }
        .form-title {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #2c3e50;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .form-subtitle {
          font-size: 16px;
          color: #7f8c8d;
          margin-bottom: 20px;
        }
        .status-section {
          background: linear-gradient(135deg, #e8f4fd 0%, #d1ecf1 100%);
          border: 2px solid #3498db;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 25px;
          text-align: center;
        }
        .status-badge {
          display: inline-block;
          background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
          color: white;
          padding: 8px 20px;
          border-radius: 25px;
          font-weight: bold;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
        }
        .section {
          margin-bottom: 25px;
          background: #ffffff;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .section-title {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 15px;
          border-bottom: 2px solid #3498db;
          padding-bottom: 10px;
          color: #2c3e50;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .form-group {
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 5px;
          border-left: 4px solid #3498db;
        }
        .form-label {
          font-weight: 600;
          margin-right: 15px;
          min-width: 180px;
          display: inline-block;
          color: #34495e;
          font-size: 14px;
        }
        .form-value {
          display: inline-block;
          color: #2c3e50;
          font-weight: 500;
          flex: 1;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        th, td {
          border: 1px solid #dee2e6;
          padding: 12px;
          text-align: left;
        }
        th {
          background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
          color: white;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .total-row {
          font-weight: bold;
          background: linear-gradient(135deg, #e8f4fd 0%, #d1ecf1 100%);
          color: #2c3e50;
        }
        .signature-section {
          margin-top: 40px;
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
        }
        .signature-block {
          display: inline-block;
          width: 45%;
          margin-bottom: 20px;
          vertical-align: top;
          text-align: center;
          position: relative;
        }
        .signature-line {
          border-top: 2px solid #3498db;
          margin-top: 40px;
          width: 80%;
          display: block;
        }
        .seal {
          position: absolute;
          top: -10px;
          right: 20px;
          width: 90px;
          height: 90px;
          border-radius: 50%;
          border: 3px solid currentColor;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          text-transform: uppercase;
          font-size: 16px;
          opacity: 0.9;
          transform: rotate(-12deg);
        }
        .seal-approved {
          color: #27ae60;
          background: rgba(39, 174, 96, 0.08);
        }
        .seal-pending {
          color: #e67e22;
          background: rgba(230, 126, 34, 0.08);
        }
        .seal-rejected {
          color: #c0392b;
          background: rgba(192, 57, 43, 0.08);
        }
        .seal-na {
          color: #7f8c8d;
          background: rgba(127, 140, 141, 0.08);
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #7f8c8d;
          font-size: 12px;
          border-top: 1px solid #e9ecef;
          padding-top: 20px;
        }
        .watermark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 120px;
          color: rgba(52, 152, 219, 0.1);
          z-index: -1;
          pointer-events: none;
        }
        .signature-title {
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="watermark">PAYFLOW</div>
      
      <div class="header">
        <div class="logo-section">
          <div class="logo">💰 PAYFLOW</div>
          <div class="form-subtitle">Digital Payment Management System</div>
        </div>
        <div class="form-title">${formType.replace('_', ' ').toUpperCase()} FORM</div>
        <div class="form-subtitle">University of Ruhuna</div>
      </div>
      
      <div class="status-section">
        <div class="status-badge">${status}</div>
        <div style="margin-top: 10px; font-size: 14px; color: #7f8c8d;">
          Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
        </div>
      </div>
  `;

  // Footer common to all forms
  const commonFooter = `
      <div class="signature-section">
        <div class="section-title">Approval Chain</div>
        
        <div class="signature-block">
          <div class="seal seal-approved">Approved</div>
          <div class="signature-line"></div>
          <div class="signature-title">Applicant</div>
          <div style="font-weight: 600; margin: 10px 0;">${user?.fullName || 'N/A'}</div>
          <div style="color: #7f8c8d; font-size: 12px;">Date: ${new Date().toLocaleDateString()}</div>
        </div>
        
        <div class="signature-block">
          <div class="seal ${rejectedByHod ? 'seal-rejected' : (hodIsApproved ? 'seal-approved' : (isRejected ? 'seal-na' : 'seal-pending'))}">${rejectedByHod ? 'Rejected' : (hodIsApproved ? 'Approved' : (isRejected ? 'N/A' : 'Pending'))}</div>
          <div class="signature-line"></div>
          <div class="signature-title">Head of Department</div>
          <div style="font-weight: 600; margin: 10px 0;">${rejectedByHod ? 'Rejected' : (hodIsApproved ? 'Approved' : (isRejected ? 'Not Applicable' : 'Pending Approval'))}</div>
          <div style="color: #7f8c8d; font-size: 12px;">Date: ${hodIsApproved && hodApprovedAt ? hodApprovedAt.toLocaleDateString() : ''}</div>
        </div>
        
        <div class="signature-block">
          <div class="seal ${rejectedByFinance ? 'seal-rejected' : (financeIsApproved ? 'seal-approved' : (isRejected ? 'seal-na' : 'seal-pending'))}">${rejectedByFinance ? 'Rejected' : (financeIsApproved ? 'Approved' : (isRejected ? 'N/A' : 'Pending'))}</div>
          <div class="signature-line"></div>
          <div class="signature-title">Finance Officer</div>
          <div style="font-weight: 600; margin: 10px 0;">${rejectedByFinance ? 'Rejected' : (financeIsApproved ? 'Approved' : (isRejected ? 'Not Applicable' : 'Pending Approval'))}</div>
          <div style="color: #7f8c8d; font-size: 12px;">Date: ${financeIsApproved && financeApprovedAt ? financeApprovedAt.toLocaleDateString() : ''}</div>
        </div>
      </div>
      
      <div class="footer">
        <div style="margin-bottom: 10px;">
          <strong>PAYFLOW</strong> - Digital Payment Management System
        </div>
        <div>University of Ruhuna | Generated electronically on ${new Date().toLocaleDateString()}</div>
        <div style="margin-top: 10px; font-size: 10px; color: #95a5a6;">
          This document was generated automatically by the PayFlow system. 
          For verification, please contact the finance department.
        </div>
        <div style="margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 5px; border: 1px solid #e9ecef;">
          <div style="text-align: center; font-size: 12px; color: #7f8c8d;">
            <strong>Document ID:</strong> ${formType.toUpperCase()}_${Date.now()}<br>
            <strong>Generated by:</strong> ${user?.fullName || 'System'}<br>
            <strong>Timestamp:</strong> ${new Date().toISOString()}
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  // Generate specific content based on form type
  let specificContent = '';

  switch (formType) {
    case 'petty_cash':
      specificContent = generatePettyCashContent(formData);
      break;
    case 'exam_duty':
      specificContent = generateExamDutyContent(formData);
      break;
    case 'transport':
      specificContent = generateTransportContent(formData);
      break;
    case 'paper_marking':
      specificContent = generatePaperMarkingContent(formData);
      break;
    case 'overtime':
      specificContent = generateOvertimeContent(formData);
      break;
    default:
      specificContent = `<div class="section">
        <div class="section-title">Form Data</div>
        <pre>${JSON.stringify(formData, null, 2)}</pre>
      </div>`;
  }

  return commonHeader + specificContent + commonFooter;
};

/**
 * Generate HTML content for Petty Cash form
 */
const generatePettyCashContent = (formData) => {
  // Extract data from the nested structure
  const data = formData.basicInfo || formData;

  return `
    <div class="section">
      <div class="section-title">📋 Basic Information</div>
      
      <div class="form-group">
        <span class="form-label">👤 Requestor Name:</span>
        <span class="form-value">${data.requestorName || 'Not specified'}</span>
      </div>
      
      <div class="form-group">
        <span class="form-label">🏢 Position:</span>
        <span class="form-value">${data.position || 'Not specified'}</span>
      </div>
      
      <div class="form-group">
        <span class="form-label">🏛️ Department:</span>
        <span class="form-value">${data.department || 'Not specified'}</span>
      </div>
      
      <div class="form-group">
        <span class="form-label">📅 Date Requested:</span>
        <span class="form-value">${data.dateRequested || 'Not specified'}</span>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">💰 Financial Details</div>
      
      <div class="form-group">
        <span class="form-label">💵 Amount Required (Rs):</span>
        <span class="form-value" style="font-size: 18px; font-weight: bold; color: #27ae60;">Rs. ${data.amountRs || '0'}</span>
      </div>
      
      <div class="form-group">
        <span class="form-label">📆 Expected Spending Date:</span>
        <span class="form-value">${data.expectedSpendingDate || 'Not specified'}</span>
      </div>
      
      <div class="form-group">
        <span class="form-label">📝 Reason for Request:</span>
        <span class="form-value">${data.reasonForRequest || 'Not specified'}</span>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">📊 Request Summary</div>
      
      <div style="background: linear-gradient(135deg, #e8f4fd 0%, #d1ecf1 100%); padding: 20px; border-radius: 8px; border-left: 4px solid #3498db;">
        <div style="text-align: center; margin-bottom: 15px;">
          <div style="font-size: 16px; font-weight: 600; color: #2c3e50; margin-bottom: 5px;">Request Summary</div>
          <div style="font-size: 14px; color: #7f8c8d;">This request is for petty cash reimbursement</div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
          <div style="text-align: center; padding: 10px; background: white; border-radius: 5px;">
            <div style="font-size: 12px; color: #7f8c8d; margin-bottom: 5px;">Requestor</div>
            <div style="font-weight: 600; color: #2c3e50;">${data.requestorName || 'N/A'}</div>
          </div>
          <div style="text-align: center; padding: 10px; background: white; border-radius: 5px;">
            <div style="font-size: 12px; color: #7f8c8d; margin-bottom: 5px;">Amount</div>
            <div style="font-weight: 600; color: #27ae60; font-size: 16px;">Rs. ${data.amountRs || '0'}</div>
          </div>
        </div>
      </div>
    </div>
  `;
};

/**
 * Generate HTML content for Exam Duty form
 */
const generateExamDutyContent = (formData) => {
  // Extract data from the nested structure
  const basicInfo = formData.basicInfo || {};
  const examDetails = formData.examDetails || [];
  const totals = formData.totals || {};

  // Create exam details table
  let examDetailsTable = `
    <div class="section">
      <div class="section-title">Examination Details</div>
      <table>
        <thead>
          <tr>
            <th>Exam Name</th>
            <th>Date</th>
            <th>Venue</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Hours</th>
            <th>Rate (Rs)</th>
            <th>Amount (Rs)</th>
          </tr>
        </thead>
        <tbody>
  `;

  // Add rows for each exam
  examDetails.forEach(detail => {
    examDetailsTable += `
      <tr>
        <td>${detail.examName || ''}</td>
        <td>${detail.date || ''}</td>
        <td>${detail.venue || ''}</td>
        <td>${detail.startTime || ''}</td>
        <td>${detail.endTime || ''}</td>
        <td>${detail.hoursWorked || ''}</td>
        <td>${detail.payPerHour || ''}</td>
        <td>${detail.totalAmount || ''}</td>
      </tr>
    `;
  });

  // Add totals row
  examDetailsTable += `
        <tr class="total-row">
          <td colspan="5">Totals</td>
          <td>${totals.totalHours || '0'}</td>
          <td></td>
          <td>${totals.totalAmount || '0'}</td>
        </tr>
      </tbody>
    </table>
  `;

  return `
    <div class="section">
      <div class="section-title">Basic Information</div>
      
      <div class="form-group">
        <span class="form-label">Officer Name:</span>
        <span class="form-value">${basicInfo.officerName || ''}</span>
      </div>
      
      <div class="form-group">
        <span class="form-label">Position:</span>
        <span class="form-value">${basicInfo.position || ''}</span>
      </div>
      
      <div class="form-group">
        <span class="form-label">Department:</span>
        <span class="form-value">${basicInfo.department || ''}</span>
      </div>
      
      <div class="form-group">
        <span class="form-label">Bank Account:</span>
        <span class="form-value">${basicInfo.bankAccount || ''}</span>
      </div>
      
      <div class="form-group">
        <span class="form-label">Bank Name:</span>
        <span class="form-value">${basicInfo.bankName || ''}</span>
      </div>
      
      <div class="form-group">
        <span class="form-label">Branch:</span>
        <span class="form-value">${basicInfo.branch || ''}</span>
      </div>
      
      <div class="form-group">
        <span class="form-label">Venue:</span>
        <span class="form-value">${basicInfo.venue || ''}</span>
      </div>
      
      <div class="form-group">
        <span class="form-label">Number of Candidates:</span>
        <span class="form-value">${basicInfo.numberOfCandidates || ''}</span>
      </div>
    </div>
    
    ${examDetailsTable}
    
    <div class="section">
      <div class="section-title">Payment Summary</div>
      
      <div class="form-group">
        <span class="form-label">Total Hours:</span>
        <span class="form-value">${totals.totalHours || '0'}</span>
      </div>
      
      <div class="form-group">
        <span class="form-label">Total Amount (Rs):</span>
        <span class="form-value">${totals.totalAmount || '0'}</span>
      </div>
      
      <div class="form-group">
        <span class="form-label">Advances Received (Rs):</span>
        <span class="form-value">${totals.advancesReceived || '0'}</span>
      </div>
      
      <div class="form-group">
        <span class="form-label">Balance Due (Rs):</span>
        <span class="form-value">${totals.balanceDue || '0'}</span>
      </div>
    </div>
  `;
};

/**
 * Generate HTML content for Transport form
 */
const generateTransportContent = (formData) => {
  // Extract data from the nested structure
  const data = formData.basicInfo || formData;
  const journeyDetails = formData.journeyDetails || [];

  // Create journey details table
  let journeyTable = `
    <div class="section">
      <div class="section-title">Journey Details</div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>From</th>
            <th>To</th>
            <th>Purpose</th>
            <th>Mode</th>
            <th>Distance (km)</th>
            <th>Amount (Rs)</th>
          </tr>
        </thead>
        <tbody>
  `;

  // Add rows for each journey
  journeyDetails.forEach(journey => {
    journeyTable += `
      <tr>
        <td>${journey.date || ''}</td>
        <td>${journey.from || ''}</td>
        <td>${journey.to || ''}</td>
        <td>${journey.purpose || ''}</td>
        <td>${journey.transportMode || ''}</td>
        <td>${journey.distance || ''}</td>
        <td>${journey.amount || ''}</td>
      </tr>
    `;
  });

  // Calculate total amount
  const totalAmount = journeyDetails.reduce((total, journey) => total + (parseFloat(journey.amount) || 0), 0);

  // Add totals row
  journeyTable += `
        <tr class="total-row">
          <td colspan="6">Total Amount</td>
          <td>${totalAmount.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
  `;

  return `
    <div class="section">
      <div class="section-title">Basic Information</div>
      
      <div class="form-group">
        <span class="form-label">Claimant Name:</span>
        <span class="form-value">${data.claimantName || ''}</span>
      </div>
      
      <div class="form-group">
        <span class="form-label">Position:</span>
        <span class="form-value">${data.position || ''}</span>
      </div>
      
      <div class="form-group">
        <span class="form-label">Department:</span>
        <span class="form-value">${data.department || ''}</span>
      </div>
      
      <div class="form-group">
        <span class="form-label">Month/Year:</span>
        <span class="form-value">${data.claimPeriod || ''}</span>
      </div>
    </div>
    
    ${journeyTable}
    
    <div class="section">
      <div class="section-title">Bank Details</div>
      
      <div class="form-group">
        <span class="form-label">Bank Account Number:</span>
        <span class="form-value">${data.bankAccount || ''}</span>
      </div>
      
      <div class="form-group">
        <span class="form-label">Bank Name:</span>
        <span class="form-value">${data.bankName || ''}</span>
      </div>
      
      <div class="form-group">
        <span class="form-label">Branch:</span>
        <span class="form-value">${data.branch || ''}</span>
      </div>
    </div>
  `;
};

/**
 * Generate HTML content for Paper Marking form
 */
const generatePaperMarkingContent = (formData) => {
  // Extract data from the nested structure
  const basicInfo = formData.basicInfo || {};
  const paperDetails = formData.paperDetails || [];
  const markingDetails = formData.markingDetails || {};
  const practicalDetails = formData.practicalDetails || {};
  const totalAmount = formData.totalAmount || 0;

  // Create paper details table
  let paperDetailsTable = `
    <div class="section">
      <div class="section-title">Paper Details</div>
      <table>
        <thead>
          <tr>
            <th>Duration (hrs)</th>
            <th>No. of Papers</th>
            <th>Rate per Paper (Rs)</th>
            <th>Amount (Rs)</th>
          </tr>
        </thead>
        <tbody>
  `;

  // Add rows for each paper detail
  paperDetails.forEach(detail => {
    paperDetailsTable += `
      <tr>
        <td>${detail.duration || ''}</td>
        <td>${detail.noOfPapers || ''}</td>
        <td>${detail.ratePerPaper || ''}</td>
        <td>${detail.amount || ''}</td>
      </tr>
    `;
  });

  paperDetailsTable += `
      </tbody>
    </table>
  `;

  return `
    <div class="section">
      <div class="section-title">Basic Information</div>
      
      <div class="form-group">
        <span class="form-label">Examination:</span>
        <span class="form-value">${basicInfo.examination || ''}</span>
      </div>
      
      <div class="form-group">
        <span class="form-label">Subject:</span>
        <span class="form-value">${basicInfo.subject || ''}</span>
      </div>
      
      <div class="form-group">
        <span class="form-label">Examiner Name:</span>
        <span class="form-value">${basicInfo.examinerName || ''}</span>
      </div>
      
      <div class="form-group">
        <span class="form-label">UPF No:</span>
        <span class="form-value">${basicInfo.upfNo || ''}</span>
      </div>
      
      <div class="form-group">
        <span class="form-label">Address:</span>
        <span class="form-value">${basicInfo.address || ''}</span>
      </div>
    </div>
    
    ${paperDetailsTable}
    
    <div class="section">
      <div class="section-title">Marking Details</div>
      
      <div class="form-group">
        <span class="form-label">Number of Papers:</span>
        <span class="form-value">${markingDetails.noOfPapers || ''}</span>
      </div>
      
      <div class="form-group">
        <span class="form-label">Amount (Rs):</span>
        <span class="form-value">${markingDetails.amount || ''}</span>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">Practical Examination Details</div>
      
      <div class="form-group">
        <span class="form-label">Number of Candidates:</span>
        <span class="form-value">${practicalDetails.noOfCandidates || ''}</span>
      </div>
      
      <div class="form-group">
        <span class="form-label">Amount (Rs):</span>
        <span class="form-value">${practicalDetails.amount || ''}</span>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">Payment Summary</div>
      
      <div class="form-group">
        <span class="form-label">Total Amount (Rs):</span>
        <span class="form-value">${totalAmount || '0'}</span>
      </div>
    </div>
  `;
};

/**
 * Generate HTML content for Overtime form
 */
const generateOvertimeContent = (formData) => {
  // Extract data from the nested structure
  const basicInfo = formData.basicInfo || {};
  const overtimeDetails = formData.overtimeDetails || [];
  const totalAmount = formData.totalAmount || 0;

  // Create overtime details table
  let overtimeTable = `
    <div class="section">
      <div class="section-title">Overtime Details</div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Hours</th>
            <th>Rate (Rs/hr)</th>
            <th>Amount (Rs)</th>
          </tr>
        </thead>
        <tbody>
  `;

  // Add rows for each overtime entry
  overtimeDetails.forEach(detail => {
    overtimeTable += `
      <tr>
        <td>${detail.date || ''}</td>
        <td>${detail.startTime || ''}</td>
        <td>${detail.endTime || ''}</td>
        <td>${detail.hours || ''}</td>
        <td>${detail.rate || ''}</td>
        <td>${detail.amount || ''}</td>
      </tr>
    `;
  });

  // Add totals row
  overtimeTable += `
        <tr class="total-row">
          <td colspan="5">Total Amount</td>
          <td>${totalAmount}</td>
        </tr>
      </tbody>
    </table>
  `;

  return `
    <div class="section">
      <div class="section-title">Basic Information</div>
      
      <div class="form-group">
        <span class="form-label">Employee Name:</span>
        <span class="form-value">${basicInfo.employeeName || ''}</span>
      </div>
      
      <div class="form-group">
        <span class="form-label">Position:</span>
        <span class="form-value">${basicInfo.position || ''}</span>
      </div>
      
      <div class="form-group">
        <span class="form-label">Department:</span>
        <span class="form-value">${basicInfo.department || ''}</span>
      </div>
      
      <div class="form-group">
        <span class="form-label">Month/Year:</span>
        <span class="form-value">${basicInfo.overtimePeriod || ''}</span>
      </div>
    </div>
    
    ${overtimeTable}
    
    <div class="section">
      <div class="section-title">Payment Details</div>
      
      <div class="form-group">
        <span class="form-label">Bank Account Number:</span>
        <span class="form-value">${basicInfo.bankAccount || ''}</span>
      </div>
      
      <div class="form-group">
        <span class="form-label">Bank Name:</span>
        <span class="form-value">${basicInfo.bankName || ''}</span>
      </div>
      
      <div class="form-group">
        <span class="form-label">Branch:</span>
        <span class="form-value">${basicInfo.branch || ''}</span>
      </div>
    </div>
  `;
};

export default { generatePdf }; 