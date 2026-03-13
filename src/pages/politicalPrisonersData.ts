/**
 * Political prisoners profile page path mapping.
 * Maps prisoner names to their dedicated profile page routes.
 */
export const PROFILE_PATHS: Record<string, string> = {
  'Jimmy Lai': '/profiles/jimmy-lai',
  'Ilham Tohti': '/profiles/ilham-tohti',
  'Gedhun Choekyi Nyima': '/profiles/panchen-lama',
  'Liu Xiaobo': '/profiles/liu-xiaobo',
  'Joshua Wong': '/profiles/joshua-wong',
  'Gui Minhai': '/profiles/gui-minhai',
  'Zhang Zhan': '/profiles/zhang-zhan',
  'Gao Zhisheng': '/profiles/gao-zhisheng',
  'Benny Tai': '/profiles/benny-tai',
  'Nathan Law': '/profiles/nathan-law',
  'Cardinal Joseph Zen': '/profiles/cardinal-zen',
  'Agnes Chow': '/profiles/agnes-chow',
};

export const NGO_SOURCES = new Set([
  'www.hrw.org', 'hrw.org',
  'www.amnesty.org', 'amnesty.org',
  'www.frontlinedefenders.org', 'frontlinedefenders.org',
  'pen.org', 'www.pen-international.org',
  'chinaaid.org', 'www.article19.org',
  'www.hongkongwatch.org', 'savetibet.org',
  'southmongolia.org', 'www.ibanet.org'
]);

export const NEWS_SOURCES = new Set([
  'www.bbc.com', 'bbc.com',
  'www.reuters.com', 'reuters.com',
  'www.theguardian.com', 'theguardian.com',
  'apnews.com', 'www.aljazeera.com',
  'hongkongfp.com', 'www.npr.org',
  'www.voanews.com', 'www.rfa.org',
  'thechinaproject.com', 'aninews.in',
  'news.artnet.com', 'www.pillarcatholic.com'
]);

export const GOV_SOURCES = new Set([
  'humanrightscommission.house.gov',
  'www.ohchr.org'
]);
