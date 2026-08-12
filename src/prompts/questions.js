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