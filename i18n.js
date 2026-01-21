(() => {
  const STORAGE_KEY = 'anka_lang';
  const DEFAULT_LANG = 'en';

  const translations = {
    en: {
      'nav.home': 'Home',
      'nav.about': 'About Us',
      'nav.about_link': 'About Us',
      'nav.legacy': 'ANKA Legacy',
      'nav.news': 'ANKA News',
      'nav.committees': 'Our Committees',
      'nav.contact': 'Contact Us',
      'nav.member': 'Become a Member',
      'nav.login': 'Member Login',
      'nav.myanka': 'MyANKA',
      'nav.admin': 'Admin Panel',
      'nav.profile': 'My Profile',
      'footer.website': 'Website',
      'footer.home': 'Home',
      'footer.about': 'About Us',
      'footer.committees': 'Our Committies',
      'footer.contact': 'Contact Us',
      'footer.member': 'Become a Member',
      'footer.login': 'Member Login',
      'footer.follow': 'Follow Us',
      'footer.documents': 'Documents',
      'footer.articles': 'Articles of Association (TR)',
      'footer.legal': 'Legal',
      'footer.privacy': 'Privacy Policy',
      'footer.terms': 'Terms & Conditions',
      'footer.cookie': 'Cookie Policy',
      'footer.rights': '© 2025 ANKA Website. All rights reserved.',
      'footer_loggedin.title': 'MyANKA',
      'footer_loggedin.home': 'MyANKA Home',
      'footer_loggedin.legal': 'Legal Consultancy',
      'footer_loggedin.talent': 'ANKA Talent Pool',
      'footer_loggedin.committee': 'Committee Application',
      'footer_loggedin.discounts': 'Special Discounts',
      'contact.title': 'Contact Us',
      'contact.intro1': "Do you have further questions that haven't been answered through the FAQ?",
      'contact.intro2': "Feel free to reach out to us anytime through the form below. Without you, we're one person short!",
      'contact.form.name': 'Your Name',
      'contact.form.email': 'Your Email',
      'contact.form.subject': 'Subject',
      'contact.form.message': 'Your Message',
      'contact.form.submit': 'Send Message',
      'contact.info.title': 'Get in Touch',
      'contact.info.location': 'Netherlands',
      'contact_page.title': 'Contact Us',
      'contact_page.intro1': "Have a question, idea or just want to say hello? We'd love to hear from you.",
      'contact_page.intro2': "If you have an idea or project that you believe could make an impact for the ANKA community, feel free to reach out to us anytime. Without you, we're one person short!",
      'contact_page.form.name': 'Your Name',
      'contact_page.form.email': 'Your Email',
      'contact_page.form.subject': 'Subject',
      'contact_page.form.message': 'Your Message',
      'contact_page.form.submit': 'Send Message',
      'contact_page.info.title': 'Get in Touch',
      'contact_page.info.location': 'Netherlands',
      'apply.title': 'Join Us',
      'apply.subtitle': 'Become part of ANKA – where innovation meets collaboration. Fill out the form below to apply!',
      'apply.form.title': 'ANKA Membership Form',
      'login.title': 'Member Login',
      'login.subtitle': "Please enter your username and password given to you by ANKA's HR Committee.",
      'login.username': 'username',
      'login.password': 'password',
      'login.submit': 'Log In',
      'login.home': '🏠 Back to Home Page',
      'about.hero.title': 'About Us',
      'about.hero.subtitle': 'History and Future of ANKA',
      'about.hero.body':
        'ANKA Association was founded in 2025 by ambitious students in Amsterdam to support Turkish and multicultural youth in the Netherlands. What began as a small initiative has grown into a dynamic community focused on mentorship, cultural connection, and professional development. As ANKA builds partnerships and hosts impactful events, it continues to create opportunities for leadership and global-minded growth. Looking forward, ANKA aims to expand across Europe and become a leading voice for student empowerment.',
      'about.board.title': 'ANKA Board',
      'about.board.subtitle': 'ANKA – Board Members',
      'about.board.chair.role': 'ANKA Board Chair',
      'about.board.members_title': 'Board Members',
      'about.board.member1.role': 'Academic and Post-Admission Support Committee Chair',
      'about.board.member2.role': 'Entrepreneurship and Business Committee Chair',
      'about.board.member3.role': 'IT Committee Chair',
      'about.board.member4.role': 'Event Planning Committee Chair',
      'about.board.member5.role': 'Marketing Committee Chair',
      'about.board.member6.role': 'Legal Consultancy Committee Chair',
      'about.board.member7.role': 'International Projects and Collaboration Committee Chair',
      'about.board.member8.role': 'HR Committee Chair',
      'about.section1.title': 'About Us',
      'about.section1.body':
        'ANKA is a dynamic and inclusive student association that serves as a bridge between cultures, communities, and opportunities. Our organization was established to support Turkish and international students as they navigate academic life and beyond in the Netherlands. We believe in fostering connections, building confidence, and inspiring leadership among young people.',
      'about.section2.title': 'Our Mission',
      'about.section2.body':
        'Our mission is to empower students from diverse backgrounds by providing mentorship, career guidance, and access to meaningful opportunities. We strive to create an environment where every student can grow, lead, and contribute to society with confidence and purpose.',
      'about.section3.title': 'Our Vision',
      'about.section3.body':
        'We envision a vibrant, inclusive, and empowered student community that thrives on collaboration and mutual support. Through strong partnerships and sustainable programs, ANKA aims to be a leading force in shaping the next generation of global-minded professionals.',
      'committees.hero.title': 'Committees',
      'committees.hero.subtitle': 'Welcome to Our Committees',
      'committees.hero.body':
        'Our committees are the heart of ANKA’s operations-driven by passionate students who plan, organize, and bring our mission to life. From events and communications to mentorship and social impact, each committee plays a vital role in making ANKA a thriving and meaningful community. Whether you\'re looking to lead, contribute, or learn, there\'s a place for you here. Welcome to the engine behind our vision!',
      'committees.it.title': 'IT Committee',
      'committees.it.body':
        "This team, which manages ANKA's digital infrastructure, works in the fields of web development, software, and technical support.",
      'committees.marketing.title': 'Marketing Committee',
      'committees.marketing.body':
        "Through strategic promotion, social media, and content creation, they represent ANKA's outward-facing image to the world.",
      'committees.entrepreneurship.title': 'Entrepreneurship & Business Committee',
      'committees.entrepreneurship.body':
        'They develop innovative projects, organize entrepreneurship workshops and competitions, and guide members from ideas to products.',
      'committees.academic.title': 'Academic Support Committee',
      'committees.academic.body':
        "They support ANKA's knowledge-focused vision through seminars, academic content, and publications.",
      'committees.event.title': 'Event Planning Committee',
      'committees.event.body':
        'They organize social and academic events; managing all processes from the idea stage to the actual event.',
      'committees.hr.title': 'HR Committee',
      'committees.hr.body':
        'They are responsible for internal communication, interaction among members, and ensuring harmony within the organization.',
      'committees.law.title': 'Law Committee',
      'committees.law.body':
        'They provide legal consultancy and oversee the legal compliance of projects and processes.',
      'committees.ir.title': 'International Relations Committee',
      'committees.ir.body':
        "They establish ANKA's international connections and manage international projects and collaborations.",
      'committee_it.hero.title': 'IT Committee',
      'committee_it.hero.body':
        'Driving innovation and digital transformation through technology and technical support at ANKA.',
      'committee_it.team.title': 'Our Team',
      'committee_it.team.member1.role': 'Chair',
      'committee_it.team.member2.role': 'Vice Chair',
      'committee_it.team.member3.role': 'Data Analyst',
      'committee_it.team.member4.role': 'Web Developer',
      'committee_it.responsibilities.title': 'Key Responsibilities',
      'committee_it.responsibilities.item1': 'Maintain and update ANKA’s website and digital platforms.',
      'committee_it.responsibilities.item2': 'Develop software solutions to improve internal workflows.',
      'committee_it.responsibilities.item3': 'Provide IT support to ANKA staff and committees.',
      'committee_it.responsibilities.item4': 'Manage data security and privacy protocols.',
      'committee_it.responsibilities.item5': 'Research and implement new technologies.',
      'committee_it.responsibilities.item6': 'Develop and maintain the official ANKA website and internal systems.',
      'committee_it.responsibilities.item7': 'Manage technical infrastructure including payment and security systems.',
      'committee_it.responsibilities.item8': 'Provide technical support to other committees.',
      'committee_it.responsibilities.item9': 'Improve automation and data handling tools.',
      'committee_it.responsibilities.item10': 'Ensure cybersecurity and data protection across platforms.',
      'committee_marketing.hero.title': 'Marketing Committee',
      'committee_marketing.hero.body':
        "Crafting compelling campaigns and strategies to elevate ANKA's brand and engage our community effectively.",
      'committee_marketing.team.title': 'Our Team',
      'committee_marketing.team.member1.role': 'Chair',
      'committee_marketing.team.member2.role': 'Vice Chair',
      'committee_marketing.team.member3.role': 'Canva Graphic Designer',
      'committee_marketing.team.member4.role': 'Canva Designer',
      'committee_marketing.team.member5.role': 'Marketing Executive',
      'committee_marketing.team.member6.role': 'Community Manager & Content Writer',
      'committee_marketing.team.member7.role': 'Video Production',
      'committee_marketing.team.member8.role': 'Video Production',
      'committee_marketing.team.member9.role': 'Researcher',
      'committee_marketing.responsibilities.title': 'Key Responsibilities',
      'committee_marketing.responsibilities.item1': 'Design and execute social media strategies to increase visibility',
      'committee_marketing.responsibilities.item2': 'Create promotional materials and branding content',
      'committee_marketing.responsibilities.item3': 'Collaborate with other committees for campaign consistency',
      'committee_marketing.responsibilities.item4': 'Analyze audience engagement and optimize outreach efforts',
      'committee_marketing.responsibilities.item5': 'Manage communication channels and visual identity of ANKA',
      'committee_entre.hero.title': 'Entrepreneurship & Business Committee',
      'committee_entre.hero.body':
        'Developing future entrepreneurs and business leaders through hands-on workshops, impactful events, and real-world execution.',
      'committee_entre.team.title': 'Our Team',
      'committee_entre.team.member1.role': 'Chair',
      'committee_entre.team.member2.role': 'Vice Chair',
      'committee_entre.team.member3.role': 'Start-Up Hub Coordinator',
      'committee_entre.team.member4.role': 'ANKA Journeys & Event Coordinator',
      'committee_entre.team.member5.role': 'GENC NETWORK Coordinator',
      'committee_entre.team.member6.role': 'ANKA Journeys & Events Associate',
      'committee_entre.team.member7.role': 'Startup Hub Operations Associate',
      'committee_entre.responsibilities.title': 'Key Responsibilities',
      'committee_entre.responsibilities.item1':
        'Build a global entrepreneurship & business network of students, alumni, and professionals',
      'committee_entre.responsibilities.item2':
        'Operate the Startup Hub, enabling idea incubation, venture development, and execution',
      'committee_entre.responsibilities.item3':
        'Deliver high-impact events including workshops, webinars, seminars, and competitions',
      'committee_entre.responsibilities.item4': 'Connect members with mentors, investors, and industry experts',
      'committee_entre.responsibilities.item5':
        'Promote an execution-driven entrepreneurial mindset across the community',
      'committee_academic.hero.title': 'Academic Support Committee',
      'committee_academic.hero.body':
        'Driving innovation and digital transformation through technology and technical support at ANKA.',
      'committee_academic.team.title': 'Our Team',
      'committee_academic.team.member1.role': 'Chair',
      'committee_academic.team.member2.role': 'Vice Chair',
      'committee_academic.team.member3.role': 'Academic and Post-Admission Communications',
      'committee_academic.team.member4.role': 'University/Academic Support Lead',
      'committee_academic.responsibilities.title': 'Key Responsibilities',
      'committee_academic.responsibilities.item1': 'Host seminars, webinars, and lectures with academic relevance',
      'committee_academic.responsibilities.item2': 'Produce educational content and research-focused initiatives',
      'committee_academic.responsibilities.item3':
        'Foster academic collaboration among members and external institutions',
      'committee_academic.responsibilities.item4': 'Support students in personal and intellectual development',
      'committee_academic.responsibilities.item5': 'Promote critical thinking and interdisciplinary dialogue',
      'committee_event.hero.title': 'Event Planning Committee',
      'committee_event.hero.body':
        'Driving innovation and digital transformation through technology and technical support at ANKA.',
      'committee_event.team.title': 'Our Team',
      'committee_event.team.member1.role': 'Chair',
      'committee_event.team.member2.role': 'Vice Chair',
      'committee_event.team.member3.role': 'Communication & PR Officer',
      'committee_event.team.member4.role': 'Program & Content Creator',
      'committee_event.team.member5.role': 'Program & Content Creator',
      'committee_event.team.member6.role': 'Creative Concepts Officer',
      'committee_event.team.member7.role': 'Venue & Logistics Officer',
      'committee_event.responsibilities.title': 'Key Responsibilities',
      'committee_event.responsibilities.item1':
        'Plan and execute in-person and virtual events (workshops, socials, etc.)',
      'committee_event.responsibilities.item2': 'Manage logistics, scheduling, and event operations',
      'committee_event.responsibilities.item3': 'Coordinate with sponsors and partners for event support',
      'committee_event.responsibilities.item4': 'Ensure high-quality attendee experiences',
      'committee_event.responsibilities.item5': 'Promote events across all communication channels',
      'committee_hr.hero.title': 'HR Committee',
      'committee_hr.hero.body':
        'Driving innovation and digital transformation through technology and technical support at ANKA.',
      'committee_hr.team.title': 'Our Team',
      'committee_hr.team.member1.role': 'Chair',
      'committee_hr.team.member2.role': 'Vice Chair',
      'committee_hr.team.member3.role': 'Member Relations and Engagement Officer',
      'committee_hr.team.member4.role': 'Talent Pool Officer',
      'committee_hr.responsibilities.title': 'Key Responsibilities',
      'committee_hr.responsibilities.item1': 'Oversee recruitment and onboarding of new members',
      'committee_hr.responsibilities.item2': 'Maintain member engagement and satisfaction',
      'committee_hr.responsibilities.item3': 'Organize internal community-building activities',
      'committee_hr.responsibilities.item4':
        'Manage the Talent Pool and match students with job/internship opportunities',
      'committee_hr.responsibilities.item5': 'Serve as a bridge between members and executive board',
      'committee_law.hero.title': 'Law Committee',
      'committee_law.hero.body':
        'Driving innovation and digital transformation through technology and technical support at ANKA.',
      'committee_law.team.title': 'Our Team',
      'committee_law.team.member1.role': 'Chair',
      'committee_law.team.member2.role': 'Vice Chair',
      'committee_law.team.member3.role': 'Communications Officer',
      'committee_law.team.member4.role': 'Researcher',
      'committee_law.team.member5.role': 'Researcher',
      'committee_law.team.member6.role': 'Researcher',
      'committee_law.team.member7.role': 'Researcher',
      'committee_law.responsibilities.title': 'Key Responsibilities',
      'committee_law.responsibilities.item1': 'Ensure all ANKA activities comply with Dutch and international law',
      'committee_law.responsibilities.item2': 'Provide legal insights and organize law-related seminars',
      'committee_law.responsibilities.item3': 'Support members with career guidance in the legal field',
      'committee_law.responsibilities.item4': 'Draft and review contracts and internal regulations',
      'committee_law.responsibilities.item5': 'Monitor legal risk and ethical practices',
      'committee_ir.hero.title': 'International Relations Committee',
      'committee_ir.hero.body':
        'Driving innovation and digital transformation through technology and technical support at ANKA.',
      'committee_ir.team.title': 'Our Team',
      'committee_ir.team.member1.role': 'Chair',
      'committee_ir.team.member2.role': 'Vice Chair',
      'committee_ir.team.member3.role': 'Corporate Relations and Networking Officer',
      'committee_ir.team.member4.role': 'Corporate Relations and Networking Officer',
      'committee_ir.team.member5.role': 'Crisis Manager',
      'committee_ir.team.member6.role': 'Corporate Relations (Networking) Officer',
      'committee_ir.responsibilities.title': 'Key Responsibilities',
      'committee_ir.responsibilities.item1':
        'Develop partnerships with international organizations and institutions',
      'committee_ir.responsibilities.item2':
        'Guide members on EU programs (e.g., Erasmus+, Horizon Europe)',
      'committee_ir.responsibilities.item3':
        'Coordinate participation in global projects, exchanges, and trainings',
      'committee_ir.responsibilities.item4': 'Organize international conferences and cultural exchanges',
      'committee_ir.responsibilities.item5':
        'Manage communication with international partners and stakeholders',
      'news.hero.title': 'ANKA News',
      'news.hero.subtitle': 'Stay updated with the latest from ANKA Association',
      'news.messages.setup': 'News feature is being set up. Please check back later.',
      'news.messages.error': 'Failed to load news. Please try again later.',
      'news.messages.empty': 'No news available.',
      'loggedin.subtitle':
        'Here you can find your MyANKA page. You can access services, applications, and special discounts only for ANKA members.',
      'loggedin.mood.question': 'How are you feeling today?',
      'loggedin.mood.thanks': 'Thank you for your response.',
      'loggedin.news.title': 'ANKA News',
      'loggedin.services.title': 'Our Services',
      'loggedin.services.legal': 'Legal Consultancy',
      'loggedin.services.talent': 'ANKA Talent Pool',
      'loggedin.services.committee': 'ANKA Committee Position Application',
      'loggedin.services.discounts': 'ANKA Special Discounts and Campaigns',
      'loggedin.welcome': 'Welcome {name}!',
      'loggedin.welcome_member': 'Welcome member!',
      'loggedin.news.setup': 'News feature is being set up. Please check back later.',
      'loggedin.news.error': 'Failed to load news. Please try again later.',
      'loggedin.news.empty': 'No news available.',
      'home.hero.title': 'Welcome to ANKA',
      'home.hero.subtitle': 'Your gateway to innovation, opportunity, and community.',
      'home.hero.cta_join': 'Join ANKA',
      'home.hero.cta_learn': 'Learn More',
      'home.about.title': 'About ANKA',
      'home.about.body':
        'ANKA Association is a studentled platform based in the Netherlands, dedicated to empowering Turkish and multicultural students through mentorship, career development, and community-building initiatives. Founded with the vision of turning challenges into opportunities, ANKA brings together students, professionals, and institutions to create a supportive and inspiring environment where young talents can thrive academically, socially, and professionally.',
      'home.about.card1.title': 'Guided Pathways',
      'home.about.card1.body': 'Personalized support for academics, careers, and leadership.',
      'home.about.card2.title': 'Strong Network',
      'home.about.card2.body': 'Build lasting connections with mentors and peers.',
      'home.about.badge': 'Inclusive. Supportive. Student-driven.',
      'home.focus.title': 'Our Focus',
      'home.focus.subtitle': 'Practical support, inclusive community, and real opportunities for growth.',
      'home.focus.meta1': 'Strong initiatives',
      'home.focus.meta2': 'Guided pathways',
      'home.focus.meta3': 'Inclusive network',
      'home.highlights.card1.title': 'Mentorship',
      'home.highlights.card1.body': 'Connect with peers and professionals who guide your academic and career path.',
      'home.highlights.card2.title': 'Career Growth',
      'home.highlights.card2.body': 'Workshops, events, and programs that open doors to internships and jobs.',
      'home.highlights.card3.title': 'Community',
      'home.highlights.card3.body': 'A welcoming network that celebrates diversity, identity, and collaboration.',
      'home.why.kicker': 'Why ANKA?',
      'home.why.title': 'Grow with people who believe in you.',
      'home.why.body':
        'ANKA offers students in the Netherlands a supportive and empowering community for personal, academic, and professional growth. Through access to a diverse network of students, mentors, and professionals, members can take part in exclusive workshops, events, and partnerships designed to support their development and future goals.',
      'home.why.item1': 'Workshops, mentorship, and real career guidance',
      'home.why.item2': 'Cultural exchange and impactful community projects',
      'home.why.item3': 'A safe space to build confidence and leadership',
      'home.why.cta': 'Become a Member',
      'home.programs.title': 'Explore ANKA',
      'home.programs.subtitle': 'Discover platforms designed to support students, talent, and innovation.',
      'home.programs.card1.title': 'Talent Pool',
      'home.programs.card1.body': 'Jobs, internships, and opportunities tailored for student growth.',
      'home.programs.card2.title': 'News',
      'home.programs.card2.body': 'Latest updates, events, and highlights from the ANKA community.',
      'home.programs.card3.title': 'Legacy',
      'home.programs.card3.body': 'Celebrate the people and stories that shaped ANKA.',
      'home.programs.cta': 'Explore',
      'legacy.hero.title': 'ANKA Legacy',
      'legacy.hero.subtitle': 'Honoring Our Past Members',
      'legacy.hero.body':
        'Throughout the years, ANKA has been shaped by dedicated individuals who have contributed their time, energy, and passion to our community. This page honors all those who have served in various positions, helping build ANKA into what it is today. Explore our history and the remarkable people who have been part of our journey.',
      'legacy.header.title': 'Past Members',
      'legacy.header.subtitle': 'Celebrating the contributions of our alumni',
      'legacy.filter.label': 'Filter by Year:',
      'legacy.filter.all': 'All Years',
      'legacy.categories.board': 'Board Committee',
      'legacy.categories.vice_chair': 'Vice Chairs',
      'legacy.categories.committee': 'Committee Members',
      'legacy.subcategories.it': 'IT Committee',
      'legacy.subcategories.marketing': 'Marketing Committee',
      'legacy.subcategories.entrepreneurship': 'Entrepreneurship & Business Committee',
      'legacy.subcategories.academic': 'Academic Support Committee',
      'legacy.subcategories.event': 'Event Planning Committee',
      'legacy.subcategories.hr': 'HR Committee',
      'legacy.subcategories.law': 'Law Committee',
      'legacy.subcategories.ir': 'International Relations Committee',
      'legacy.messages.setup': 'Legacy feature is being set up. Please check back later.',
      'legacy.messages.error': 'Failed to load legacy members. Please try again later.',
      'legacy.messages.empty': 'No legacy members available.',
      'legacy.messages.no_year': 'No members found for the selected year.',
      'legacy.aria.past_member': 'Past Member: {name}',
      'tp.nav.brand': 'myANKA',
      'tp.nav.talent': 'TalentPool',
      'tp.nav.jobs': 'Find Jobs',
      'tp.nav.profile': 'My Profile',
      'tp.nav.faq': 'FAQ',
      'tp.welcome': 'Welcome {name}!',
      'tp.welcome_member': 'Welcome member!',
      'tp.hero.title': 'Find Your Dream Job',
      'tp.hero.body':
        'Connect with top employers and discover opportunities that match your skills and ambitions.',
      'tp.hero.cta_primary': 'Browse Jobs',
      'tp.hero.cta_secondary': 'Learn More',
      'tp.why.title': 'Why Choose ANKA Talent Pool',
      'tp.why.job_seekers.title': 'For Job Seekers',
      'tp.why.job_seekers.item1': 'Find opportunities that match your skills and experience',
      'tp.why.job_seekers.item2': 'Apply with a streamlined, intuitive process',
      'tp.why.job_seekers.item3': 'Track application status in real-time',
      'tp.why.job_seekers.item4': 'Showcase your skills and get noticed',
      'tp.why.employers.title': 'For Employers',
      'tp.why.employers.item1': 'Post jobs and reach qualified candidates quickly',
      'tp.why.employers.item2': 'Powerful search and filtering tools',
      'tp.why.employers.item3': 'Manage applications efficiently',
      'tp.why.employers.item4': 'Communicate directly with promising candidates',
      'tp.why.platform.title': 'Platform Benefits',
      'tp.why.platform.item1': 'User-friendly interface designed for productivity',
      'tp.why.platform.item2': 'Secure and reliable platform',
      'tp.why.platform.item3': 'Regular updates with new features',
      'tp.why.platform.item4': 'Dedicated support team',
      'tp.jobs.title': 'Job Search',
      'tp.jobs.filters.type': 'Job Type',
      'tp.jobs.filters.type_placeholder': 'Select Job Type',
      'tp.jobs.filters.type_full': 'Full-time',
      'tp.jobs.filters.type_part': 'Part-time',
      'tp.jobs.filters.experience': 'Experience Level',
      'tp.jobs.filters.experience_placeholder': 'Select Experience Level',
      'tp.jobs.filters.experience_intern': 'Internship',
      'tp.jobs.filters.experience_junior': 'Junior / Entry',
      'tp.jobs.filters.experience_mid': 'Mid Level',
      'tp.jobs.filters.experience_senior': 'Senior',
      'tp.jobs.filters.location': 'Location',
      'tp.jobs.filters.location_placeholder': 'Enter location',
      'tp.jobs.filters.search': 'Search',
      'tp.jobs.results.title': 'Available Jobs',
      'tp.jobs.errors.fetch': 'Failed to fetch companies.',
      'tp.jobs.errors.empty': 'No results found.',
      'tp.jobs.description_empty': 'No description available.',
      'tp.jobs.card.job_type': 'Job Type',
      'tp.jobs.card.experience': 'Experience',
      'tp.jobs.card.view_details': 'View Details',
      'tp.jobs.modal.close': 'Close modal',
      'tp.jobs.modal.industry': 'Industry',
      'tp.jobs.modal.hq': 'Headquarters',
      'tp.jobs.modal.website': 'Website',
      'tp.jobs.modal.description': 'Description',
      'tp.jobs.modal.apply': 'Apply',
      'tp.jobs.modal.applied': 'Applied',
      'tp.jobs.apply.missing': 'Missing username or company name.',
      'tp.jobs.apply.error_prefix': 'Error',
      'tp.jobs.apply.error_generic': 'An error occurred while applying.',
      'tp.profile.change_password': 'Change your password',
      'tp.profile.title': 'Personal Information',
      'tp.profile.labels.university': 'University',
      'tp.profile.labels.major': 'Major',
      'tp.profile.labels.gender': 'Gender',
      'tp.profile.labels.yob': 'Year of Birth',
      'tp.profile.labels.cv': 'Current CV',
      'tp.profile.cv_empty': 'No CV uploaded',
      'tp.profile.upload_cv': 'Upload CV',
      'tp.profile.change_cv': 'Change CV',
      'tp.profile.logout': 'Logout',
      'tp.profile.password.title': 'Change Password',
      'tp.profile.password.old': 'Old Password',
      'tp.profile.password.new': 'New Password',
      'tp.profile.password.cancel': 'Cancel',
      'tp.profile.password.submit': 'Change Password',
      'tp.profile.view_cv': 'View CV',
      'tp.profile.error': 'Error loading profile',
      'tp.profile.upload_select': 'Please select a PDF file first.',
      'tp.profile.uploading': 'Uploading...',
      'tp.profile.upload_success': 'CV uploaded and saved successfully!',
      'tp.profile.upload_fail': 'Upload failed! Please try again.',
      'tp.profile.password.changing': 'Changing...',
      'tp.profile.password.success': 'Password changed successfully!',
      'tp.profile.password.error': 'Failed to change password. Please try again.',
      'tp.faq.title': 'FAQs',
      'tp.faq.q1': 'What is Talentpool used for?',
      'tp.faq.a1':
        'ANKA Talent Pool is a platform designed to connect talented students and professionals with job opportunities. It serves as a bridge between job seekers and employers, allowing members to create profiles, search for positions, and apply for vacancies. The platform is specifically tailored for Turkish and multicultural students in the Netherlands, helping them find internships, part-time jobs, and full-time positions that match their skills and career goals.',
      'tp.faq.q2': 'Is talentpool free for job seekers?',
      'tp.faq.a2':
        "Yes, ANKA Talent Pool is completely free for all job seekers. As an ANKA member, you can create your profile, browse job listings, and apply for positions at no cost. There are no hidden fees, subscription charges, or premium tiers required to access the platform's core features. Our mission is to support students and professionals in their career journey without financial barriers.",
      'tp.faq.q3': 'How to apply for a vacancy?',
      'tp.faq.a3':
        'To apply for a vacancy, first make sure you have completed your profile with your skills, experience, and education details. Then, browse available positions using the "Find Jobs" page, where you can filter by job type, location, or keywords. When you find a position that interests you, click on it to view full details, and then click the "Apply" button. Your profile information will be sent to the employer, and you\'ll receive a confirmation that your application has been submitted. Make sure your profile is up-to-date before applying to increase your chances of being selected.',
      'tp.faq.q4': 'Can I edit the information on my profile?',
      'tp.faq.a4':
        "Absolutely! You can edit your profile information at any time. Simply go to the \"My Profile\" page, and you'll be able to update your personal details, work experience, education, skills, and any other information. We recommend keeping your profile updated regularly, especially after completing new projects, gaining new skills, or achieving new qualifications. An up-to-date profile increases your visibility to employers and improves your chances of matching with relevant job opportunities.",
      'tp.faq.q5': 'I have more questions, where can I go?',
      'tp.faq.a5':
        "If you have additional questions or need support, you can reach out to us through the contact section at the bottom of this page. You can also visit the main ANKA website for more information about our association and services. For urgent matters or technical issues, please use the contact form provided, and our team will get back to you as soon as possible. We're here to help you make the most of the Talent Pool platform and support you in your career journey."
    },
    tr: {
      'nav.home': 'Ana Sayfa',
      'nav.about': 'Hakkımızda',
      'nav.about_link': 'Hakkımızda',
      'nav.legacy': 'ANKA Mirası',
      'nav.news': 'ANKA Haberleri',
      'nav.committees': 'Komitelerimiz',
      'nav.contact': 'Bize Ulaşın',
      'nav.member': 'Üye Ol',
      'nav.login': 'Üye Girişi',
      'nav.myanka': 'MyANKA',
      'nav.admin': 'Yönetici Paneli',
      'nav.profile': 'Profilim',
      'footer.website': 'Web Sitesi',
      'footer.home': 'Ana Sayfa',
      'footer.about': 'Hakkımızda',
      'footer.committees': 'Komitelerimiz',
      'footer.contact': 'Bize Ulaşın',
      'footer.member': 'Üye Ol',
      'footer.login': 'Üye Girişi',
      'footer.follow': 'Bizi Takip Edin',
      'footer.documents': 'Belgeler',
      'footer.articles': 'Tüzük (TR)',
      'footer.legal': 'Yasal',
      'footer.privacy': 'Gizlilik Politikası',
      'footer.terms': 'Şartlar ve Koşullar',
      'footer.cookie': 'Çerez Politikası',
      'footer.rights': '© 2025 ANKA Web Sitesi. Tüm hakları saklıdır.',
      'footer_loggedin.title': 'MyANKA',
      'footer_loggedin.home': 'MyANKA Ana Sayfa',
      'footer_loggedin.legal': 'Hukuki Danışmanlık',
      'footer_loggedin.talent': 'ANKA Yetenek Havuzu',
      'footer_loggedin.committee': 'Komite Başvurusu',
      'footer_loggedin.discounts': 'Özel İndirimler',
      'contact.title': 'Bize Ulaşın',
      'contact.intro1': 'Sıkça Sorulan Sorular ile cevaplanmamış başka sorularınız var mı?',
      'contact.intro2': 'Aşağıdaki form üzerinden bize dilediğiniz zaman ulaşabilirsiniz. Sensiz bir kişi eksiğiz!',
      'contact.form.name': 'Adınız Soyadınız',
      'contact.form.email': 'E-posta Adresiniz',
      'contact.form.subject': 'Konu',
      'contact.form.message': 'Mesajınız',
      'contact.form.submit': 'Mesaj Gönder',
      'contact.info.title': 'İletişime Geçin',
      'contact.info.location': 'Hollanda',
      'contact_page.title': 'Bize Ulaşın',
      'contact_page.intro1': 'Bir sorunuz, fikriniz var mı ya da sadece merhaba demek mi istiyorsunuz? Sizden haber almayı çok isteriz.',
      'contact_page.intro2': 'ANKA topluluğu için etkili olacağına inandığınız bir fikriniz veya projeniz varsa, bize dilediğiniz zaman ulaşın. Sensiz bir kişi eksiğiz!',
      'contact_page.form.name': 'Adınız Soyadınız',
      'contact_page.form.email': 'E-posta Adresiniz',
      'contact_page.form.subject': 'Konu',
      'contact_page.form.message': 'Mesajınız',
      'contact_page.form.submit': 'Mesaj Gönder',
      'contact_page.info.title': 'İletişime Geçin',
      'contact_page.info.location': 'Hollanda',
      'apply.title': 'Bize Katılın',
      'apply.subtitle': 'ANKA’nın parçası olun – yenilik ve iş birliğinin buluştuğu yer. Başvurmak için aşağıdaki formu doldurun!',
      'apply.form.title': 'ANKA Üyelik Formu',
      'login.title': 'Üye Girişi',
      'login.subtitle': 'Lütfen ANKA HR Komitesi tarafından size verilen kullanıcı adı ve şifrenizi girin.',
      'login.username': 'kullanıcı adı',
      'login.password': 'şifre',
      'login.submit': 'Giriş Yap',
      'login.home': '🏠 Ana Sayfaya Dön',
      'about.hero.title': 'Hakkımızda',
      'about.hero.subtitle': 'ANKA’nın Geçmişi ve Geleceği',
      'about.hero.body':
        "ANKA Derneği, 2025 yılında Amsterdam'da Türk ve çok kültürlü gençleri Hollanda’da desteklemek amacıyla hırslı öğrenciler tarafından kurulmuştur. Küçük bir girişim olarak başlayan bu yolculuk, mentorluk, kültürel bağlar ve profesyonel gelişime odaklanan dinamik bir topluluğa dönüştü. ANKA, ortaklıklar kurup etkili etkinlikler düzenledikçe liderlik ve küresel bakış açısı kazandıran fırsatlar yaratmaya devam ediyor. Gelecekte ANKA’nın Avrupa çapında büyüyerek öğrenci güçlenmesinin önde gelen sesi olması hedefleniyor.",
      'about.board.title': 'ANKA Yönetim Kurulu',
      'about.board.subtitle': 'ANKA – Yönetim Kurulu Üyeleri',
      'about.board.chair.role': 'ANKA Yönetim Kurulu Başkanı',
      'about.board.members_title': 'Yönetim Kurulu Üyeleri',
      'about.board.member1.role': 'Akademik ve Kabul Sonrası Destek Komitesi Başkanı',
      'about.board.member2.role': 'Girişimcilik ve İşletme Komitesi Başkanı',
      'about.board.member3.role': 'IT Komitesi Başkanı',
      'about.board.member4.role': 'Etkinlik Düzenleme Komitesi Başkanı',
      'about.board.member5.role': 'Marketing Komitesi Başkanı',
      'about.board.member6.role': 'Hukuk Danışmanlık Komitesi Başkanı',
      'about.board.member7.role': 'Uluslararası Projeler ve İşbirliği Komitesi Başkanı',
      'about.board.member8.role': 'HR Komitesi Başkanı',
      'about.section1.title': 'Hakkımızda',
      'about.section1.body':
        'ANKA, kültürler, topluluklar ve fırsatlar arasında köprü kuran dinamik ve kapsayıcı bir öğrenci derneğidir. Kuruluşumuz, Hollanda’da akademik yaşamı ve sonrasını deneyimleyen Türk ve uluslararası öğrencileri desteklemek için kurulmuştur. Gençler arasında bağlar kurmaya, özgüven geliştirmeye ve liderliği teşvik etmeye inanıyoruz.',
      'about.section2.title': 'Misyonumuz',
      'about.section2.body':
        'Misyonumuz, farklı geçmişlerden gelen öğrencileri mentorluk, kariyer rehberliği ve anlamlı fırsatlara erişim sağlayarak güçlendirmektir. Her öğrencinin güven ve amaçla büyüyebileceği, liderlik edebileceği ve topluma katkıda bulunabileceği bir ortam yaratmayı hedefliyoruz.',
      'about.section3.title': 'Vizyonumuz',
      'about.section3.body':
        'Vizyonumuz, iş birliği ve karşılıklı destekle büyüyen, canlı, kapsayıcı ve güçlenmiş bir öğrenci topluluğudur. Güçlü ortaklıklar ve sürdürülebilir programlar aracılığıyla ANKA, küresel bakış açısına sahip yeni nesil profesyonelleri şekillendirmede öncü bir güç olmayı hedefler.',
      'committees.hero.title': 'Komiteler',
      'committees.hero.subtitle': 'Komitelerimize Hoş Geldiniz',
      'committees.hero.body':
        'Komitelerimiz, ANKA’nın operasyonlarının kalbidir; misyonumuzu hayata geçirmek için planlayan, organize eden ve çalışan tutkulu öğrencilerden oluşur. Etkinliklerden iletişime, mentorluktan sosyal etkiye kadar her komite ANKA’yı güçlü ve anlamlı bir topluluk yapan önemli bir role sahiptir. Liderlik etmek, katkı sağlamak veya öğrenmek istiyorsanız burada size uygun bir yer var. Vizyonumuzun motoruna hoş geldiniz!',
      'committees.it.title': 'IT Komitesi',
      'committees.it.body':
        "ANKA'nın dijital altyapısını yöneten bu ekip; web geliştirme, yazılım ve teknik destek alanlarında çalışır.",
      'committees.marketing.title': 'Pazarlama Komitesi',
      'committees.marketing.body':
        "Stratejik tanıtım, sosyal medya ve içerik üretimiyle ANKA'nın dışa dönük yüzünü temsil ederler.",
      'committees.entrepreneurship.title': 'Girişimcilik ve İşletme Komitesi',
      'committees.entrepreneurship.body':
        'Yenilikçi projeler geliştirir, girişimcilik atölyeleri ve yarışmalar düzenler, üyeleri fikirden ürüne yönlendirirler.',
      'committees.academic.title': 'Akademik Destek Komitesi',
      'committees.academic.body':
        "Seminerler, akademik içerikler ve yayınlarla ANKA'nın bilgi odaklı vizyonunu desteklerler.",
      'committees.event.title': 'Etkinlik Düzenleme Komitesi',
      'committees.event.body':
        'Sosyal ve akademik etkinlikleri organize eder; fikir aşamasından etkinliğin gerçekleşmesine kadar tüm süreci yönetirler.',
      'committees.hr.title': 'İnsan Kaynakları Komitesi',
      'committees.hr.body':
        'İç iletişim, üyeler arası etkileşim ve organizasyon içindeki uyumu sağlamaktan sorumludurlar.',
      'committees.law.title': 'Hukuk Komitesi',
      'committees.law.body':
        'Hukuki danışmanlık sağlar ve projelerin/ süreçlerin yasal uyumunu gözetirler.',
      'committees.ir.title': 'Uluslararası İlişkiler Komitesi',
      'committees.ir.body':
        "ANKA'nın uluslararası bağlantılarını kurar ve uluslararası projeleri ile iş birliklerini yönetirler.",
      'committee_it.hero.title': 'IT Komitesi',
      'committee_it.hero.body':
        "ANKA'da teknoloji ve teknik destek aracılığıyla yenilik ve dijital dönüşümü destekler.",
      'committee_it.team.title': 'Ekibimiz',
      'committee_it.team.member1.role': 'Başkan',
      'committee_it.team.member2.role': 'Başkan Yardımcısı',
      'committee_it.team.member3.role': 'Veri Analisti',
      'committee_it.team.member4.role': 'Web Geliştirici',
      'committee_it.responsibilities.title': 'Temel Sorumluluklar',
      'committee_it.responsibilities.item1': "ANKA'nın web sitesini ve dijital platformlarını sürdürmek ve güncellemek.",
      'committee_it.responsibilities.item2': 'İç iş akışlarını iyileştirmek için yazılım çözümleri geliştirmek.',
      'committee_it.responsibilities.item3': 'ANKA çalışanlarına ve komitelere IT desteği sağlamak.',
      'committee_it.responsibilities.item4': 'Veri güvenliği ve gizlilik protokollerini yönetmek.',
      'committee_it.responsibilities.item5': 'Yeni teknolojileri araştırıp uygulamak.',
      'committee_it.responsibilities.item6':
        "ANKA'nın resmi web sitesi ve iç sistemlerini geliştirmek ve sürdürmek.",
      'committee_it.responsibilities.item7': 'Ödeme ve güvenlik sistemleri dahil teknik altyapıyı yönetmek.',
      'committee_it.responsibilities.item8': 'Diğer komitelere teknik destek sağlamak.',
      'committee_it.responsibilities.item9': 'Otomasyon ve veri işleme araçlarını geliştirmek.',
      'committee_it.responsibilities.item10': 'Siber güvenlik ve veri korumasını sağlamak.',
      'committee_marketing.hero.title': 'Pazarlama Komitesi',
      'committee_marketing.hero.body':
        "ANKA'nın markasını güçlendirmek ve topluluğumuzla etkili şekilde etkileşim kurmak için güçlü kampanyalar ve stratejiler oluşturur.",
      'committee_marketing.team.title': 'Ekibimiz',
      'committee_marketing.team.member1.role': 'Başkan',
      'committee_marketing.team.member2.role': 'Başkan Yardımcısı',
      'committee_marketing.team.member3.role': 'Canva Grafik Tasarımcı',
      'committee_marketing.team.member4.role': 'Canva Tasarımcı',
      'committee_marketing.team.member5.role': 'Pazarlama Executive',
      'committee_marketing.team.member6.role': 'Topluluk Yöneticisi ve İçerik Yazarı',
      'committee_marketing.team.member7.role': 'Video Prodüksiyon',
      'committee_marketing.team.member8.role': 'Video Prodüksiyon',
      'committee_marketing.team.member9.role': 'Araştırmacı',
      'committee_marketing.responsibilities.title': 'Temel Sorumluluklar',
      'committee_marketing.responsibilities.item1': 'Görünürlüğü artırmak için sosyal medya stratejileri tasarlamak ve uygulamak',
      'committee_marketing.responsibilities.item2': 'Tanıtım materyalleri ve marka içerikleri üretmek',
      'committee_marketing.responsibilities.item3': 'Kampanya tutarlılığı için diğer komitelerle iş birliği yapmak',
      'committee_marketing.responsibilities.item4': 'Kitle etkileşimini analiz edip erişimi optimize etmek',
      'committee_marketing.responsibilities.item5': "ANKA'nın iletişim kanallarını ve görsel kimliğini yönetmek",
      'committee_entre.hero.title': 'Girişimcilik ve İşletme Komitesi',
      'committee_entre.hero.body':
        'Uygulamalı atölyeler, etkili etkinlikler ve gerçek hayat uygulamalarıyla geleceğin girişimcilerini ve iş liderlerini yetiştirir.',
      'committee_entre.team.title': 'Ekibimiz',
      'committee_entre.team.member1.role': 'Başkan',
      'committee_entre.team.member2.role': 'Başkan Yardımcısı',
      'committee_entre.team.member3.role': 'Start-Up Hub Koordinatörü',
      'committee_entre.team.member4.role': 'ANKA Journeys ve Etkinlik Koordinatörü',
      'committee_entre.team.member5.role': 'GENC NETWORK Koordinatörü',
      'committee_entre.team.member6.role': 'ANKA Journeys ve Etkinlikler Asistanı',
      'committee_entre.team.member7.role': 'Startup Hub Operasyon Asistanı',
      'committee_entre.responsibilities.title': 'Temel Sorumluluklar',
      'committee_entre.responsibilities.item1':
        'Öğrenciler, mezunlar ve profesyonellerden oluşan küresel bir girişimcilik ve iş ağı kurmak',
      'committee_entre.responsibilities.item2':
        'Startup Hub’ı yöneterek fikir kuluçkası, girişim geliştirme ve uygulamayı mümkün kılmak',
      'committee_entre.responsibilities.item3':
        'Atölyeler, webinarlar, seminerler ve yarışmalar dahil yüksek etkili etkinlikler düzenlemek',
      'committee_entre.responsibilities.item4': 'Üyeleri mentorlar, yatırımcılar ve sektör uzmanlarıyla buluşturmak',
      'committee_entre.responsibilities.item5':
        'Topluluk genelinde uygulama odaklı girişimci bir zihniyeti teşvik etmek',
      'committee_academic.hero.title': 'Akademik Destek Komitesi',
      'committee_academic.hero.body':
        "ANKA'da teknoloji ve teknik destek aracılığıyla yenilik ve dijital dönüşümü destekler.",
      'committee_academic.team.title': 'Ekibimiz',
      'committee_academic.team.member1.role': 'Başkan',
      'committee_academic.team.member2.role': 'Başkan Yardımcısı',
      'committee_academic.team.member3.role': 'Akademik ve Kabul Sonrası İletişim',
      'committee_academic.team.member4.role': 'Üniversite/Akademik Destek Sorumlusu',
      'committee_academic.responsibilities.title': 'Temel Sorumluluklar',
      'committee_academic.responsibilities.item1': 'Akademik içerikli seminerler, webinarlar ve konferanslar düzenlemek',
      'committee_academic.responsibilities.item2': 'Eğitsel içerikler ve araştırma odaklı girişimler üretmek',
      'committee_academic.responsibilities.item3':
        'Üyeler ve dış kurumlar arasında akademik iş birliğini teşvik etmek',
      'committee_academic.responsibilities.item4': 'Öğrencilerin kişisel ve entelektüel gelişimini desteklemek',
      'committee_academic.responsibilities.item5': 'Eleştirel düşünmeyi ve disiplinler arası diyaloğu teşvik etmek',
      'committee_event.hero.title': 'Etkinlik Düzenleme Komitesi',
      'committee_event.hero.body':
        "ANKA'da teknoloji ve teknik destek aracılığıyla yenilik ve dijital dönüşümü destekler.",
      'committee_event.team.title': 'Ekibimiz',
      'committee_event.team.member1.role': 'Başkan',
      'committee_event.team.member2.role': 'Başkan Yardımcısı',
      'committee_event.team.member3.role': 'İletişim ve PR Sorumlusu',
      'committee_event.team.member4.role': 'Program ve İçerik Üreticisi',
      'committee_event.team.member5.role': 'Program ve İçerik Üreticisi',
      'committee_event.team.member6.role': 'Yaratıcı Konseptler Sorumlusu',
      'committee_event.team.member7.role': 'Mekan ve Lojistik Sorumlusu',
      'committee_event.responsibilities.title': 'Temel Sorumluluklar',
      'committee_event.responsibilities.item1':
        'Yüz yüze ve çevrimiçi etkinlikleri (atölyeler, sosyaller vb.) planlamak ve yürütmek',
      'committee_event.responsibilities.item2': 'Lojistik, planlama ve etkinlik operasyonlarını yönetmek',
      'committee_event.responsibilities.item3': 'Etkinlik desteği için sponsor ve ortaklarla koordinasyon sağlamak',
      'committee_event.responsibilities.item4': 'Yüksek kaliteli katılımcı deneyimleri sağlamak',
      'committee_event.responsibilities.item5': 'Etkinlikleri tüm iletişim kanallarında tanıtmak',
      'committee_hr.hero.title': 'İnsan Kaynakları Komitesi',
      'committee_hr.hero.body':
        "ANKA'da teknoloji ve teknik destek aracılığıyla yenilik ve dijital dönüşümü destekler.",
      'committee_hr.team.title': 'Ekibimiz',
      'committee_hr.team.member1.role': 'Başkan',
      'committee_hr.team.member2.role': 'Başkan Yardımcısı',
      'committee_hr.team.member3.role': 'Üye İlişkileri ve Etkileşim Sorumlusu',
      'committee_hr.team.member4.role': 'Yetenek Havuzu Sorumlusu',
      'committee_hr.responsibilities.title': 'Temel Sorumluluklar',
      'committee_hr.responsibilities.item1': 'Yeni üyelerin işe alım ve oryantasyon süreçlerini yönetmek',
      'committee_hr.responsibilities.item2': 'Üye bağlılığını ve memnuniyetini sürdürmek',
      'committee_hr.responsibilities.item3': 'İç topluluk oluşturma etkinlikleri düzenlemek',
      'committee_hr.responsibilities.item4':
        'Yetenek Havuzunu yönetmek ve öğrencileri iş/staj fırsatlarıyla eşleştirmek',
      'committee_hr.responsibilities.item5': 'Üyeler ile yönetim kurulu arasında köprü olmak',
      'committee_law.hero.title': 'Hukuk Komitesi',
      'committee_law.hero.body':
        "ANKA'da teknoloji ve teknik destek aracılığıyla yenilik ve dijital dönüşümü destekler.",
      'committee_law.team.title': 'Ekibimiz',
      'committee_law.team.member1.role': 'Başkan',
      'committee_law.team.member2.role': 'Başkan Yardımcısı',
      'committee_law.team.member3.role': 'İletişim Sorumlusu',
      'committee_law.team.member4.role': 'Araştırmacı',
      'committee_law.team.member5.role': 'Araştırmacı',
      'committee_law.team.member6.role': 'Araştırmacı',
      'committee_law.team.member7.role': 'Araştırmacı',
      'committee_law.responsibilities.title': 'Temel Sorumluluklar',
      'committee_law.responsibilities.item1':
        "ANKA'nın tüm faaliyetlerinin Hollanda ve uluslararası hukuka uygunluğunu sağlamak",
      'committee_law.responsibilities.item2': 'Hukuki içgörüler sağlamak ve hukuk odaklı seminerler düzenlemek',
      'committee_law.responsibilities.item3': 'Üyeleri hukuk alanında kariyer rehberliğiyle desteklemek',
      'committee_law.responsibilities.item4': 'Sözleşme ve iç düzenlemeleri hazırlamak ve gözden geçirmek',
      'committee_law.responsibilities.item5': 'Hukuki risk ve etik uygulamaları takip etmek',
      'committee_ir.hero.title': 'Uluslararası İlişkiler Komitesi',
      'committee_ir.hero.body':
        "ANKA'da teknoloji ve teknik destek aracılığıyla yenilik ve dijital dönüşümü destekler.",
      'committee_ir.team.title': 'Ekibimiz',
      'committee_ir.team.member1.role': 'Başkan',
      'committee_ir.team.member2.role': 'Başkan Yardımcısı',
      'committee_ir.team.member3.role': 'Kurumsal İlişkiler ve Networking Sorumlusu',
      'committee_ir.team.member4.role': 'Kurumsal İlişkiler ve Networking Sorumlusu',
      'committee_ir.team.member5.role': 'Kriz Yöneticisi',
      'committee_ir.team.member6.role': 'Kurumsal İlişkiler (Networking) Sorumlusu',
      'committee_ir.responsibilities.title': 'Temel Sorumluluklar',
      'committee_ir.responsibilities.item1':
        'Uluslararası kuruluşlar ve kurumlarla ortaklıklar geliştirmek',
      'committee_ir.responsibilities.item2':
        'Üyelere AB programları konusunda rehberlik etmek (örn. Erasmus+, Horizon Europe)',
      'committee_ir.responsibilities.item3':
        'Küresel projelere, değişimlere ve eğitimlere katılımı koordine etmek',
      'committee_ir.responsibilities.item4': 'Uluslararası konferanslar ve kültürel değişimler düzenlemek',
      'committee_ir.responsibilities.item5':
        'Uluslararası ortaklar ve paydaşlarla iletişimi yönetmek',
      'news.hero.title': 'ANKA Haberleri',
      'news.hero.subtitle': 'ANKA Derneği’nden en güncel gelişmeler',
      'news.messages.setup': 'Haberler özelliği hazırlanıyor. Lütfen daha sonra tekrar deneyin.',
      'news.messages.error': 'Haberler yüklenemedi. Lütfen daha sonra tekrar deneyin.',
      'news.messages.empty': 'Gösterilecek haber bulunamadı.',
      'loggedin.subtitle':
        'Burada MyANKA sayfanızı bulabilirsiniz. Sadece ANKA üyelerine özel hizmetlere, başvurulara ve indirimlere erişebilirsiniz.',
      'loggedin.mood.question': 'Bugün nasıl hissediyorsunuz?',
      'loggedin.mood.thanks': 'Yanıtınız için teşekkürler.',
      'loggedin.news.title': 'ANKA Haberleri',
      'loggedin.services.title': 'Hizmetlerimiz',
      'loggedin.services.legal': 'Hukuki Danışmanlık',
      'loggedin.services.talent': 'ANKA Yetenek Havuzu',
      'loggedin.services.committee': 'ANKA Komite Pozisyonu Başvurusu',
      'loggedin.services.discounts': 'ANKA Özel İndirimler ve Kampanyalar',
      'loggedin.welcome': 'Hoş geldin {name}!',
      'loggedin.welcome_member': 'Hoş geldin!',
      'loggedin.news.setup': 'Haberler özelliği hazırlanıyor. Lütfen daha sonra tekrar deneyin.',
      'loggedin.news.error': 'Haberler yüklenemedi. Lütfen daha sonra tekrar deneyin.',
      'loggedin.news.empty': 'Gösterilecek haber bulunamadı.',
      'home.hero.title': "ANKA'ya Hoş Geldiniz",
      'home.hero.subtitle': 'Yenilik, fırsat ve topluluğa açılan kapınız.',
      'home.hero.cta_join': "ANKA'ya Katıl",
      'home.hero.cta_learn': 'Daha Fazla Bilgi',
      'home.about.title': 'ANKA Hakkında',
      'home.about.body':
        'ANKA Derneği, Hollanda merkezli, Türk ve çok kültürlü öğrencileri mentorluk, kariyer gelişimi ve topluluk oluşturma girişimleriyle güçlendirmeye adanmış, öğrenci liderliğinde bir platformdur. Zorlukları fırsata dönüştürme vizyonuyla kurulan ANKA; öğrencileri, profesyonelleri ve kurumları bir araya getirerek genç yeteneklerin akademik, sosyal ve profesyonel olarak gelişebileceği destekleyici ve ilham verici bir ortam yaratır.',
      'home.about.card1.title': 'Rehberli Yollar',
      'home.about.card1.body': 'Akademik, kariyer ve liderlik için kişiselleştirilmiş destek.',
      'home.about.card2.title': 'Güçlü Ağ',
      'home.about.card2.body': 'Mentorlar ve akranlarla kalıcı bağlantılar kurun.',
      'home.about.badge': 'Kapsayıcı. Destekleyici. Öğrenci odaklı.',
      'home.focus.title': 'Odak Noktamız',
      'home.focus.subtitle': 'Pratik destek, kapsayıcı topluluk ve büyüme için gerçek fırsatlar.',
      'home.focus.meta1': 'Güçlü girişimler',
      'home.focus.meta2': 'Rehberli yollar',
      'home.focus.meta3': 'Kapsayıcı ağ',
      'home.highlights.card1.title': 'Mentorluk',
      'home.highlights.card1.body':
        'Akademik ve kariyer yolunda sizi yönlendiren akranlar ve profesyonellerle bağlantı kurun.',
      'home.highlights.card2.title': 'Kariyer Gelişimi',
      'home.highlights.card2.body':
        'Atölyeler, etkinlikler ve programlar staj ve iş kapılarını açar.',
      'home.highlights.card3.title': 'Topluluk',
      'home.highlights.card3.body':
        'Çeşitliliği, kimliği ve iş birliğini kutlayan sıcak bir ağ.',
      'home.why.kicker': 'Neden ANKA?',
      'home.why.title': 'Size inanan insanlarla birlikte büyüyün.',
      'home.why.body':
        "ANKA, Hollanda'daki öğrencilere kişisel, akademik ve profesyonel gelişim için destekleyici ve güçlendirici bir topluluk sunar. Öğrenciler, mentorlar ve profesyonellerden oluşan çeşitli bir ağa erişim sayesinde üyeler, gelişimlerini ve gelecek hedeflerini desteklemek üzere özel atölye çalışmaları, etkinlikler ve ortaklıklara katılabilir.",
      'home.why.item1': 'Atölyeler, mentorluk ve gerçek kariyer rehberliği',
      'home.why.item2': 'Kültürel etkileşim ve etkili topluluk projeleri',
      'home.why.item3': 'Özgüven ve liderlik geliştirmek için güvenli bir alan',
      'home.why.cta': 'Üye Ol',
      'home.programs.title': "ANKA'yı Keşfet",
      'home.programs.subtitle':
        'Öğrencileri, yeteneği ve yeniliği desteklemek için tasarlanmış platformları keşfedin.',
      'home.programs.card1.title': 'Yetenek Havuzu',
      'home.programs.card1.body': 'Öğrenci gelişimine özel iş, staj ve fırsatlar.',
      'home.programs.card2.title': 'Haberler',
      'home.programs.card2.body':
        'ANKA topluluğundan en güncel haberler, etkinlikler ve öne çıkanlar.',
      'home.programs.card3.title': 'Miras',
      'home.programs.card3.body': "ANKA'yı şekillendiren kişi ve hikayeleri kutlayın.",
      'home.programs.cta': 'Keşfet',
      'legacy.hero.title': 'ANKA Mirası',
      'legacy.hero.subtitle': 'Geçmiş Üyelerimizi Onurlandırıyoruz',
      'legacy.hero.body':
        'Yıllar boyunca ANKA, topluluğumuza zamanını, emeğini ve tutkusunu veren kişilerin katkılarıyla şekillendi. Bu sayfa, ANKA’yı bugün olduğu hale getiren farklı görevlerde hizmet etmiş herkesi onurlandırır. Tarihimizi ve bu yolculuğun parçası olan değerli insanları keşfedin.',
      'legacy.header.title': 'Geçmiş Üyeler',
      'legacy.header.subtitle': 'Mezunlarımızın katkılarını kutluyoruz',
      'legacy.filter.label': 'Yıla Göre Filtrele:',
      'legacy.filter.all': 'Tüm Yıllar',
      'legacy.categories.board': 'Yönetim Kurulu',
      'legacy.categories.vice_chair': 'Başkan Yardımcıları',
      'legacy.categories.committee': 'Komite Üyeleri',
      'legacy.subcategories.it': 'IT Komitesi',
      'legacy.subcategories.marketing': 'Pazarlama Komitesi',
      'legacy.subcategories.entrepreneurship': 'Girişimcilik ve İşletme Komitesi',
      'legacy.subcategories.academic': 'Akademik Destek Komitesi',
      'legacy.subcategories.event': 'Etkinlik Düzenleme Komitesi',
      'legacy.subcategories.hr': 'İnsan Kaynakları Komitesi',
      'legacy.subcategories.law': 'Hukuk Komitesi',
      'legacy.subcategories.ir': 'Uluslararası İlişkiler Komitesi',
      'legacy.messages.setup': 'Miras özelliği hazırlanıyor. Lütfen daha sonra tekrar deneyin.',
      'legacy.messages.error': 'Miras üyeleri yüklenemedi. Lütfen daha sonra tekrar deneyin.',
      'legacy.messages.empty': 'Gösterilecek geçmiş üye bulunamadı.',
      'legacy.messages.no_year': 'Seçilen yıl için üye bulunamadı.',
      'legacy.aria.past_member': 'Geçmiş Üye: {name}',
      'tp.nav.brand': 'myANKA',
      'tp.nav.talent': 'Yetenek Havuzu',
      'tp.nav.jobs': 'İş Bul',
      'tp.nav.profile': 'Profilim',
      'tp.nav.faq': 'SSS',
      'tp.welcome': 'Hoş geldin {name}!',
      'tp.welcome_member': 'Hoş geldin!',
      'tp.hero.title': 'Hayalindeki İşi Bul',
      'tp.hero.body':
        'En iyi işverenlerle bağlantı kurun ve becerilerinizle hedeflerinize uygun fırsatları keşfedin.',
      'tp.hero.cta_primary': 'İşlere Göz At',
      'tp.hero.cta_secondary': 'Daha Fazla Bilgi',
      'tp.why.title': 'Neden ANKA Yetenek Havuzu?',
      'tp.why.job_seekers.title': 'İş Arayanlar İçin',
      'tp.why.job_seekers.item1': 'Becerilerinize ve deneyiminize uygun fırsatlar bulun',
      'tp.why.job_seekers.item2': 'Hızlı ve sezgisel bir başvuru süreci',
      'tp.why.job_seekers.item3': 'Başvuru durumunu anlık takip edin',
      'tp.why.job_seekers.item4': 'Becerilerinizi öne çıkarın ve fark edilin',
      'tp.why.employers.title': 'İşverenler İçin',
      'tp.why.employers.item1': 'İlan verin ve nitelikli adaylara hızlıca ulaşın',
      'tp.why.employers.item2': 'Güçlü arama ve filtreleme araçları',
      'tp.why.employers.item3': 'Başvuruları verimli şekilde yönetin',
      'tp.why.employers.item4': 'Umut vadeden adaylarla doğrudan iletişim kurun',
      'tp.why.platform.title': 'Platform Avantajları',
      'tp.why.platform.item1': 'Verimlilik için tasarlanmış kullanıcı dostu arayüz',
      'tp.why.platform.item2': 'Güvenli ve güvenilir platform',
      'tp.why.platform.item3': 'Yeni özelliklerle düzenli güncellemeler',
      'tp.why.platform.item4': 'Özel destek ekibi',
      'tp.jobs.title': 'İş Arama',
      'tp.jobs.filters.type': 'İş Türü',
      'tp.jobs.filters.type_placeholder': 'İş Türü Seçin',
      'tp.jobs.filters.type_full': 'Tam Zamanlı',
      'tp.jobs.filters.type_part': 'Yarı Zamanlı',
      'tp.jobs.filters.experience': 'Deneyim Seviyesi',
      'tp.jobs.filters.experience_placeholder': 'Deneyim Seviyesi Seçin',
      'tp.jobs.filters.experience_intern': 'Staj',
      'tp.jobs.filters.experience_junior': 'Junior / Giriş',
      'tp.jobs.filters.experience_mid': 'Orta Seviye',
      'tp.jobs.filters.experience_senior': 'Kıdemli',
      'tp.jobs.filters.location': 'Konum',
      'tp.jobs.filters.location_placeholder': 'Konum girin',
      'tp.jobs.filters.search': 'Ara',
      'tp.jobs.results.title': 'Mevcut İşler',
      'tp.jobs.errors.fetch': 'Şirketler getirilemedi.',
      'tp.jobs.errors.empty': 'Sonuç bulunamadı.',
      'tp.jobs.description_empty': 'Açıklama bulunmuyor.',
      'tp.jobs.card.job_type': 'İş Türü',
      'tp.jobs.card.experience': 'Deneyim',
      'tp.jobs.card.view_details': 'Detayları Gör',
      'tp.jobs.modal.close': 'Kapat',
      'tp.jobs.modal.industry': 'Sektör',
      'tp.jobs.modal.hq': 'Merkez',
      'tp.jobs.modal.website': 'Web Sitesi',
      'tp.jobs.modal.description': 'Açıklama',
      'tp.jobs.modal.apply': 'Başvur',
      'tp.jobs.modal.applied': 'Başvuruldu',
      'tp.jobs.apply.missing': 'Kullanıcı adı veya şirket adı eksik.',
      'tp.jobs.apply.error_prefix': 'Hata',
      'tp.jobs.apply.error_generic': 'Başvuru sırasında bir hata oluştu.',
      'tp.profile.change_password': 'Şifreni değiştir',
      'tp.profile.title': 'Kişisel Bilgiler',
      'tp.profile.labels.university': 'Üniversite',
      'tp.profile.labels.major': 'Bölüm',
      'tp.profile.labels.gender': 'Cinsiyet',
      'tp.profile.labels.yob': 'Doğum Yılı',
      'tp.profile.labels.cv': 'Mevcut CV',
      'tp.profile.cv_empty': 'CV yüklenmedi',
      'tp.profile.upload_cv': 'CV Yükle',
      'tp.profile.change_cv': 'CV Değiştir',
      'tp.profile.logout': 'Çıkış Yap',
      'tp.profile.password.title': 'Şifre Değiştir',
      'tp.profile.password.old': 'Eski Şifre',
      'tp.profile.password.new': 'Yeni Şifre',
      'tp.profile.password.cancel': 'İptal',
      'tp.profile.password.submit': 'Şifreyi Değiştir',
      'tp.profile.view_cv': 'CV Görüntüle',
      'tp.profile.error': 'Profil yüklenemedi',
      'tp.profile.upload_select': 'Lütfen önce bir PDF dosyası seçin.',
      'tp.profile.uploading': 'Yükleniyor...',
      'tp.profile.upload_success': 'CV başarıyla yüklendi ve kaydedildi!',
      'tp.profile.upload_fail': 'Yükleme başarısız! Lütfen tekrar deneyin.',
      'tp.profile.password.changing': 'Değiştiriliyor...',
      'tp.profile.password.success': 'Şifre başarıyla değiştirildi!',
      'tp.profile.password.error': 'Şifre değiştirilemedi. Lütfen tekrar deneyin.',
      'tp.faq.title': 'SSS',
      'tp.faq.q1': 'Talentpool ne için kullanılır?',
      'tp.faq.a1':
        'ANKA Yetenek Havuzu, yetenekli öğrencileri ve profesyonelleri iş fırsatlarıyla buluşturmak için tasarlanmış bir platformdur. İş arayanlar ile işverenler arasında köprü görevi görür; üyelerin profil oluşturmasına, pozisyon aramasına ve ilanlara başvurmasına olanak tanır. Platform, Hollanda’daki Türk ve çok kültürlü öğrencilere özel olarak uyarlanmıştır; beceri ve kariyer hedeflerine uygun staj, yarı zamanlı ve tam zamanlı pozisyonlar bulmalarına yardımcı olur.',
      'tp.faq.q2': 'Talentpool iş arayanlar için ücretsiz mi?',
      'tp.faq.a2':
        'Evet, ANKA Yetenek Havuzu tüm iş arayanlar için tamamen ücretsizdir. ANKA üyesi olarak profil oluşturabilir, iş ilanlarını inceleyebilir ve pozisyonlara ücretsiz başvurabilirsiniz. Platformun temel özelliklerine erişim için gizli ücretler, abonelikler veya premium paketler yoktur. Misyonumuz, öğrencilere ve profesyonellere kariyer yolculuklarında finansal engel olmadan destek olmaktır.',
      'tp.faq.q3': 'Bir ilana nasıl başvurulur?',
      'tp.faq.a3':
        'Bir ilana başvurmak için önce beceri, deneyim ve eğitim bilgilerinizi içeren profilinizi tamamlayın. Ardından “İş Bul” sayfasından iş türü, konum veya anahtar kelimelerle filtreleyerek ilanları inceleyin. İlginizi çeken bir pozisyona tıklayıp detayları görüntüleyin ve “Başvur” butonuna basın. Profil bilgileriniz işverene iletilir ve başvurunuzun gönderildiğine dair onay alırsınız. Seçilme şansınızı artırmak için profilinizi güncel tutmanızı öneririz.',
      'tp.faq.q4': 'Profilimdeki bilgileri düzenleyebilir miyim?',
      'tp.faq.a4':
        'Elbette! Profil bilgilerinizi istediğiniz zaman düzenleyebilirsiniz. “Profilim” sayfasına giderek kişisel bilgilerinizi, iş deneyiminizi, eğitiminizi, becerilerinizi ve diğer bilgilerinizi güncelleyebilirsiniz. Yeni projeler tamamladığınızda, yeni beceriler kazandığınızda veya yeni yeterlilikler elde ettiğinizde profilinizi güncel tutmanızı öneririz. Güncel bir profil, işverenlere görünürlüğünüzü artırır.',
      'tp.faq.q5': 'Daha fazla sorum var, nereye başvurabilirim?',
      'tp.faq.a5':
        'Ek sorularınız varsa veya desteğe ihtiyacınız olursa, sayfanın altındaki iletişim bölümünden bize ulaşabilirsiniz. Derneğimiz ve hizmetlerimiz hakkında daha fazla bilgi için ana ANKA web sitesini ziyaret edebilirsiniz. Acil konular veya teknik sorunlar için lütfen iletişim formunu kullanın; ekibimiz en kısa sürede size dönüş yapacaktır. Yetenek Havuzu’ndan en iyi şekilde yararlanmanız için buradayız.'
    }
  };

  const setActiveLang = (lang) => {
    document.documentElement.lang = lang;
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      const isActive = btn.dataset.lang === lang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  };

  const applyTranslations = (lang) => {
    const strings = translations[lang] || translations[DEFAULT_LANG];
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (strings[key]) {
        el.textContent = strings[key];
      }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (strings[key]) {
        el.setAttribute('placeholder', strings[key]);
      }
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
      const key = el.getAttribute('data-i18n-aria-label');
      if (strings[key]) {
        el.setAttribute('aria-label', strings[key]);
      }
    });
    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      const key = el.getAttribute('data-i18n-title');
      if (strings[key]) {
        el.setAttribute('title', strings[key]);
      }
    });
    document.querySelectorAll('[data-i18n-value]').forEach((el) => {
      const key = el.getAttribute('data-i18n-value');
      if (strings[key]) {
        el.setAttribute('value', strings[key]);
      }
    });
    setActiveLang(lang);
  };

  const bindToggleHandlers = () => {
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      if (btn.dataset.i18nBound === 'true') {
        return;
      }
      btn.dataset.i18nBound = 'true';
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang || DEFAULT_LANG;
        localStorage.setItem(STORAGE_KEY, lang);
        applyTranslations(lang);
      });
    });
  };

  let observer = null;
  let observerTimeout = null;

  const scheduleI18nRefresh = () => {
    if (observerTimeout) {
      clearTimeout(observerTimeout);
    }
    observerTimeout = setTimeout(() => {
      const lang = getCurrentLang();
      applyTranslations(lang);
      bindToggleHandlers();
    }, 60);
  };

  const observeI18nChanges = () => {
    if (observer || !document.body) {
      return;
    }
    const selector =
      '[data-i18n],[data-i18n-placeholder],[data-i18n-aria-label],[data-i18n-title],[data-i18n-value]';
    observer = new MutationObserver((mutations) => {
      const shouldRefresh = mutations.some((mutation) => {
        return Array.from(mutation.addedNodes).some((node) => {
          if (node.nodeType !== 1) {
            return false;
          }
          const el = node;
          return el.matches(selector) || el.querySelector(selector);
        });
      });
      if (shouldRefresh) {
        scheduleI18nRefresh();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  };

  const getCurrentLang = () => localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;

  const getI18nString = (key, lang = getCurrentLang()) => {
    const strings = translations[lang] || translations[DEFAULT_LANG];
    return strings[key] || translations[DEFAULT_LANG][key] || '';
  };

  const initI18n = () => {
    const lang = getCurrentLang();
    applyTranslations(lang);
    bindToggleHandlers();
    observeI18nChanges();
  };

  window.initI18n = initI18n;
  window.getI18nString = getI18nString;
  window.getCurrentLang = getCurrentLang;
  document.addEventListener('DOMContentLoaded', initI18n);
})();
