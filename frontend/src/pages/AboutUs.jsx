import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-750 to-blue-600 text-white py-8 text-center rounded-xl mb-8">
          <h1 className="text-3xl font-bold mb-2">About PayFlow</h1>
          <p className="text-lg">Faculty of Engineering, University of Ruhuna</p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <section className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              PayFlow is a comprehensive payment request management system designed to streamline and modernize the payment request process at the Faculty of Engineering, University of Ruhuna. Our mission is to simplify the administrative workflow while ensuring transparency and efficiency in handling academic-related payments.
            </p>
          </section>

          {/* Features Section */}
          <section className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">Key Features</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Multiple Payment Types</h3>
                <p className="text-gray-600">Support for various payment categories including petty cash, exam duties, paper marking, transportation, and overtime.</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Real-time Tracking</h3>
                <p className="text-gray-600">Monitor the status of your payment requests in real-time with instant notifications.</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Multi-level Approval</h3>
                <p className="text-gray-600">Streamlined approval process involving department heads and financial division.</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Secure Platform</h3>
                <p className="text-gray-600">Advanced security measures with Clerk authentication ensuring data protection.</p>
              </div>
            </div>
          </section>

          {/* Footer Note */}
          <div className="text-center text-gray-600 mt-8">
            <p>© {new Date().getFullYear()} PayFlow - Faculty of Engineering, University of Ruhuna</p>
            <p className="text-sm mt-2">All rights reserved</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 