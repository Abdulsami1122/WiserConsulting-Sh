"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Target, 
  Award, 
  Rocket, 
  Heart,
  Lightbulb,
  Zap,
  Globe2,
  CheckCircle2,
  Briefcase,
  Smile,
  Calendar,
  UserCheck
} from "lucide-react";

const About = () => {
  const values = [
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Innovation First",
      description: "We stay ahead of technology trends to deliver cutting-edge solutions."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Client-Centric",
      description: "Your success is our priority. We build solutions tailored to your needs."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Agile Excellence",
      description: "Fast delivery without compromising quality or attention to detail."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Transparency",
      description: "Clear communication and honest collaboration throughout every project."
    }
  ];

  const stats = [
    { 
      number: "100+", 
      label: "Projects Completed",
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
      number: "5+", 
      label: "Years Experience",
      icon: <Calendar className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500"
    },
    { 
      number: "10+", 
      label: "Expert Team Members",
      icon: <UserCheck className="w-6 h-6" />,
      color: "from-orange-500 to-red-500"
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
              About WISER CONSULTING
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Transforming businesses through innovative software solutions. 
              We are a trusted software house delivering excellence since 2020.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-slate-600 mb-4 leading-relaxed">
                WISER CONSULTING was founded in 2020 with a simple mission: to help businesses 
                leverage technology to achieve their goals. What started as a small team of 
                passionate developers has grown into a full-service software house.
              </p>
              <p className="text-lg text-slate-600 mb-4 leading-relaxed">
                Over the years, we've helped hundreds of companies transform their operations, 
                streamline processes, and scale their businesses through custom software solutions. 
                Our commitment to quality, innovation, and client success has made us a trusted 
                partner for businesses of all sizes.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Today, we continue to push boundaries, embracing new technologies and methodologies 
                to deliver solutions that not only meet but exceed our clients' expectations.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-8 h-full flex items-center justify-center">
                <Globe2 className="w-32 h-32 text-slate-400" />
              </div>
            </motion.div>
          </div>
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

      {/* Our Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-slate-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="text-slate-900 mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-slate-600">{value.description}</p>
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
            <Rocket className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">
              Ready to Work With Us?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Let's discuss how we can help transform your business with innovative software solutions.
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-4 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
            >
              Get In Touch
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
