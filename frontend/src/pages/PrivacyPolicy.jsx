import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-white text-gray-700 min-h-screen">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-600">Privacy Policy</h1>
          <p className="mt-4 text-lg text-gray-500">How we protect and manage your information</p>
        </div>

        <div className="mt-12 max-w-4xl mx-auto">
          <div className="relative z-10 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl overflow-hidden mb-12">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-400 to-blue-600"></div>
            <div className="p-7 md:p-10">
              <div className="inline-block mb-5 bg-blue-100 rounded-lg p-2">
                <svg className="w-9 h-9 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-5 text-gray-800 relative">
                Our Commitment to Privacy
                <span className="absolute bottom-0 left-0 w-14 h-1 bg-blue-600 rounded-full"></span>
              </h2>
              <p className="text-base leading-relaxed text-gray-700 mb-5">
                PayFlow is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our payment request management system. We take your privacy seriously and have implemented robust measures to ensure your data remains secure.
              </p>
            </div>
          </div>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-blue-600 mr-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </span>
                Information We Collect
              </h2>
              <div className="bg-gray-50 p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                <div className="mb-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Personal Information</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Name and contact information</li>
                    <li>University email address</li>
                    <li>Department and position</li>
                    <li>Employee identification number</li>
                    <li>Bank account details for payment processing</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800 mb-2">Payment Information</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Payment request details</li>
                    <li>Supporting documents and receipts</li>
                    <li>Transaction history</li>
                    <li>Approval status and comments</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-blue-600 mr-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </span>
                How We Use Your Information
              </h2>
              <div className="bg-gray-50 p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Process and manage payment requests</li>
                  <li>Verify your identity and eligibility</li>
                  <li>Communicate about your requests</li>
                  <li>Send notifications about request status</li>
                  <li>Maintain system security and prevent fraud</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-blue-600 mr-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </span>
                Data Security
              </h2>
              <div className="bg-gray-50 p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                <p className="text-gray-700 mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information, including:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Encryption of sensitive data</li>
                  <li>Secure authentication through Clerk</li>
                  <li>Regular security assessments</li>
                  <li>Access controls and authorization</li>
                  <li>Secure data storage and transmission</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-blue-600 mr-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </span>
                Data Retention
              </h2>
              <div className="bg-gray-50 p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                <p className="text-gray-700">
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-blue-600 mr-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </span>
                Your Rights
              </h2>
              <div className="bg-gray-50 p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                <p className="text-gray-700 mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Object to data processing</li>
                  <li>Data portability</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-blue-600 mr-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </span>
                Contact Us
              </h2>
              <div className="bg-gray-50 p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                <p className="text-gray-700 mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us at:
                </p>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-gray-700">Email: privacy@payflow.ruh.ac.lk</p>
                  <p className="text-gray-700">Phone: +94 91 224 5767</p>
                  <p className="text-gray-700">Address: Faculty of Engineering, University of Ruhuna, Hapugala, Galle, Sri Lanka</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-blue-600 mr-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                </span>
                Updates to This Policy
              </h2>
              <div className="bg-gray-50 p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                <p className="text-gray-700">
                  We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last Updated" date. We encourage you to review this Privacy Policy periodically.
                </p>
                <p className="text-gray-600 mt-4 font-medium">
                  Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 