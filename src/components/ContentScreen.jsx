import { aboutText, educationText, contactLinks, professionalExperience } from '../data/content'
import ChatAppAboutMe from './ChatAppAboutMe'

// Portfolio content pages (About / Professional / Education / Contact).
// `contentView` selects which; back navigation is owned by App.
//
// ABOUT ME is special: it renders the Persona 5-style chat experience, which
// brings its own header + CLOSE control, so it replaces the standard content
// chrome entirely. The chat's CTAs jump to other sections via `onNavigate`.
export default function ContentScreen({ contentView, onBack, onHover, onSelect, onNavigate }) {
  if (contentView === 'about') {
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
        <h2>
          {contentView === 'professional'
            ? 'Professional Experience'
            : contentView === 'education'
              ? 'Education'
              : 'Contact'}
        </h2>
      </div>
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
        <div className="content-card">
          {educationText.map((line) => <p key={line} className="page-copy">{line}</p>)}
        </div>
      )}
      {contentView === 'contact' && (
        <div className="content-card">
          <div className="contact-links">
            {contactLinks.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label}</a>
            ))}
          </div>
        </div>
      )}
      <button type="button" className="back-button" onClick={onBack} onMouseEnter={onHover}>BACK TO MENU</button>
    </section>
  )
}
