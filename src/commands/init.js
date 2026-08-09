import { createPromptModule } from "inquirer";
import questions from "../prompts/questions.js";
import generateProject from "../generator/generateProject.js";

const prompt = createPromptModule();

const init = () => {
  console.log('Initializing project...');
  // Add your initialization logic here
  prompt(questions).then((answers) => {
    generateProject(answers);
  });
}

export default init;