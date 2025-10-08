// Guest management interface with RSVP tracking
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Mail, 
  Phone, 
  CheckCircle, 
  XCircle, 
  Clock,
  MoreHorizontal,
  UserPlus,
  Send
} from 'lucide-react';
import { Button } from './ui/button';
import { getInvitationRSVPs } from '../lib/firestore';
import type { RSVP, AttendanceStatus } from '../types';

interface GuestManagementProps {
  invitationId: string;
}

interface GuestStats {
  total: number;
  attending: number;
  notAttending: number;
  maybe: number;
  pending: number;
}

const GuestManagement: React.FC<GuestManagementProps> = ({ invitationId }) => {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [filteredRSVPs, setFilteredRSVPs] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | 'all'>('all');
  const [selectedRSVPs, setSelectedRSVPs] = useState<Set<string>>(new Set());
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    loadRSVPs();
  }, [invitationId]);

  useEffect(() => {
    filterRSVPs();
  }, [rsvps, searchQuery, statusFilter]);

  const loadRSVPs = async () => {
    try {
      const rsvpData = await getInvitationRSVPs(invitationId);
      setRsvps(rsvpData);
    } catch (error) {
      console.error('Error loading RSVPs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRSVPs = () => {
    let filtered = rsvps;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(rsvp => 
        rsvp.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (rsvp.guestEmail && rsvp.guestEmail.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(rsvp => rsvp.attendanceStatus === statusFilter);
    }

    setFilteredRSVPs(filtered);
  };

  const calculateStats = (): GuestStats => {
    const stats = rsvps.reduce((acc, rsvp) => {
      acc.total++;
      switch (rsvp.attendanceStatus) {
        case 'attending':
          acc.attending++;
          break;
        case 'not-attending':
          acc.notAttending++;
          break;
        case 'maybe':
          acc.maybe++;
          break;
      }
      return acc;
    }, {
      total: 0,
      attending: 0,
      notAttending: 0,
      maybe: 0,
      pending: 0
    });

    return stats;
  };

  const handleSelectRSVP = (rsvpId: string) => {
    const newSelected = new Set(selectedRSVPs);
    if (newSelected.has(rsvpId)) {
      newSelected.delete(rsvpId);
    } else {
      newSelected.add(rsvpId);
    }
    setSelectedRSVPs(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRSVPs.size === filteredRSVPs.length) {
      setSelectedRSVPs(new Set());
    } else {
      setSelectedRSVPs(new Set(filteredRSVPs.map(rsvp => rsvp.rsvpId)));
    }
  };

  const exportGuestList = () => {
    const csvData = rsvps.map(rsvp => ({
      Name: rsvp.guestName,
      Email: rsvp.guestEmail || '',
      Phone: rsvp.guestPhone || '',
      Status: rsvp.attendanceStatus,
      'Plus Ones': rsvp.plusOnes,
      'Dietary Restrictions': rsvp.dietaryRestrictions || '',
      'Submitted At': new Date(rsvp.submittedAt).toLocaleDateString()
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guest-list-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case 'attending':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'not-attending':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'maybe':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case 'attending':
        return 'bg-green-100 text-green-800';
      case 'not-attending':
        return 'bg-red-100 text-red-800';
      case 'maybe':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Guest Management</h2>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Guests
            </Button>
            <Button
              onClick={exportGuestList}
              variant="outline"
              className="flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Guests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Attending</p>
                <p className="text-2xl font-bold text-green-800">{stats.attending}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">Not Attending</p>
                <p className="text-2xl font-bold text-red-800">{stats.notAttending}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600">Maybe</p>
                <p className="text-2xl font-bold text-yellow-800">{stats.maybe}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search guests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AttendanceStatus | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="attending">Attending</option>
              <option value="not-attending">Not Attending</option>
              <option value="maybe">Maybe</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedRSVPs.size > 0 && (
          <div className="mt-4 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
            <span className="text-sm text-blue-800">
              {selectedRSVPs.size} guest{selectedRSVPs.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
              <Button size="sm" variant="outline">
                Export Selected
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Guest List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Guest List ({filteredRSVPs.length})
            </h3>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedRSVPs.size === filteredRSVPs.length && filteredRSVPs.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
              />
              <span className="text-sm text-gray-600">Select All</span>
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guest
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plus Ones
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRSVPs.map((rsvp, index) => (
                <motion.tr
                  key={rsvp.rsvpId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedRSVPs.has(rsvp.rsvpId)}
                        onChange={() => handleSelectRSVP(rsvp.rsvpId)}
                        className="mr-3 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {rsvp.guestName}
                        </div>
                        {rsvp.message && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            "{rsvp.message}"
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {rsvp.guestEmail && (
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-1 text-gray-400" />
                          {rsvp.guestEmail}
                        </div>
                      )}
                      {rsvp.guestPhone && (
                        <div className="flex items-center mt-1">
                          <Phone className="w-4 h-4 mr-1 text-gray-400" />
                          {rsvp.guestPhone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(rsvp.attendanceStatus)}
                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(rsvp.attendanceStatus)}`}>
                        {rsvp.attendanceStatus.replace('-', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {rsvp.plusOnes > 0 ? `+${rsvp.plusOnes}` : '0'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(rsvp.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRSVPs.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No guests found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start by inviting guests to your event'
              }
            </p>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-lg font-semibold mb-4">Invite Guests</h3>
            <p className="text-gray-600 mb-4">
              Share your invitation link with guests or send personalized invitations.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowInviteModal(false)}
              >
                Cancel
              </Button>
              <Button>
                <Send className="w-4 h-4 mr-2" />
                Send Invites
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default GuestManagement;