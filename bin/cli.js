#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import inquirer from 'inquirer';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templateDir = path.join(__dirname, '..', 'templates');
const skillsDir = path.join(templateDir, 'skills');
const targetDir = process.cwd();

// Intelligent mapping of keywords to skill directories
const keywordToSkillMap = {
  'frontend': ['frontend-ui-engineering', 'browser-testing-with-devtools', 'frontend-skill'],
  'react': ['frontend-ui-engineering', 'vercel-react-best-practices', 'vercel-react-view-transitions'],
  'native': ['vercel-react-native-skills'],
  'next': ['frontend-ui-engineering', 'vercel-react-best-practices'],
  'vue': ['frontend-ui-engineering'],
  'ui': ['frontend-ui-engineering', 'frontend-skill'],
  'design': ['api-and-interface-design', 'frontend-ui-engineering', 'web-design-guidelines'],
  'api': ['api-and-interface-design'],
  'backend': ['api-and-interface-design', 'observability-and-instrumentation'],
  'rest': ['api-and-interface-design'],
  'test': ['test-driven-development', 'browser-testing-with-devtools', 'tdd'],
  'tdd': ['test-driven-development', 'tdd'],
  'ci': ['ci-cd-and-automation'],
  'cd': ['ci-cd-and-automation', 'shipping-and-launch'],
  'deploy': ['shipping-and-launch'],
  'debug': ['debugging-and-error-recovery', 'diagnosing-bugs', 'triage'],
  'error': ['debugging-and-error-recovery', 'diagnosing-bugs'],
  'bug': ['diagnosing-bugs', 'triage'],
  'git': ['git-workflow-and-versioning', 'git-guardrails-claude-code', 'resolving-merge-conflicts'],
  'optimize': ['performance-optimization'],
  'performance': ['performance-optimization'],
  'secure': ['security-and-hardening'],
  'auth': ['security-and-hardening'],
  'doc': ['documentation-and-adrs'],
  'refactor': ['code-simplification', 'deprecation-and-migration', 'improve-codebase-architecture'],
  'plan': ['planning-and-task-breakdown', 'codebase-design', 'domain-modeling', 'grill-me'],
  'review': ['code-review-and-quality', 'code-review'],
  'typescript': ['setup-matt-pocock-skills', 'ask-matt', 'setup-ts-deep-modules'],
  'ts': ['setup-matt-pocock-skills', 'ask-matt', 'setup-ts-deep-modules']
};

// Default skills applied to every project
const defaultSkills = [
  'context-engineering',
  'using-agent-skills'
];

async function run() {
  console.log(chalk.blue.bold('\n🤖 Welcome to agent-contextify!'));
  console.log(chalk.gray('This tool will intelligently inject AI agent rules and skills into your project.\n'));

  const answers = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'agents',
      message: 'Which AI Assistant(s) do you use in this project?',
      choices: [
        { name: 'Gemini / Antigravity', value: 'gemini', checked: true },
        { name: 'Claude', value: 'claude' },
        { name: 'Cursor', value: 'cursor' },
        { name: 'Windsurf', value: 'windsurf' },
        { name: 'Cline / RooCode', value: 'cline' },
        { name: 'Aider', value: 'aider' },
        { name: 'GitHub Copilot', value: 'copilot' }
      ],
      validate(answer) {
        if (answer.length < 1) return 'You must choose at least one agent.';
        return true;
      }
    },
    {
      type: 'input',
      name: 'projectDescription',
      message: 'What are you working on right now? (e.g. "React frontend with tests and CI")',
    }
  ]);

  console.log(chalk.cyan('\n🧠 Analyzing your project description...'));

  const words = answers.projectDescription.toLowerCase().match(/\b\w+\b/g) || [];
  
  const selectedSkills = new Set(defaultSkills);
  let matchedKeywords = [];

  for (const word of words) {
    for (const [keyword, skills] of Object.entries(keywordToSkillMap)) {
      if (word.includes(keyword) || keyword.includes(word) && word.length > 2) {
        skills.forEach(s => selectedSkills.add(s));
        if (!matchedKeywords.includes(keyword)) matchedKeywords.push(keyword);
      }
    }
  }

  if (matchedKeywords.length > 0) {
    console.log(chalk.magenta(`🔍 Matched topics: ${matchedKeywords.join(', ')}`));
  } else {
    console.log(chalk.yellow(`⚠️  No specific topics matched. Adding core skills only.`));
  }

  console.log(chalk.green(`📚 Selected Skills: ${Array.from(selectedSkills).join(', ')}\n`));

  try {
    for (const agent of answers.agents) {
      let agentSkillDir = '';
      let agentBaseDir = '';
      
      switch (agent) {
        case 'gemini':
          agentBaseDir = '.agents';
          agentSkillDir = path.join(agentBaseDir, 'skills');
          break;
        case 'claude':
          agentBaseDir = '.claude-plugin';
          agentSkillDir = path.join(agentBaseDir, 'skills');
          break;
        case 'cursor':
          agentBaseDir = '.cursor';
          agentSkillDir = path.join(agentBaseDir, 'rules');
          break;
        case 'windsurf':
          agentBaseDir = '.windsurf';
          agentSkillDir = path.join(agentBaseDir, 'skills');
          break;
        case 'cline':
          agentBaseDir = '.cline';
          agentSkillDir = path.join(agentBaseDir, 'skills');
          break;
        case 'aider':
          agentBaseDir = '.aider';
          agentSkillDir = path.join(agentBaseDir, 'skills');
          break;
        case 'copilot':
          agentBaseDir = '.github';
          agentSkillDir = path.join(agentBaseDir, 'copilot-instructions');
          break;
      }

      console.log(chalk.gray(`Configuring ${agent} environment in ${agentSkillDir}...`));
      
      const targetAgentDir = path.join(targetDir, agentSkillDir);
      fs.ensureDirSync(targetAgentDir);

      for (const skill of selectedSkills) {
        const sourceSkillPath = path.join(skillsDir, skill);
        const targetSkillPath = path.join(targetAgentDir, skill);
        
        if (fs.existsSync(sourceSkillPath)) {
          fs.copySync(sourceSkillPath, targetSkillPath, { overwrite: true });
        }
      }
    }
    
    console.log(chalk.green.bold('\n✅ Success! AI context files have been configured.'));
    console.log(chalk.cyan('You are ready to code with your AI assistants.\n'));
  } catch (err) {
    console.error(chalk.red.bold('Error configuring files:'), err);
    process.exit(1);
  }
}

run();
