const cheerio = require('cheerio');

// @desc    Scrape and analyze a Google Cloud Skills Boost public profile URL
// @route   POST /api/profile/scrape
// @access  Public
const scrapeProfile = async (req, res) => {
  try {
    const { profileUrl } = req.body;

    if (!profileUrl) {
      return res.status(400).json({ message: 'Profile URL is required' });
    }

    // Support Mock URL for easy testing & offline evaluations
    if (
      profileUrl.includes('mock') || 
      profileUrl.includes('test') || 
      !profileUrl.startsWith('http')
    ) {
      const mockSkillBadges = 8;
      const mockGameBadges = 4;
      const mockTriviaBadges = 3;
      const mockQuests = 6;
      const totalPoints = (mockSkillBadges * 0.5) + (mockGameBadges * 1) + (mockTriviaBadges * 1) + (mockQuests * 1);

      return res.json({
        success: true,
        name: 'Google Cloud Champion (Mock Account)',
        profileUrl,
        avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
        memberSince: 'Joined 2024',
        labsCount: mockQuests,
        badgesCount: mockSkillBadges,
        skillBadgesCount: mockSkillBadges,
        gameBadgesCount: mockGameBadges,
        triviaBadgesCount: mockTriviaBadges,
        totalPoints,
        swagTier: totalPoints >= 45 ? 'Champion Swag Tier' : totalPoints >= 25 ? 'Premium Swag Tier' : totalPoints >= 10 ? 'Standard Swag Tier' : 'Novice Learner',
        badges: [
          { title: 'Google Cloud Essentials (Quest)', type: 'lab', category: 'Quest' },
          { title: 'Create and Manage Cloud Resources', type: 'badge', category: 'Skill Badge' },
          { title: 'Perform Foundational Infrastructure Tasks in Google Cloud', type: 'badge', category: 'Skill Badge' },
          { title: 'Baseline: Infrastructure', type: 'lab', category: 'Quest' },
          { title: 'Arcade Trivia July 2026', type: 'badge', category: 'Trivia Badge' },
          { title: 'Level 1: Cloud Architecture Game', type: 'badge', category: 'Game Badge' },
          { title: 'Build and Secure Networks in Google Cloud', type: 'badge', category: 'Skill Badge' },
          { title: 'Automate Data Tasks on Google Cloud', type: 'badge', category: 'Skill Badge' },
          { title: 'Deploy and Manage Cloud Applications', type: 'badge', category: 'Skill Badge' },
          { title: 'Kubernetes in Google Cloud', type: 'lab', category: 'Quest' },
          { title: 'Engineer Data in Google Cloud', type: 'badge', category: 'Skill Badge' }
        ]
      });
    }

    // Real profile scraping
    try {
      const response = await fetch(profileUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      if (!response.ok) {
        if (response.status === 403) {
          return res.status(403).json({
            message: 'Google Request Blocked: Google Cloud Skills Boost returned 403 Forbidden. Please verify profile public visibility or try using "mock".'
          });
        }
        if (response.status === 404) {
          return res.status(404).json({
            message: 'Profile Not Found: The link returned 404 Not Found. Please check your unique profile ID URL.'
          });
        }
        return res.status(response.status).json({ 
          message: `Google Request Failed: HTTP ${response.status}. Verify profile link is public.` 
        });
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // Extract User Name
      let name = $('h1').first().text().trim() || 
                 $('.ql-display-4').first().text().trim() || 
                 $('.ql-headline-1').first().text().trim() || 
                 'Arcade Member';
                 
      name = name.replace(/\s+/g, ' ');

      // Extract Avatar URL
      let avatar = $('img.public-profile__avatar').attr('src') || 
                   $('.profile-avatar img').attr('src') || 
                   'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

      // Extract Member Since
      let memberSince = $('.public-profile__member-since').text().trim() || 
                        $('span:contains("Member since")').text().trim() || 
                        'Google Cloud Learner';

      const badges = [];
      let skillBadgesCount = 0;
      let gameBadgesCount = 0;
      let triviaBadgesCount = 0;
      let questsCount = 0;

      const badgeContainers = $('.profile-badge, .badge, div[class*="badge"], .public-profile-badge');

      if (badgeContainers.length > 0) {
        badgeContainers.each((idx, el) => {
          const badgeText = $(el).find('.ql-subheading-1, .ql-body-2, .public-profile-badge__name, span, p').first().text().trim() || 
                            $(el).text().trim();
          
          if (badgeText && !badges.some(b => b.title === badgeText)) {
            const lowerText = badgeText.toLowerCase();
            const imgSrc = $(el).find('img').attr('src')?.toLowerCase() || '';

            let category = 'Quest';
            let type = 'lab';

            if (lowerText.includes('trivia')) {
              category = 'Trivia Badge';
              type = 'badge';
              triviaBadgesCount++;
            } else if (lowerText.includes('level') || lowerText.includes('game') || lowerText.includes('monitored')) {
              category = 'Game Badge';
              type = 'badge';
              gameBadgesCount++;
            } else if (lowerText.includes('skill badge') || imgSrc.includes('skill_badge')) {
              category = 'Skill Badge';
              type = 'badge';
              skillBadgesCount++;
            } else {
              category = 'Quest';
              type = 'lab';
              questsCount++;
            }

            badges.push({
              title: badgeText,
              type,
              category
            });
          }
        });
      } else {
        $('span[class*="ql-subheading"], span[class*="ql-body"], p[class*="ql-body"]').each((idx, el) => {
          const text = $(el).text().trim();
          if (text.length > 5 && text.length < 100 && (text.includes('Quest') || text.includes('Badge') || text.includes('Course') || text.includes('Trivia'))) {
            const lowerText = text.toLowerCase();
            let category = 'Quest';
            let type = 'lab';

            if (lowerText.includes('trivia')) {
              category = 'Trivia Badge';
              type = 'badge';
              triviaBadgesCount++;
            } else if (lowerText.includes('level') || lowerText.includes('game')) {
              category = 'Game Badge';
              type = 'badge';
              gameBadgesCount++;
            } else if (lowerText.includes('skill badge')) {
              category = 'Skill Badge';
              type = 'badge';
              skillBadgesCount++;
            } else {
              category = 'Quest';
              type = 'lab';
              questsCount++;
            }

            if (!badges.some(b => b.title === text)) {
              badges.push({ title: text, type, category });
            }
          }
        });
      }

      const totalPoints = (skillBadgesCount * 0.5) + (gameBadgesCount * 1) + (triviaBadgesCount * 1) + (questsCount * 1);

      let swagTier = 'Novice Learner';
      if (totalPoints >= 45) swagTier = 'Champion Swag Tier';
      else if (totalPoints >= 25) swagTier = 'Premium Swag Tier';
      else if (totalPoints >= 10) swagTier = 'Standard Swag Tier';

      res.json({
        success: true,
        name,
        avatar,
        memberSince,
        profileUrl,
        labsCount: questsCount,
        badgesCount: skillBadgesCount,
        skillBadgesCount,
        gameBadgesCount,
        triviaBadgesCount,
        totalPoints,
        swagTier,
        badges
      });

    } catch (fetchErr) {
      console.error('Fetch error during scraping:', fetchErr);
      res.status(500).json({ 
        message: `Scraping error: Unable to connect to Google Skills Boost. Details: ${fetchErr.message}` 
      });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  scrapeProfile
};
