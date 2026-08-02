import { useState } from 'react';
import { MapPin, Mail, Phone, Clock, Facebook, Twitter, Instagram } from 'lucide-react';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import Card from '@components/common/Card';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // TODO: Implement form submission
    setTimeout(() => {
      setLoading(false);
      alert('Message sent successfully!');
    }, 1000);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-lmsa-50 to-lmsa-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6 uppercase tracking-tight">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-balance">
            Get in touch with the LMSA team - we're here to help
          </p>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold mb-6 uppercase tracking-tight">Get In Touch</h2>
              <Card className="mb-8 hover:shadow-md transition-shadow duration-200">
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <MapPin size={20} className="text-lmsa-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Address</h3>
                      <p className="text-gray-600 text-balance">
                        LMSA Secretariat<br />
                        A.M. Dogliotti College of Medicine<br />
                        University of Liberia<br />
                        Monrovia, Liberia
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail size={20} className="text-lmsa-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Email</h3>
                      <a href="mailto:info@lmsa.org.lr" className="text-lmsa-600 hover:text-lmsa-700 transition-colors duration-200">
                        info@lmsa.org.lr
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone size={20} className="text-lmsa-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Phone</h3>
                      <a href="tel:+231770000000" className="text-lmsa-600 hover:text-lmsa-700 transition-colors duration-200">
                        +231 77 000 0000
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock size={20} className="text-lmsa-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Office Hours</h3>
                      <p className="text-gray-600 text-balance">
                        Monday - Friday: 9:00 AM - 5:00 PM<br />
                        Saturday: 10:00 AM - 2:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Social Media */}
              <Card>
                <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="p-3 bg-gray-100 rounded-lg hover:bg-lmsa-600 hover:text-white text-gray-700 transition-all duration-200"
                    aria-label="Facebook"
                  >
                    <Facebook size={20} />
                  </a>
                  <a
                    href="#"
                    className="p-3 bg-gray-100 rounded-lg hover:bg-lmsa-600 hover:text-white text-gray-700 transition-all duration-200"
                    aria-label="Twitter"
                  >
                    <Twitter size={20} />
                  </a>
                  <a
                    href="#"
                    className="p-3 bg-gray-100 rounded-lg hover:bg-lmsa-600 hover:text-white text-gray-700 transition-all duration-200"
                    aria-label="Instagram"
                  >
                    <Instagram size={20} />
                  </a>
                </div>
              </Card>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-6 uppercase tracking-tight">Send Us a Message</h2>
              <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      className="input w-full"
                      required
                    />
                  </div>
                  <Button type="submit" loading={loading} fullWidth>
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
