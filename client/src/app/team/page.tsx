"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Linkedin, 
  Github, 
  Twitter, 
  Mail, 
  ArrowRight,
  Code2,
  Database,
  Cloud,
  Smartphone,
  Globe2,
  Cpu
} from "lucide-react";

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  bio: string;
  fullBio?: string;
  image: string;
  skills: string[];
  email?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  expertise: string[];
  achievements?: string[];
  order: number;
  isActive: boolean;
}

const Team = () => {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("all");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const url = `${API_URL}/team?isActive=true`;
      
      // Add timeout to fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        let errorText = '';
        try {
          errorText = await res.text();
          console.error('API Error Response:', errorText);
        } catch (e) {
          console.error('Could not read error response');
        }
        throw new Error(`Failed to fetch team members: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      console.log('Team members response:', data);
      
      // Helper function to sort team members: Full Stack and MERN Stack first
      const sortTeamMembers = (members: TeamMember[]): TeamMember[] => {
        return members.sort((a, b) => {
          const roleA = a.role?.toLowerCase() || '';
          const roleB = b.role?.toLowerCase() || '';
          
          // Priority order: Full Stack > MERN Stack > Others
          const getPriority = (role: string) => {
            if (role.includes('full stack')) return 1;
            if (role.includes('mern stack')) return 2;
            return 3;
          };
          
          const priorityA = getPriority(roleA);
          const priorityB = getPriority(roleB);
          
          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }
          
          // If same priority, sort by order field, then by name
          if (a.order !== b.order) {
            return a.order - b.order;
          }
          return a.name.localeCompare(b.name);
        });
      };
      
      if (data.success) {
        let members: TeamMember[] = [];
        if (Array.isArray(data.data)) {
          members = data.data;
        } else if (Array.isArray(data)) {
          // Handle case where data is directly an array
          members = data;
        } else {
          console.warn('Unexpected API response format:', data);
          setTeamMembers([]);
          return;
        }
        // Sort members before setting
        setTeamMembers(sortTeamMembers(members));
      } else {
        console.warn('API returned success: false', data);
        setTeamMembers([]);
      }
    } catch (error: any) {
      console.error('Error fetching team members:', error);
      
      // Handle different types of errors
      let errorMessage = 'Failed to load team members. ';
      if (error.name === 'AbortError') {
        errorMessage += 'Request timed out. Please check your connection and try again.';
      } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMessage += 'Unable to connect to the server. Please ensure the backend is running on port 5000.';
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Please try again later.';
      }
      
      setError(errorMessage);
      // Keep empty array on error - page will show empty state
      setTeamMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const skills = [
    { name: "Frontend Development", icon: <Code2 className="w-5 h-5" /> },
    { name: "Backend Development", icon: <Database className="w-5 h-5" /> },
    { name: "Cloud Architecture", icon: <Cloud className="w-5 h-5" /> },
    { name: "Mobile Development", icon: <Smartphone className="w-5 h-5" /> },
    { name: "Full Stack", icon: <Globe2 className="w-5 h-5" /> },
  ];

  // Retry fetch on error
  const retryFetch = () => {
    setLoading(true);
    fetchTeamMembers();
  };

  const filteredMembers = (() => {
    if (activeFilter === "all") return teamMembers;

    const filterName = activeFilter.toLowerCase();

    return teamMembers.filter((member) => {
      const expertise = (member.expertise || []).map((e) => String(e).toLowerCase());
      const skills = (member.skills || []).map((s) => String(s).toLowerCase());
      const role = String(member.role || '').toLowerCase();

      // Direct match by expertise
      if (expertise.includes(filterName)) return true;

      // Check for partial matches in expertise (word-based matching)
      if (expertise.some((e) => e.includes(filterName) || filterName.includes(e))) return true;

      // Check for matches in skills
      if (skills.includes(filterName)) return true;
      if (skills.some((s) => s.includes(filterName) || filterName.includes(s))) return true;

      // Treat MERN stack members as both frontend and backend
      if (filterName === 'frontend development' || filterName === 'backend development') {
        if (expertise.includes('mern stack') || expertise.includes('mern') || role.includes('mern')) return true;
      }

      // Allow role-based matches (e.g., role contains filter or vice versa)
      if (role.includes(filterName) || filterName.includes(role)) return true;

      return false;
    });
  })();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading team members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative text-white pt-32 pb-20 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{
            backgroundImage: 'url(/back.png)',
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-800/85 to-slate-900/90"></div>
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Our Team
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Meet the talented individuals who bring innovation and expertise to every project
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                activeFilter === "all"
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              All Team
            </button>
            {skills.map((skill) => (
              <button
                key={skill.name}
                onClick={() => setActiveFilter(skill.name)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  activeFilter === skill.name
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {skill.icon}
                {skill.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[300px] flex items-center justify-center">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
              <p className="text-slate-600 text-lg">Loading team members...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-800 text-lg mb-4">{error}</p>
                <button
                  onClick={() => {
                    setError(null);
                    fetchTeamMembers();
                  }}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-600 text-lg mb-4">No team members found.</p>
              <button
                onClick={retryFetch}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMembers.map((member, index) => (
              <motion.div
                key={member._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl transition-all group"
              >
                <div className="p-6">
                  <div 
                    onClick={() => router.push(`/team/${member._id}`)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      {member.image && (member.image.startsWith('http') || member.image.startsWith('/')) ? (
                        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 border-slate-200">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center text-5xl flex-shrink-0">
                          {member.image || '👨‍💼'}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-slate-700 transition-colors">
                          {member.name}
                        </h3>
                        <p className="text-slate-600 text-sm font-medium">
                          {member.role}
                        </p>
                      </div>
                    </div>
                    <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                      {member.bio}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {member.skills && member.skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {member.skills && member.skills.length > 3 && (
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                          +{member.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                      {member.github && (
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-slate-900 transition-colors"
                        >
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                      {member.twitter && (
                        <a
                          href={member.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-blue-400 transition-colors"
                        >
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="text-slate-400 hover:text-slate-900 transition-colors"
                        >
                          <Mail className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                    <div 
                      onClick={() => router.push(`/team/${member._id}`)}
                      className="flex items-center gap-2 text-slate-600 group-hover:text-slate-900 transition-colors text-sm font-semibold cursor-pointer"
                    >
                      View Profile
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4">
              Join Our Team
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              We're always looking for talented individuals to join our growing team
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-4 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
            >
              Get In Touch
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Team;
