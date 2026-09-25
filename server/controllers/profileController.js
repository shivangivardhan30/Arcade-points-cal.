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
      // Trivia badges are Game Badges in Arcade (1 pt each)
      const totalGameBadges = mockGameBadges + mockTriviaBadges;
      const totalPoints = (mockSkillBadges * 0.5) + (totalGameBadges * 1);

      return res.json({
        success: true,
        name: 'Google Cloud Champion (Mock Account)',
        profileUrl,
        avatar: 'https://ui-avatars.com/api/?name=Google%20Cloud%20Champion&background=4285F4&color=fff&bold=true',
        memberSince: 'Joined 2024',
        labsCount: mockQuests,
        badgesCount: mockSkillBadges,
        skillBadgesCount: mockSkillBadges,
        gameBadgesCount: totalGameBadges,
        triviaBadgesCount: mockTriviaBadges,
        totalPoints,
        swagTier: totalPoints >= 45 ? 'Champion Swag Tier' : totalPoints >= 25 ? 'Premium Swag Tier' : totalPoints >= 10 ? 'Standard Swag Tier' : 'Novice Learner',
        lowConfidence: false,
        warning: null,
        badges: [
          { title: 'Google Cloud Essentials (Quest)', type: 'lab', category: 'Quest' },
          { title: 'Create and Manage Cloud Resources', type: 'badge', category: 'Skill Badge', earnedDate: 'May 10, 2024' },
          { title: 'Perform Foundational Infrastructure Tasks in Google Cloud', type: 'badge', category: 'Skill Badge', earnedDate: 'Jun 02, 2024' },
          { title: 'Baseline: Infrastructure', type: 'lab', category: 'Quest' },
          { title: 'Arcade Trivia July 2026', type: 'badge', category: 'Game Badge', earnedDate: 'Jul 15, 2026' },
          { title: 'Level 1: Cloud Architecture Game', type: 'badge', category: 'Game Badge', earnedDate: 'Aug 01, 2026' },
          { title: 'Build and Secure Networks in Google Cloud', type: 'badge', category: 'Skill Badge', earnedDate: 'Aug 12, 2026' },
          { title: 'Automate Data Tasks on Google Cloud', type: 'badge', category: 'Skill Badge', earnedDate: 'Aug 20, 2026' },
          { title: 'Deploy and Manage Cloud Applications', type: 'badge', category: 'Skill Badge', earnedDate: 'Sep 05, 2026' },
          { title: 'Engineer Data in Google Cloud', type: 'badge', category: 'Skill Badge', earnedDate: 'Sep 18, 2026' }
        ]
      });
    }

    // Real profile scraping
    try {
      const response = await fetch(profileUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
          'Sec-Ch-Ua': '"Chromium";v="124", "Google Chrome";v="124"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"Windows"',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Sec-Fetch-User': '?1',
          'Upgrade-Insecure-Requests': '1'
        }
      });

      if (!response.ok) {
        if (response.status === 403) {
          return res.status(403).json({
            message: 'Google Cloud Skills Boost returned 403 Forbidden. Please ensure your profile is public in Skills Boost account settings or test with "mock".'
          });
        }
        if (response.status === 404) {
          return res.status(404).json({
            message: 'Profile Not Found: The profile link returned 404. Please check your unique public profile URL.'
          });
        }
        return res.status(response.status).json({ 
          message: `Google Skills Boost request failed: HTTP ${response.status}. Verify your profile is set to public.` 
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

      // Extract Avatar URL (Neutral initials fallback, NO gendered icons)
      let scrapedAvatar = $('img.public-profile__avatar').attr('src') || 
                          $('.profile-avatar img').attr('src') || 
                          $('.public-profile-header img').attr('src') || 
                          $('img[src*="googleusercontent"]').attr('src') ||
                          $('img[src*="qwiklabs.com/avatar"]').attr('src') ||
                          $('img.avatar').attr('src') ||
                          '';

      let avatar = '';
      if (
        scrapedAvatar && 
        !scrapedAvatar.includes('3135715.png') && 
        !scrapedAvatar.includes('google_cloud_gear') &&
        (scrapedAvatar.startsWith('http://') || scrapedAvatar.startsWith('https://'))
      ) {
        avatar = scrapedAvatar;
      } else {
        const encodedName = encodeURIComponent(name || 'Arcade Member');
        avatar = `https://ui-avatars.com/api/?name=${encodedName}&background=4285F4&color=fff&bold=true`;
      }

      // Extract Member Since
      let memberSince = $('.public-profile__member-since').text().trim() || 
                        $('span:contains("Member since")').text().trim() || 
                        'Google Cloud Learner';

      const badges = [];
      let skillBadgesCount = 0;
      let gameBadgesCount = 0;
      let triviaBadgesCount = 0;
      let questsCount = 0;
      let lowConfidence = false;
      let warning = null;

      const badgeContainers = $('.profile-badge, .public-profile-badge, .badge-item, div[class*="badge"]');

      if (badgeContainers.length > 0) {
        badgeContainers.each((idx, el) => {
          const badgeTitle = $(el).find('.ql-subheading-1, .ql-body-2, .public-profile-badge__name, span, p').first().text().trim() || 
                             $(el).text().trim();
          
          const dateText = $(el).find('.public-profile-badge__date, .ql-caption-1, span:contains("Earned"), span:contains("20")').text().trim() || null;
          
          // Requirement 1: Scan full badge container text (title + category label + date)
          const containerFullText = $(el).text().trim().toLowerCase();
          const imgSrc = $(el).find('img').attr('src')?.toLowerCase() || '';
          const imgAlt = $(el).find('img').attr('alt')?.toLowerCase() || '';

          if (badgeTitle && badgeTitle.length > 2 && !badges.some(b => b.title === badgeTitle)) {
            let category = 'Quest';
            let type = 'lab';

            // Requirement 2: Check isSkillBadge FIRST with unambiguous markers
            const isSkillBadge = containerFullText.includes('skill badge') || 
                                 containerFullText.includes('skill-badge') || 
                                 imgSrc.includes('skill_badge') || 
                                 imgSrc.includes('skill-badge') || 
                                 imgSrc.includes('skillbadges') || 
                                 imgSrc.includes('completion_badge') || 
                                 imgSrc.includes('badges/skill') || 
                                 imgAlt.includes('skill badge') || 
                                 imgAlt.includes('skill-badge');

            // Requirement 2: Check isGameBadge SECOND with specific markers (level N regex, trivia, speed run, basecamp)
            // Removed standalone generic words 'arcade', 'challenge', 'game', 'monitored'
            const isGameBadge = containerFullText.includes('trivia') || 
                                /\blevel\s*\d/i.test(containerFullText) || 
                                containerFullText.includes('speed run') || 
                                containerFullText.includes('base camp') || 
                                containerFullText.includes('basecamp') || 
                                containerFullText.includes('game badge') || 
                                imgSrc.includes('game_badge') || 
                                imgSrc.includes('game-badge') || 
                                imgSrc.includes('trivia') || 
                                imgAlt.includes('game badge') || 
                                imgAlt.includes('trivia');

            if (isSkillBadge) {
              category = 'Skill Badge';
              type = 'badge';
              skillBadgesCount++;
            } else if (isGameBadge) {
              category = 'Game Badge';
              type = 'badge';
              gameBadgesCount++;
              if (containerFullText.includes('trivia') || imgSrc.includes('trivia')) {
                triviaBadgesCount++;
              }
            } else {
              category = 'Quest';
              type = 'lab';
              questsCount++;
            }

            badges.push({
              title: badgeTitle,
              type,
              category,
              earnedDate: dateText
            });
          }
        });
      } else {
        // Requirement 3: Set lowConfidence = true and warning when fallback loose parser path runs
        lowConfidence = true;
        warning = 'Profile layout could not be parsed structurally; badge counts estimated from page text.';
        console.warn(`[ProfileScraper] Fallback parser triggered for ${profileUrl}. Setting lowConfidence = true.`);

        $('span[class*="ql-subheading"], span[class*="ql-body"], p[class*="ql-body"]').each((idx, el) => {
          const text = $(el).text().trim();
          if (text.length > 5 && text.length < 120) {
            const lowerText = text.toLowerCase();
            let category = 'Quest';
            let type = 'lab';

            // Same priority: Check isSkillBadge FIRST
            const isSkillBadge = lowerText.includes('skill badge') || lowerText.includes('skill-badge');
            
            // Strict isGameBadge check SECOND
            const isGameBadge = lowerText.includes('trivia') || 
                                /\blevel\s*\d/i.test(lowerText) || 
                                lowerText.includes('speed run') || 
                                lowerText.includes('base camp') || 
                                lowerText.includes('basecamp') || 
                                lowerText.includes('game badge');

            if (isSkillBadge) {
              category = 'Skill Badge';
              type = 'badge';
              skillBadgesCount++;
            } else if (isGameBadge) {
              category = 'Game Badge';
              type = 'badge';
              gameBadgesCount++;
              if (lowerText.includes('trivia')) triviaBadgesCount++;
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

      // Calculation formula: Game Badges (1 pt) + Skill Badges (0.5 pt)
      const totalPoints = (skillBadgesCount * 0.5) + (gameBadgesCount * 1);

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
        lowConfidence,
        warning,
        badges
      });

    } catch (fetchErr) {
      console.error('Fetch error during scraping:', fetchErr);
      res.status(500).json({ 
        message: `Unable to connect to Google Cloud Skills Boost. Details: ${fetchErr.message}` 
      });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  scrapeProfile
};

