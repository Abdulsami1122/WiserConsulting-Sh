"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  Linkedin, 
  Github, 
  Twitter, 
  Mail, 
  ArrowLeft,
  Code2,
  Database,
  Cloud,
  Smartphone,
  Globe2,
  Cpu,
  CheckCircle2
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

const TeamMemberPage = () => {
  const params = useParams();
  const memberId = params?.id as string;
  const [member, setMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (memberId) {
      fetchTeamMember();
    }
  }, [memberId]);

  const fetchTeamMember = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_URL}/team/${memberId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch team member: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      console.log('Team member response:', data);
      
      if (data.success && data.data) {
        setMember(data.data);
      } else {
        throw new Error('Team member not found');
      }
    } catch (error) {
      console.error('Error fetching team member:', error);
      setError(error instanceof Error ? error.message : 'Failed to load team member');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading team member...</p>
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Team Member Not Found</h1>
          <p className="text-slate-600 mb-6">{error || 'The team member you are looking for does not exist.'}</p>
          <Link href="/team" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Team
          </Link>
        </div>
      </div>
    );
  }

  const skillIcons: { [key: string]: React.ReactNode } = {
    "Frontend Development": <Code2 className="w-5 h-5" />,
    "Backend Development": <Database className="w-5 h-5" />,
    "Cloud Architecture": <Cloud className="w-5 h-5" />,
    "Mobile Development": <Smartphone className="w-5 h-5" />,
    "Full Stack": <Globe2 className="w-5 h-5" />,
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/team"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Team
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-center md:items-start gap-8"
          >
            {member.image && (member.image.startsWith('http') || member.image.startsWith('/')) ? (
              <div className="w-48 h-48 rounded-2xl overflow-hidden flex-shrink-0 border-4 border-white/20 shadow-xl">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-48 h-48 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-9xl flex-shrink-0">
                {member.image || '👨‍💼'}
              </div>
            )}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                {member.name}
              </h1>
              <p className="text-2xl text-slate-300 mb-6">
                {member.role}
              </p>
              <p className="text-lg text-slate-200 max-w-2xl mb-6 leading-relaxed">
                {member.fullBio || member.bio}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Linkedin className="w-6 h-6" />
                  </a>
                )}
                {member.github && (
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Github className="w-6 h-6" />
                  </a>
                )}
                {member.twitter && (
                  <a
                    href={member.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Twitter className="w-6 h-6" />
                  </a>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Mail className="w-6 h-6" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-12">
              {/* Expertise */}
              {member.expertise && member.expertise.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-6">Areas of Expertise</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {member.expertise.map((exp, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200"
                      >
                        {skillIcons[exp] || <Cpu className="w-5 h-5" />}
                        <span className="font-semibold text-slate-900">{exp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {member.skills && member.skills.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-6">Skills & Technologies</h2>
                  <div className="flex flex-wrap gap-3">
                    {member.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg border border-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements */}
              {member.achievements && member.achievements.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-6">Key Achievements</h2>
                  <div className="space-y-4">
                    {member.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-slate-600 leading-relaxed">{achievement}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Contact</h3>
                <div className="space-y-3">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-3 text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                      <span className="text-sm">{member.email}</span>
                    </a>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                      <span className="text-sm">LinkedIn Profile</span>
                    </a>
                  )}
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      <Github className="w-5 h-5" />
                      <span className="text-sm">GitHub Profile</span>
                    </a>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Role</h3>
                <p className="text-slate-600">{member.role}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeamMemberPage;
