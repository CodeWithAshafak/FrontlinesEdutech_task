import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CompanyCard from './components/CompanyCard';
import CompanyTable from './components/CompanyTable';
import CompanyForm from './components/CompanyForm';
import FilterControls from './components/FilterControls';
import Pagination from './components/Pagination';
import './App.css';

const API_BASE_URL = 'http://localhost:8000/api';

function App() {
  const [companies, setCompanies] = useState([]);
  const [filterOptions, setFilterOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // cards or table
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  const [filters, setFilters] = useState({
    search: '',
    industry: '',
    size: '',
    city: '',
    state: '',
    revenue: '',
    foundedFrom: '',
    foundedTo: '',
    status: 'Active'
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Fetch companies with current filters and pagination
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        sort: sortField,
        order: sortOrder,
        ...filters
      };

      // Remove empty filter values
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await axios.get(`${API_BASE_URL}/companies`, { params });
      
      if (response.data.success) {
        setCompanies(response.data.data);
        setPagination(response.data.pagination);
      } else {
        setError('Failed to fetch companies');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching companies');
      console.error('Error fetching companies:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch filter options
  const fetchFilterOptions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/companies/filter-options`);
      if (response.data.success) {
        setFilterOptions(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching filter options:', err);
    }
  };

  // Handle new company creation
  const handleCompanyCreated = async () => {
    await fetchCompanies();
    await fetchFilterOptions();
  };

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setPagination(prev => ({
      ...prev,
      currentPage: 1 
    }));
  };

  // Handle search
  const handleSearch = (value) => {
    setFilters(prev => ({
      ...prev,
      search: value
    }));
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      industry: '',
      size: '',
      city: '',
      state: '',
      revenue: '',
      foundedFrom: '',
      foundedTo: '',
      status: 'Active'
    });
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Fetch data when filters, pagination, or sorting changes
  useEffect(() => {
    fetchCompanies();
  }, [filters, pagination.currentPage, sortField, sortOrder]);

  
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
     
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 py-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">Companies Directory</h1>
              <p className="mt-1 text-sm text-gray-500">
                Discover and explore companies across various industries
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <CompanyForm apiBaseUrl={API_BASE_URL} onCreated={handleCompanyCreated} />
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    viewMode === 'cards' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Cards
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    viewMode === 'table' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Table
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

   
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Controls */}
        <FilterControls
          filters={filters}
          onFilterChange={handleFilterChange}
          filterOptions={filterOptions}
          onClearFilters={clearFilters}
          onSearch={handleSearch}
        />

       
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading companies...</span>
          </div>
        )}

     
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

       
        {!loading && !error && (
          <>
            {/* Results Summary */}
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Showing {pagination.totalItems} companies
                {pagination.totalItems > 0 && (
                  <span className="ml-2">
                    (Page {pagination.currentPage} of {pagination.totalPages})
                  </span>
                )}
              </p>
            </div>

          
            {companies.length > 0 ? (
              <>
                {viewMode === 'cards' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {companies.map((company) => (
                      <CompanyCard key={company._id} company={company} />
                    ))}
                  </div>
                ) : (
                  <div className="mb-8">
                    <CompanyTable 
                      companies={companies} 
                      onSort={handleSort}
                    />
                  </div>
                )}

              
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.totalItems}
                  itemsPerPage={pagination.itemsPerPage}
                  hasNextPage={pagination.hasNextPage}
                  hasPrevPage={pagination.hasPrevPage}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your filters or search terms to find companies.
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;