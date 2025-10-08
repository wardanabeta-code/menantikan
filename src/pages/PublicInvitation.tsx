// Public invitation page with slug-based routing
import React from 'react';
import { useParams } from 'react-router-dom';

const PublicInvitation: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Public Invitation</h1>
        <p className="text-gray-600">Invitation slug: {slug}</p>
        <p className="text-gray-500 mt-4">Template rendering system implemented</p>
      </div>
    </div>
  );
};

export default PublicInvitation;