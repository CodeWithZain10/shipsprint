import { createPromptModule } from "inquirer";
import questions from "../prompts/questions.js";
import createProjectStructure from "../templates/backend/express-mongodb/utils/fileHelper.js";

const prompt = createPromptModule();

const init = () => {
  console.log('Initializing project...');
  // Add your initialization logic here
  prompt(questions).then((answers) => {
    console.log(`Project name: ${answers.projectName}`);
    console.log(`Include authentication: ${answers.authentication}`);
    console.log(`Include validation: ${answers.validation}`);
    console.log(`Include error handler: ${answers.errorHandler}`);
    createProjectStructure(answers.projectName, answers.authentication, answers.validation, answers.errorHandler);
  });
}

export default init;