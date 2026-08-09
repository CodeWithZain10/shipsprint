const envValidationTemplate = () => {
return `const validateEnv = (requiredEnvVars) => {
  const missingVars = [];

  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    } else {
      console.log(\`$\{envVar}: Found\`);
    }
  });

  if (missingVars.length > 0) {
    console.error(
      \`Missing required environment variables: $\{missingVars.join(", ")}\`
    );

    process.exit(1);
  }
};
export default validateEnv`
}
export default envValidationTemplate
