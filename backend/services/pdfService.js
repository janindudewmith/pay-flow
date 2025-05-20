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
export const generatePdf = (formData, formType, user) => {
  return new Promise((resolve, reject) => {
    try {
      // Generate HTML content based on form type
      const htmlContent = generateHtmlContent(formData, formType, user);

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
const generateHtmlContent = (formData, formType, user) => {
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
          font-family: Arial, sans-serif;
          color: #333;
          line-height: 1.5;
          margin: 0;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
          border-bottom: 1px solid #ccc;
          padding-bottom: 10px;
        }
        .form-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .form-subtitle {
          font-size: 16px;
          color: #666;
          margin-bottom: 20px;
        }
        .section {
          margin-bottom: 20px;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
          border-bottom: 1px solid #eee;
          padding-bottom: 5px;
        }
        .form-group {
          margin-bottom: 10px;
        }
        .form-label {
          font-weight: bold;
          margin-right: 10px;
          min-width: 150px;
          display: inline-block;
        }
        .form-value {
          display: inline-block;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
        .total-row {
          font-weight: bold;
          background-color: #f9f9f9;
        }
        .signature-section {
          margin-top: 40px;
        }
        .signature-block {
          display: inline-block;
          width: 45%;
          margin-bottom: 20px;
          vertical-align: top;
        }
        .signature-line {
          border-top: 1px solid #000;
          margin-top: 40px;
          width: 80%;
        }
        .signature-title {
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="form-title">${formType.replace('_', ' ').toUpperCase()} FORM</div>
        <div class="form-subtitle">University of Moratuwa</div>
      </div>
  `;

  // Footer common to all forms
  const commonFooter = `
      <div class="signature-section">
        <div class="signature-block">
          <div class="signature-line"></div>
          <div class="signature-title">Applicant Signature</div>
          <div>${user?.fullName || ''}</div>
          <div>${new Date().toLocaleDateString()}</div>
        </div>
        
        <div class="signature-block">
          <div class="signature-line"></div>
          <div class="signature-title">Approved By</div>
          <div></div>
          <div></div>
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
  const data = formData.basicInfo || formData;

  return `
    <div class="section">
      <div class="section-title">Basic Information</div>
      
      <div class="form-group">
        <span class="form-label">Requestor Name:</span>
        <span class="form-value">${data.requestorName || ''}</span>
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
        <span class="form-label">Date Requested:</span>
        <span class="form-value">${data.dateRequested || ''}</span>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">Amount Information</div>
      
      <div class="form-group">
        <span class="form-label">Amount (Rs):</span>
        <span class="form-value">${data.amountRs || '0'}.${data.amountCts || '00'}</span>
      </div>
      
      <div class="form-group">
        <span class="form-label">Expected Spending Date:</span>
        <span class="form-value">${data.expectedSpendingDate || ''}</span>
      </div>
      
      <div class="form-group">
        <span class="form-label">Reason for Request:</span>
        <span class="form-value">${data.reasonForRequest || ''}</span>
      </div>
    </div>
  `;
};

/**
 * Generate HTML content for Exam Duty form
 */
const generateExamDutyContent = (formData) => {
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