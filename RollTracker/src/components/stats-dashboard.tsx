"use client";

import { motion } from "framer-motion";
import { Camera, Film, Zap, TrendingUp } from "lucide-react";

interface StatsDashboardProps {
  totalRolls: number;
  totalShots: number;
  averageShotsPerRoll: number;
  mostUsedFilmStock: string;
  className?: string;
}

export function StatsDashboard({ 
  totalRolls, 
  totalShots, 
  averageShotsPerRoll, 
  mostUsedFilmStock,
  className = "" 
}: StatsDashboardProps) {
  const stats = [
    {
      label: "Total Rolls",
      value: totalRolls,
      icon: Film,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      label: "Total Shots",
      value: totalShots,
      icon: Camera,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    {
      label: "Avg per Roll",
      value: averageShotsPerRoll,
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      label: "Top Film Stock",
      value: mostUsedFilmStock || "None",
      icon: Zap,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
    },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h3 className="text-2xl font-display font-bold mb-2">Photography Statistics</h3>
        <p className="text-muted-foreground">Your film photography journey in numbers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative p-6 rounded-xl border ${stat.bgColor} ${stat.borderColor} backdrop-blur-sm`}
          >
            {/* Vintage Gauge Background */}
            <div className="absolute inset-0 rounded-xl opacity-10">
              <div className="w-full h-full rounded-xl border-2 border-dashed border-current" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color} text-white`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold font-mono">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </div>

              {/* Progress Bar for Numeric Values */}
              {typeof stat.value === 'number' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0</span>
                    <span>100</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full bg-gradient-to-r ${stat.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((stat.value / 100) * 100, 100)}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    />
                  </div>
                </div>
              )}

              {/* Vintage Meter Needle for Numeric Values */}
              {typeof stat.value === 'number' && (
                <div className="relative mt-4">
                  <div className="w-full h-1 bg-gray-300 dark:bg-gray-600 rounded-full">
                    <motion.div
                      className="absolute top-0 w-1 h-1 bg-current rounded-full"
                      style={{ 
                        left: `${Math.min((stat.value / 100) * 100, 100)}%`,
                        transform: 'translateX(-50%)'
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Additional Vintage Elements */}
      <div className="mt-8 p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50">
        <div className="text-center">
          <h4 className="text-lg font-display font-semibold mb-4">Film Photography Journey</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Active Photographer</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span>Film Enthusiast</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              <span>Creative Explorer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
