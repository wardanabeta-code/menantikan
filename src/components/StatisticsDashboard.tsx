// Statistics dashboard with real-time analytics
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  Eye, 
  MessageSquare, 
  TrendingUp, 
  Calendar,
  Heart,
  Share2,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserInvitations } from '../lib/firestore';
import type { Invitation, DashboardStats } from '../types';

interface StatCard {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

interface AnalyticsData {
  totalInvitations: number;
  totalViews: number;
  totalRSVPs: number;
  totalGuestbookEntries: number;
  conversionRate: number;
  popularTemplates: Array<{ name: string; count: number }>;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: Date;
    invitationTitle: string;
  }>;
  viewsOverTime: Array<{ date: string; views: number }>;
  rsvpStats: {
    attending: number;
    notAttending: number;
    maybe: number;
  };
}

const StatisticsDashboard: React.FC = () => {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalInvitations: 0,
    totalViews: 0,
    totalRSVPs: 0,
    totalGuestbookEntries: 0,
    conversionRate: 0,
    popularTemplates: [],
    recentActivity: [],
    viewsOverTime: [],
    rsvpStats: { attending: 0, notAttending: 0, maybe: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      if (!user) return;
      
      const userInvitations = await getUserInvitations(user.uid);
      setInvitations(userInvitations.data);
      
      // Calculate analytics from invitations
      const calculatedAnalytics = calculateAnalytics(userInvitations.data);
      setAnalytics(calculatedAnalytics);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (invitations: Invitation[]): AnalyticsData => {
    const totalInvitations = invitations.length;
    const totalViews = invitations.reduce((sum, inv) => sum + (inv.analytics?.views || 0), 0);
    const totalRSVPs = invitations.reduce((sum, inv) => sum + (inv.analytics?.rsvpCount || 0), 0);
    const totalGuestbookEntries = invitations.reduce((sum, inv) => sum + (inv.analytics?.guestbookEntries || 0), 0);
    
    const conversionRate = totalViews > 0 ? (totalRSVPs / totalViews) * 100 : 0;

    // Mock data for demonstration
    const mockRecentActivity = [
      {
        id: '1',
        type: 'rsvp',
        description: 'New RSVP received from John Doe',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        invitationTitle: 'Sarah & Michael Wedding'
      },
      {
        id: '2',
        type: 'view',
        description: 'Invitation viewed 5 times today',
        timestamp: new Date(Date.now() - 7200000), // 2 hours ago
        invitationTitle: 'Birthday Celebration'
      },
      {
        id: '3',
        type: 'guestbook',
        description: 'New guestbook message from Emily',
        timestamp: new Date(Date.now() - 10800000), // 3 hours ago
        invitationTitle: 'Sarah & Michael Wedding'
      }
    ];

    const mockViewsOverTime = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString(),
      views: Math.floor(Math.random() * 100) + 20
    }));

    return {
      totalInvitations,
      totalViews,
      totalRSVPs,
      totalGuestbookEntries,
      conversionRate,
      popularTemplates: [
        { name: 'Modern Elegance', count: 45 },
        { name: 'Romantic Garden', count: 32 },
        { name: 'Birthday Celebration', count: 18 }
      ],
      recentActivity: mockRecentActivity,
      viewsOverTime: mockViewsOverTime,
      rsvpStats: {
        attending: Math.floor(totalRSVPs * 0.7),
        notAttending: Math.floor(totalRSVPs * 0.2),
        maybe: Math.floor(totalRSVPs * 0.1)
      }
    };
  };

  const statCards: StatCard[] = [
    {
      title: 'Total Invitations',
      value: analytics.totalInvitations,
      change: 12,
      changeType: 'increase',
      icon: <Heart className="w-6 h-6" />,
      color: 'bg-pink-500'
    },
    {
      title: 'Total Views',
      value: analytics.totalViews.toLocaleString(),
      change: 8.5,
      changeType: 'increase',
      icon: <Eye className="w-6 h-6" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Total RSVPs',
      value: analytics.totalRSVPs,
      change: 15.3,
      changeType: 'increase',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-green-500'
    },
    {
      title: 'Guestbook Messages',
      value: analytics.totalGuestbookEntries,
      change: -2.1,
      changeType: 'decrease',
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'bg-purple-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Overview of your invitation performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>All time</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`${card.color} text-white p-3 rounded-lg`}>
                {card.icon}
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {card.changeType === 'increase' ? (
                <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
              ) : card.changeType === 'decrease' ? (
                <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
              ) : null}
              <span 
                className={`text-sm font-medium ${
                  card.changeType === 'increase' 
                    ? 'text-green-600' 
                    : card.changeType === 'decrease' 
                    ? 'text-red-600' 
                    : 'text-gray-600'
                }`}
              >
                {card.change > 0 ? '+' : ''}{card.change}%
              </span>
              <span className="text-sm text-gray-500 ml-1">from last period</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Over Time Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Views Over Time</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analytics.viewsOverTime.map((data, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="bg-pink-500 rounded-t w-full transition-all duration-500 hover:bg-pink-600"
                  style={{ 
                    height: `${(data.views / Math.max(...analytics.viewsOverTime.map(d => d.views))) * 200}px`,
                    minHeight: '10px'
                  }}
                  title={`${data.views} views`}
                />
                <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left">
                  {data.date}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* RSVP Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">RSVP Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-3" />
                <span className="text-sm text-gray-600">Attending</span>
              </div>
              <span className="font-semibold">{analytics.rsvpStats.attending}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded mr-3" />
                <span className="text-sm text-gray-600">Not Attending</span>
              </div>
              <span className="font-semibold">{analytics.rsvpStats.notAttending}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded mr-3" />
                <span className="text-sm text-gray-600">Maybe</span>
              </div>
              <span className="font-semibold">{analytics.rsvpStats.maybe}</span>
            </div>
          </div>
          
          {/* Conversion Rate */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Conversion Rate</span>
              <span className="font-semibold text-lg text-pink-600">
                {analytics.conversionRate.toFixed(1)}%
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Popular Templates and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Templates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Templates</h3>
          <div className="space-y-3">
            {analytics.popularTemplates.map((template, index) => (
              <div key={template.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded mr-3 flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-600">{index + 1}</span>
                  </div>
                  <span className="text-sm text-gray-900">{template.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-600">{template.count} uses</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {analytics.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                  {activity.type === 'rsvp' && <Users className="w-4 h-4 text-pink-600" />}
                  {activity.type === 'view' && <Eye className="w-4 h-4 text-pink-600" />}
                  {activity.type === 'guestbook' && <MessageSquare className="w-4 h-4 text-pink-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500">
                    {activity.invitationTitle} • {new Date(activity.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StatisticsDashboard;