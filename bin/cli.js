#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import inquirer from 'inquirer';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templateDir = path.join(__dirname, '..', 'templates');
const targetDir = process.cwd();

// Basic heuristic detection
function detectStack(targetPath) {
  let hasFrontend = false;
  let hasBackend = false;
  
  try {
    const pkgPath = path.join(targetPath, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = fs.readJsonSync(pkgPath);
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      
      const frontendKeywords = ['react', 'next', 'vue', 'svelte', 'nuxt', 'angular'];
      const backendKeywords = ['express', 'nestjs', 'fastify', 'koa', 'mongoose', 'prisma'];
      
      hasFrontend = frontendKeywords.some(kw => Object.keys(deps).some(d => d.includes(kw)));
      hasBackend = backendKeywords.some(kw => Object.keys(deps).some(d => d.includes(kw)));
    }
  } catch (err) {
    // silently fail if no package.json or unreadable
  }
  
  return { hasFrontend, hasBackend };
}

async function run() {
  console.log(chalk.blue.bold('\n🤖 Welcome to create-ai-context!'));
  console.log(chalk.gray('This tool will intelligently inject AI agent rules and skills into your project.\n'));

  const stack = detectStack(targetDir);
  
  if (stack.hasFrontend || stack.hasBackend) {
    console.log(chalk.magenta('🔍 Auto-detected stack:'));
    if (stack.hasFrontend) console.log(chalk.magenta('   - Frontend Framework'));
    if (stack.hasBackend) console.log(chalk.magenta('   - Backend Framework'));
    console.log('');
  }

  const answers = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'categories',
      message: 'Which AI skills would you like to inject?',
      choices: [
        { name: 'Core (Must-haves, general rules)', value: 'core', checked: true },
        { name: 'Frontend (React/UI/Design skills)', value: 'frontend', checked: stack.hasFrontend },
        { name: 'Backend (Node/API/Database skills)', value: 'backend', checked: stack.hasBackend }
      ],
      validate(answer) {
        if (answer.length < 1) {
          return 'You must choose at least one category.';
        }
        return true;
      }
    }
  ]);

  console.log();
  
  try {
    for (const category of answers.categories) {
      const sourcePath = path.join(templateDir, category);
      if (fs.existsSync(sourcePath)) {
        console.log(chalk.gray(`Copying ${category} skills...`));
        fs.copySync(sourcePath, targetDir, { overwrite: true });
      }
    }
    
    console.log(chalk.green.bold('\n✅ Success! AI context files have been merged safely.'));
    console.log(chalk.cyan('You are ready to code with your AI assistants.\n'));
  } catch (err) {
    console.error(chalk.red.bold('Error copying files:'), err);
    process.exit(1);
  }
}

run();
