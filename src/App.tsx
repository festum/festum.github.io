import { FormEvent, useEffect, useState } from 'react';
import * as ReactSimpleMapsModule from 'react-simple-maps';
import { useInView } from 'react-intersection-observer';
import * as ReactScrollModule from 'react-scroll';

type Skill = {
  name: string;
  percent: number;
};

type Service = {
  icon: string;
  title: string;
  description: string;
};

type Experience = {
  period: string;
  company: string;
  summary: string;
};


const skills: Skill[] = [
  { name: 'Go · Python · TypeScript', percent: 85 },
  { name: 'LLM & Agentic Systems', percent: 90 },
  { name: 'Kubernetes · Docker · AWS', percent: 82 },
  { name: 'CI/CD & DevOps', percent: 90 },
  { name: 'PostgreSQL · MySQL · NoSQL', percent: 70 },
];

const services: Service[] = [
  { icon: 'icon-rocket', title: 'LLM Integration', description: 'Production AI agents and agentic workflows wired into real systems — MCP servers, agent memory, enterprise-safe pipelines. Not demos.' },
  { icon: 'icon-note', title: 'Enterprise Architecture', description: 'Distributed systems for regulated environments and real scale. From FinTech payment infrastructure to cloud-native SaaS.' },
  { icon: 'icon-chemistry', title: 'Cloud & SaaS', description: 'AWS, Kubernetes, Terraform — code to cluster. CI/CD pipelines that make production deployments uneventful.' },
  { icon: 'icon-directions', title: 'System Transformation', description: 'Replace the engine while the plane flies. Monolith decomposition and rewrites shipped without downtime.' },
  { icon: 'icon-globe', title: 'Europe Entry', description: 'Expanding a product or company into Europe? FinTech compliance, regulatory navigation, and practical market setup — across 4 countries of firsthand experience.' },
  { icon: 'icon-bubbles', title: 'Overseas Navigation', description: 'Tax optimisation, residency pathways, Asia → Europe relocation strategy. Ask before paying a consultant €300/hr for the same answers.' },
];

const experiences: Experience[] = [
  { period: '2019 - Present', company: 'PPRO · Software Engineer', summary: 'Deep inside European payment infrastructure — a mesh of microservices moving money for millions of merchants, built not to fail. Automation runs deep: most code ships from AI, engineers steer the architecture.' },
  { period: '2018 - 2019', company: 'Coosto · Sr. Data Engineer', summary: 'Built machines that read the internet at scale — billions of signals a day, harvested without leaving a footprint. Infrastructure that learns, adapts, and doesn\'t get stopped.' },
  { period: '2017 - 2018', company: 'CGG · Principal Engineer', summary: 'Crossed the sea to Hong Kong at 33. Architected the data foundations beneath Asia-Pacific\'s largest financial comparison network.' },
  { period: '2014 - 2017', company: 'Trend Micro · Sr. Engineer', summary: 'Shipped security into Japan\'s connected homes at national scale — millions of IoT devices, high-traffic infrastructure built to hold. The threats arrived later.' },
  { period: '2011 - 2014', company: 'III · Cloud Developer', summary: 'Built the cloud storage layer beneath millions of users — seamlessly integrated with NAS, invisible and indispensable. The kind of infrastructure people trust without thinking about it.' },
];


type JourneyStop = {
  name: string;
  label: string;
  emoji: string;
  period: string;
  coords: [number, number];
  current?: boolean;
  anchor?: 'start' | 'middle' | 'end';
  labelOffset?: [number, number];
};

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const journeyStops: JourneyStop[] = [
  { name: 'Taipei',     label: 'Taiwan',      emoji: '🇹🇼', period: '~ 2017', coords: [121.56, 25.03], anchor: 'middle', labelOffset: [0, -16]  },
  { name: 'Hong Kong', label: 'Hong Kong',   emoji: '🇭🇰', period: '2017 – 2018', coords: [114.17, 22.32], anchor: 'end',    labelOffset: [-8, 18]  },
  { name: 'Eindhoven', label: 'Netherlands', emoji: '🇳🇱', period: '2018 – 2019', coords: [5.47,   51.44], anchor: 'end',    labelOffset: [-8, -16] },
  { name: 'Munich',    label: 'Germany',     emoji: '🇩🇪', period: '2019 – Now',  coords: [11.58,  48.14], anchor: 'start',  labelOffset: [8, -16],  current: true },
];

type Slide = { category: string; text: string };
const aboutSlides: Slide[] = [
  { category: 'Origins',      text: 'Writing code since 2002. Hundreds of websites shipped before most people had a smartphone — e-commerce platforms, creative tools, internal systems. The foundation everything else is built on.' },
  { category: 'Recognition', text: "Built YouSteez, an online SVG vector logo editor, and placed 2nd at the International ICT Innovative Services Contest. Later won Gold and Silver at iENA Nuremberg — one of the world's largest invention fairs." },
  { category: 'Tax',         text: 'Optimised a personal German tax return to nearly \u20ac4,000 back in a single year. Regular years consistently return over \u20ac1,000 — without an accountant.' },
  { category: 'AI Workforce', text: 'Four Hermes Agent teams running in parallel. Projects move from idea to live in one to a few weeks — because most of the execution is already delegated.' },
];

type ContactState = 'idle' | 'sending' | 'sent' | 'error';

const scrollConfig = {
  smooth: true,
  duration: 800,
  offset: -50,
};
const navLinkClass = 'transition-colors duration-200 hover:text-indigo-200';
const socialLinkClass = 'inline-flex transition-transform duration-200 hover:-translate-y-0.5 hover:scale-110';
const ctaClass = 'transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg';
const ScrollLink = (ReactScrollModule as any).Link ?? (ReactScrollModule as any).default?.Link;
const animateScroll = (ReactScrollModule as any).animateScroll ?? (ReactScrollModule as any).default?.animateScroll;
const ComposableMap = (ReactSimpleMapsModule as any).ComposableMap ?? (ReactSimpleMapsModule as any).default?.ComposableMap;
const Geographies = (ReactSimpleMapsModule as any).Geographies ?? (ReactSimpleMapsModule as any).default?.Geographies;
const Geography = (ReactSimpleMapsModule as any).Geography ?? (ReactSimpleMapsModule as any).default?.Geography;
const Marker = (ReactSimpleMapsModule as any).Marker ?? (ReactSimpleMapsModule as any).default?.Marker;
const Line = (ReactSimpleMapsModule as any).Line ?? (ReactSimpleMapsModule as any).default?.Line;
const ZoomableGroup = (ReactSimpleMapsModule as any).ZoomableGroup ?? (ReactSimpleMapsModule as any).default?.ZoomableGroup;
const avatarPath = './assets/images/avatar.svg';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [preloading, setPreloading] = useState(true);
  const [showBackTop, setShowBackTop] = useState(false);
  const [contactState, setContactState] = useState<ContactState>('idle');
  const [aboutSlideIndex, setAboutSlideIndex] = useState(0);
  const { ref: skillsRef, inView: skillsInView } = useInView({ threshold: 0.35, triggerOnce: true });

  useEffect(() => {
    const timer = window.setTimeout(() => setPreloading(false), 350);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY >= 250);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (aboutSlides.length <= 1) {
      return;
    }

    const slideTimer = window.setInterval(() => {
      setAboutSlideIndex((index) => (index + 1) % aboutSlides.length);
    }, 3000);

    return () => window.clearInterval(slideTimer);
  }, []);



  const onContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setContactState('sending');

    const form = event.currentTarget;
    const body = new FormData(form);

    try {
      const response = await fetch('https://formspree.io/f/xrgoowrz', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body,
      });

      if (!response.ok) {
        throw new Error('Form submit failed');
      }

      form.reset();
      setContactState('sent');
    } catch {
      setContactState('error');
    }
  };

  return (
    <>
      {preloading ? (
        <div id="preloader">
          <div className="outer">
            <div className="spinner">
              <div className="dot1" />
              <div className="dot2" />
            </div>
          </div>
        </div>
      ) : null}

      <div className="site-wrapper">
        <div className={`mobile-header py-2 px-3 mt-4 transition-colors duration-300 ease-in-out ${menuOpen ? 'push' : ''}`.trim()}>
          <button className="menu-icon mr-2 transition-transform duration-300 hover:scale-110 active:scale-95" onClick={() => setMenuOpen((v) => !v)} aria-label="Open menu" type="button">
            <span />
            <span />
            <span />
          </button>
          <ScrollLink to="home" className="logo transition-transform duration-300 hover:scale-105" {...scrollConfig} onClick={() => setMenuOpen(false)}><img className="avatar-left-panel" src={avatarPath} alt="Festum Qin" /></ScrollLink>
          <ScrollLink to="home" className="site-title dot ml-2 transition-colors duration-300" {...scrollConfig} onClick={() => setMenuOpen(false)}>
            Festum Qin
          </ScrollLink>
        </div>

        <header className={`left float-left shadow-dark transition-colors duration-300 ease-in-out ${menuOpen ? 'open' : ''}`.trim()} id="header">
          <button type="button" className="close" aria-label="Close" onClick={() => setMenuOpen(false)}>
            <span aria-hidden="true">&times;</span>
          </button>
          <div className="header-inner d-flex align-items-start flex-column">
            <ScrollLink to="home" {...scrollConfig} onClick={() => setMenuOpen(false)}><img className="avatar-left-panel" src={avatarPath} alt="Festum Qin" /></ScrollLink>
            <ScrollLink to="home" className="site-title dot mt-3 transition-colors duration-300" {...scrollConfig} onClick={() => setMenuOpen(false)}>
              Festum Qin
            </ScrollLink>
            <span className="site-slogan">LLM · Enterprise · Cloud SaaS</span>

            <nav>
              <ul className="vertical-menu scrollspy">
                <li>
                  <ScrollLink to="home" className={navLinkClass} {...scrollConfig} onClick={() => setMenuOpen(false)}><i className="icon-home" />Home
                                    </ScrollLink>
                </li>
                <li>
                  <ScrollLink to="about" className={navLinkClass} {...scrollConfig} onClick={() => setMenuOpen(false)}><i className="icon-energy" />About
                                    </ScrollLink>
                </li>
                <li>
                  <ScrollLink to="services" className={navLinkClass} {...scrollConfig} onClick={() => setMenuOpen(false)}><i className="icon-grid" />Services
                                    </ScrollLink>
                </li>
                <li>
                  <a href="https://shop.fesq.in" className={navLinkClass}>
                    <i className="icon-basket" />Shop
                  </a>
                </li>
                <li>
                  <ScrollLink to="resume" className={navLinkClass} {...scrollConfig} onClick={() => setMenuOpen(false)}><i className="icon-briefcase" />Resume
                                    </ScrollLink>
                </li>
                <li>
                  <ScrollLink to="contact" className={navLinkClass} {...scrollConfig} onClick={() => setMenuOpen(false)}><i className="icon-phone" />Contact
                                    </ScrollLink>
                </li>
              </ul>
            </nav>

            <div className="footer mt-auto">
              <ul className="social-icons list-inline">
                <li className="list-inline-item"><a href="https://github.com/festum" className={socialLinkClass}><i className="fab fa-github" /></a></li>
                <li className="list-inline-item"><a href="https://linkedin.com/in/festum" className={socialLinkClass}><i className="fab fa-linkedin" /></a></li>
                <li className="list-inline-item"><a href="https://x.com/festum" className={socialLinkClass}><i className="fab fa-twitter" /></a></li>
                <li className="list-inline-item"><a href="https://fesqin.t.me" className={socialLinkClass}><i className="fab fa-telegram" /></a></li>
                <li className="list-inline-item"><a href="https://paypal.me/frqin" className={socialLinkClass}><i className="fab fa-paypal" /></a></li>
              </ul>
              <span className="copyright">© {new Date().getFullYear()} FesQin &middot; <a href="./products/font-rendering-enhancer/privacy" className="underline">Privacy Policy</a></span>
            </div>
          </div>
        </header>

        <main className={`content float-right ${menuOpen ? 'push' : ''}`.trim()} onClick={() => setMenuOpen(false)}>
          <section
            className="hero background parallax shadow-dark d-flex align-items-center"
            id="home"
            style={{ backgroundImage: `url('${avatarPath}')` }}
          >
            <div className="cta mx-auto mt-2">
              <h1 className="mt-0 mb-4">
                I’m Festum Qin<span className="dot" />
              </h1>
              <p className="mb-4">
                Sixteen years building systems that handle real money, real traffic, real consequences — across four countries. Now in Munich, at the frontier of enterprise infrastructure and AI engineering. The same instinct carries over: tax structures, overseas moves, European expansion. If it's a system, it can be figured out.
              </p>
              <a href="https://github.com/festum" className={`btn btn-default btn-lg mr-3 ${ctaClass}`}>
                <i className="fab fa-github" />GitHub
              </a>
              <div className="spacer d-md-none d-lg-none d-sm-none" style={{ height: 10 }} />
              <ScrollLink to="contact" className={`btn btn-border-light btn-lg ${ctaClass}`} {...scrollConfig} onClick={() => setMenuOpen(false)}><i className="icon-envelope" />Work with me
                            </ScrollLink>
            </div>
            <div className="overlay" />
          </section>

          <section id="about" className="shadow-blue white-bg padding">
            <h3 className="section-title">About</h3>
            <div className="spacer" style={{ height: 80 }} />

            <div className="row">
              <div className="col-md-3">
                <img className="avatar-twilight" src={avatarPath} alt="about" />
              </div>
              <div className="col-md-9">
                <div className="about-slider mt-4 mt-md-0">
                  <div className="about-slider-track">
                    {aboutSlides.map((slide, index) => (
                      <div key={slide.category} className={`testimonial-item about-slider-item about-slide ${index === aboutSlideIndex ? 'active' : ''}`.trim()}>
                        <span className="symbol text-indigo-500">{slide.category}</span>
                        <p>{slide.text}</p>
                      </div>
                    ))}
                  </div>
                  <div className="about-slider-dots" role="tablist" aria-label="About slides">
                    {aboutSlides.map((slide, index) => (
                      <button
                        key={slide.category}
                        type="button"
                        className={`about-slider-dot ${index === aboutSlideIndex ? 'active' : ''}`.trim()}
                        aria-label={`Go to slide ${index + 1}`}
                        aria-current={index === aboutSlideIndex}
                        onClick={() => setAboutSlideIndex(index)}
                      />
                    ))}
                  </div>
                </div>

                <a href="https://drive.google.com/file/d/1tiIr3L8ER-HR-LYukfSmH9cRkGTMg1e-/view" className="btn btn-default mr-3">
                  <i className="icon-cloud-download" />Download CV
                </a>
                <a href="https://calendly.com/festum/30min" className="btn btn-alt mt-2 mt-md-0 mt-xs-2">
                  <i className="icon-event" />Meet me
                </a>
              </div>
            </div>
          </section>

          <section id="skills" className="shadow-blue white-bg padding" ref={skillsRef}>
            <h3 className="section-title">Stack</h3>
            <div className="spacer" style={{ height: 80 }} />
            <p className="mb-0">Started in 2002. Went deep on backend systems by 2014. The interesting work now sits where production engineering meets AI.</p>

            <div className="row mt-5">
              {skills.map((skill) => (
                <div className="col-md-6" key={skill.name}>
                  <div className="skill-item">
                    <div className="skill-info clearfix">
                      <h4 className="float-left mb-3 mt-0">{skill.name}</h4>
                      <span className="float-right">{skill.percent}%</span>
                    </div>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={skill.percent}
                        style={{ width: skillsInView ? `${skill.percent}%` : 0, transition: 'width 1.2s linear' }}
                      />
                    </div>
                    <div className="spacer" style={{ height: 40 }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="services" className="shadow-blue white-bg padding">
            <h3 className="section-title">Services</h3>
            <div className="spacer" style={{ height: 80 }} />

            <div className="row services-grid">
              {services.map((service) => (
                <div className="col-md-4 col-sm-6 mb-4 service-card-column" key={service.title}>
                  <div className="service-item text-center">
                    <i className={`${service.icon} icon-simple`} />
                    <h4 className="my-3">{service.title}</h4>
                    <p className="mb-0">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="resume" className="shadow-blue white-bg padding">
            <h3 className="section-title">Journey</h3>
            <div className="spacer" style={{ height: 80 }} />

            <div
              className="journey-map-wrap"
              onWheel={(event) => event.preventDefault()}
              onMouseDown={(event) => event.preventDefault()}
              onPointerDown={(event) => event.preventDefault()}
              onTouchStart={(event) => event.preventDefault()}
              style={{ borderRadius: 12, overflow: 'hidden', background: '#0f172a', border: '1px solid #1e293b', marginBottom: 48 }}
            >
              <ComposableMap
                projection="geoNaturalEarth1"
                projectionConfig={{ center: [65, 35], scale: 185 }}
                style={{ width: '100%', height: 'auto' }}
              >
                <ZoomableGroup center={[60, 42]} zoom={1.75} disablePanning disableZooming>
                  <Geographies geography={geoUrl}>
                    {({ geographies }: { geographies: any[] }) =>
                      geographies.map((geo: any) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill="#1e293b"
                          stroke="#334155"
                          strokeWidth={0.5}
                          style={{ default: { outline: 'none' }, hover: { outline: 'none' }, pressed: { outline: 'none' } }}
                        />
                      ))
                    }
                  </Geographies>

                  {journeyStops.slice(0, -1).map((stop, i) => (
                    <Line
                      key={`arc-${i}`}
                      from={stop.coords}
                      to={journeyStops[i + 1].coords}
                      stroke="#6366f1"
                      strokeWidth={1.5}
                      strokeDasharray="5 4"
                      strokeLinecap="round"
                    />
                  ))}

                  {journeyStops.map((stop) => (
                    <Marker key={stop.name} coordinates={stop.coords}>
                      {stop.current && (
                        <circle r={14} fill="#818cf8" fillOpacity={0.2}>
                          <animate attributeName="r" values="7;18;7" dur="2.5s" repeatCount="indefinite" />
                          <animate attributeName="fill-opacity" values="0.2;0.04;0.2" dur="2.5s" repeatCount="indefinite" />
                        </circle>
                      )}
                      <circle
                        r={stop.current ? 7 : 5}
                        fill={stop.current ? '#818cf8' : '#6366f1'}
                        stroke="#0f172a"
                        strokeWidth={1.5}
                      />
                      <text
                        x={stop.labelOffset?.[0] ?? 0}
                        y={stop.labelOffset?.[1] ?? -14}
                        textAnchor={stop.anchor ?? 'middle'}
                        style={{ fontSize: 10, fill: '#e2e8f0', fontFamily: 'sans-serif', fontWeight: 600, pointerEvents: 'none' }}
                      >
                        {stop.emoji} {stop.label}
                      </text>
                      <text
                        x={stop.labelOffset?.[0] ?? 0}
                        y={(stop.labelOffset?.[1] ?? -14) + 11}
                        textAnchor={stop.anchor ?? 'middle'}
                        style={{ fontSize: 9, fill: '#94a3b8', fontFamily: 'sans-serif', pointerEvents: 'none' }}
                      >
                        {stop.period}
                      </text>
                    </Marker>
                  ))}
                </ZoomableGroup>
              </ComposableMap>
            </div>

            <div className="timeline">
              {experiences.map((item) => (
                <div className="entry" key={`${item.period}-${item.company}`}>
                  <div className="title">
                    <span>{item.period}</span>
                  </div>
                  <div className="body">
                    <h4 className="mt-0">{item.company}</h4>
                    <p>{item.summary}</p>
                  </div>
                </div>
              ))}
              <span className="timeline-line" />
            </div>
          </section>

          <section id="contact" className="shadow-blue white-bg padding pico">
            <h3 className="section-title">Get in <a href="https://fesqin.t.me/">touch</a></h3>
            <div className="spacer" style={{ height: 80 }} />

            <div className="row">
              <div className="col-md-4 mb-4 mb-md-0 contact-details-column">
                <div className="contact-info mb-5">
                  <i className="icon-phone" />
                  <div className="details">
                    <h5>Phone</h5>
                    <span>+49 15222104630</span>
                  </div>
                </div>
                <div className="contact-info mb-5">
                  <i className="icon-envelope" />
                  <div className="details">
                    <h5>Email address</h5>
                    <span>im@fesq.in</span>
                  </div>
                </div>
                <div className="contact-info">
                  <i className="icon-location-pin" />
                  <div className="details">
                    <h5>Location</h5>
                    <span>Obergiesing</span>
                  </div>
                </div>
              </div>

              <div className="col-md-8 contact-form-column">
                <form id="contact-form" className="contact-form" onSubmit={onContactSubmit}>
                  <div className="messages">
                    {contactState === 'sent' ? (
                      <div className="alert alert-success alert-dismissable">Message sent. Thank you!</div>
                    ) : null}
                    {contactState === 'error' ? (
                      <div className="alert alert-danger alert-dismissable">Message send failed. Please retry.</div>
                    ) : null}
                  </div>

                  <div className="row">
                    <div className="column col-md-6">
                      <div className="form-group">
                        <input type="text" className="form-control" name="name" placeholder="Your name" required />
                      </div>
                    </div>
                    <div className="column col-md-6">
                      <div className="form-group">
                        <input type="email" className="form-control" name="_replyto" placeholder="Email address" required />
                      </div>
                    </div>
                    <div className="column col-md-12">
                      <div className="form-group">
                        <input type="text" className="form-control" name="_subject" placeholder="Subject" required />
                      </div>
                    </div>
                    <div className="column col-md-12">
                      <div className="form-group">
                        <textarea name="message" className="form-control" rows={5} placeholder="Message" required />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-default" disabled={contactState === 'sending'}>
                    <i className="icon-paper-plane" />
                    {contactState === 'sending' ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </section>
        </main>
      </div>

      <a
        href="#home"
        id="return-to-top"
        onClick={(event) => {
          event.preventDefault();
          animateScroll?.scrollToTop({ duration: 400, smooth: 'easeInOutQuad' });
        }}
        className="transition-all duration-300 hover:-translate-y-1 motion-safe:animate-pulse"
        style={{ display: showBackTop ? 'inline-block' : 'none' }}
      >
        <i className="fa fa-chevron-up" />
      </a>
    </>
  );
}
