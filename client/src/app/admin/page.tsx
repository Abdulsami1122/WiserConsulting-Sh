'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  Users, 
  Wrench, 
  FileText, 
  Mail, 
  User,
  TrendingUp,
  Activity,
  Home,
  ExternalLink
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    portfolio: 0,
    team: 0,
    services: 0,
    contacts: 0,
  });

  useEffect(() => {
    // Fetch stats from API
    const fetchStats = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const token = localStorage.getItem('token');
        const headers = { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        };
        
        const [portfolioRes, teamRes, servicesRes, contactsRes] = await Promise.all([
          fetch(`${API_URL}/portfolios`, { headers, credentials: 'include' }),
          fetch(`${API_URL}/team`, { headers, credentials: 'include' }),
          fetch(`${API_URL}/services`, { headers, credentials: 'include' }),
          fetch(`${API_URL}/admin/contacts`, { headers, credentials: 'include' }),
        ]);

        const portfolio = await portfolioRes.json();
        const team = await teamRes.json();
        const services = await servicesRes.json();
        const contacts = await contactsRes.json();

        setStats({
          portfolio: portfolio.data?.length || 0,
          team: team.data?.length || 0,
          services: services.data?.length || 0,
          contacts: contacts.data?.length || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const quickLinks = [
    { name: 'Portfolio', href: '/admin/portfolio', icon: Briefcase, color: 'bg-blue-500' },
    { name: 'Team', href: '/admin/team', icon: Users, color: 'bg-green-500' },
    { name: 'Services', href: '/admin/services', icon: Wrench, color: 'bg-purple-500' },
    { name: 'Content', href: '/admin/content', icon: FileText, color: 'bg-orange-500' },
    { name: 'Contact Submissions', href: '/admin/contacts', icon: Mail, color: 'bg-red-500' },
    { name: 'Users', href: '/admin/users', icon: User, color: 'bg-indigo-500' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Manage your website content and submissions</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 truncate">Portfolio Items</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">{stats.portfolio}</p>
            </div>
            <Briefcase className="w-8 h-8 sm:w-12 sm:h-12 text-blue-500 flex-shrink-0 ml-2" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 truncate">Team Members</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">{stats.team}</p>
            </div>
            <Users className="w-8 h-8 sm:w-12 sm:h-12 text-green-500 flex-shrink-0 ml-2" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 truncate">Services</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">{stats.services}</p>
            </div>
            <Wrench className="w-8 h-8 sm:w-12 sm:h-12 text-purple-500 flex-shrink-0 ml-2" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 truncate">Contact Submissions</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">{stats.contacts}</p>
            </div>
            <Mail className="w-8 h-8 sm:w-12 sm:h-12 text-red-500 flex-shrink-0 ml-2" />
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-lg transition-shadow flex items-center gap-3 sm:gap-4"
              >
                <div className={`${link.color} p-2 sm:p-3 rounded-lg flex-shrink-0`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="font-semibold text-sm sm:text-base text-gray-900 truncate">{link.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
