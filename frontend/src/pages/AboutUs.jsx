import React from 'react';

const AboutUs = () => {
  return (
    <div className="bg-white text-gray-700 min-h-screen">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">About PayFlow</h1>
          <p className="mt-4 text-lg text-gray-600">Streamlining Payments, Simplifying Workflows.</p>
        </div>

        <div className="mt-5 relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-50 rounded-full opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-50 rounded-full opacity-70 animate-pulse" style={{ animationDelay: '1s' }}></div>

          <div className="relative z-10 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl overflow-hidden border border-blue-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-400 to-blue-600"></div>

            <div className="p-7 md:p-10">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-10">
                  <div className="inline-block mb-5 bg-blue-100 rounded-lg p-2 shadow-md transform transition-all duration-300 hover:scale-105">
                    <svg className="w-9 h-9 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-5 text-gray-800 relative">
                    Our Mission
                    <span className="absolute bottom-0 left-0 w-14 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></span>
                  </h2>
                  <p className="text-base leading-relaxed text-gray-700 mb-5">
                    Our mission is to eliminate the inefficiencies of traditional payment request systems by providing a centralized, transparent platform that empowers employees, simplifies approvals for managers, and streamlines processing for finance departments.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center transform transition-all hover:translate-y-[-2px]">
                      <div className="bg-blue-100 p-1.5 rounded-full mr-2 shadow-sm">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <span className="font-medium text-sm">Efficiency</span>
                    </div>
                    <div className="flex items-center transform transition-all hover:translate-y-[-2px]">
                      <div className="bg-blue-100 p-1.5 rounded-full mr-2 shadow-sm">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <span className="font-medium text-sm">Transparency</span>
                    </div>
                    <div className="flex items-center transform transition-all hover:translate-y-[-2px]">
                      <div className="bg-blue-100 p-1.5 rounded-full mr-2 shadow-sm">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <span className="font-medium text-sm">Accessibility</span>
                    </div>
                  </div>
                </div>

                <div className="md:w-1/2 mt-8 md:mt-0">
                  <div className="relative">
                    <div className="absolute -top-4 -left-4 w-22 h-22 bg-blue-100 rounded-lg transform rotate-6 opacity-70"></div>
                    <div className="absolute -bottom-4 -right-4 w-22 h-22 bg-blue-100 rounded-lg transform -rotate-6 opacity-70"></div>

                    <div className="relative z-10 bg-white p-5 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-blue-50">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-7 rounded-lg flex items-center justify-center">
                        <svg className="w-40 h-40 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>

                      <div className="mt-5 flex justify-between items-center">
                        <div className="text-center w-1/3">
                          <div className="text-xl font-bold text-blue-600">90%</div>
                          <div className="text-sm text-gray-500">Time Saved</div>
                        </div>
                        <div className="text-center w-1/3">
                          <div className="text-xl font-bold text-blue-600">100%</div>
                          <div className="text-sm text-gray-500">Transparency</div>
                        </div>
                        <div className="text-center w-1/3">
                          <div className="text-xl font-bold text-blue-600">24/7</div>
                          <div className="text-sm text-gray-500">Accessibility</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-10 text-gray-800 relative inline-block">
              Why Choose PayFlow?
              <span className="absolute bottom-0 left-0 right-0 mx-auto w-24 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-100">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-600">Efficiency</h3>
              <p>Submit and approve requests in minutes, not days. Our automated workflows accelerate the entire process.</p>
            </div>
            <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-100">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-600">Transparency</h3>
              <p>Track the status of your requests in real-time. No more guessing games or follow-up emails.</p>
            </div>
            <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-100">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-600">Accessibility</h3>
              <p>Access PayFlow from anywhere, on any device. Our responsive design ensures a seamless experience.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutUs; 