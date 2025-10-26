"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, Film, Zap, Download, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        {/* Film Strip Border Animation */}
        <motion.div
          className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-black to-transparent opacity-20"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-black to-transparent opacity-20"
          animate={{ x: ["100%", "-100%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Floating Camera Icons */}
        <motion.div
          className="absolute top-20 left-10 text-4xl opacity-10"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Camera />
        </motion.div>
        
        <motion.div
          className="absolute top-40 right-20 text-3xl opacity-10"
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -3, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Film />
        </motion.div>
        
        <motion.div
          className="absolute bottom-40 left-20 text-2xl opacity-10"
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 2, 0]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <Zap />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Film Roll Header */}
          <motion.div
            className="mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Film className="w-5 h-5 text-primary" />
              <span className="text-sm font-mono text-primary">Film Photography</span>
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            className="text-6xl md:text-8xl font-display font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Film Shot Logger
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Capture every moment, log every shot. The ultimate companion for film photographers who want to track their rolls, settings, and memories with precision and style.
          </motion.p>

          {/* Feature Highlights */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="group">
              <motion.div
                className="p-6 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 hover:border-primary/50 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Camera className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Roll Management</h3>
                <p className="text-sm text-muted-foreground">Track your film rolls with detailed metadata and settings</p>
              </motion.div>
            </div>
            
            <div className="group">
              <motion.div
                className="p-6 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 hover:border-primary/50 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Film className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Shot Logging</h3>
                <p className="text-sm text-muted-foreground">Log every shot with aperture, speed, and notes</p>
              </motion.div>
            </div>
            
            <div className="group">
              <motion.div
                className="p-6 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 hover:border-primary/50 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Download className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Export & Share</h3>
                <p className="text-sm text-muted-foreground">Save to Markdown or sync with GitHub</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Call to Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <Button size="lg" className="text-lg px-8 py-6">
              <Film className="w-5 h-5 mr-2" />
              Start Logging Shots
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              <Github className="w-5 h-5 mr-2" />
              View on GitHub
            </Button>
          </motion.div>

          {/* Statistics Counter */}
          <motion.div
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div className="text-center">
              <motion.div
                className="text-4xl font-bold text-primary mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 1.4 }}
              >
                1,247
              </motion.div>
              <p className="text-sm text-muted-foreground">Rolls Logged</p>
            </div>
            <div className="text-center">
              <motion.div
                className="text-4xl font-bold text-primary mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 1.6 }}
              >
                45,892
              </motion.div>
              <p className="text-sm text-muted-foreground">Shots Tracked</p>
            </div>
            <div className="text-center">
              <motion.div
                className="text-4xl font-bold text-primary mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 1.8 }}
              >
                98%
              </motion.div>
              <p className="text-sm text-muted-foreground">Accuracy Rate</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
