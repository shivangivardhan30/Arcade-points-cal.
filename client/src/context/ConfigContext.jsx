import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useAuth, API_URL } from './AuthContext';

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const { token, getAuthHeaders } = useAuth();
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConfig = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/config`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
        setError(null);
      } else {
        throw new Error('Failed to fetch config');
      }
    } catch (err) {
      console.error('Error fetching config:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, getAuthHeaders]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  // Helper: compute total points
  const calculatePoints = useCallback((labs, badges) => {
    if (!config) return 0;
    const l = parseInt(labs) || 0;
    const b = parseInt(badges) || 0;
    return (l * config.pointsPerLab) + (b * config.pointsPerBadge);
  }, [config]);

  // Helper: get current milestone achieved
  const getMilestoneReached = useCallback((points) => {
    if (!config || !config.milestones || config.milestones.length === 0) return 'None';
    
    const sortedMilestones = [...config.milestones].sort((a, b) => a.pointsRequired - b.pointsRequired);
    let milestone = 'None';
    for (let i = 0; i < sortedMilestones.length; i++) {
      if (points >= sortedMilestones[i].pointsRequired) {
        milestone = sortedMilestones[i].name;
      }
    }
    return milestone;
  }, [config]);

  // Helper: get details of next milestone
  const getNextMilestoneInfo = useCallback((points) => {
    if (!config || !config.milestones || config.milestones.length === 0) {
      return { nextMilestone: null, pointsNeeded: 0, progress: 100 };
    }

    const sortedMilestones = [...config.milestones].sort((a, b) => a.pointsRequired - b.pointsRequired);
    
    // Find first milestone that user hasn't reached yet
    const next = sortedMilestones.find(m => points < m.pointsRequired);
    
    if (!next) {
      // Reached all milestones
      return {
        nextMilestone: null,
        pointsNeeded: 0,
        progress: 100,
        labsNeeded: 0,
        badgesNeeded: 0
      };
    }

    const pointsNeeded = next.pointsRequired - points;
    
    // Find the previous milestone requirement to calculate progress percentage within current tier
    const currentMilestoneIndex = sortedMilestones.findIndex(m => m.name === getMilestoneReached(points));
    const basePoints = currentMilestoneIndex >= 0 ? sortedMilestones[currentMilestoneIndex].pointsRequired : 0;
    const tierTotalRange = next.pointsRequired - basePoints;
    const tierProgress = points - basePoints;
    const progress = Math.max(0, Math.min(100, Math.round((tierProgress / tierTotalRange) * 100)));

    // Calculate how many labs or badges are needed specifically (rounded up)
    const labsNeeded = Math.ceil(pointsNeeded / config.pointsPerLab);
    const badgesNeeded = Math.ceil(pointsNeeded / config.pointsPerBadge);

    return {
      nextMilestone: next,
      pointsNeeded,
      progress,
      labsNeeded,
      badgesNeeded
    };
  }, [config, getMilestoneReached]);

  return (
    <ConfigContext.Provider
      value={{
        config,
        loading,
        error,
        refreshConfig: fetchConfig,
        calculatePoints,
        getMilestoneReached,
        getNextMilestoneInfo
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
