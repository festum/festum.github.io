import { FormEvent, useEffect, useState } from 'react';
import { CountUp } from 'countup.js';
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

type Fact = {
  icon: string;
  value: number;
  label: string;
};

const skills: Skill[] = [
  { name: 'Go', percent: 95 },
  { name: 'Python', percent: 80 },
  { name: 'Kubernetes & Docker', percent: 85 },
  { name: 'AWS', percent: 70 },
  { name: 'Git & CI/CD', percent: 90 },
  { name: 'TypeScript', percent: 70 },
];

const services: Service[] = [
  { icon: 'icon-globe', title: 'Development', description: 'Making backend system in Go/Python/PHP.' },
  { icon: 'icon-chemistry', title: 'Build', description: 'Setup any OpenSource system, DNS and VPS included.' },
  { icon: 'icon-directions', title: 'Deployment', description: 'Make a auto deployment pipeline solution.' },
  { icon: 'icon-rocket', title: 'Refactoring', description: 'Replace legacy with modern solution.' },
  { icon: 'icon-note', title: 'Architect', description: 'Design a solution with any industry size.' },
  { icon: 'icon-bubbles', title: 'Support', description: 'Your best consultant. Ask me for any questions.' },
];

const experiences: Experience[] = [
  { period: '2019 - Present', company: 'PPRO - Software Developer', summary: 'Solving complex problem in Fintech company' },
  { period: '2018 - 2019', company: 'Coosto - Sr.Data Engineer', summary: 'Handling job vacancy data pipeline' },
  { period: '2017 - 2018', company: 'CGG - Principle Engineer', summary: 'Building data warehouse for financial packages' },
  { period: '2014 - 2017', company: 'TrendMicro - Sr. Engineer', summary: 'Developing security system for home IoT' },
  { period: '2011 - 2014', company: 'III - Cloud Developer', summary: 'Developing cloud storage with NAS solution' },
];

const facts: Fact[] = [
  { icon: 'icon-like', value: 119, label: 'Projects completed' },
  { icon: 'icon-cup', value: 10, label: 'Years of tea' },
  { icon: 'icon-emotsmile', value: 89, label: 'Happy customers' },
  { icon: 'icon-trophy', value: 45, label: 'Daily commits' },
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
const avatarPath = './assets/images/avatar.svg';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [preloading, setPreloading] = useState(true);
  const [showBackTop, setShowBackTop] = useState(false);
  const [contactState, setContactState] = useState<ContactState>('idle');
  const { ref: skillsRef, inView: skillsInView } = useInView({ threshold: 0.35, triggerOnce: true });
  const { ref: factsRef, inView: factsInView } = useInView({ threshold: 0.35, triggerOnce: true });

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
    if (!factsInView) {
      return;
    }

    const counters = document.querySelectorAll<HTMLElement>('[data-count-to]');
    counters.forEach((counter) => {
      const end = Number(counter.dataset.countTo ?? '0');
      const animator = new CountUp(counter, end, { duration: 2 });

      if (!animator.error) {
        animator.start();
      }
    });
  }, [factsInView]);

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
          <ScrollLink to="home" className="logo transition-transform duration-300 hover:scale-105" {...scrollConfig} onClick={() => setMenuOpen(false)}><img className="avatar-twilight" src={avatarPath} alt="Festum Qin" /></ScrollLink>
          <ScrollLink to="home" className="site-title dot ml-2 transition-colors duration-300" {...scrollConfig} onClick={() => setMenuOpen(false)}>
            Festum Qin
          </ScrollLink>
        </div>

        <header className={`left float-left shadow-dark transition-colors duration-300 ease-in-out ${menuOpen ? 'open' : ''}`.trim()} id="header">
          <button type="button" className="close" aria-label="Close" onClick={() => setMenuOpen(false)}>
            <span aria-hidden="true">&times;</span>
          </button>
          <div className="header-inner d-flex align-items-start flex-column">
            <ScrollLink to="home" {...scrollConfig} onClick={() => setMenuOpen(false)}><img className="avatar-twilight" src={avatarPath} alt="Festum Qin" /></ScrollLink>
            <ScrollLink to="home" className="site-title dot mt-3 transition-colors duration-300" {...scrollConfig} onClick={() => setMenuOpen(false)}>
              Festum Qin
            </ScrollLink>
            <span className="site-slogan">Pro Dev</span>

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
                <li className="list-inline-item"><a href="https://twitter.com/festum" className={socialLinkClass}><i className="fab fa-twitter" /></a></li>
                <li className="list-inline-item"><a href="https://fesqin.t.me" className={socialLinkClass}><i className="fab fa-telegram" /></a></li>
                <li className="list-inline-item"><a href="https://paypal.me/frqin" className={socialLinkClass}><i className="fab fa-paypal" /></a></li>
              </ul>
              <span className="copyright">© 2023 FesQin</span>
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
                A skilled and motivated developer with proven expertise in using Go, Python, gRPC, AWS, Kubernetes and other
                technologies working with continuous integration. Being a fast learner, I always use new technology to drive improvements
                throughout an entire software development lifecycle.
              </p>
              <a href="https://linkedin.com/in/festum" className={`btn btn-default btn-lg mr-3 ${ctaClass}`}>
                <i className="icon-grid" />View Portfolio
              </a>
              <div className="spacer d-md-none d-lg-none d-sm-none" style={{ height: 10 }} />
              <ScrollLink to="contact" className={`btn btn-border-light btn-lg ${ctaClass}`} {...scrollConfig} onClick={() => setMenuOpen(false)}><i className="icon-envelope" />Work with me
                            </ScrollLink>
            </div>
            <div className="overlay" />
          </section>

          <section id="about" className="shadow-blue white-bg padding">
            <h3 className="section-title">About Me</h3>
            <div className="spacer" style={{ height: 80 }} />

            <div className="row">
              <div className="col-md-3">
                <img className="avatar-twilight" src={avatarPath} alt="about" />
              </div>
              <div className="col-md-9">
                <h2 className="mt-4 mt-md-0 mb-4">Hello,</h2>
                <p className="mb-0">
                  I am a software developer from Taipei. Worked in Taiwan, Hong Kong, Netherlands, and Germany. I have 15 years extensive
                  industry and full life cycle experience in an IT environment both as a full stack developer, along with exceptional
                  analytical, designing and problem-solving capabilities.
                </p>
                <div className="row my-4">
                  <div className="col-md-6">
                    <p className="mb-2">Name: <span className="text-dark">Festum Qin</span></p>
                  </div>
                  <div className="col-md-6 mt-2 mt-md-0 mt-sm-2">
                    <p className="mb-2">Location: <span className="text-dark">Munich, DE</span></p>
                    <p className="mb-0">Email: <span className="text-dark">im@fesq.in</span></p>
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
            <h3 className="section-title">My skills</h3>
            <div className="spacer" style={{ height: 80 }} />
            <p className="mb-0">I start programming from 2002, and switched to fully backend domain since 2014, thus web design is no longer apply to me.</p>

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

          <section id="facts" className="shadow-dark color-white padding-50" ref={factsRef}>
            <div className="row relative z-1">
              {facts.map((fact) => (
                <div className="col-md-3 col-sm-6" key={fact.label}>
                  <div className="fact-item text-center">
                    <i className={`${fact.icon} icon-circle`} />
                    <h2 className="count" data-count-to={fact.value}>0</h2>
                    <span>{fact.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="services" className="shadow-blue white-bg padding">
            <h3 className="section-title">Services</h3>
            <div className="spacer" style={{ height: 80 }} />

            <div className="row">
              {services.map((service) => (
                <div className="col-md-4 col-sm-6" key={service.title}>
                  <div className="service-item text-center">
                    <i className={`${service.icon} icon-simple`} />
                    <h4 className="my-3">{service.title}</h4>
                    <p className="mb-0">{service.description}</p>
                  </div>
                  <div className="spacer" style={{ height: 20 }} />
                </div>
              ))}
            </div>
          </section>

          <section id="resume" className="shadow-blue white-bg padding">
            <h3 className="section-title">Experience</h3>
            <div className="spacer" style={{ height: 80 }} />

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
            <h3 className="section-title">Get in <a href="https://teleport.org/users/festum/">touch</a></h3>
            <div className="spacer" style={{ height: 80 }} />

            <div className="row">
              <div className="col-md-4 mb-4 mb-md-0">
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
                    <span>St.-Bonifatius-Str.</span>
                  </div>
                </div>
              </div>

              <div className="col-md-8">
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
