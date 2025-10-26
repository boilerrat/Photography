"use client";

import { motion } from "framer-motion";
import { Film } from "lucide-react";

interface FilmRollProgressProps {
  currentShots: number;
  totalExposures: number;
  className?: string;
}

export function FilmRollProgress({ currentShots, totalExposures, className = "" }: FilmRollProgressProps) {
  const progress = Math.min((currentShots / totalExposures) * 100, 100);
  const isComplete = currentShots >= totalExposures;

  return (
    <div className={`relative ${className}`}>
      {/* Film Roll Container */}
      <div className="relative bg-gray-900 rounded-lg p-4 border-2 border-gray-700">
        {/* Film Strip Perforations */}
        <div className="absolute -left-1 top-0 bottom-0 w-2 flex flex-col justify-between py-2">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="w-1 h-1 bg-gray-600 rounded-full"></div>
          ))}
        </div>
        <div className="absolute -right-1 top-0 bottom-0 w-2 flex flex-col justify-between py-2">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="w-1 h-1 bg-gray-600 rounded-full"></div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="relative h-8 bg-gray-800 rounded-md overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          
          {/* Film Frame Indicators */}
          <div className="absolute inset-0 flex items-center justify-between px-2">
            {Array.from({ length: Math.min(totalExposures, 12) }, (_, i) => (
              <div
                key={i}
                className={`w-1 h-6 rounded-sm ${
                  i < currentShots ? 'bg-white' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Frame Counter */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-mono text-gray-300">
              Frame {currentShots} of {totalExposures}
            </span>
          </div>
          
          {/* Completion Status */}
          <div className="flex items-center gap-2">
            {isComplete ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 text-green-400"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs font-mono">Complete</span>
              </motion.div>
            ) : (
              <div className="text-xs font-mono text-gray-400">
                {Math.round(progress)}% used
              </div>
            )}
          </div>
        </div>

        {/* Film Advance Animation */}
        {currentShots > 0 && (
          <motion.div
            className="absolute top-2 right-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-yellow-400 rounded-full"
            >
              <div className="w-1 h-1 bg-yellow-400 rounded-full m-1" />
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
