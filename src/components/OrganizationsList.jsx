import { useState } from 'react';
import { useOrganizations, useMutation } from '../hooks/useAPI';
import apiClient from '../services/apiClient';

/**
 * Organizations List Component
 * Displays list of organizations with filtering and actions
 */
export default function OrganizationsList() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: '',
  });

  const { organizations, pagination, loading, error, refresh } = useOrganizations(filters);
  const createOrg = useMutation(apiClient.organizations.create);

  const handleSearch = (e) => {
    setFilters({ ...filters, search: e.target.value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
    refresh({ ...filters, page: newPage });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading organizations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-900/20 border border-red-600 rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-bold text-red-500 mb-2">Error</h2>
          <p className="text-gray-300">{error}</p>
          <button
            onClick={refresh}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Organizations</h1>
        <p className="text-gray-400">
          Verified organizations working against CCP oppression
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search organizations..."
          value={filters.search}
          onChange={handleSearch}
          className="w-full max-w-md px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
        />
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.map((org) => (
          <div
            key={org.id}
            className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-red-600 transition-colors"
          >
            {org.logo_url && (
              <img
                src={org.logo_url}
                alt={org.name}
                className="w-16 h-16 object-cover rounded mb-4"
              />
            )}
            
            <h3 className="text-xl font-bold text-white mb-2">{org.name}</h3>
            
            {org.verification_status === 'verified' && (
              <span className="inline-block px-2 py-1 text-xs bg-green-900/30 text-green-400 border border-green-600 rounded mb-3">
                ✓ Verified
              </span>
            )}
            
            <p className="text-gray-400 text-sm mb-4 line-clamp-3">
              {org.description}
            </p>
            
            {org.headquarters_country && (
              <p className="text-gray-500 text-sm mb-2">
                📍 {org.headquarters_country}
              </p>
            )}
            
            {org.focus_areas && org.focus_areas.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {org.focus_areas.slice(0, 3).map((area, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded"
                  >
                    {area}
                  </span>
                ))}
              </div>
            )}
            
            <div className="mt-4 flex gap-2">
              {org.website && (
                <a
                  href={org.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-500 hover:text-red-400 text-sm"
                >
                  Visit Website →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {organizations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No organizations found</p>
          <p className="text-gray-500 text-sm mt-2">
            Try adjusting your search criteria
          </p>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:border-red-600 transition-colors"
          >
            Previous
          </button>
          
          <span className="px-4 py-2 text-gray-400">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:border-red-600 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
