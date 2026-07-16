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
      // Return predefined high-quality mock data for testing
      return res.json({
        success: true,
        name: 'Google Cloud Champion (Mock Account)',
        profileUrl,
        labsCount: 15,
        badgesCount: 6,
        badges: [
          { title: 'Google Cloud Essentials (Quest)', type: 'lab' },
          { title: 'Create and Manage Cloud Resources (Skill Badge)', type: 'badge' },
          { title: 'Perform Foundational Infrastructure Tasks in Google Cloud (Skill Badge)', type: 'badge' },
          { title: 'Baseline: Infrastructure (Quest)', type: 'lab' },
          { title: 'Cloud Engineering Learning Path', type: 'lab' },
          { title: 'Build and Secure Networks in Google Cloud (Skill Badge)', type: 'badge' },
          { title: 'Automate Data Tasks on Google Cloud (Skill Badge)', type: 'badge' },
          { title: 'Deploy and Manage Cloud Applications (Skill Badge)', type: 'badge' },
          { title: 'Kubernetes in Google Cloud (Quest)', type: 'lab' },
          { title: 'Engineer Data in Google Cloud (Skill Badge)', type: 'badge' },
          { title: 'Security & Identity Fundamentals (Quest)', type: 'lab' }
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
            message: 'Google Request Blocked: Google Cloud Skills Boost returned 403 Forbidden. This can happen if the site blocks automated requests. Please ensure your profile public visibility is enabled, or use "mock" to evaluate points.'
          });
        }
        if (response.status === 404) {
          return res.status(404).json({
            message: 'Profile Not Found: The profile link returned 404 Not Found. Please verify that the unique profile URL ID is correct.'
          });
        }
        return res.status(response.status).json({ 
          message: `Google Request Failed: HTTP ${response.status}. Verify that the profile URL is active and public.` 
        });
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // Extract User Name
      let name = $('h1').first().text().trim() || 
                 $('.ql-display-4').first().text().trim() || 
                 $('.ql-headline-1').first().text().trim() || 
                 'Arcade Member';
                 
      // Clean name string
      name = name.replace(/\s+/g, ' ');

      const badges = [];
      let labsCount = 0;
      let badgesCount = 0;

      // Extract all badges. Skills Boost displays badges in divs containing titles
      // Check standard selectors for profile pages
      const badgeContainers = $('.profile-badge, .badge, div[class*="badge"]');

      if (badgeContainers.length > 0) {
        badgeContainers.each((idx, el) => {
          const badgeText = $(el).find('.ql-subheading-1, .ql-body-2, span, p').first().text().trim() || 
                            $(el).text().trim();
          
          if (badgeText && !badges.some(b => b.title === badgeText)) {
            // Determine type: Skill Badge or Quest/Lab-equivalent
            const isSkillBadge = badgeText.toLowerCase().includes('skill badge') || 
                                 badgeText.toLowerCase().includes('assessment') ||
                                 $(el).find('img').attr('src')?.toLowerCase().includes('skill_badge');

            const type = isSkillBadge ? 'badge' : 'lab';
            
            if (isSkillBadge) {
              badgesCount++;
            } else {
              labsCount++;
            }

            badges.push({
              title: badgeText,
              type
            });
          }
        });
      } else {
        // Fallback: search for ql headings or other blocks containing badge descriptions
        $('span[class*="ql-subheading"], span[class*="ql-body"], p[class*="ql-body"]').each((idx, el) => {
          const text = $(el).text().trim();
          // Profile badges have specific texts
          if (text.length > 5 && text.length < 100 && (text.includes('Quest') || text.includes('Badge') || text.includes('Course'))) {
            const isSkillBadge = text.toLowerCase().includes('skill badge');
            const type = isSkillBadge ? 'badge' : 'lab';
            
            if (!badges.some(b => b.title === text)) {
              if (isSkillBadge) {
                badgesCount++;
              } else {
                labsCount++;
              }
              badges.push({ title: text, type });
            }
          }
        });
      }

      // Check if profile explicitly states no badges have been earned yet
      const noBadgesEarned = html.toLowerCase().includes("hasn't earned any badges yet") || 
                             html.toLowerCase().includes("has not earned any badges");

      // If scraping returns nothing and name is default, we assume it is not public
      if (badges.length === 0 && !noBadgesEarned && name === 'Arcade Member') {
        return res.status(422).json({
          message: 'The profile page loaded, but no badges or user info were found. Verify that the profile has public visibility enabled.'
        });
      }

      res.json({
        success: true,
        name,
        profileUrl,
        labsCount: labsCount,
        badgesCount: badgesCount,
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
