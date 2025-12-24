import React from "react";

const Policy = () => {
  const sections = [
    {
      title: "Privacy Policy",
      content: [
        "We respect your privacy and are committed to protecting your personal data.",
        "All information collected is used solely for providing and improving our services.",
        "We do not share your personal information with third parties without your consent.",
        "Users can request deletion of their data at any time."
      ],
    },
    {
      title: "Refund Policy",
      content: [
        "Refunds are processed within 7 business days after verification of the request.",
        "Digital purchases may not be eligible for refund after delivery or activation.",
        "In case of failed or duplicate transactions, refunds will be initiated promptly."
      ],
    },
    {
      title: "Terms & Conditions",
      content: [
        "Users must adhere to all platform rules and policies.",
        "Accounts involved in fraudulent activity or policy violations may be suspended or terminated.",
        "All users must be of legal age to use the platform.",
        "The platform reserves the right to modify terms and policies at any time."
      ],
    },
    {
      title: "Security",
      content: [
        "We implement industry-standard security measures to protect your data.",
        "Users are responsible for keeping their account credentials secure.",
        "Two-factor authentication (2FA) is recommended for added security."
      ],
    },
    {
      title: "Cookies Policy",
      content: [
        "Our platform uses cookies to enhance user experience and track usage analytics.",
        "Cookies help personalize content and improve functionality of the website.",
        "Users can manage cookie settings via their browser preferences."
      ],
    },
    {
      title: "User Responsibilities",
      content: [
        "Users must provide accurate and up-to-date information during account creation.",
        "Users must not misuse the platform for illegal or malicious activities.",
        "Users should report any bugs, issues, or suspicious activity to support promptly."
      ],
    },
    {
      title: "Disclaimer",
      content: [
        "All investments and earnings involve risk; users participate at their own discretion.",
        "The platform is not responsible for losses incurred due to user decisions or external factors.",
        "Information provided on the platform is for informational purposes and should not be considered financial advice."
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-[1170px] mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
        <h1 className="text-3xl font-bold text-primary dark:text-white text-center mb-6">
          Platform Policies
        </h1>

        {sections.map((section, idx) => (
          <div key={idx} className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {section.title}
            </h2>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
              {section.content.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        ))}

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-6 text-center">
          By using our platform, you agree to our policies and terms. Please read carefully.
        </p>
      </div>
    </div>
  );
};

export default Policy;
