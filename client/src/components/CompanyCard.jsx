import React from 'react';

const CompanyCard = ({ company }) => {
  
  const getSizeColor = (size) => {
    const colors = {
      '1-10': 'bg-blue-100 text-blue-800',
      '11-50': 'bg-green-100 text-green-800',
      '51-200': 'bg-yellow-100 text-yellow-800',
      '201-500': 'bg-orange-100 text-orange-800',
      '501-1000': 'bg-red-100 text-red-800',
      '1000+': 'bg-purple-100 text-purple-800'
    };
    return colors[size] || 'bg-gray-100 text-gray-800';
  };

  const getIndustryColor = (industry) => {
    const colors = {
      'Technology': 'bg-blue-100 text-blue-800',
      'Healthcare': 'bg-green-100 text-green-800',
      'Finance': 'bg-yellow-100 text-yellow-800',
      'Education': 'bg-purple-100 text-purple-800',
      'Manufacturing': 'bg-orange-100 text-orange-800',
      'Retail': 'bg-pink-100 text-pink-800',
      'Real Estate': 'bg-indigo-100 text-indigo-800',
      'Consulting': 'bg-gray-100 text-gray-800',
      'Media & Entertainment': 'bg-red-100 text-red-800',
      'Transportation': 'bg-teal-100 text-teal-800',
      'Energy': 'bg-yellow-100 text-yellow-800',
      'Government': 'bg-slate-100 text-slate-800',
      'Non-profit': 'bg-emerald-100 text-emerald-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[industry] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-1">{company.name}</h3>
          <p className="text-gray-600 text-sm">
            {company.location.city}, {company.location.state}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getIndustryColor(company.industry)}`}>
            {company.industry}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSizeColor(company.size)}`}>
            {company.size} employees
          </span>
        </div>
      </div>

      <p className="text-gray-700 text-sm mb-4 line-clamp-3">
        {company.description}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-gray-500">Founded:</span>
          <span className="ml-1 font-medium">{company.founded}</span>
        </div>
        <div>
          <span className="text-gray-500">Revenue:</span>
          <span className="ml-1 font-medium">{company.revenue || 'Not disclosed'}</span>
        </div>
      </div>

      {company.website && (
        <div className="mb-3">
          <a 
            href={company.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Visit Website →
          </a>
        </div>
      )}

      {company.tags && company.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {company.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
            >
              {tag}
            </span>
          ))}
          {company.tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
              +{company.tags.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyCard;
