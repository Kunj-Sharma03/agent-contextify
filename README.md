# 🤖 agent-contextify

![npm version](https://img.shields.io/npm/v/agent-contextify)
![license](https://img.shields.io/npm/l/agent-contextify)

**`agent-contextify`** is an intelligent, interactive CLI wizard that auto-configures your project with highly specialized AI agent skills and workflows. By simply telling the CLI what you're working on, it will automatically pull from a library of 64+ expert workflows and scaffold them into the correct directory structure for your favorite AI assistants.

## 🚀 Quickstart

You don't even need to install it! Just run the wizard in the root of your project using `npx`:

```bash
npx agent-contextify
```

### How it works:
1. **Select your Agents:** Choose one or multiple AI assistants that you use (e.g., Gemini, Claude, Cursor, Windsurf, Cline/RooCode, Aider, GitHub Copilot).
2. **Describe your Project:** Type a brief sentence about what you are building (e.g. *"I'm building a React frontend with a Node backend, and doing TDD"*).
3. **Magic happens:** The CLI's keyword mapping engine analyzes your input and copies the exact skills you need (like `frontend-ui-engineering` and `test-driven-development`) directly into the `.agents/skills`, `.claude-plugin/skills`, `.cursor/rules`, or `.windsurf/skills` folder.

## ✨ Features
- **Natural Language Parsing**: Just describe your stack and workflow. The engine maps keywords (`react`, `api`, `debug`, `tdd`, `git`) to specialized prompt engineering skills.
- **Multi-Agent Support**: Configures context for 7 of the most popular AI environments instantly:
  - Gemini / Antigravity (`.agents/skills/`)
  - Claude (`.claude-plugin/skills/`)
  - Cursor (`.cursor/rules/`)
  - Windsurf (`.windsurf/skills/`)
  - Cline / RooCode (`.cline/skills/`)
  - Aider (`.aider/skills/`)
  - GitHub Copilot (`.github/copilot-instructions/`)
- **Massive Skill Library**: Ships with 64 extracted, flat, and highly optimized AI skills ready for immediate use.

## 🙏 Credits & Acknowledgements

This project wouldn't be possible without the incredible open-source AI community curating and sharing their prompt engineering workflows. A massive thank you to the creators of the skills bundled in this package:

- **[Addy Osmani's Agent Skills](https://github.com/addyosmani/agent-skills)**: For providing an extensive baseline of incredibly high-quality software engineering agent rules (e.g., `frontend-ui-engineering`, `test-driven-development`, `code-review-and-quality`).
- **[Matt Pocock's Skills](https://github.com/mattpocock/skills)**: For the fantastic TypeScript-specific and codebase design workflows (e.g., `ask-matt`, `setup-matt-pocock-skills`).
- **The Open Source Community**: For various other skills surrounding CI/CD, specific framework best practices (like Vercel React integrations), and git workflows.

## 📝 License

MIT License. See `LICENSE` for more information.
