import { useState } from 'react';
import Modal from './Modal';
import Input from './Input';
import Textarea from './Textarea';
import Button from './Button';
import { submitContactQuery } from '../../utils/api';

const ContactQueryModal = ({ isOpen, onClose, source = 'login' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setSubmitted(false);
    setError('');
    setFormData({ name: '', email: '', subject: '', message: '' });
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setIsSubmitting(true);
      const res = await submitContactQuery({ ...formData, source });
      if (res.success) {
        setSubmitted(true);
      } else {
        setError(res.message || 'Failed to submit query');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit query. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Contact Admin" modalClassName="max-w-2xl">
      {submitted ? (
        <div className="text-center py-6">
          <i className="fas fa-check-circle text-green-500 text-5xl mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Query Submitted!</h3>
          <p className="text-gray-600 mb-6">
            Our admin team has been notified and will get back to you at{' '}
            <span className="font-medium">{formData.email}</span>.
          </p>
          <Button onClick={handleClose}>Close</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-gray-600">
            Having trouble? Describe your issue and our admin team will reach out to you by email.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <Input
            label="Your Name"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Input
            label="Subject"
            name="subject"
            placeholder="Brief description of your issue"
            value={formData.subject}
            onChange={handleChange}
            required
          />

          <Textarea
            label="Message"
            name="message"
            rows={4}
            placeholder="Describe your query or problem in detail..."
            value={formData.message}
            onChange={handleChange}
            required
          />

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="secondary" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
              <i className="fas fa-paper-plane mr-2"></i>
              Send to Admin
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default ContactQueryModal;
