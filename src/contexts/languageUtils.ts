/**
 * Language utilities — translations, context, and hook for the i18n system.
 *
 * Supports 8 languages: English, Simplified Chinese, Traditional Chinese,
 * Vietnamese, Korean, Japanese, Uyghur (RTL), and Tibetan.
 *
 * @module languageUtils
 */
import React, { type ComponentType } from 'react';
import { EastTurkestanFlag, TibetanFlag } from '../components/FlagIcons';

// Import comprehensive language files
import enTranslations from '../locales/en.json';
import zhCNTranslations from '../locales/zh-CN.json';
import zhTWTranslations from '../locales/zh-TW.json';
import viTranslations from '../locales/vi.json';
import koTranslations from '../locales/ko.json';
import jaTranslations from '../locales/ja.json';
import ugTranslations from '../locales/ug.json';
import boTranslations from '../locales/bo.json';

/** Navigation label translations. */
export interface NavigationLabels {
  dashboard: string;
  intelligence: string;
  directory: string;
  prisoners: string;
  threats: string;
  takeAction: string;
  campaigns: string;
  community: string;
  tactics: string;
  education: string;
  security: string;
  resources: string;
}

/** Common UI label translations. */
export interface CommonLabels {
  search: string;
  filter: string;
  all: string;
  critical: string;
  high: string;
  medium: string;
  low: string;
  learnMore: string;
  takeAction: string;
  share: string;
  donate: string;
  signPetition: string;
  contactRep: string;
  viewDetails: string;
  close: string;
  submit: string;
  cancel: string;
  back: string;
  next: string;
}

/** Security alert translations. */
export interface AlertLabels {
  securityWarning: string;
  useVPN: string;
  inChina: string;
  emergency: string;
  reportIncident: string;
}

/** Prisoner database translations. */
export interface PrisonerLabels {
  title: string;
  detained: string;
  imprisoned: string;
  disappeared: string;
  released: string;
  deceased: string;
  healthConcerns: string;
  tortureDocumented: string;
}

/** A single language entry containing display metadata and translations. */
export interface LanguageEntry {
  /** Display name of the language */
  name: string;
  /** Emoji flag character */
  flag?: string;
  /** Custom flag component (for non-emoji flags) */
  FlagIcon?: ComponentType;
  /** Whether the language is right-to-left */
  rtl?: boolean;
  /** Full locale JSON translations */
  localeData: Record<string, unknown>;
  /** Navigation label translations */
  nav: NavigationLabels;
  /** Common UI label translations */
  common: CommonLabels;
  /** Security alert translations */
  alerts: AlertLabels;
  /** Prisoner database translations */
  prisoners: PrisonerLabels;
}

/** State exposed by the LanguageProvider. */
export interface LanguageState {
  /** Current language code (e.g. 'en', 'zh-CN') */
  language: string;
  /** Change the active language */
  setLanguage: (lang: string) => void;
  /** Translation function (dot-notation keys) */
  t: (key: string) => string;
  /** Current language translations */
  translations: LanguageEntry;
  /** List of available languages with display metadata */
  availableLanguages?: Array<{
    code: string;
    name: string;
    flag?: string;
    FlagIcon?: ComponentType;
  }>;
}
// Translations for key UI elements and critical content
export const translations: Record<string, LanguageEntry> = {
  en: {
    name: 'English',
    flag: '🇬🇧',
    localeData: enTranslations,
    nav: {
      dashboard: 'Dashboard',
      intelligence: 'Intelligence',
      directory: 'Directory',
      prisoners: 'Political Prisoners',
      threats: 'Regional Threats',
      takeAction: 'Take Action',
      campaigns: 'Campaigns',
      community: 'Community',
      tactics: 'CCP Tactics',
      education: 'Education',
      security: 'Security',
      resources: 'Resources'
    },
    common: {
      search: 'Search',
      filter: 'Filter',
      all: 'All',
      critical: 'Critical',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      learnMore: 'Learn More',
      takeAction: 'Take Action',
      share: 'Share',
      donate: 'Donate',
      signPetition: 'Sign Petition',
      contactRep: 'Contact Representative',
      viewDetails: 'View Details',
      close: 'Close',
      submit: 'Submit',
      cancel: 'Cancel',
      back: 'Back',
      next: 'Next'
    },
    alerts: {
      securityWarning: 'Security Warning',
      useVPN: 'For your safety, we recommend using a VPN or Tor browser.',
      inChina: 'If you are in China, please use extreme caution.',
      emergency: 'Emergency Contact',
      reportIncident: 'Report Incident'
    },
    prisoners: {
      title: 'Political Prisoners Database',
      detained: 'Detained',
      imprisoned: 'Imprisoned',
      disappeared: 'Disappeared',
      released: 'Released',
      deceased: 'Deceased',
      healthConcerns: 'Health Concerns',
      tortureDocumented: 'Torture Documented'
    }
  },
  'zh-CN': {
    name: '简体中文',
    flag: '🇨🇳',
    localeData: zhCNTranslations,
    nav: {
      dashboard: '仪表板',
      intelligence: '情报',
      directory: '目录',
      prisoners: '政治犯',
      threats: '地区威胁',
      takeAction: '采取行动',
      campaigns: '运动',
      community: '社区',
      tactics: '中共策略',
      education: '教育',
      security: '安全',
      resources: '资源'
    },
    common: {
      search: '搜索',
      filter: '筛选',
      all: '全部',
      critical: '紧急',
      high: '高',
      medium: '中',
      low: '低',
      learnMore: '了解更多',
      takeAction: '采取行动',
      share: '分享',
      donate: '捐款',
      signPetition: '签署请愿书',
      contactRep: '联系代表',
      viewDetails: '查看详情',
      close: '关闭',
      submit: '提交',
      cancel: '取消',
      back: '返回',
      next: '下一步'
    },
    alerts: {
      securityWarning: '安全警告',
      useVPN: '为了您的安全，我们建议使用VPN或Tor浏览器。',
      inChina: '如果您在中国，请格外小心。',
      emergency: '紧急联系',
      reportIncident: '报告事件'
    },
    prisoners: {
      title: '政治犯数据库',
      detained: '被拘留',
      imprisoned: '被监禁',
      disappeared: '失踪',
      released: '已释放',
      deceased: '已故',
      healthConcerns: '健康问题',
      tortureDocumented: '有酷刑记录'
    }
  },
  'zh-TW': {
    name: '繁體中文',
    flag: '🇹🇼',
    localeData: zhTWTranslations,
    nav: {
      dashboard: '儀表板',
      intelligence: '情報',
      directory: '目錄',
      prisoners: '政治犯',
      threats: '區域威脅',
      takeAction: '採取行動',
      campaigns: '運動',
      community: '社群',
      tactics: '中共策略',
      education: '教育',
      security: '安全',
      resources: '資源'
    },
    common: {
      search: '搜尋',
      filter: '篩選',
      all: '全部',
      critical: '危急',
      high: '高',
      medium: '中',
      low: '低',
      learnMore: '了解更多',
      takeAction: '採取行動',
      share: '分享',
      donate: '捐款',
      signPetition: '簽署請願書',
      contactRep: '聯繫代表',
      viewDetails: '查看詳情',
      close: '關閉',
      submit: '提交',
      cancel: '取消',
      back: '返回',
      next: '下一步'
    },
    alerts: {
      securityWarning: '安全警告',
      useVPN: '為了您的安全，我們建議使用VPN或Tor瀏覽器。',
      inChina: '如果您在中國，請格外小心。',
      emergency: '緊急聯繫',
      reportIncident: '報告事件'
    },
    prisoners: {
      title: '政治犯資料庫',
      detained: '被拘留',
      imprisoned: '被監禁',
      disappeared: '失蹤',
      released: '已釋放',
      deceased: '已故',
      healthConcerns: '健康問題',
      tortureDocumented: '有酷刑記錄'
    }
  },
  vi: {
    name: 'Tiếng Việt',
    flag: '🇻🇳',
    localeData: viTranslations,
    nav: {
      dashboard: 'Bảng điều khiển',
      intelligence: 'Tin tức',
      directory: 'Danh mục',
      prisoners: 'Tù nhân chính trị',
      threats: 'Mối đe dọa khu vực',
      takeAction: 'Hành động',
      campaigns: 'Chiến dịch',
      community: 'Cộng đồng',
      tactics: 'Chiến thuật ĐCSTQ',
      education: 'Giáo dục',
      security: 'An ninh',
      resources: 'Tài nguyên'
    },
    common: {
      search: 'Tìm kiếm',
      filter: 'Lọc',
      all: 'Tất cả',
      critical: 'Nghiêm trọng',
      high: 'Cao',
      medium: 'Trung bình',
      low: 'Thấp',
      learnMore: 'Tìm hiểu thêm',
      takeAction: 'Hành động',
      share: 'Chia sẻ',
      donate: 'Quyên góp',
      signPetition: 'Ký kiến nghị',
      contactRep: 'Liên hệ đại diện',
      viewDetails: 'Xem chi tiết',
      close: 'Đóng',
      submit: 'Gửi',
      cancel: 'Hủy',
      back: 'Quay lại',
      next: 'Tiếp theo'
    },
    alerts: {
      securityWarning: 'Cảnh báo an ninh',
      useVPN: 'Vì an toàn của bạn, hãy sử dụng VPN hoặc Tor.',
      inChina: 'Nếu bạn ở Trung Quốc, hãy cực kỳ cẩn thận.',
      emergency: 'Liên hệ khẩn cấp',
      reportIncident: 'Báo cáo sự cố'
    },
    prisoners: {
      title: 'Cơ sở dữ liệu Tù nhân Chính trị',
      detained: 'Đang bị giam',
      imprisoned: 'Bị cầm tù',
      disappeared: 'Mất tích',
      released: 'Đã được thả',
      deceased: 'Đã qua đời',
      healthConcerns: 'Lo ngại sức khỏe',
      tortureDocumented: 'Có ghi nhận tra tấn'
    }
  },
  ko: {
    name: '한국어',
    flag: '🇰🇷',
    localeData: koTranslations,
    nav: {
      dashboard: '대시보드',
      intelligence: '정보',
      directory: '디렉터리',
      prisoners: '정치범',
      threats: '지역 위협',
      takeAction: '행동하기',
      campaigns: '캠페인',
      community: '커뮤니티',
      tactics: '중국공산당 전술',
      education: '교육',
      security: '보안',
      resources: '자료'
    },
    common: {
      search: '검색',
      filter: '필터',
      all: '전체',
      critical: '심각',
      high: '높음',
      medium: '보통',
      low: '낮음',
      learnMore: '더 알아보기',
      takeAction: '행동하기',
      share: '공유',
      donate: '기부',
      signPetition: '청원 서명',
      contactRep: '대표자 연락',
      viewDetails: '상세 보기',
      close: '닫기',
      submit: '제출',
      cancel: '취소',
      back: '뒤로',
      next: '다음'
    },
    alerts: {
      securityWarning: '보안 경고',
      useVPN: '안전을 위해 VPN 또는 Tor를 사용하세요.',
      inChina: '중국에 계시다면 각별히 주의하세요.',
      emergency: '긴급 연락처',
      reportIncident: '사건 보고'
    },
    prisoners: {
      title: '정치범 데이터베이스',
      detained: '구금 중',
      imprisoned: '수감 중',
      disappeared: '실종',
      released: '석방됨',
      deceased: '사망',
      healthConcerns: '건강 우려',
      tortureDocumented: '고문 기록'
    }
  },
  ja: {
    name: '日本語',
    flag: '🇯🇵',
    localeData: jaTranslations,
    nav: {
      dashboard: 'ダッシュボード',
      intelligence: 'インテリジェンス',
      directory: 'ディレクトリ',
      prisoners: '政治犯',
      threats: '地域の脅威',
      takeAction: '行動する',
      campaigns: 'キャンペーン',
      community: 'コミュニティ',
      tactics: '中共の戦術',
      education: '教育',
      security: 'セキュリティ',
      resources: 'リソース'
    },
    common: {
      search: '検索',
      filter: 'フィルター',
      all: 'すべて',
      critical: '重大',
      high: '高',
      medium: '中',
      low: '低',
      learnMore: '詳しく見る',
      takeAction: '行動する',
      share: '共有',
      donate: '寄付',
      signPetition: '署名する',
      contactRep: '代表者に連絡',
      viewDetails: '詳細を見る',
      close: '閉じる',
      submit: '送信',
      cancel: 'キャンセル',
      back: '戻る',
      next: '次へ'
    },
    alerts: {
      securityWarning: 'セキュリティ警告',
      useVPN: '安全のため、VPNまたはTorをご使用ください。',
      inChina: '中国にいる場合は、十分にご注意ください。',
      emergency: '緊急連絡先',
      reportIncident: 'インシデント報告'
    },
    prisoners: {
      title: '政治犯データベース',
      detained: '拘束中',
      imprisoned: '投獄中',
      disappeared: '行方不明',
      released: '釈放済み',
      deceased: '死亡',
      healthConcerns: '健康上の懸念',
      tortureDocumented: '拷問の記録'
    }
  },
  ug: {
    name: 'ئۇيغۇرچە',
    FlagIcon: EastTurkestanFlag,
    rtl: true,
    localeData: ugTranslations,
    nav: {
      dashboard: 'باشقۇرۇش تاختىسى',
      intelligence: 'ئىستخبارات',
      directory: 'مۇندەرىجە',
      prisoners: 'سىياسىي مەھبۇسلار',
      threats: 'رايونلۇق تەھدىدلەر',
      takeAction: 'ھەرىكەت قىلىڭ',
      campaigns: 'پائالىيەتلەر',
      community: 'جامائەت',
      tactics: 'جۇڭگو كومۇنىستىك پارتىيىسى تاكتىكىسى',
      education: 'مائارىف',
      security: 'بىخەتەرلىك',
      resources: 'مەنبەلەر'
    },
    common: {
      search: 'ئىزدەش',
      filter: 'سۈزگۈچ',
      all: 'ھەممىسى',
      critical: 'ھالقىلىق',
      high: 'يۇقىرى',
      medium: 'ئوتتۇرا',
      low: 'تۆۋەن',
      learnMore: 'تەپسىلاتى',
      takeAction: 'ھەرىكەت قىلىڭ',
      share: 'ھەمبەھىرلەش',
      donate: 'ئىئانە',
      signPetition: 'ئىمزا قويۇش',
      contactRep: 'ۋەكىل بىلەن ئالاقىلىشىش',
      viewDetails: 'تەپسىلاتىنى كۆرۈش',
      close: 'تاقاش',
      submit: 'يوللاش',
      cancel: 'بىكار قىلىش',
      back: 'قايتىش',
      next: 'كېيىنكى'
    },
    alerts: {
      securityWarning: 'بىخەتەرلىك ئاگاھلاندۇرۇشى',
      useVPN: 'بىخەتەرلىكىڭىز ئۈچۈن VPN ياكى Tor تور كۆرگۈچ ئىشلىتىشنى تەۋسىيە قىلىمىز.',
      inChina: 'ئەگەر جۇڭگودا بولسىڭىز، ئىنتايىن ئېھتىيات قىلىڭ.',
      emergency: 'جىددىي ئالاقە',
      reportIncident: 'ۋەقەنى دوكلات قىلىش'
    },
    prisoners: {
      title: 'سىياسىي مەھبۇسلار ساندانى',
      detained: 'توتۇلغان',
      imprisoned: 'قاماقتا',
      disappeared: 'غايىب بولغان',
      released: 'قويۇپ بېرىلگەن',
      deceased: 'ۋاپات بولغان',
      healthConcerns: 'ساغلاملىق مەسىلىسى',
      tortureDocumented: 'قىيىنچىلىق خاتىرىسى'
    }
  },
  bo: {
    name: 'བོད་སྐད།',
    FlagIcon: TibetanFlag,
    localeData: boTranslations,
    nav: {
      dashboard: 'ལས་ཁུངས།',
      intelligence: 'གསང་བའི་གནས་ཚུལ།',
      directory: 'དཀར་ཆག',
      prisoners: 'ཆབ་སྲིད་བཙོན་པ།',
      threats: 'ས་ཁུལ་གྱི་ཉེན་ཁ།',
      takeAction: 'ལས་འགུལ་སྤེལ།',
      campaigns: 'ལས་འགུལ།',
      community: 'སྤྱི་ཚོགས།',
      tactics: 'རྒྱ་ནག་གུང་ཁྲན་ཏང་གི་ཐབས་ལམ།',
      education: 'སློབ་གསོ།',
      security: 'བདེ་འཇགས།',
      resources: 'ཐོན་ཁུངས།'
    },
    common: {
      search: 'འཚོལ།',
      filter: 'གཙང་སྦྲ།',
      all: 'ཚང་མ།',
      critical: 'གལ་ཆེ།',
      high: 'མཐོ།',
      medium: 'འབྲིང་།',
      low: 'དམའ།',
      learnMore: 'ཆ་ཤེས་མང་བ།',
      takeAction: 'ལས་འགུལ་སྤེལ།',
      share: 'མཉམ་སྤྱོད།',
      donate: 'སྦྱིན་བདག',
      signPetition: 'མིང་རྟགས་བཀོད།',
      contactRep: 'འཐུས་མི་དང་འབྲེལ་བ།',
      viewDetails: 'ཞིབ་ཕྲ་ལྟ།',
      close: 'སྒོ་རྒྱག',
      submit: 'འབུལ།',
      cancel: 'དོར།',
      back: 'ཕྱིར་ལོག',
      next: 'རྗེས་མ།'
    },
    alerts: {
      securityWarning: 'བདེ་འཇགས་ཉེན་བརྡ།',
      useVPN: 'ཁྱེད་ཀྱི་བདེ་འཇགས་ཆེད་དུ། VPN ཡང་ན་ Tor བཀོལ་སྤྱོད་བྱེད་པར་འོས་སྦྱོར་ཞུ།',
      inChina: 'ཁྱེད་རྒྱ་ནག་ཏུ་ཡོད་ན། ཧ་ཅང་གཟབ་ནན་བྱེད་དགོས།',
      emergency: 'ཛ་དྲག་འབྲེལ་བ།',
      reportIncident: 'དོན་རྐྱེན་སྙན་སེང་།'
    },
    prisoners: {
      title: 'ཆབ་སྲིད་བཙོན་པའི་གཞི་གྲངས།',
      detained: 'འཛིན་བཟུང་།',
      imprisoned: 'བཙོན་འཇུག',
      disappeared: 'བརླག་པ།',
      released: 'གློད་བཀྲོལ།',
      deceased: 'འདས་གྲོངས།',
      healthConcerns: 'བདེ་ཐང་གི་དཀའ་ངལ།',
      tortureDocumented: 'མནར་གཅོད་ཀྱི་ཡིག་ཆ།'
    }
  }
};

// Create a context for language
export const LanguageContext = React.createContext<LanguageState>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
  translations: translations.en
});

/**
 * Hook to access the current language state and translation function.
 */
export const useLanguage = (): LanguageState => React.useContext(LanguageContext);
