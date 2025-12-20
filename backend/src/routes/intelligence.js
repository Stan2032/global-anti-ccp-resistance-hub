/**
 * Intelligence API Routes
 * 
 * Provides access to comprehensive CCP human rights violations data,
 * regional security assessments, and resistance resources.
 */

import express from 'express';
import logger from '../utils/logger.js';
import ccpData from '../data/ccpViolationsData.js';
import regionalData from '../data/regionalThreats.js';

const router = express.Router();

// ============================================
// CCP HUMAN RIGHTS VIOLATIONS ENDPOINTS
// ============================================

/**
 * GET /api/v1/intelligence/sources
 * Returns list of verified intelligence sources
 */
router.get('/sources', (req, res) => {
  try {
    res.json({
      success: true,
      data: ccpData.INTELLIGENCE_SOURCES,
      count: ccpData.INTELLIGENCE_SOURCES.length
    });
  } catch (error) {
    logger.error('Error fetching sources', { error: error.message });
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/v1/intelligence/databases
 * Returns list of research databases and resources
 */
router.get('/databases', (req, res) => {
  try {
    res.json({
      success: true,
      data: ccpData.RESEARCH_DATABASES,
      count: ccpData.RESEARCH_DATABASES.length
    });
  } catch (error) {
    logger.error('Error fetching databases', { error: error.message });
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/v1/intelligence/tactics
 * Returns documentation of CCP tactics and methods
 */
router.get('/tactics', (req, res) => {
  try {
    const { category } = req.query;
    
    if (category && ccpData.CCP_TACTICS[category]) {
      res.json({
        success: true,
        data: ccpData.CCP_TACTICS[category]
      });
    } else {
      res.json({
        success: true,
        data: ccpData.CCP_TACTICS,
        categories: Object.keys(ccpData.CCP_TACTICS)
      });
    }
  } catch (error) {
    logger.error('Error fetching tactics', { error: error.message });
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/v1/intelligence/prisoners
 * Returns list of notable political prisoners
 */
router.get('/prisoners', (req, res) => {
  try {
    const { status, urgency } = req.query;
    let prisoners = ccpData.NOTABLE_PRISONERS;
    
    if (status) {
      prisoners = prisoners.filter(p => p.status === status.toUpperCase());
    }
    if (urgency) {
      prisoners = prisoners.filter(p => p.urgency === urgency.toUpperCase());
    }
    
    res.json({
      success: true,
      data: prisoners,
      count: prisoners.length,
      filters: { status, urgency }
    });
  } catch (error) {
    logger.error('Error fetching prisoners', { error: error.message });
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/v1/intelligence/prisoners/:name
 * Returns details of a specific political prisoner
 */
router.get('/prisoners/:name', (req, res) => {
  try {
    const prisoner = ccpData.NOTABLE_PRISONERS.find(
      p => p.name.toLowerCase().includes(req.params.name.toLowerCase())
    );
    
    if (prisoner) {
      res.json({ success: true, data: prisoner });
    } else {
      res.status(404).json({ success: false, error: 'Prisoner not found' });
    }
  } catch (error) {
    logger.error('Error fetching prisoner', { error: error.message });
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/v1/intelligence/officials
 * Returns list of sanctioned CCP officials
 */
router.get('/officials', (req, res) => {
  try {
    res.json({
      success: true,
      data: ccpData.SANCTIONED_OFFICIALS,
      count: ccpData.SANCTIONED_OFFICIALS.length
    });
  } catch (error) {
    logger.error('Error fetching officials', { error: error.message });
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/v1/intelligence/analyze
 * Analyzes text content for CCP-related relevance
 */
router.post('/analyze', (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ success: false, error: 'Text is required' });
    }
    
    const score = ccpData.calculateRelevanceScore(text);
    const relevanceLevel = score >= 50 ? 'HIGH' : score >= 20 ? 'MEDIUM' : 'LOW';
    
    // Find matching keywords
    const matchedKeywords = [];
    const lowerText = text.toLowerCase();
    
    Object.entries(ccpData.RELEVANCE_KEYWORDS).forEach(([level, keywords]) => {
      keywords.forEach(keyword => {
        if (lowerText.includes(keyword)) {
          matchedKeywords.push({ keyword, level });
        }
      });
    });
    
    res.json({
      success: true,
      data: {
        score,
        relevanceLevel,
        matchedKeywords,
        keywordCount: matchedKeywords.length
      }
    });
  } catch (error) {
    logger.error('Error analyzing text', { error: error.message });
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// REGIONAL SECURITY ENDPOINTS
// ============================================

/**
 * GET /api/v1/intelligence/threats/taiwan
 * Returns Taiwan threat assessment
 */
router.get('/threats/taiwan', (req, res) => {
  try {
    res.json({
      success: true,
      data: regionalData.TAIWAN_THREAT,
      lastUpdated: regionalData.TAIWAN_THREAT.overview.lastUpdated
    });
  } catch (error) {
    logger.error('Error fetching Taiwan threat', { error: error.message });
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/v1/intelligence/threats/south-china-sea
 * Returns South China Sea assessment
 */
router.get('/threats/south-china-sea', (req, res) => {
  try {
    res.json({
      success: true,
      data: regionalData.SOUTH_CHINA_SEA,
      lastUpdated: regionalData.SOUTH_CHINA_SEA.overview.lastUpdated
    });
  } catch (error) {
    logger.error('Error fetching SCS threat', { error: error.message });
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/v1/intelligence/threats/east-china-sea
 * Returns East China Sea assessment
 */
router.get('/threats/east-china-sea', (req, res) => {
  try {
    res.json({
      success: true,
      data: regionalData.EAST_CHINA_SEA,
      lastUpdated: regionalData.EAST_CHINA_SEA.overview.lastUpdated
    });
  } catch (error) {
    logger.error('Error fetching ECS threat', { error: error.message });
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/v1/intelligence/threats/overview
 * Returns overview of all regional threats
 */
router.get('/threats/overview', (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        taiwan: {
          status: regionalData.TAIWAN_THREAT.overview.status,
          threatLevel: regionalData.TAIWAN_THREAT.overview.threatLevel,
          summary: regionalData.TAIWAN_THREAT.overview.summary
        },
        southChinaSea: {
          status: regionalData.SOUTH_CHINA_SEA.overview.status,
          threatLevel: regionalData.SOUTH_CHINA_SEA.overview.threatLevel,
          summary: regionalData.SOUTH_CHINA_SEA.overview.summary
        },
        eastChinaSea: {
          status: regionalData.EAST_CHINA_SEA.overview.status,
          threatLevel: regionalData.EAST_CHINA_SEA.overview.threatLevel,
          summary: regionalData.EAST_CHINA_SEA.overview.summary
        }
      }
    });
  } catch (error) {
    logger.error('Error fetching threats overview', { error: error.message });
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/v1/intelligence/belt-and-road
 * Returns Belt and Road Initiative assessment
 */
router.get('/belt-and-road', (req, res) => {
  try {
    res.json({
      success: true,
      data: regionalData.BELT_AND_ROAD
    });
  } catch (error) {
    logger.error('Error fetching BRI data', { error: error.message });
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/v1/intelligence/united-front
 * Returns United Front Work Department operations data
 */
router.get('/united-front', (req, res) => {
  try {
    res.json({
      success: true,
      data: regionalData.UNITED_FRONT
    });
  } catch (error) {
    logger.error('Error fetching UFWD data', { error: error.message });
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/v1/intelligence/cyber
 * Returns cyber warfare and disinformation data
 */
router.get('/cyber', (req, res) => {
  try {
    res.json({
      success: true,
      data: regionalData.CYBER_WARFARE
    });
  } catch (error) {
    logger.error('Error fetching cyber data', { error: error.message });
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// COMPREHENSIVE ENDPOINTS
// ============================================

/**
 * GET /api/v1/intelligence/summary
 * Returns a comprehensive summary of all intelligence data
 */
router.get('/summary', (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        humanRights: {
          sourcesCount: ccpData.INTELLIGENCE_SOURCES.length,
          databasesCount: ccpData.RESEARCH_DATABASES.length,
          tacticsDocumented: Object.keys(ccpData.CCP_TACTICS).length,
          notablePrisoners: ccpData.NOTABLE_PRISONERS.length,
          sanctionedOfficials: ccpData.SANCTIONED_OFFICIALS.length
        },
        regionalThreats: {
          taiwan: regionalData.TAIWAN_THREAT.overview.threatLevel,
          southChinaSea: regionalData.SOUTH_CHINA_SEA.overview.threatLevel,
          eastChinaSea: regionalData.EAST_CHINA_SEA.overview.threatLevel
        },
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Error fetching summary', { error: error.message });
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/v1/intelligence/keywords
 * Returns relevance keywords for content analysis
 */
router.get('/keywords', (req, res) => {
  try {
    res.json({
      success: true,
      data: ccpData.RELEVANCE_KEYWORDS,
      totalKeywords: Object.values(ccpData.RELEVANCE_KEYWORDS).flat().length
    });
  } catch (error) {
    logger.error('Error fetching keywords', { error: error.message });
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/v1/intelligence/ (root)
 * Returns API documentation
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Intelligence API - Comprehensive CCP Human Rights Violations and Regional Security Data',
    endpoints: {
      humanRights: {
        '/sources': 'Verified intelligence sources',
        '/databases': 'Research databases and resources',
        '/tactics': 'CCP tactics documentation',
        '/prisoners': 'Notable political prisoners',
        '/officials': 'Sanctioned CCP officials',
        '/analyze': 'POST - Analyze text for relevance'
      },
      regionalThreats: {
        '/threats/overview': 'All regional threats summary',
        '/threats/taiwan': 'Taiwan threat assessment',
        '/threats/south-china-sea': 'South China Sea assessment',
        '/threats/east-china-sea': 'East China Sea assessment'
      },
      influence: {
        '/belt-and-road': 'Belt and Road Initiative data',
        '/united-front': 'United Front operations',
        '/cyber': 'Cyber warfare and disinformation'
      },
      utility: {
        '/summary': 'Comprehensive data summary',
        '/keywords': 'Relevance scoring keywords'
      }
    }
  });
});

export default router;
