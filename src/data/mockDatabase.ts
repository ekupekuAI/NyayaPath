import { Case, CaseEvent, Order, AIExplanation, User } from '../types';

export const DEMO_USERS: User[] = [
  {
    id: 'user-staff-01',
    role: 'staff',
    email: 'staff@nyayapath.demo',
    name: 'K. Sridevi',
    designation: 'Bench Clerk / Reader, Court Hall 4'
  },
  {
    id: 'user-citizen-01',
    role: 'citizen',
    email: 'ravi.mehta.citizen@demo.org',
    name: 'Ravi Mehta',
    designation: 'Petitioner / Litigant'
  }
];

export const DEMO_CASES: Case[] = [
  {
    id: 'case-cs-184-2024',
    cnr: 'DEMO-CNR-HYD-184-2024',
    caseNumber: 'DEMO-CIV-184-2024',
    caseType: 'Original Civil Suit (OS)',
    court: 'Demo District Court, Hyderabad',
    district: 'Hyderabad',
    state: 'Telangana',
    filingDate: '15 January 2024',
    status: 'Active',
    nextHearingDate: '14 September 2026',
    petitioner: 'Ravi Mehta (Fictional Party)',
    petitionerAdvocate: 'Adv. S. K. Venkatraman',
    respondent: 'Anita Sharma (Fictional Party)',
    respondentAdvocate: 'Adv. P. Radhakrishnan',
    actSection: 'Specific Relief Act, Sec 34 & 38; Code of Civil Procedure Sec 9',
    subject: 'Commercial Contract & Specific Performance (Value: INR 12,50,000)'
  },
  {
    id: 'case-rc-92-2024',
    cnr: 'MHMB020088192024',
    caseNumber: 'Rent Suit 92/2024',
    caseType: 'Civil Misc Appeal (CMA)',
    court: 'Demo Small Causes Court, Mumbai',
    district: 'Mumbai City',
    state: 'Maharashtra',
    filingDate: '03 March 2024',
    status: 'Active',
    nextHearingDate: '22 October 2026',
    petitioner: 'Sunil Gokhale (Fictional Party)',
    petitionerAdvocate: 'Adv. M. Deshmukh',
    respondent: 'Meera Kulkarni (Fictional Party)',
    respondentAdvocate: 'Adv. A. Joshi',
    actSection: 'Maharashtra Rent Control Act, 1999 Sec 16(1)(g)',
    subject: 'Eviction petition on bona fide requirement of commercial shop premises'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'order-184-01',
    caseId: 'case-cs-184-2024',
    orderDate: '28 August 2026',
    title: 'Daily Order Sheet - Oral Arguments & Direction for Written Submissions',
    orderType: 'Order Sheet',
    judgeName: 'Hon\'ble Presiding Officer, Bench-IV',
    totalPages: 2,
    officialText: `IN THE COURT OF THE PRINCIPAL DISTRICT & SESSIONS JUDGE (DEMO BENCH-IV), HYDERABAD
CNR: DEMO-CNR-HYD-184-2024 | CIVIL SUIT NO. 184 OF 2024

Ravi Mehta ... Plaintiff / Petitioner
Versus
Anita Sharma ... Defendant / Respondent

CORAM: Sri D. R. Nageshwar Rao, Presiding Officer

ORDER DATED 28.08.2026:
Case called out. Both learned counsels present.
1. Heard the learned counsel for the plaintiff at length on the issue of ownership title documents marked as Ex. A-1 to A-7.
2. Learned counsel for the respondent/defendant submitted that due to bereavement in the senior counsel's office, written submissions could not be finalized today and prays for a short adjournment of two weeks to place on record concise written arguments along with relevant citations.
3. Learned counsel for the plaintiff has no serious objection subject to fixing an early date for concluding arguments.
4. In view of the above, request of respondent counsel is acceded to. Respondent is directed to serve an advance copy of written submissions to the plaintiff counsel by or before 08.09.2026.
5. Matter is posted for final oral arguments and conclusion of hearing on 14.09.2026.

(D.R. Nageshwar Rao)
Presiding Officer, Bench-IV`
  },
  {
    id: 'order-184-02',
    caseId: 'case-cs-184-2024',
    orderDate: '04 March 2025',
    title: 'Interim Order on Marking of Documentary Evidence',
    orderType: 'Interim Order',
    judgeName: 'Hon\'ble Presiding Officer, Bench-IV',
    totalPages: 1,
    officialText: `CIVIL SUIT NO. 184 OF 2024
ORDER DATED 04.03.2025:
PW-1 present and cross-examined in full. Exhibits A-1 to A-7 marked without objection on mode of proof. Plaintiff side evidence closed. Defendant seeks date for leading evidence (DW-1). Relisted on 22.04.2025 for defendant evidence.`
  },
  {
    id: 'order-184-03',
    caseId: 'case-cs-184-2024',
    orderDate: '15 June 2024',
    title: 'Framing of Issues under Order XIV CPC',
    orderType: 'Directions',
    judgeName: 'Hon\'ble Presiding Officer, Bench-IV',
    totalPages: 2,
    officialText: `CIVIL SUIT NO. 184 OF 2024
ORDER DATED 15.06.2024:
Pleadings perused. Issues framed under Order XIV Rule 1 CPC:
1. Whether the plaintiff proves lawful title over the suit schedule property?
2. Whether the defendant proves permissive possession as tenant?
3. Whether the plaintiff is entitled to the decree of permanent injunction as prayed for?
4. What relief?
List on 12.11.2024 for Plaintiff Evidence (Affidavit in lieu of Examination-in-Chief).`
  }
];

export const INITIAL_EVENTS: CaseEvent[] = [
  {
    id: 'evt-184-01',
    caseId: 'case-cs-184-2024',
    eventDate: '15 January 2024',
    eventType: 'Case Filing',
    officialText: 'Plaint presented before registry along with vakalatnama, court fee and original documents. Scrutiny initiated.',
    status: 'Published',
    createdBy: 'System Registry',
    publishedAt: '15 Jan 2024, 04:30 PM',
    nextHearingDate: '22 January 2024'
  },
  {
    id: 'evt-184-02',
    caseId: 'case-cs-184-2024',
    eventDate: '22 January 2024',
    eventType: 'Case Registration',
    officialText: 'Objections complied with. Case registered as OS/184/2024. Summons ordered to defendant returnable by 10 April 2024.',
    status: 'Published',
    createdBy: 'Court Clerical Office',
    publishedAt: '22 Jan 2024, 05:15 PM',
    nextHearingDate: '10 April 2024'
  },
  {
    id: 'evt-184-03',
    caseId: 'case-cs-184-2024',
    eventDate: '10 April 2024',
    eventType: 'Written Statement Filed',
    officialText: 'Vakalatnama and Written Statement on behalf of Defendant filed. Copy served to Plaintiff. Listed for Framing of Issues.',
    status: 'Published',
    createdBy: 'Bench Clerk',
    publishedAt: '10 Apr 2024, 03:00 PM',
    nextHearingDate: '15 June 2024'
  },
  {
    id: 'evt-184-04',
    caseId: 'case-cs-184-2024',
    eventDate: '15 June 2024',
    eventType: 'Issues Framed',
    officialText: 'Pleadings perused. 4 issues framed. Matter posted for Plaintiff Evidence.',
    status: 'Published',
    createdBy: 'Bench Clerk',
    publishedAt: '15 Jun 2024, 04:10 PM',
    nextHearingDate: '12 November 2024',
    relatedOrderId: 'order-184-03'
  },
  {
    id: 'evt-184-05',
    caseId: 'case-cs-184-2024',
    eventDate: '12 November 2024',
    eventType: 'Evidence Hearing',
    officialText: 'PW-1 chief examination affidavit filed. Documents marked. Cross-examination partly recorded. Adjourned for further cross.',
    status: 'Published',
    createdBy: 'Bench Clerk',
    publishedAt: '12 Nov 2024, 04:45 PM',
    nextHearingDate: '04 March 2025'
  },
  {
    id: 'evt-184-06',
    caseId: 'case-cs-184-2024',
    eventDate: '04 March 2025',
    eventType: 'Evidence Hearing',
    officialText: 'Cross-examination of PW-1 completed. Plaintiff evidence closed. Defendant evidence recorded. Evidence closed. Listed for oral arguments.',
    status: 'Published',
    createdBy: 'Bench Clerk',
    publishedAt: '04 Mar 2025, 05:00 PM',
    nextHearingDate: '28 August 2026',
    relatedOrderId: 'order-184-02'
  },
  {
    id: 'evt-184-07',
    caseId: 'case-cs-184-2024',
    eventDate: '28 August 2026',
    eventType: 'Oral Arguments',
    officialText: 'Arguments heard. Counsel for respondent seeks time for filing written submissions. Matter posted for final arguments.',
    status: 'Published',
    createdBy: 'K. Sridevi (Court Staff)',
    publishedAt: '28 Aug 2026, 03:45 PM',
    nextHearingDate: '14 September 2026',
    relatedOrderId: 'order-184-01'
  }
];

export const PRECOMPUTED_EXPLANATIONS: Record<string, AIExplanation> = {
  'evt-184-07': {
    id: 'exp-184-07',
    eventId: 'evt-184-07',
    summary: 'The court heard arguments today, but gave the opposing lawyer extra time to submit written papers before making the final decision.',
    what_happened: 'The court hearing took place as scheduled. The judge listened to the arguments, but the case was not finally decided today.',
    what_it_means: 'The respondent\'s (Anita Sharma\'s) lawyer requested additional time from the judge to submit their written arguments and legal citations in writing.',
    what_happens_next: 'The judge granted the time request. The matter has been scheduled for final oral arguments on 14 September 2026.',
    action_required: 'The available case information does not specify an action required from you.',
    important_date: '14 September 2026 (Final Arguments)',
    confidence_note: 'High confidence based strictly on Bench-IV order record dated 28 Aug 2026.',
    disclaimer: 'This is a plain-language explanation of the supplied case information, not legal advice.'
  },
  'evt-184-06': {
    id: 'exp-184-06',
    eventId: 'evt-184-06',
    summary: 'All witness questioning and evidence submissions have finished. The case has moved to the final argument phase.',
    what_happened: 'The questioning (cross-examination) of witnesses was completed and both sides have finished presenting their evidence.',
    what_it_means: 'The evidence stage of the lawsuit is now officially over. Neither side will present new witness testimony.',
    what_happens_next: 'Both lawyers will present their legal arguments to the judge based on the submitted evidence.',
    action_required: 'The available case information does not specify an action required from you.',
    important_date: '28 August 2026 (Arguments Hearing)',
    confidence_note: 'Verified from evidentiary closing record dated 04 Mar 2025.',
    disclaimer: 'This is a plain-language explanation of the supplied case information, not legal advice.'
  },
  'evt-184-04': {
    id: 'exp-184-04',
    eventId: 'evt-184-04',
    summary: 'The court outlined the key legal and factual questions (issues) that need to be decided in this case.',
    what_happened: 'The judge reviewed both parties\' written statements and finalized 4 formal legal questions (issues) for trial.',
    what_it_means: 'These questions define exactly what each party needs to prove with documents and witness statements.',
    what_happens_next: 'The petitioner (plaintiff) will be called to present witness affidavits and documents in evidence.',
    action_required: 'The available case information does not specify an action required from you.',
    important_date: '12 November 2024 (Plaintiff Evidence Date)',
    confidence_note: 'Grounded in Order XIV CPC issue framing sheet.',
    disclaimer: 'This is a plain-language explanation of the supplied case information, not legal advice.'
  }
};

export const MULTILINGUAL_TRANSLATIONS: Record<string, Record<string, {
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  viewDemoCase: string;
  searchPlaceholder: string;
  searchButton: string;
  recentUpdate: string;
  whatHappenedTitle: string;
  whatItMeansTitle: string;
  whatNextTitle: string;
  actionTitle: string;
  importantDateTitle: string;
  officialRecordTitle: string;
  explainedForYouTitle: string;
  disclaimerText: string;
}>> = {
  hi: {
    'general': {
      tagline: 'अपने केस को समझें। अगला कदम जानें।',
      heroHeadline: 'आपका केस। अब समझना हुआ आसान।',
      heroSubheadline: 'कोर्ट की कठिन कानूनी भाषा और तारीखों को सरल नागरिक भाषा, समय-सीमा और स्पष्ट अगले कदम में बदलें।',
      viewDemoCase: 'डेमो केस देखें (Civil Suit 184/2024)',
      searchPlaceholder: 'CNR नंबर दर्ज करें (उदा. TSHY010045232024)',
      searchButton: 'केस खोजें',
      recentUpdate: 'ताज़ा अपडेट',
      whatHappenedTitle: 'क्या हुआ?',
      whatItMeansTitle: 'इसका क्या मतलब है?',
      whatNextTitle: 'आगे क्या होगा?',
      actionTitle: 'क्या आपको कुछ करना है?',
      importantDateTitle: 'ज़रूरी तारीख',
      officialRecordTitle: 'सेक्शन A: आधिकारिक कोर्ट रिकॉर्ड',
      explainedForYouTitle: 'सेक्शन B: आपके लिए सरल भाषा में व्याख्या',
      disclaimerText: 'यह केवल प्रदान की गई केस जानकारी की सरल व्याख्या है, कानूनी सलाह नहीं।'
    }
  },
  te: {
    'general': {
      tagline: 'మీ కేసును అర్థం చేసుకోండి. మీ తదుపరి దశను తెలుసుకోండి.',
      heroHeadline: 'మీ కోర్టు కేసు. ఇప్పుడు సులభంగా అర్థమవుతుంది.',
      heroSubheadline: 'కోర్టు సంక్లిష్ట ఆదేశాలను సాధారణ పౌర భాషలో, ముఖ్యమైన తేదీలు మరియు తదుపరి చర్యలతో సులభంగా తెలుసుకోండి.',
      viewDemoCase: 'డెమో కేసు చూడండి (Civil Suit 184/2024)',
      searchPlaceholder: 'CNR నంబర్ నమోదు చేయండి (ఉదా. TSHY010045232024)',
      searchButton: 'కేసు శోధించండి',
      recentUpdate: 'ఇటీవలి నవీకరణ',
      whatHappenedTitle: 'ఏమి జరిగింది?',
      whatItMeansTitle: 'దీని అర్థం ఏమిటి?',
      whatNextTitle: 'తరువాత ఏమి జరుగుతుంది?',
      actionTitle: 'మీరు ఏదైనా చేయాలా?',
      importantDateTitle: 'ముఖ్యమైన తేదీ',
      officialRecordTitle: 'విభాగం A: అధికారిక కోర్టు రికార్డు',
      explainedForYouTitle: 'విభాగం B: మీ కోసం సులభమైన వివరణ',
      disclaimerText: 'ఇది అందించిన కేసు సమాచారం యొక్క సాధారణ భాషా వివరణ మాత్రమే, న్యాయ సలహా కాదు.'
    }
  },
  ta: {
    'general': {
      tagline: 'உங்கள் வழக்கை புரிந்து கொள்ளுங்கள். உங்கள் அடுத்த படியை அறியுங்கள்.',
      heroHeadline: 'உங்கள் நீதிமன்ற வழக்கு. இப்போது எளிதாக புரியும்.',
      heroSubheadline: 'நீதிமன்ற சட்டப்பூர்வ உத்தரவுகளை எளிய தமிழில், முக்கிய தேதிகள் மற்றும் அடுத்த நடவடிக்கைகளுடன் அறியவும்.',
      viewDemoCase: 'மாதிரி வழக்கை காண்க (Civil Suit 184/2024)',
      searchPlaceholder: 'CNR எண்ணை உள்ளிடவும் (எ.கா. TSHY010045232024)',
      searchButton: 'வழக்கு தேடுங்கள்',
      recentUpdate: 'சமீபத்திய புதுப்பிப்பு',
      whatHappenedTitle: 'என்ன நடந்தது?',
      whatItMeansTitle: 'இதன் பொருள் என்ன?',
      whatNextTitle: 'அடுத்து என்ன நடக்கும்?',
      actionTitle: 'நீங்கள் ஏதேனும் செய்ய வேண்டுமா?',
      importantDateTitle: 'முக்கியமான தேதி',
      officialRecordTitle: 'பிரிவு A: அதிகாரப்பூர்வ நீதிமன்ற பதிவு',
      explainedForYouTitle: 'பிரிவு B: உங்களுக்கான எளிய விளக்கம்',
      disclaimerText: 'இது வழங்கப்பட்ட வழக்கின் எளிய விளக்கம் மட்டுமே, சட்ட ஆலோசனை அல்ல.'
    }
  },
  mr: {
    'general': {
      tagline: 'तुमची केस समजून घ्या. पुढचे पाऊल जाणून घ्या.',
      heroHeadline: 'तुमची न्यायालयीन केस. आता समजायला सोपी.',
      heroSubheadline: 'न्यायालयाचे क्लिष्ट कायदेशीर आदेश साध्या भाषेत, महत्त्वाच्या तारखा आणि स्पष्ट पुढच्या कृतीसह समजून घ्या.',
      viewDemoCase: 'डेमो केस पहा (Civil Suit 184/2024)',
      searchPlaceholder: 'CNR नंबर प्रविष्ट करा (उदा. TSHY010045232024)',
      searchButton: 'केस शोधा',
      recentUpdate: 'नवीनतम अपडेट',
      whatHappenedTitle: 'काय घडले?',
      whatItMeansTitle: 'याचा काय अर्थ आहे?',
      whatNextTitle: 'पुढे काय होईल?',
      actionTitle: 'तुम्हाला काही करायचे आहे का?',
      importantDateTitle: 'महत्त्वाची तारीख',
      officialRecordTitle: 'विभाग A: अधिकृत न्यायालयीन नोंद',
      explainedForYouTitle: 'विभाग B: तुमच्यासाठी साध्या भाषेतील स्पष्टीकरण',
      disclaimerText: 'हे केवळ दिलेल्या केस माहितीचे साध्या भाषेतील स्पष्टीकरण आहे, कायदेशीर सल्ला नाही.'
    }
  },
  en: {
    'general': {
      tagline: 'Understand your case. Know your next step.',
      heroHeadline: 'Your case. Finally understandable.',
      heroSubheadline: 'Turn complex court language and procedure into a clean citizen timeline, plain-language explanation, important dates, and a clear next step.',
      viewDemoCase: 'View Demo Case (Civil Suit 184/2024)',
      searchPlaceholder: 'Enter demo CNR or case number (DEMO-CNR-HYD-184-2024)',
      searchButton: 'Search Case',
      recentUpdate: 'Recent Case Update',
      whatHappenedTitle: 'What happened?',
      whatItMeansTitle: 'What does it mean?',
      whatNextTitle: 'What happens next?',
      actionTitle: 'Do you need to act?',
      importantDateTitle: 'Important Date',
      officialRecordTitle: 'SECTION A: Official Court Record',
      explainedForYouTitle: 'SECTION B: Explained for You',
      disclaimerText: 'This is a plain-language explanation of the supplied case information, not legal advice.'
    }
  }
};
