import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function EditorialSectionHeader({ eyebrow, title, description, align = 'left', as: Heading = 'h2' }) {
  return (
    <div className={`editorial-section-header ${align === 'center' ? 'editorial-section-header-center' : ''}`}>
      {eyebrow && <p className="editorial-overline">{eyebrow}</p>}
      <Heading>{title}</Heading>
      {description && <p>{description}</p>}
    </div>
  );
}

export function EditorialLinkCard({ to, eyebrow, title, description, icon: Icon, className = '' }) {
  return (
    <Link to={to} className={`group editorial-link-card ${className}`}>
      {Icon && (
        <span className="editorial-link-card-icon" aria-hidden="true">
          <Icon size={22} strokeWidth={1.6} />
        </span>
      )}
      <div className="editorial-link-card-copy">
        {eyebrow && <span className="editorial-card-eyebrow">{eyebrow}</span>}
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </div>
      <ArrowRight className="editorial-link-card-arrow" size={19} aria-hidden="true" />
    </Link>
  );
}

export function EditorialCallout({ eyebrow, title, description, action, tone = 'green' }) {
  return (
    <section className={`editorial-callout editorial-callout-${tone}`}>
      <div>
        {eyebrow && <p className="editorial-overline">{eyebrow}</p>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action && (
        <Link to={action.to} className="editorial-callout-action">
          {action.label}
          <ArrowRight size={17} aria-hidden="true" />
        </Link>
      )}
    </section>
  );
}

export function EditorialStat({ value, label, detail }) {
  return (
    <div className="editorial-stat">
      <strong>{value}</strong>
      <span>{label}</span>
      {detail && <small>{detail}</small>}
    </div>
  );
}