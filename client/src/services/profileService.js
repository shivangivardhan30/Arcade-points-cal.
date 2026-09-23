import { formatUserFriendlyError } from '../utils/validation';

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Fetches profile data from backend API
 * @param {string} profileUrl 
 * @returns {Promise<Object>}
 */
export const fetchProfileData = async (profileUrl) => {
  const trimmedUrl = profileUrl.trim();

  // Support mock keyword explicitly for testing/offline evaluation
  if (
    trimmedUrl.toLowerCase() === 'mock' ||
    trimmedUrl.toLowerCase() === 'test' ||
    trimmedUrl.toLowerCase().startsWith('mock-')
  ) {
    return {
      success: true,
      name: 'Google Cloud Champion (Demo Profile)',
      avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      memberSince: 'Member since 2024',
      profileUrl: 'https://www.cloudskillsboost.google/public_profiles/mock-demo-id',
      skillBadgesCount: 8,
      gameBadgesCount: 4,
      triviaBadgesCount: 2,
      labsCount: 5,
      badges: [
        { title: 'Google Cloud Essentials', category: 'Quest', type: 'lab', earned: true },
        { title: 'Create and Manage Cloud Resources', category: 'Skill Badge', type: 'badge', earned: true },
        { title: 'Perform Foundational Infrastructure Tasks in Google Cloud', category: 'Skill Badge', type: 'badge', earned: true },
        { title: 'Baseline: Infrastructure', category: 'Quest', type: 'lab', earned: true },
        { title: 'Arcade Trivia July 2026', category: 'Trivia Badge', type: 'badge', earned: true },
        { title: 'Level 1: Cloud Architecture Game', category: 'Game Badge', type: 'badge', earned: true },
        { title: 'Build and Secure Networks in Google Cloud', category: 'Skill Badge', type: 'badge', earned: true },
        { title: 'Automate Data Tasks on Google Cloud', category: 'Skill Badge', type: 'badge', earned: true },
        { title: 'Deploy and Manage Cloud Applications', category: 'Skill Badge', type: 'badge', earned: true },
        { title: 'Kubernetes in Google Cloud', category: 'Quest', type: 'lab', earned: true },
        { title: 'Engineer Data in Google Cloud', category: 'Skill Badge', type: 'badge', earned: true },
        { title: 'Set Up an App Dev Environment on GCP', category: 'Skill Badge', type: 'badge', earned: true }
      ]
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/profile/scrape`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileUrl: trimmedUrl })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    if (!data || data.success === false) {
      throw new Error('Unable to retrieve profile data. Please make sure your Google Skills Boost profile is public and try again.');
    }

    return data;

  } catch (err) {
    const userFriendlyMessage = formatUserFriendlyError(err);
    throw new Error(userFriendlyMessage);
  }
};
