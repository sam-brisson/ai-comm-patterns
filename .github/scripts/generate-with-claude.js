const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const getArg = (flag) => {
  const index = args.indexOf(flag);
  return index !== -1 ? args[index + 1] : '';
};

const section = getArg('--section');
const suggestedTitle = getArg('--suggested-title');
const rawTranscript = getArg('--transcript');
const additionalContext = getArg('--context');
const customInstructions = getArg('--custom-instructions');
const attachmentsJson = getArg('--attachments');
const filename = getArg('--filename');

const attachments = JSON.parse(attachmentsJson || '[]');

console.log('Received arguments:');
console.log('Section:', section);
console.log('Suggested title:', suggestedTitle);
console.log('Transcript length:', rawTranscript.length);
console.log('Context:', additionalContext.substring(0, 100));
console.log('Custom instructions:', customInstructions.substring(0, 100));

// Load the master prompt template
const promptTemplate = fs.readFileSync('.github/prompts/article-generation-prompt.md', 'utf8');

// Build attachments list
const attachmentsList = attachments.length > 0
  ? attachments.map((url, i) => `${i + 1}. ${url}`).join('\n')
  : 'No attachments';

// Fill in the template - use replaceAll or global regex
let fullPrompt = promptTemplate;
fullPrompt = fullPrompt.replace(/{section}/g, section || 'Not specified');
fullPrompt = fullPrompt.replace(/{suggested_title}/g, suggestedTitle || 'Not provided - please suggest one');
fullPrompt = fullPrompt.replace(/{context}/g, additionalContext || 'No additional context provided');
fullPrompt = fullPrompt.replace(/{custom_instructions}/g, customInstructions || 'No custom instructions');
fullPrompt = fullPrompt.replace(/{raw_transcript}/g, rawTranscript || 'No transcript provided');
fullPrompt = fullPrompt.replace(/{attachments_list}/g, attachmentsList);

console.log('Prompt length after substitution:', fullPrompt.length);
console.log('First 500 chars of prompt:', fullPrompt.substring(0, 500));

// Initialize Claude API client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function generateArticle() {
  try {
    console.log('Calling Claude API to generate article...');
    console.log(`Section: ${section}`);
    console.log(`Filename: ${filename}`);
    
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: fullPrompt
        }
      ]
    });
    
    const articleContent = message.content[0].text;
    
    // Ensure directory exists
    const docPath = path.join('docs', section);
    if (!fs.existsSync(docPath)) {
      fs.mkdirSync(docPath, { recursive: true });
    }
    
    // Write the article
    const filepath = path.join(docPath, `${filename}.md`);
    fs.writeFileSync(filepath, articleContent, 'utf8');
    
    console.log(`✅ Article generated successfully at: ${filepath}`);
    console.log(`\nArticle preview (first 500 chars):\n${articleContent.substring(0, 500)}...\n`);
    
  } catch (error) {
    console.error('❌ Error generating article:', error);
    process.exit(1);
  }
}

generateArticle();