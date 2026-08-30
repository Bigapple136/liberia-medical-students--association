import { Link } from 'react-router-dom';
import { Target, Users, Lightbulb } from 'lucide-react';
import Button from '@components/common/Button';

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-lmsa-50 to-lmsa-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 uppercase tracking-tight">About LMSA</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-balance">
            Learn about our mission, history, and commitment to medical education in Liberia
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="card hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-600 text-balance">
                To unite medical students at A.M. Dogliotti College of Medicine and promote
                excellence in medical education, research, and community service while
                advocating for student welfare and professional development.
              </p>
            </div>
            <div className="card hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-gray-600 text-balance">
                To be the leading voice for medical students in Liberia, producing competent,
                compassionate, and ethical physicians who will transform healthcare in our nation.
              </p>
            </div>
          </div>

          {/* History */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 uppercase tracking-tight">Our History</h2>
            <div className="card">
              <p className="text-gray-600 mb-4 text-balance">
                The Liberia Medical Students&apos; Association (LMSA) was established in 1972 at the
                A.M. Dogliotti College of Medicine, University of Liberia. For over five decades,
                LMSA has served as the unified voice of medical students, advocating for academic
                excellence, student welfare, and professional development.
              </p>
              <p className="text-gray-600 mb-4 text-balance">
                From its humble beginnings with just a few dozen students, LMSA has grown to
                represent hundreds of medical students across all years of study. Our members
                have gone on to become leading physicians, surgeons, researchers, and healthcare
                administrators both in Liberia and internationally.
              </p>
              <p className="text-gray-600 text-balance">
                Today, LMSA continues to evolve, embracing new technologies and methodologies
                to better serve our members and contribute to the advancement of medical education
                and healthcare delivery in Liberia.
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 uppercase tracking-tight">Our Core Values</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {values.map((value, index) => (
              <div key={index} className="card text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                <div className="text-lmsa-600 mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight">Join Our Community</h2>
            <p className="text-gray-600 mb-6 text-balance">
              Become part of a legacy of excellence and service
            </p>
            <Link to="/register">
              <Button variant="primary">Become a Member</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

const values = [
  {
    icon: <Target size={32} strokeWidth={1.5} />,
    title: 'Excellence',
    description: 'Commitment to the highest standards in medical education and patient care'
  },
  {
    icon: <Users size={32} strokeWidth={1.5} />,
    title: 'Unity',
    description: 'Standing together to support and uplift every medical student'
  },
  {
    icon: <Lightbulb size={32} strokeWidth={1.5} />,
    title: 'Innovation',
    description: 'Embracing new ideas and technologies to advance medical education'
  }
];
