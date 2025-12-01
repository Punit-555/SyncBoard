import { useState } from 'react';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Help = () => {
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    email: '',
    category: 'general',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, send this to your backend
    console.log('Feedback submitted:', feedbackForm);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFeedbackForm({
        name: '',
        email: '',
        category: 'general',
        subject: '',
        message: '',
      });
    }, 3000);
  };

  const handleChange = (e) => {
    setFeedbackForm({
      ...feedbackForm,
      [e.target.name]: e.target.value,
    });
  };

  const faqs = [
    {
      question: 'How do I create a new task?',
      answer: 'Click the "New Task" button in the header or the "Add Task" button in any column on the dashboard.',
    },
    {
      question: 'How can I edit a task?',
      answer: 'Click the edit icon (pencil) on any task card. A modal will open with all task details pre-filled for editing.',
    },
    {
      question: 'How do I change the status of a task?',
      answer: 'Edit the task and select the desired status from the dropdown menu, or use the drag and drop feature to move tasks between columns.',
    },
    {
      question: 'Can I assign tasks to team members?',
      answer: 'Yes! When creating or editing a task, select a team member from the "Assign To" dropdown.',
    },
    {
      question: 'How do I delete a task?',
      answer: 'Click the trash icon on any task card. You\'ll be asked to confirm before the task is permanently deleted.',
    },
    {
      question: 'What do the priority colors mean?',
      answer: 'Red border = High priority, Orange = Medium priority, Blue = Low priority. Set priority when creating or editing tasks.',
    },
  ];

  const supportOptions = [
    {
      icon: 'fas fa-book',
      title: 'Documentation',
      description: 'Browse our comprehensive guides and tutorials',
      action: 'View Docs',
      color: 'blue',
    },
    {
      icon: 'fas fa-video',
      title: 'Video Tutorials',
      description: 'Watch step-by-step video guides',
      action: 'Watch Videos',
      color: 'pink',
    },
    {
      icon: 'fas fa-users',
      title: 'Community Forum',
      description: 'Connect with other TaskFlow users',
      action: 'Visit Forum',
      color: 'green',
    },
    {
      icon: 'fas fa-headset',
      title: 'Live Chat Support',
      description: 'Get instant help from our support team',
      action: 'Start Chat',
      color: 'orange',
    },
  ];

  return (
    <div className="animate-fadeIn">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1 md:mb-2">Help & Support</h1>
        <p className="text-gray-600 text-sm md:text-base">Get assistance, submit feedback, or browse our FAQs</p>
      </div>

      {/* Support Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-6 md:mb-8">
        {supportOptions.map((option, index) => (
          <div
            key={index}
            className="animate-fadeIn"
            style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
          >
            <Card className="text-center hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 h-full">
              <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full mx-auto mb-3 md:mb-4 flex items-center justify-center text-white text-xl md:text-2xl ${
                option.color === 'blue' ? 'bg-[#4361ee]' :
                option.color === 'pink' ? 'bg-[#f72585]' :
                option.color === 'green' ? 'bg-[#4ade80]' :
                'bg-[#f8961e]'
              }`}>
                <i className={option.icon}></i>
              </div>
              <h3 className="font-semibold text-base md:text-lg mb-1 md:mb-2 text-gray-800">{option.title}</h3>
              <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">{option.description}</p>
              <button className="text-[#4361ee] font-medium hover:underline text-xs md:text-sm">
                {option.action} <i className="fas fa-arrow-right ml-1"></i>
              </button>
            </Card>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
        {/* Feedback Form */}
        <div className="animate-slideInLeft">
          <Card>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-4 flex items-center gap-2">
              <i className="fas fa-comment-dots text-[#4361ee]"></i>
              Send Feedback
            </h2>
            <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
              We'd love to hear from you! Share your thoughts, report bugs, or suggest new features.
            </p>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 md:p-6 text-center animate-scaleIn">
                <i className="fas fa-check-circle text-green-500 text-4xl md:text-5xl mb-3 md:mb-4"></i>
                <h3 className="text-lg md:text-xl font-semibold text-green-800 mb-1 md:mb-2">Thank You!</h3>
                <p className="text-green-700 text-sm md:text-base">Your feedback has been submitted successfully.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <Input
                  label="Your Name"
                  name="name"
                  placeholder="Enter your name"
                  value={feedbackForm.name}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={feedbackForm.email}
                  onChange={handleChange}
                  required
                />

                <Select
                  label="Category"
                  name="category"
                  value={feedbackForm.category}
                  onChange={handleChange}
                  options={[
                    { value: 'general', label: 'General Feedback' },
                    { value: 'bug', label: 'Bug Report' },
                    { value: 'feature', label: 'Feature Request' },
                    { value: 'help', label: 'Need Help' },
                    { value: 'other', label: 'Other' },
                  ]}
                />

                <Input
                  label="Subject"
                  name="subject"
                  placeholder="Brief description"
                  value={feedbackForm.subject}
                  onChange={handleChange}
                  required
                />

                <Textarea
                  label="Message"
                  name="message"
                  rows={5}
                  placeholder="Tell us more..."
                  value={feedbackForm.message}
                  onChange={handleChange}
                  required
                />

                <Button type="submit" className="w-full">
                  <i className="fas fa-paper-plane mr-2"></i>
                  Submit Feedback
                </Button>
              </form>
            )}
          </Card>
        </div>

        {/* Contact Information */}
        <div className="animate-slideInRight">
          <Card className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <i className="fas fa-envelope text-[#4361ee]"></i>
              Contact Us
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <i className="fas fa-envelope text-[#4361ee] text-xl mt-1"></i>
                <div>
                  <h3 className="font-semibold text-gray-800">Email Support</h3>
                  <p className="text-gray-600">support@taskflow.com</p>
                  <p className="text-sm text-gray-500">We respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <i className="fas fa-phone text-[#4361ee] text-xl mt-1"></i>
                <div>
                  <h3 className="font-semibold text-gray-800">Phone Support</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                  <p className="text-sm text-gray-500">Mon-Fri, 9am-6pm EST</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <i className="fas fa-map-marker-alt text-[#4361ee] text-xl mt-1"></i>
                <div>
                  <h3 className="font-semibold text-gray-800">Office Address</h3>
                  <p className="text-gray-600">123 Task Street</p>
                  <p className="text-gray-600">San Francisco, CA 94105</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <i className="fas fa-share-alt text-[#4361ee]"></i>
              Follow Us
            </h2>
            <div className="flex gap-4">
              <button className="w-12 h-12 rounded-full bg-[#4361ee] text-white flex items-center justify-center hover:bg-[#3f37c9] transition-colors">
                <i className="fab fa-twitter"></i>
              </button>
              <button className="w-12 h-12 rounded-full bg-[#4361ee] text-white flex items-center justify-center hover:bg-[#3f37c9] transition-colors">
                <i className="fab fa-facebook-f"></i>
              </button>
              <button className="w-12 h-12 rounded-full bg-[#4361ee] text-white flex items-center justify-center hover:bg-[#3f37c9] transition-colors">
                <i className="fab fa-linkedin-in"></i>
              </button>
              <button className="w-12 h-12 rounded-full bg-[#4361ee] text-white flex items-center justify-center hover:bg-[#3f37c9] transition-colors">
                <i className="fab fa-github"></i>
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="animate-fadeIn" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
        <Card>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <i className="fas fa-question-circle text-[#4361ee]"></i>
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
              >
                <h3 className="font-semibold text-gray-800 mb-2 flex items-start gap-2">
                  <i className="fas fa-chevron-right text-[#4361ee] text-sm mt-1"></i>
                  {faq.question}
                </h3>
                <p className="text-gray-600 ml-6">{faq.answer}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Help;
