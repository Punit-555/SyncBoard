import { useLocation, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const UnderDevelopment = () => {
  const location = useLocation();

  // Get the page name from the route
  const pageName = location.pathname.substring(1).charAt(0).toUpperCase() +
                   location.pathname.substring(2);

  const formatPageName = (path) => {
    const name = path.substring(1);
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const features = [
    {
      icon: 'fas fa-rocket',
      title: 'Coming Soon',
      description: 'This feature is currently under active development',
      color: 'blue',
    },
    {
      icon: 'fas fa-code',
      title: 'In Progress',
      description: 'Our team is working hard to bring you this feature',
      color: 'orange',
    },
    {
      icon: 'fas fa-calendar-check',
      title: 'Planned Release',
      description: 'Expected to launch in the next update',
      color: 'green',
    },
  ];

  return (
    <div className="min-h-[70vh] flex items-center justify-center animate-fadeIn">
      <div className="text-center max-w-3xl mx-auto px-4">
        {/* Icon Animation */}
        <div className="mb-8 animate-scaleIn">
          <div className="relative inline-block">
            <div className="w-32 h-32 bg-gradient-to-br from-[#4361ee] to-[#3f37c9] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <i className="fas fa-tools text-white text-6xl"></i>
            </div>
            {/* Animated circles */}
            <div className="absolute top-0 left-0 w-32 h-32 border-4 border-[#4361ee]/20 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 animate-slideInLeft">
          {formatPageName(location.pathname)}
        </h1>

        <p className="text-xl text-gray-600 mb-4">
          Under Development
        </p>

        <p className="text-gray-500 mb-8 max-w-xl mx-auto">
          We're building something amazing for you! This page is currently under construction.
          Check back soon to see what we're working on.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="animate-fadeIn"
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
            >
              <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  feature.color === 'blue' ? 'bg-[#4361ee]/10' :
                  feature.color === 'orange' ? 'bg-[#f8961e]/10' :
                  'bg-[#4ade80]/10'
                }`}>
                  <i className={`${feature.icon} text-2xl ${
                    feature.color === 'blue' ? 'text-[#4361ee]' :
                    feature.color === 'orange' ? 'text-[#f8961e]' :
                    'text-[#4ade80]'
                  }`}></i>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </Card>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/dashboard">
            <Button>
              <i className="fas fa-home mr-2"></i>
              Back to Dashboard
            </Button>
          </Link>

          <Link to="/help">
            <Button variant="outline">
              <i className="fas fa-question-circle mr-2"></i>
              Get Help
            </Button>
          </Link>
        </div>

        {/* Progress Indicator */}
        <div className="mt-12 max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Development Progress</span>
            <span className="text-sm font-semibold text-[#4361ee]">65%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#4361ee] to-[#3f37c9] h-2 rounded-full transition-all duration-1000 ease-out animate-slideInLeft"
              style={{ width: '65%' }}
            ></div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 p-6 bg-gradient-to-r from-[#4361ee]/5 to-[#3f37c9]/5 rounded-lg border border-[#4361ee]/10">
          <div className="flex items-start gap-3">
            <i className="fas fa-info-circle text-[#4361ee] text-xl mt-1"></i>
            <div className="text-left">
              <h3 className="font-semibold text-gray-800 mb-2">Want to be notified?</h3>
              <p className="text-sm text-gray-600 mb-3">
                Subscribe to our newsletter to get updates when new features are released.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#4361ee]"
                />
                <Button>
                  <i className="fas fa-bell mr-2"></i>
                  Notify Me
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderDevelopment;
