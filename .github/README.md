# Article Generation System

This directory contains the automated article generation system for the AI Communication Patterns knowledge site.

## How It Works

1. Open a GitHub Issue using the "New Article from Conversation" template
2. Paste your raw conversation transcript
3. GitHub Actions triggers and calls Claude API
4. Claude generates a formatted article
5. A Pull Request is created for you to review
6. Approve and merge to publish

## Setup Complete ✓

The system is ready to use. Just make sure your `ANTHROPIC_API_KEY` secret is configured.

## Files

- `ISSUE_TEMPLATE/new-article.yml` - The issue form template
- `workflows/process-article-issue.yml` - GitHub Actions automation
- `scripts/generate-with-claude.js` - Claude API integration
- `prompts/article-generation-prompt.md` - Your master prompt template

## Usage

Go to Issues → New Issue → Select "New Article from Conversation"