// Invitation list with management actions
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Eye, 
  Edit, 
  Share2, 
  MoreHorizontal, 
  Calendar, 
  Users, 
  MessageSquare,
  Copy,
  Trash2,
  Archive,
  Settings,
  ExternalLink
} from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { getUserInvitations, deleteInvitation, updateInvitation } from '../lib/firestore';
import type { Invitation, InvitationStatus } from '../types';

interface InvitationCardProps {
  invitation: Invitation;
  onEdit: (invitation: Invitation) => void;
  onDelete: (invitationId: string) => void;
  onStatusChange: (invitationId: string, status: InvitationStatus) => void;
}

const InvitationCard: React.FC<InvitationCardProps> = ({
  invitation,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  const [showActions, setShowActions] = useState(false);

  const getStatusColor = (status: InvitationStatus) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'archived':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/invitation/${invitation.slug}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: invitation.title,
          text: 'You\'re invited!',
          url: shareUrl
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Invitation link copied to clipboard!');
      } catch (error) {
        prompt('Copy this link:', shareUrl);
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      {/* Header with preview image placeholder */}
      <div className="h-32 bg-gradient-to-br from-pink-100 to-purple-100 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Calendar className="w-8 h-8 mx-auto mb-1 text-pink-500" />
            <p className="text-xs text-gray-600">Preview</p>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invitation.status)}`}>
            {invitation.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {invitation.title}
            </h3>
            <p className="text-sm text-gray-500">
              Event Date: {formatDate(invitation.eventDate)}
            </p>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            
            {showActions && (
              <div className="absolute right-0 top-8 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={() => onEdit(invitation)}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <Link
                  to={`/preview/${invitation.invitationId}`}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Link>
                {invitation.status === 'published' && (
                  <a
                    href={`/invitation/${invitation.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Live
                  </a>
                )}
                <button
                  onClick={handleShare}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </button>
                <hr className="my-1" />
                {invitation.status === 'draft' && (
                  <button
                    onClick={() => onStatusChange(invitation.invitationId, 'published')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Publish
                  </button>
                )}
                {invitation.status === 'published' && (
                  <button
                    onClick={() => onStatusChange(invitation.invitationId, 'archived')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Archive className="w-4 h-4 mr-2" />
                    Archive
                  </button>
                )}
                <button
                  onClick={() => onDelete(invitation.invitationId)}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center text-gray-400 mb-1">
              <Eye className="w-4 h-4" />
            </div>
            <p className="text-sm font-semibold text-gray-900">
              {invitation.analytics?.views || 0}
            </p>
            <p className="text-xs text-gray-500">Views</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center text-gray-400 mb-1">
              <Users className="w-4 h-4" />
            </div>
            <p className="text-sm font-semibold text-gray-900">
              {invitation.analytics?.rsvpCount || 0}
            </p>
            <p className="text-xs text-gray-500">RSVPs</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center text-gray-400 mb-1">
              <MessageSquare className="w-4 h-4" />
            </div>
            <p className="text-sm font-semibold text-gray-900">
              {invitation.analytics?.guestbookEntries || 0}
            </p>
            <p className="text-xs text-gray-500">Messages</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={() => onEdit(invitation)}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          
          {invitation.status === 'published' ? (
            <Button
              onClick={handleShare}
              size="sm"
              className="flex-1"
            >
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
          ) : (
            <Button
              onClick={() => onStatusChange(invitation.invitationId, 'published')}
              size="sm"
              className="flex-1"
            >
              <Settings className="w-4 h-4 mr-1" />
              Publish
            </Button>
          )}
        </div>

        {/* Last updated */}
        <p className="text-xs text-gray-400 mt-3">
          Updated {new Date(invitation.updatedAt).toLocaleDateString()}
        </p>
      </div>
    </motion.div>
  );
};

const InvitationList: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<InvitationStatus | 'all'>('all');

  useEffect(() => {
    if (user) {
      loadInvitations();
    }
  }, [user]);

  const loadInvitations = async () => {
    try {
      if (!user) return;
      
      const userInvitations = await getUserInvitations(user.uid);
      setInvitations(userInvitations.data);
    } catch (error) {
      console.error('Error loading invitations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (invitation: Invitation) => {
    // Navigate to editor using React Router
    navigate(`/editor/${invitation.invitationId}`);
  };

  const handleDelete = async (invitationId: string) => {
    if (window.confirm('Are you sure you want to delete this invitation? This action cannot be undone.')) {
      try {
        await deleteInvitation(invitationId);
        setInvitations(invitations.filter(inv => inv.invitationId !== invitationId));
      } catch (error) {
        console.error('Error deleting invitation:', error);
        alert('Failed to delete invitation. Please try again.');
      }
    }
  };

  const handleStatusChange = async (invitationId: string, newStatus: InvitationStatus) => {
    try {
      await updateInvitation(invitationId, { status: newStatus });
      setInvitations(invitations.map(inv => 
        inv.invitationId === invitationId 
          ? { ...inv, status: newStatus }
          : inv
      ));
    } catch (error) {
      console.error('Error updating invitation status:', error);
      alert('Failed to update invitation status. Please try again.');
    }
  };

  const filteredInvitations = filter === 'all' 
    ? invitations 
    : invitations.filter(inv => inv.status === filter);

  const getEmptyStateMessage = () => {
    if (filter === 'all') {
      return {
        title: 'No invitations yet',
        description: 'Create your first invitation to get started'
      };
    }
    return {
      title: `No ${filter} invitations`,
      description: `You don't have any ${filter} invitations yet`
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  const emptyState = getEmptyStateMessage();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Invitations</h2>
          <p className="text-gray-600">Manage and track your digital invitations</p>
        </div>
        <Link to="/templates">
          <Button className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Create New
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2">
        {(['all', 'draft', 'published', 'archived'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              filter === status
                ? 'bg-pink-100 text-pink-800 border border-pink-200'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            <span className="ml-2 text-xs">
              ({status === 'all' ? invitations.length : invitations.filter(inv => inv.status === status).length})
            </span>
          </button>
        ))}
      </div>

      {/* Invitations Grid */}
      {filteredInvitations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvitations.map((invitation) => (
            <InvitationCard
              key={invitation.invitationId}
              invitation={invitation}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {emptyState.title}
          </h3>
          <p className="text-gray-600 mb-6">
            {emptyState.description}
          </p>
          {filter === 'all' && (
            <Link to="/templates">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Invitation
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default InvitationList;