"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Globe2, 
  Smartphone, 
  ShoppingCart, 
  Building2,
  GraduationCap,
  Heart,
  Briefcase,
  Code2,
  ExternalLink,
  Github,
  Smile,
  Calendar,
  UserCheck
} from "lucide-react";

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const categories = [
    { id: "all", label: "All Projects" },
    { id: "web", label: "Web Applications" },
    { id: "mobile", label: "Mobile Apps" },
    { id: "enterprise", label: "Enterprise Solutions" }
  ];

  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      category: "web",
      description: "A full-featured e-commerce platform with payment integration, inventory management, and analytics dashboard.",
      image: "🛒",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      link: "#"
    },
    {
      id: 2,
      title: "Healthcare Management System",
      category: "enterprise",
      description: "Comprehensive healthcare management system for hospitals with patient records, scheduling, and billing.",
      image: "🏥",
      technologies: ["Angular", "Spring Boot", "PostgreSQL", "Docker"],
      link: "#"
    },
    {
      id: 3,
      title: "Fitness Tracking App",
      category: "mobile",
      description: "Cross-platform mobile app for fitness tracking with workout plans, progress monitoring, and social features.",
      image: "💪",
      technologies: ["React Native", "Firebase", "Redux", "Charts"],
      link: "#"
    },
    {
      id: 4,
      title: "Financial Analytics Dashboard",
      category: "web",
      description: "Real-time financial analytics dashboard with data visualization, reporting, and forecasting capabilities.",
      image: "📊",
      technologies: ["Vue.js", "Python", "Django", "Chart.js"],
      link: "#"
    },
    {
      id: 5,
      title: "Learning Management System",
      category: "enterprise",
      description: "Enterprise LMS platform for online education with course management, assessments, and progress tracking.",
      image: "🎓",
      technologies: ["Next.js", "Node.js", "MongoDB", "AWS"],
      link: "#"
    },
    {
      id: 6,
      title: "Food Delivery App",
      category: "mobile",
      description: "Mobile app for food delivery with real-time tracking, multiple payment options, and restaurant management.",
      image: "🍕",
      technologies: ["Flutter", "Node.js", "MongoDB", "Google Maps"],
      link: "#"
    },
    {
      id: 7,
      title: "Real Estate Platform",
      category: "web",
      description: "Property listing and management platform with virtual tours, mortgage calculator, and agent tools.",
      image: "🏠",
      technologies: ["React", "Express.js", "PostgreSQL", "AWS S3"],
      link: "#"
    },
    {
      id: 8,
      title: "Supply Chain Management",
      category: "enterprise",
      description: "End-to-end supply chain management system with inventory tracking, logistics, and supplier management.",
      image: "📦",
      technologies: ["Angular", "Java", "MySQL", "Kubernetes"],
      link: "#"
    },
    {
      id: 9,
      title: "Social Media Analytics",
      category: "web",
      description: "Social media analytics platform with sentiment analysis, engagement metrics, and content scheduling.",
      image: "📱",
      technologies: ["React", "Python", "Django", "TensorFlow"],
      link: "#"
    }
  ];

  const filteredProjects = activeFilter === "all" 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  const stats = [
    { 
      number: "100+", 
      label: "Projects Delivered",
      icon: <Briefcase className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500"
    },
    { 
      number: "200+", 
      label: "Happy Clients",
      icon: <Smile className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500"
    },
    { 
      number: "10+", 
      label: "Team Members",
      icon: <UserCheck className="w-6 h-6" />,
      color: "from-orange-500 to-red-500"
    },
    { 
      number: "5+", 
      label: "Years Experience",
      icon: <Calendar className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500"
    }
  ];

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
              Our Portfolio
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Showcasing our best work across web applications, mobile apps, and enterprise solutions
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-slate-100 group"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2 group-hover:text-slate-700 transition-colors">
                  {stat.number}
                </div>
                <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  activeFilter === category.id
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl transition-all group"
              >
                <div className="bg-gradient-to-br from-slate-100 to-slate-200 h-48 flex items-center justify-center text-6xl">
                  {project.image}
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-slate-900">
                      {project.title}
                    </h3>
                    <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                  </div>
                  <p className="text-slate-600 mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <a
                    href={project.link}
                    className="text-slate-900 font-semibold hover:underline inline-flex items-center gap-2"
                  >
                    View Project
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Client Testimonials
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              What our clients say about working with us
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "CEO, TechStart Inc.",
                content: "WISER CONSULTING transformed our business operations with their custom software solution. The team was professional, responsive, and delivered beyond our expectations.",
                rating: 5
              },
              {
                name: "Michael Chen",
                role: "CTO, HealthCare Plus",
                content: "Outstanding work on our healthcare management system. The platform is robust, scalable, and has significantly improved our efficiency.",
                rating: 5
              },
              {
                name: "Emily Rodriguez",
                role: "Founder, FitLife App",
                content: "The mobile app they developed exceeded all our expectations. User feedback has been overwhelmingly positive, and the app has been a huge success.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-slate-600 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-slate-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-slate-600">
                    {testimonial.role}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
            <Code2 className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Let's create something amazing together. Get in touch to discuss your project.
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-4 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
            >
              Start Your Project
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
