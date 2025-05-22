import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-750 to-blue-600 text-white py-8 text-center rounded-xl mb-8">
          <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-lg">Faculty of Engineering, University of Ruhuna</p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                PayFlow ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our payment request management system.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">2. Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-blue-800 mb-2">2.1 Personal Information</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Name and contact information</li>
                    <li>University email address</li>
                    <li>Department and position</li>
                    <li>Employee identification number</li>
                    <li>Bank account details for payment processing</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800 mb-2">2.2 Payment Information</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Payment request details</li>
                    <li>Supporting documents and receipts</li>
                    <li>Transaction history</li>
                    <li>Approval status and comments</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Process and manage payment requests</li>
                <li>Verify your identity and eligibility</li>
                <li>Communicate about your requests</li>
                <li>Send notifications about request status</li>
                <li>Maintain system security and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">4. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational measures to protect your personal information, including:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Encryption of sensitive data</li>
                <li>Secure authentication through Clerk</li>
                <li>Regular security assessments</li>
                <li>Access controls and authorization</li>
                <li>Secure data storage and transmission</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">5. Data Retention</h2>
              <p className="text-gray-700 mb-4">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">6. Your Rights</h2>
              <p className="text-gray-700 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to data processing</li>
                <li>Data portability</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">7. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">Email: privacy@payflow.ruh.ac.lk</p>
                <p className="text-gray-700">Phone: +94 91 224 5767</p>
                <p className="text-gray-700">Address: Faculty of Engineering, University of Ruhuna, Hapugala, Galle, Sri Lanka</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">8. Updates to This Policy</h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last Updated" date. We encourage you to review this Privacy Policy periodically.
              </p>
              <p className="text-gray-600 mt-4 text-sm">
                Last Updated: {new Date().toLocaleDateString()}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 