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
const context = getArg('--context');
const customInstructions = getArg('--custom-instructions');
const attachmentsJson = getArg('--attachments');
const filename = getArg('--filename');

const attachments = JSON.parse(attachmentsJson || '[]');

// Load the master prompt template
const promptTemplate = fs.readFileSync('.github/prompts/article-generation-prompt.md', 'utf8');

// Build attachments list
const attachmentsList = attachments.length > 0
  ? attachments.map((url, i) => `${i + 1}. ${url}`).join('\n')
  : 'No attachments';

// Fill in the template
const fullPrompt = promptTemplate
  .replace('{section}', section)
  .replace('{suggested_title}', suggestedTitle || 'Not provided - please suggest one')
  .replace('{context}', context || 'No additional context provided')
  .replace('{custom_instructions}', customInstructions || 'No custom instructions')
  .replace('{raw_transcript}', rawTranscript)
  .replace('{attachments_list}', attachmentsList);

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