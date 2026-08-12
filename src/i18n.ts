import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

/**
 * UI chrome strings. Content itself (about, history, stories…) comes from the
 * CMS in all three languages — these are only the interface labels.
 * Tigrinya/Amharic labels use common web conventions; flagged for native review.
 */
const resources = {
  en: {
    translation: {
      nav: { story: 'Our Story', work: 'What We Do', projects: 'Projects', stories: 'Stories', involved: 'Get Involved', contact: 'Contact', donate: 'Donate' },
      hero: {
        kicker: 'Relief Society of Tigray · est. 1978',
        title1: 'The land remembers',
        title2: 'every hand that worked it.',
        sub: 'For 48 years REST has held a region together — famine relief, terraces, water, credit, and care, built with the people of Tigray.',
        cta: 'See the work',
        scroll: 'Descend',
      },
      home: {
        introKick: 'From the land',
        introTitle: 'Endurance, engineered.',
        introBody1: 'Tigray answered erosion with terraces — horizontal lines of stone that slow water until it feeds the soil instead of stripping it. REST does the same, institutionally: it builds structures that turn crisis into continuity.',
        introBody2: 'Founded in May 1978 in the middle of famine and war, REST ran cross-border relief through Sudan, became the first local NGO in Ethiopia to receive USAID grants, and seeded what is now one of Africa’s largest microfinance institutions.',
        numbersLabel: 'The record',
        servicesLabel: 'Three lines of work',
        storiesLabel: 'From the field',
        storiesTitle: 'Names, not numbers.',
        partnersLabel: 'The confluence',
        partnersTitle: 'Thirty partners, one work.',
        partnersBody: 'From the World Food Programme to village water committees — everyone who builds alongside REST, named properly.',
        ctaTitle: 'From the land, to life.',
        ctaBody: 'Forty-eight years of holding a region together. Join the work.',
        readStory: 'Read the story',
        allStories: 'All stories',
      },
      involved: { give: 'Give', tiers: 'Choose your terrace' },
      misc: { readMore: 'Read more', back: 'Back', loading: 'Loading', est: 'est. 1978', elevation: 'Elevation' },
      footer: {
        tag: 'Relief Society of Tigray — development and humanitarian work with the people of Tigray since 1978.',
        quick: 'Paths', reach: 'Reach us', follow: 'Follow',
        rights: 'REST · Relief Society of Tigray',
        credit: 'Rebuilt from the land up',
      },
    },
  },
  ti: {
    translation: {
      nav: { story: 'ዛንታና', work: 'ስራሕና', projects: 'ፕሮጀክትታት', stories: 'ዛንታታት', involved: 'ተሳተፉ', contact: 'ርኸቡና', donate: 'ወፈያ' },
      hero: {
        kicker: 'ማሕበር ረድኤት ትግራይ · 1978',
        title1: 'እታ መሬት ትዝክር',
        title2: 'ንዝሰርሓ ኢድ ኩሉ።',
        sub: 'ን48 ዓመታት፡ ማሕበር ረድኤት ትግራይ ምስ ህዝቢ ትግራይ ኮይኑ — ረድኤት፡ ልምዓት፡ ማይን ተስፋን ሃኒጹ።',
        cta: 'ስራሕና ርኣዩ',
        scroll: 'ውረዱ',
      },
      home: {
        introKick: 'ካብ ምድሪ',
        introTitle: 'ጽንዓት፡ ብስራሕ።',
        introBody1: 'ትግራይ ንድርቂ ብመደረባት መሊሳቶ — ማይ ንመሬት ከይሓጽብ ዝዓግቱ መስመራት እምኒ። ማሕበር ረድኤት ትግራይ ከምኡ እዩ ዝሰርሕ፡ ቅልውላው ናብ ቀጻልነት ዝቕይሩ መዋቕራት ይሃንጽ።',
        introBody2: 'ብግንቦት 1978 ኣብ ማእከል ጥምየትን ኲናትን ዝተመስረተ፡ REST ብሱዳን ኣቢሉ ረድኤት ኣብጺሑ፡ ካብ USAID ሓገዝ ዝረኸበ ቀዳማይ ሃገራዊ ትካል ኮይኑ።',
        numbersLabel: 'መዝገብ',
        servicesLabel: 'ሰለስተ መስመራት ስራሕ',
        storiesLabel: 'ካብ ዓውዲ',
        storiesTitle: 'ኣስማት እምበር ቁጽርታት ኣይኮኑን።',
        partnersLabel: 'ምትእኽኻብ',
        partnersTitle: '30 መሻርኽቲ፡ ሓደ ስራሕ።',
        partnersBody: 'ካብ WFP ን UNICEF ክሳብ ኮሚቴታት ማይ ዓድታት — ኩሉ ምትሕብባር ናብ ሓደ ስራሕ ይውሕዝ።',
        ctaTitle: 'ካብ ምድሪ፡ ናብ ህይወት።',
        ctaBody: 'ን48 ዓመታት ንዞባ ሓቚፉ ዝጸንሐ ስራሕ። ተጸምበሩ።',
        readStory: 'ዛንታ ኣንብቡ',
        allStories: 'ኩሎም ዛንታታት',
      },
      involved: { give: 'ለግሱ', tiers: 'መደረብኩም ምረጹ' },
      misc: { readMore: 'ተወሳኺ', back: 'ተመለሱ', loading: 'ይጽዓን', est: '1978', elevation: 'ብራኸ' },
      footer: {
        tag: 'ማሕበር ረድኤት ትግራይ — ካብ 1978 ጀሚሩ ምስ ህዝቢ ትግራይ ዝሰርሕ።',
        quick: 'መንገድታት', reach: 'ርኸቡና', follow: 'ተኸታተሉና',
        rights: 'ማሕበር ረድኤት ትግራይ',
        credit: 'ካብ ምድሪ ተሃኒጹ',
      },
    },
  },
  am: {
    translation: {
      nav: { story: 'ታሪካችን', work: 'ሥራችን', projects: 'ፕሮጀክቶች', stories: 'ታሪኮች', involved: 'ይሳተፉ', contact: 'ያግኙን', donate: 'ለግሱ' },
      hero: {
        kicker: 'የትግራይ እርዳታ ማህበር · 1978',
        title1: 'መሬቷ ታስታውሳለች',
        title2: 'የሠራችላትን እጅ ሁሉ።',
        sub: 'ለ48 ዓመታት REST ከትግራይ ሕዝብ ጋር — እርዳታ፣ ልማት፣ ውሃ እና ተስፋ ገንብቷል።',
        cta: 'ሥራችንን ይመልከቱ',
        scroll: 'ይውረዱ',
      },
      home: {
        introKick: 'ከመሬት',
        introTitle: 'ጽናት፣ በሥራ።',
        introBody1: 'ትግራይ ለአፈር መሸርሸር በእርከን መለሰች — ውሃን አዝግመው አፈሩን የሚመግቡ የድንጋይ መስመሮች። REST በተቋም ደረጃ ይህንኑ ይሠራል፡ ቀውስን ወደ ቀጣይነት የሚቀይሩ መዋቅሮችን ይገነባል።',
        introBody2: 'በግንቦት 1978 በረሃብና በጦርነት መካከል የተመሠረተው REST፣ በሱዳን በኩል እርዳታ አድርሷል፣ ከUSAID ድጋፍ ያገኘ የመጀመሪያው አገር በቀል ድርጅት ሆኗል።',
        numbersLabel: 'መዝገቡ',
        servicesLabel: 'ሦስት የሥራ መስመሮች',
        storiesLabel: 'ከመስክ',
        storiesTitle: 'ስሞች እንጂ ቁጥሮች አይደሉም።',
        partnersLabel: 'መገናኛው',
        partnersTitle: '30 አጋሮች፣ አንድ ሥራ።',
        partnersBody: 'ከWFP እና UNICEF እስከ የመንደር የውሃ ኮሚቴዎች — እያንዳንዱ አጋርነት ወደ አንድ ሥራ ይፈስሳል።',
        ctaTitle: 'ከመሬት፣ ወደ ሕይወት።',
        ctaBody: 'ለ48 ዓመታት ክልልን አጽንቶ የቆየ ሥራ። ይቀላቀሉ።',
        readStory: 'ታሪኩን ያንብቡ',
        allStories: 'ሁሉም ታሪኮች',
      },
      involved: { give: 'ለግሱ', tiers: 'እርከንዎን ይምረጡ' },
      misc: { readMore: 'ተጨማሪ', back: 'ተመለስ', loading: 'በመጫን ላይ', est: '1978', elevation: 'ከፍታ' },
      footer: {
        tag: 'የትግራይ እርዳታ ማህበር — ከ1978 ጀምሮ ከትግራይ ሕዝብ ጋር።',
        quick: 'መንገዶች', reach: 'ያግኙን', follow: 'ይከተሉን',
        rights: 'የትግራይ እርዳታ ማህበር',
        credit: 'ከመሬት ተገንብቷል',
      },
    },
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
