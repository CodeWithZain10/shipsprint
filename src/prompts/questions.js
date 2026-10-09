const questions = [
    {
      type: 'input',
      name: 'projectName',
      message: 'What is the name of your project?'
    },
    {
      type: 'confirm',
      name: 'includeBackend',
      message: 'Do you want to include backend?',
      default: true
    },
    {
        type: 'confirm',
        name: "includeAuthentication",
        message: "Do you want to include authentication?",
        default: false,
        when: (answers) => answers.includeBackend
    },
    {
      type: 'confirm',
      name: 'includeEmail',
      message: 'Do you want to include email sending (nodemailer)?',
      default: false,
      when: (answers) => answers.includeBackend && answers.includeAuthentication
    },
    {
      type: 'confirm',
      name: 'includeRBAC',
      message: 'Do you want to include role-based access control (user/admin roles)?',
      default: false,
      when: (answers) => answers.includeBackend && answers.includeAuthentication
    },
    {
      type: 'confirm',
      name: 'includeValidation',
      message: 'Do you want to include validation?',
      default: false,
      when: (answers) => answers.includeBackend
    },
    {
      type: 'confirm',
      name: 'includeErrorHandler',
      message: 'Do you want to include a custom error handler?',
      default: false,
      // Authentication always ships with the error handler it depends on
      when: (answers) => answers.includeBackend && !answers.includeAuthentication
    },
    {
      type: 'confirm',
      name: 'includeLogger',
      message: 'Do you want to include request logging (winston)?',
      default: false,
      when: (answers) => answers.includeBackend
    },
    {
      type: 'confirm',
      name: 'includeDocker',
      message: 'Do you want to include Docker setup (Dockerfile + docker-compose with MongoDB)?',
      default: false,
      when: (answers) => answers.includeBackend
    },
    {
      type: 'confirm',
      name: 'includeFrontend',
      message: 'Do you want to include frontend?',
      default: true
    }
]


export default questions;
