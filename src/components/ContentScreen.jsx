import {
  aboutInfo,
  educationInfo,
  contactInfo,
  skillsInfo,
  projectsInfo,
  professionalExperience,
} from '../data/content'
import ChatAppAboutMe from './ChatAppAboutMe'

const VIEW_TITLES = {
  about: 'About Me',
  professional: 'Professional Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Personal Projects',
  contact: 'Contact',
}

// Portfolio content pages (About / Professional / Education / Skills / Projects
// / Contact) plus the CHAT WITH AI experience. `contentView` selects which;
// back navigation is owned by App.
//
// CHAT WITH AI renders the Persona 5-style chat (its own header + CLOSE
// control), so it replaces the standard content chrome entirely. The chat's
// CTAs jump to other sections via `onNavigate`. ABOUT ME is a separate, static
// page — the chatbot and the summary are deliberately distinct.
export default function ContentScreen({ contentView, onBack, onHover, onSelect, onNavigate }) {
  if (contentView === 'chat') {
    return (
      <section className="screen content-screen content-screen-chat">
        <ChatAppAboutMe onBack={onBack} onHover={onHover} onSelect={onSelect} onNavigate={onNavigate} />
      </section>
    )
  }

  return (
    <section className="screen content-screen">
      <div className="content-header">
        <p className="screen-label">PORTFOLIO PAGE</p>
        <h2>{VIEW_TITLES[contentView] ?? 'Portfolio'}</h2>
      </div>

      {contentView === 'about' && (
        <div className="content-card about-card">
          {aboutInfo.intro.map((paragraph) => (
            <p key={paragraph} className="page-copy">{paragraph}</p>
          ))}
          <ul className="about-highlights">
            {aboutInfo.highlights.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <button
            type="button"
            className="about-chat-link"
            onClick={() => onNavigate('chat')}
            onMouseEnter={onHover}
          >
            Chat with the AI guide →
          </button>
        </div>
      )}

      {contentView === 'professional' && (
        <div className="content-card">
          <div className="experience-head">
            <h3 className="experience-role">{professionalExperience.role}</h3>
            <p className="experience-company">{professionalExperience.company}</p>
            <p className="experience-meta">{professionalExperience.duration} · {professionalExperience.location}</p>
          </div>
          <p className="page-copy experience-summary">{professionalExperience.summary}</p>
          {professionalExperience.sections.map((section) => (
            <div className="experience-section" key={section.title}>
              <h4 className="experience-section-title">{section.title}</h4>
              <ul className="experience-list">
                {section.points.map((point) => <li key={point}>{point}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}

      {contentView === 'education' && (
        <div className="content-card edu-card">
          <div className="edu-head">
            <h3 className="edu-degree">{educationInfo.degree}</h3>
            <p className="edu-school">{educationInfo.school}</p>
            <p className="edu-meta">{educationInfo.duration} · {educationInfo.location}</p>
          </div>
          <ul className="edu-highlights">
            {educationInfo.highlights.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      )}

      {contentView === 'skills' && (
        <div className="content-card skills-card">
          <p className="page-copy skills-intro">{skillsInfo.intro}</p>
          <div className="skills-grid">
            {skillsInfo.categories.map((category) => (
              <div className="skill-category" key={category.title}>
                <h4 className="skill-category-title">{category.title}</h4>
                <div className="skill-tags">
                  {category.items.map((item) => (
                    <span className="skill-tag" key={item}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {contentView === 'projects' && (
        <div className="content-card projects-card">
          <p className="page-copy projects-intro">{projectsInfo.intro}</p>
          <div className="projects-grid">
            {projectsInfo.projects.map((project) => (
              <div className="project-card" key={project.name}>
                <h4 className="project-name">{project.name}</h4>
                <p className="project-blurb">{project.blurb}</p>
                <div className="project-tech">
                  {project.tech.map((tech) => (
                    <span className="tech-tag" key={tech}>{tech}</span>
                  ))}
                </div>
                {project.href && (
                  <a className="project-link" href={project.href} target="_blank" rel="noreferrer">
                    View project →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {contentView === 'contact' && (
        <div className="content-card contact-card">
          <p className="page-copy contact-blurb">{contactInfo.blurb}</p>
          {contactInfo.email && (
            <a
              className="contact-email"
              href={`mailto:${contactInfo.email}`}
              onMouseEnter={onHover}
            >
              <span className="email-icon" aria-hidden="true">✉</span>
              {contactInfo.email}
            </a>
          )}
          <div className="contact-links">
            {contactInfo.links.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label}</a>
            ))}
          </div>
          {contactInfo.resumeHref && (
            <a className="resume-btn" href={contactInfo.resumeHref} target="_blank" rel="noreferrer" onMouseEnter={onHover}>
              Download Résumé
            </a>
          )}
        </div>
      )}

      <button type="button" className="back-button" onClick={onBack} onMouseEnter={onHover}>BACK TO MENU</button>
    </section>
  )
}
