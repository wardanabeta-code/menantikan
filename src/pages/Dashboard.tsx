// Dashboard page with invitation management
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Heart, Plus, BarChart3, Edit, Eye, Share2, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { getUserInvitations, deleteInvitation } from '../lib/firestore';
import type { Invitation } from '../types';

const Dashboard: React.FC = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch user invitations
  useEffect(() => {
    const fetchInvitations = async () => {
      if (!user) return;
      
      try {
        setDashboardLoading(true);
        const response = await getUserInvitations(user.uid);
        setInvitations(response.data);
      } catch (error) {
        console.error('Error fetching invitations:', error);
      } finally {
        setDashboardLoading(false);
      }
    };

    if (user && !loading) {
      fetchInvitations();
    }
  }, [user, loading]);

  const handleDelete = async (invitationId: string) => {
    if (!window.confirm('Are you sure you want to delete this invitation? This action cannot be undone.')) {
      return;
    }

    setDeletingId(invitationId);
    try {
      await deleteInvitation(invitationId);
      setInvitations(prev => prev.filter(inv => inv.invitationId !== invitationId));
    } catch (error) {
      console.error('Error deleting invitation:', error);
      alert('Failed to delete invitation. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-pink-500" />
              <h1 className="text-2xl font-bold text-gray-900">Menantikan</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.displayName}</span>
              <Button onClick={signOut} variant="outline" size="sm">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Manage your invitations and track responses</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Plus className="h-8 w-8 text-pink-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Create Invitation</h3>
                <p className="text-sm text-gray-600">Start with a beautiful template</p>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/templates">
                <Button className="w-full">
                  Browse Templates
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Analytics</h3>
                <p className="text-sm text-gray-600">Track invitation performance</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-gray-900">
                {invitations.reduce((sum, inv) => sum + (inv.analytics?.views || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total views</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Heart className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">RSVPs</h3>
                <p className="text-sm text-gray-600">Guest responses</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-gray-900">
                {invitations.reduce((sum, inv) => sum + (inv.analytics?.rsvpCount || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total responses</div>
            </div>
          </div>
        </div>

        {/* Invitations List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Your Invitations</h3>
            <span className="text-sm text-gray-500">{invitations.length} invitations</span>
          </div>
          
          {dashboardLoading ? (
            <div className="p-12 flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : invitations.length === 0 ? (
            <div className="p-6">
              <div className="text-center py-12">
                <Heart className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No invitations yet</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Create your first invitation to get started
                </p>
                <div className="mt-6">
                  <Link to="/templates">
                    <Button>
                      Create Your First Invitation
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      RSVPs
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invitations.map((invitation) => (
                    <tr key={invitation.invitationId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{invitation.title}</div>
                        <div className="text-sm text-gray-500">
                          {invitation.templateId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          invitation.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : invitation.status === 'draft' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {invitation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invitation.eventDate ? new Date(invitation.eventDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invitation.analytics?.views || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invitation.analytics?.rsvpCount || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/editor/${invitation.invitationId}`)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`/invitation-view/${invitation.templateId}?id=${invitation.invitationId}`, '_blank')}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigator.clipboard.writeText(`${window.location.origin}/invitation/${invitation.slug}`)}
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(invitation.invitationId)}
                            disabled={deletingId === invitation.invitationId}
                          >
                            {deletingId === invitation.invitationId ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                            ) : (
                              <Trash2 className="w-4 h-4 text-red-600" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;