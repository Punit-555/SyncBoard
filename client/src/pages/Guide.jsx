import { useState } from 'react';
import { ChevronDown, Users, Shield, Zap, BookOpen, ArrowRight } from 'lucide-react';

const Guide = () => {
  const [expandedSection, setExpandedSection] = useState(0);
  const [activeRole, setActiveRole] = useState('user');

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? -1 : index);
  };

  const guideData = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: 'fas fa-rocket',
      sections: [
        {
          subtitle: 'Welcome to SyncBoard',
          content: 'SyncBoard is a comprehensive task management platform designed to help teams collaborate efficiently and manage projects seamlessly.',
          steps: [
            'Sign in to your account',
            'Navigate to Dashboard to see your tasks',
            'Create new projects and tasks',
            'Invite team members to collaborate'
          ]
        },
        {
          subtitle: 'Key Features',
          content: 'Discover the powerful features that make SyncBoard your go-to task management solution.',
          steps: [
            '📊 Real-time Analytics & Reports',
            '👥 Team Collaboration Tools',
            '📅 Calendar Integration',
            '🔔 Smart Notifications',
            '📱 Mobile-Friendly Interface',
            '🔒 Enterprise-Grade Security'
          ]
        }
      ]
    },
    {
      id: 'user-roles',
      title: 'User Roles & Permissions',
      icon: 'fas fa-shield-alt',
      sections: [
        {
          subtitle: 'Role Overview',
          content: 'SyncBoard has three main user roles, each with specific permissions and responsibilities.',
          steps: []
        }
      ]
    },
    {
      id: 'task-management',
      title: 'Task Management',
      icon: 'fas fa-tasks',
      sections: [
        {
          subtitle: 'Creating Tasks',
          content: 'Learn how to create and organize tasks efficiently.',
          steps: [
            'Navigate to "My Tasks" or "Projects"',
            'Click the "New Task" button',
            'Fill in task details (Title, Description, Due Date)',
            'Assign team members',
            'Set priority level (Low, Medium, High)',
            'Click "Create" to save'
          ]
        },
        {
          subtitle: 'Task Status & Workflow',
          content: 'Manage task progress through different workflow states.',
          steps: [
            '📝 Draft - Task is being prepared',
            '🔄 In Progress - Task is actively being worked on',
            '✅ Completed - Task has been finished',
            '⏸️ On Hold - Task is paused temporarily'
          ]
        },
        {
          subtitle: 'Task Priorities',
          content: 'Set task priorities to help your team focus on what matters most.',
          steps: [
            '🔴 High - Urgent, needs immediate attention',
            '🟡 Medium - Important, should be done soon',
            '🟢 Low - Can be done when time permits'
          ]
        }
      ]
    },
    {
      id: 'team-collaboration',
      title: 'Team Collaboration',
      icon: 'fas fa-users-cog',
      sections: [
        {
          subtitle: 'Inviting Team Members',
          content: 'Build your team and start collaborating.',
          steps: [
            'Go to Teams section',
            'Click "Add Member"',
            'Enter team member email',
            'Select their role (Admin or User)',
            'Send invitation',
            'They can accept via email link'
          ]
        },
        {
          subtitle: 'Team Communication',
          content: 'Keep your team connected and aligned.',
          steps: [
            'Comment on tasks for discussions',
            'Mention team members using @mentions',
            'View activity history and changes',
            'Get notified of updates in real-time'
          ]
        },
        {
          subtitle: 'Project Management',
          content: 'Organize tasks into projects for better structure.',
          steps: [
            'Create a new project',
            'Add project members',
            'Create tasks within the project',
            'Track project progress',
            'Generate project reports'
          ]
        }
      ]
    },
    {
      id: 'advanced-features',
      title: 'Advanced Features',
      icon: 'fas fa-sliders-h',
      sections: [
        {
          subtitle: 'Analytics & Reports',
          content: 'Get insights into your team productivity and project status.',
          steps: [
            'Access Reports section from sidebar',
            'View task completion rates',
            'Track team productivity metrics',
            'Generate custom reports',
            'Export data for further analysis'
          ]
        },
        {
          subtitle: 'Calendar Integration',
          content: 'Visualize tasks and deadlines on a calendar.',
          steps: [
            'Open Calendar from sidebar',
            'View all tasks by due date',
            'Click on dates to see tasks',
            'Drag tasks to reschedule',
            'Set reminders for important dates'
          ]
        },
        {
          subtitle: 'Notifications & Settings',
          content: 'Customize your notification preferences.',
          steps: [
            'Go to Settings',
            'Configure notification types',
            'Set quiet hours',
            'Choose notification channels (Email, In-app)',
            'Manage privacy settings'
          ]
        }
      ]
    }
  ];

  const roleGuides = {
    user: {
      title: 'User Guide',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      responsibilities: [
        'Create and manage personal tasks',
        'Update task status and progress',
        'Collaborate on team projects',
        'View assigned tasks and deadlines',
        'Comment and communicate on tasks',
        'Access personal dashboard'
      ],
      permissions: [
        '✅ Create personal tasks',
        '✅ Edit own tasks',
        '✅ Comment on tasks',
        '✅ View team tasks',
        '❌ Delete other\'s tasks',
        '❌ Manage team members',
        '❌ Access analytics'
      ]
    },
    admin: {
      title: 'Admin Guide',
      icon: Shield,
      color: 'from-purple-500 to-pink-500',
      responsibilities: [
        'Manage project tasks and workflows',
        'Assign tasks to team members',
        'Monitor team productivity',
        'Manage project settings',
        'Invite and manage users',
        'Create and delete projects'
      ],
      permissions: [
        '✅ Create and manage projects',
        '✅ Assign tasks to members',
        '✅ Edit any task in projects',
        '✅ Invite users to projects',
        '✅ View team analytics',
        '✅ Configure project settings',
        '❌ Delete user accounts'
      ]
    },
    superadmin: {
      title: 'Super Admin Guide',
      icon: Zap,
      color: 'from-orange-500 to-red-500',
      responsibilities: [
        'Overall system administration',
        'Manage all teams and projects',
        'Control user accounts and access',
        'System-wide settings and configuration',
        'View all analytics and reports',
        'Manage billing and licenses'
      ],
      permissions: [
        '✅ Full system access',
        '✅ Manage all users',
        '✅ Create/delete/modify anything',
        '✅ View all reports',
        '✅ System configurations',
        '✅ User role management',
        '✅ Billing management'
      ]
    }
  };

  const currentRole = roleGuides[activeRole];
  const RoleIcon = currentRole.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 md:mb-12">
        <div className="text-center mb-8 md:mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#4361ee] to-[#3f37c9] bg-clip-text text-transparent">
            SyncBoard Guide
          </h1>
          <p className="text-gray-600 text-lg md:text-xl">
            Complete documentation and tutorials for using SyncBoard
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12">
          {Object.entries(roleGuides).map(([key, role]) => {
            const Icon = role.icon;
            return (
              <button
                key={key}
                onClick={() => setActiveRole(key)}
                className={`relative p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                  activeRole === key
                    ? `bg-gradient-to-br ${role.color} text-white shadow-2xl scale-105`
                    : 'bg-white text-gray-800 shadow-lg hover:shadow-xl border-2 border-gray-100'
                }`}
              >
                <Icon className="w-12 h-12 mb-3 mx-auto" />
                <h3 className="text-lg font-bold mb-1">{role.title}</h3>
                <p className="text-sm opacity-90">Click to learn more</p>
              </button>
            );
          })}
        </div>

        {/* Role Details Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-12 animate-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <RoleIcon className="w-8 h-8 text-indigo-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              {currentRole.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Responsibilities */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-700 flex items-center gap-2">
                <span className="text-2xl">📋</span>
                Responsibilities
              </h3>
              <ul className="space-y-3">
                {currentRole.responsibilities.map((resp, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    <span className="text-indigo-600 font-bold mt-1">•</span>
                    <span className="text-gray-700">{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Permissions */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-700 flex items-center gap-2">
                <span className="text-2xl">🔐</span>
                Permissions
              </h3>
              <ul className="space-y-3">
                {currentRole.permissions.map((perm, idx) => (
                  <li
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      perm.includes('✅')
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    <span className="font-bold">{perm.substring(0, 2)}</span>
                    <span>{perm.substring(3)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Main Guide Sections */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800">
          How to Use SyncBoard
        </h2>

        <div className="space-y-4 md:space-y-6">
          {guideData.map((guide, guideIndex) => (
            <div
              key={guide.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Guide Header */}
              <button
                onClick={() => toggleSection(guideIndex)}
                className="w-full p-6 md:p-8 flex items-center justify-between hover:bg-indigo-50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1 text-left">
                  <div className="text-3xl md:text-4xl bg-gradient-to-br from-indigo-500 to-blue-500 p-3 rounded-xl text-white">
                    <i className={guide.icon}></i>
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                      {guide.title}
                    </h3>
                  </div>
                </div>
                <ChevronDown
                  className={`w-6 h-6 text-indigo-600 transition-transform duration-300 flex-shrink-0 ${
                    expandedSection === guideIndex ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Guide Content */}
              {expandedSection === guideIndex && (
                <div className="border-t border-gray-200 px-6 md:px-8 py-6 md:py-8 bg-gradient-to-b from-indigo-50 to-transparent animate-slide-down">
                  {guide.sections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="mb-8 last:mb-0">
                      {/* Section Title */}
                      <div className="mb-4">
                        <h4 className="text-lg md:text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                          <span className="text-indigo-600">•</span>
                          {section.subtitle}
                        </h4>
                        <p className="text-gray-600 text-sm md:text-base">
                          {section.content}
                        </p>
                      </div>

                      {/* Steps/Items */}
                      {section.steps.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                          {section.steps.map((step, stepIndex) => (
                            <div
                              key={stepIndex}
                              className="flex items-start gap-3 p-4 bg-white rounded-lg border-l-4 border-indigo-500 hover:shadow-md transition-shadow"
                            >
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold">
                                {stepIndex + 1}
                              </div>
                              <span className="text-gray-700 text-sm md:text-base">{step}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tips Section */}
      <div className="max-w-7xl mx-auto mt-12 md:mt-16">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 md:p-8 text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-2">
            <span className="text-3xl">💡</span>
            Pro Tips
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li className="flex gap-3 items-start">
              <ArrowRight className="w-5 h-5 flex-shrink-0 mt-1" />
              <span className="text-sm md:text-base">Use keyboard shortcuts for faster navigation</span>
            </li>
            <li className="flex gap-3 items-start">
              <ArrowRight className="w-5 h-5 flex-shrink-0 mt-1" />
              <span className="text-sm md:text-base">Set reminders for important deadlines</span>
            </li>
            <li className="flex gap-3 items-start">
              <ArrowRight className="w-5 h-5 flex-shrink-0 mt-1" />
              <span className="text-sm md:text-base">Regularly check reports for team insights</span>
            </li>
            <li className="flex gap-3 items-start">
              <ArrowRight className="w-5 h-5 flex-shrink-0 mt-1" />
              <span className="text-sm md:text-base">Customize your notification preferences</span>
            </li>
          </ul>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-7xl mx-auto mt-12 md:mt-16 mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {[
            {
              q: 'Can I change my role after being assigned?',
              a: 'Only Super Admins and Admins can change user roles. Contact your administrator if you need a role change.'
            },
            {
              q: 'How many tasks can I create?',
              a: 'There is no limit on the number of tasks you can create. Organize them using projects and filters.'
            },
            {
              q: 'What happens when a task deadline is missed?',
              a: 'Overdue tasks are highlighted in red. Team members are notified, and the task appears in reports.'
            },
            {
              q: 'Can I restore a deleted task?',
              a: 'Currently, deleted tasks are permanently removed. Always confirm deletion before proceeding.'
            }
          ].map((faq, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow">
              <h4 className="font-bold text-gray-800 mb-2 text-sm md:text-base flex items-center gap-2">
                <span className="text-indigo-600 text-lg">Q:</span>
                {faq.q}
              </h4>
              <p className="text-gray-600 text-sm md:text-base ml-6 md:ml-8">
                <span className="text-indigo-600 font-bold">A:</span> {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Need Help Card */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 md:p-8 text-center">
          <BookOpen className="w-12 h-12 md:w-16 md:h-16 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
            Need More Help?
          </h3>
          <p className="text-gray-600 mb-4 text-sm md:text-base">
            Check out our Help & Support section or contact our team
          </p>
          <a
            href="/help"
            className="inline-block px-6 md:px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm md:text-base"
          >
            Go to Help & Support
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 1000px;
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }

        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Guide;
