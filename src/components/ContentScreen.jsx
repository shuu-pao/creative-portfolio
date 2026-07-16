import { aboutText, educationText, contactLinks } from '../data/content'

// Portfolio content pages (About / Education / Contact). `contentView` selects
// which; back navigation is owned by App.
export default function ContentScreen({ contentView, onBack, onHover }) {
  return (
    <section className="screen content-screen">
      <div className="content-header">
        <p className="screen-label">PORTFOLIO PAGE</p>
        <h2>{contentView === 'about' ? 'About Me' : contentView === 'education' ? 'Education' : 'Contact'}</h2>
      </div>
      {contentView === 'about' && (
        <div className="content-card">
          {aboutText.map((paragraph) => <p key={paragraph} className="page-copy">{paragraph}</p>)}
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
