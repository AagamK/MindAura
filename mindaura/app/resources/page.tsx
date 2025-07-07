import React from 'react';

const ResourcesPage = () => {
  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Mental Wellness Resources</h1>
      <p className="text-lg text-gray-700 mb-6">
        Here you can find a collection of resources to support your mental wellness journey. 
        These include articles, websites, and hotlines that can provide assistance and information.
      </p>
      <ul className="space-y-4">
        <li>
          <a href="https://www.nami.org/Home" className="text-indigo-600 hover:underline">
            National Alliance on Mental Illness (NAMI)
          </a>
          <p className="text-gray-600">A national organization that offers support and education for individuals affected by mental illness.</p>
        </li>
        <li>
          <a href="https://www.mentalhealth.gov/" className="text-indigo-600 hover:underline">
            MentalHealth.gov
          </a>
          <p className="text-gray-600">A government website that provides information about mental health and resources for help.</p>
        </li>
        <li>
          <a href="https://www.suicidepreventionlifeline.org/" className="text-indigo-600 hover:underline">
            National Suicide Prevention Lifeline
          </a>
          <p className="text-gray-600">A 24/7 service that provides support for individuals in distress or crisis.</p>
        </li>
        <li>
          <a href="https://www.psychologytoday.com/us/basics/therapy" className="text-indigo-600 hover:underline">
            Psychology Today
          </a>
          <p className="text-gray-600">A resource for finding therapists and understanding various mental health topics.</p>
        </li>
      </ul>
    </div>
  );
};

export default ResourcesPage;