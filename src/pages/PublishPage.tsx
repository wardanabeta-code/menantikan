// Publish page placeholder
import React from 'react';
import { useParams } from 'react-router-dom';

const PublishPage: React.FC = () => {
  const { id } = useParams();
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Publish</h1>
        <p className="text-gray-600">Publishing invitation: {id}</p>
        <p className="text-gray-500 mt-4">Coming soon...</p>
      </div>
    </div>
  );
};

export default PublishPage;