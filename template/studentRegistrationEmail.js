const studentRegistrationEmailTemplate = (name) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px;">
      <h2 style="color: #2c3e50;">Welcome to MCA by COCAS, ${name}!</h2>
      <p style="font-size: 16px; color: #34495e;">
        Thank you for registering. You’ve successfully signed up for updates from MCA by COCAS.
      </p>
      <p style="font-size: 16px; color: #34495e;">
        Stay tuned for important announcements, events, and resources that will help you on your journey.
      </p>
      <br />
      <p style="font-size: 14px; color: #7f8c8d;">– Team COCAS</p>
    </div>
  </div>
`;
module.exports = studentRegistrationEmailTemplate;