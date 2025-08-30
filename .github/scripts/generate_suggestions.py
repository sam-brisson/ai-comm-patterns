#!/usr/bin/env python3
"""
AI Research Agent - Article Suggestion Generation
Uses Claude to analyze research data and generate article suggestions with collaboration experiments.
"""

import argparse
import json
import os
from datetime import datetime
from anthropic import Anthropic
import time

def load_research_data(site_analysis_file, research_data_file):
    """Load and combine site analysis and external research data."""
    
    data = {
        'site_analysis': {},
        'external_research': {},
        'loaded_successfully': False
    }
    
    try:
        # Load site analysis
        if os.path.exists(site_analysis_file):
            with open(site_analysis_file, 'r') as f:
                data['site_analysis'] = json.load(f)
            print(f"✅ Loaded site analysis: {len(data['site_analysis'].get('articles', []))} articles analyzed")
        else:
            print(f"⚠️ Site analysis file not found: {site_analysis_file}")
            
        # Load external research
        if os.path.exists(research_data_file):
            with open(research_data_file, 'r') as f:
                data['external_research'] = json.load(f)
            arxiv_papers = len(data['external_research'].get('sources', {}).get('arxiv', []))
            print(f"✅ Loaded external research: {arxiv_papers} ArXiv papers")
        else:
            print(f"⚠️ External research file not found: {research_data_file}")
            
        data['loaded_successfully'] = bool(data['site_analysis'] or data['external_research'])
        return data
        
    except Exception as e:
        print(f"❌ Error loading research data: {e}")
        return data

def create_claude_analysis_prompt(research_data):
    """Create a comprehensive prompt for Claude to analyze research and suggest articles."""
    
    site_analysis = research_data.get('site_analysis', {})
    external_research = research_data.get('external_research', {})
    
    prompt = """You are an AI research agent helping to build a knowledge base about AI Communication Patterns. Your job is to analyze existing content and recent research to suggest new articles that would be valuable additions.

EXISTING SITE ANALYSIS:
"""
    
    # Add site analysis context
    if site_analysis:
        gaps_analysis = site_analysis.get('gaps_analysis', {})
        articles = site_analysis.get('articles', [])
        
        prompt += f"""
Current site has {len(articles)} articles.

DOMINANT THEMES ALREADY COVERED:
{json.dumps(gaps_analysis.get('dominant_themes', {}), indent=2)}

UNDEREXPLORED CONCEPTS (opportunities):
{json.dumps(gaps_analysis.get('underexplored_concepts', {}), indent=2)}

SAMPLE EXISTING ARTICLES:
"""
        # Include sample articles for context
        for i, article in enumerate(articles[:3]):
            prompt += f"""
Article {i+1}: {article.get('title', 'Untitled')}
Preview: {article.get('content_preview', '')[:200]}...
Key concepts: {article.get('key_concepts', {})}
"""
    
    # Add external research context
    if external_research:
        arxiv_papers = external_research.get('sources', {}).get('arxiv', [])
        trends = external_research.get('trends', {})
        opportunities = external_research.get('opportunities', [])
        
        prompt += f"""

RECENT RESEARCH TRENDS:
{json.dumps(trends.get('trending_terms', {}), indent=2)}

RESEARCH OPPORTUNITIES IDENTIFIED:
{json.dumps(opportunities[:5], indent=2)}

SAMPLE RECENT PAPERS:
"""
        # Include sample papers for inspiration
        for i, paper in enumerate(arxiv_papers[:3]):
            prompt += f"""
Paper {i+1}: {paper.get('title', '')}
Summary: {paper.get('summary', '')[:300]}...
Authors: {', '.join(paper.get('authors', [])[:3])}
"""

    prompt += """

YOUR TASK:
Generate 2-3 high-quality article suggestions that:

1. BUILD ON existing site themes while filling identified gaps
2. CONNECT recent research insights to practical collaboration patterns  
3. SUGGEST specific collaboration experiments readers can try
4. ADVANCE the field of human-AI communication understanding

For each article suggestion, provide:

ARTICLE_SUGGESTION_FORMAT:
{
  "title": "Compelling, specific title",
  "description": "Brief description of the article's focus",
  "rationale": "Why this article is needed based on gaps/research",
  "key_insights": ["3-5 main insights the article will explore"],
  "collaboration_experiment": {
    "name": "Name of suggested experiment",
    "description": "What readers would actually do",
    "expected_outcome": "What they might discover",
    "time_commitment": "Estimated time needed"
  },
  "source_connections": ["Which research papers or site gaps this connects to"],
  "outline": {
    "introduction": "Brief intro approach",
    "main_sections": ["Key section 1", "Key section 2", "Key section 3"],
    "experiment_section": "How to present the collaboration experiment",
    "conclusion": "How to wrap up and connect to broader themes"
  },
  "estimated_length": "Short/Medium/Long",
  "difficulty_level": "Beginner/Intermediate/Advanced",
  "tags": ["relevant", "tags", "for", "categorization"]
}

PRIORITIZATION CRITERIA:
- Emphasize PRACTICAL, TESTABLE collaboration patterns
- Focus on patterns that DEMONSTRATE rather than just explain
- Build on the site's strength in experiential learning
- Connect academic research to hands-on exploration
- Create opportunities for readers to contribute their own discoveries

Return your response as a JSON array of article suggestions.
"""
    
    return prompt

def generate_article_suggestions(client, research_data, max_suggestions=3):
    """Use Claude to generate article suggestions based on research data."""
    
    print(f"🧠 Generating article suggestions with Claude (max: {max_suggestions})...")
    
    try:
        # Create analysis prompt
        prompt = create_claude_analysis_prompt(research_data)
        
        # Call Claude API
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=4000,
            temperature=0.7,
            messages=[
                {
                    "role": "user", 
                    "content": prompt
                }
            ]
        )
        
        # Parse response
        response_text = response.content[0].text.strip()
        
        # Try to extract JSON from response
        if response_text.startswith('['):
            suggestions = json.loads(response_text)
        else:
            # Look for JSON array in response
            import re
            json_match = re.search(r'\[(.*?)\]', response_text, re.DOTALL)
            if json_match:
                json_content = '[' + json_match.group(1) + ']'
                suggestions = json.loads(json_content)
            else:
                print("❌ Could not parse JSON from Claude response")
                print("Response:", response_text[:500])
                return []
        
        # Limit to max_suggestions
        suggestions = suggestions[:max_suggestions]
        
        print(f"✅ Generated {len(suggestions)} article suggestions")
        return suggestions
        
    except Exception as e:
        print(f"❌ Error generating suggestions with Claude: {e}")
        return []

def create_article_markdown(suggestion, research_data):
    """Create a markdown file from an article suggestion."""
    
    # Generate frontmatter
    date = datetime.now().strftime('%Y-%m-%d')
    
    frontmatter = f"""---
title: "{suggestion['title']}"
description: "{suggestion['description']}"
authors:
  - name: "AI Research Agent"
    title: "Automated Research Assistant"
tags: {json.dumps(suggestion.get('tags', []))}
date: {date}
draft: true
generated_by: "ai-research-agent"
rationale: "{suggestion['rationale']}"
---"""
    
    # Generate article content
    content = f"""
# {suggestion['title']}

*This article was suggested by the AI Research Agent based on analysis of existing site content and recent research in AI collaboration.*

## Introduction

{suggestion['outline']['introduction']}

## Research Context

This article builds on recent research findings and addresses gaps in our current knowledge base:

**Source Connections:**
{chr(10).join([f"- {conn}" for conn in suggestion.get('source_connections', [])])}

**Key Insights to Explore:**
{chr(10).join([f"- {insight}" for insight in suggestion.get('key_insights', [])])}

## Main Sections

{chr(10).join([f"### {section}" for section in suggestion['outline']['main_sections']])}

[Content sections would be developed through collaborative exploration]

## Collaboration Experiment: {suggestion['collaboration_experiment']['name']}

### What You'll Do
{suggestion['collaboration_experiment']['description']}

### Expected Outcomes  
{suggestion['collaboration_experiment']['expected_outcome']}

### Time Commitment
{suggestion['collaboration_experiment']['time_commitment']}

### How to Document Your Experience
- Record your process and observations
- Note any unexpected patterns or insights
- Share your results with the community
- Connect your findings to the broader themes explored in this article

## Discussion Questions

*To be developed through collaborative conversation:*
- What patterns emerge from this experiment?
- How does this connect to other collaboration approaches?
- What new questions does this raise?

## Next Steps

{suggestion['outline']['conclusion']}

---

**Article Metadata:**
- **Estimated Length:** {suggestion.get('estimated_length', 'Medium')}
- **Difficulty Level:** {suggestion.get('difficulty_level', 'Intermediate')}  
- **Suggested by:** AI Research Agent on {date}

**Want to contribute?** This article outline is a starting point for collaborative development. [Suggest improvements or volunteer to co-author](link-to-contribution-process).
"""
    
    return frontmatter + content

def generate_research_methodology_doc(research_data, suggestions):
    """Generate a documentation file explaining the research methodology."""
    
    content = f"""# AI Research Agent - Methodology Report

**Generated:** {datetime.now().isoformat()}

## Research Process

This report documents how the AI Research Agent analyzed existing content and external research to generate article suggestions.

### Site Analysis Results

"""
    
    site_analysis = research_data.get('site_analysis', {})
    if site_analysis:
        gaps = site_analysis.get('gaps_analysis', {})
        content += f"""
**Existing Articles Analyzed:** {gaps.get('total_articles', 0)}

**Dominant Themes Found:**
{json.dumps(gaps.get('dominant_themes', {}), indent=2)}

**Underexplored Concepts Identified:**
{json.dumps(gaps.get('underexplored_concepts', {}), indent=2)}
"""

    external_research = research_data.get('external_research', {})
    if external_research:
        arxiv_papers = external_research.get('sources', {}).get('arxiv', [])
        trends = external_research.get('trends', {})
        
        content += f"""

### External Research Analysis

**ArXiv Papers Reviewed:** {len(arxiv_papers)}

**Research Trends Identified:**
{json.dumps(trends.get('trending_terms', {}), indent=2)}

**Sample Papers Analyzed:**
"""
        for paper in arxiv_papers[:5]:
            content += f"""
- **{paper.get('title', 'Untitled')}**
  - Authors: {', '.join(paper.get('authors', [])[:3])}
  - Published: {paper.get('published', 'Unknown')}
  - Summary: {paper.get('summary', '')[:200]}...
"""

    content += f"""

## Article Suggestions Generated

**Total Suggestions:** {len(suggestions)}

"""
    for i, suggestion in enumerate(suggestions, 1):
        content += f"""
### Suggestion {i}: {suggestion['title']}

**Rationale:** {suggestion['rationale']}

**Key Focus Areas:**
{chr(10).join([f"- {insight}" for insight in suggestion.get('key_insights', [])])}

**Proposed Experiment:** {suggestion['collaboration_experiment']['name']}
- Description: {suggestion['collaboration_experiment']['description']}
- Expected Outcome: {suggestion['collaboration_experiment']['expected_outcome']}

"""

    content += f"""
## Quality Assessment

### Alignment with Site Goals
- All suggestions focus on practical, testable collaboration patterns
- Each includes hands-on experiments for readers
- Suggestions build on existing themes while filling identified gaps

### Research Grounding  
- Connected to recent academic research (ArXiv papers from last 6 months)
- Addresses trending terms in AI collaboration research
- Balances theoretical insights with practical application

### Community Value
- Articles designed for collaborative development
- Experiments create opportunities for community contributions
- Clear connection points to existing site content

---

*This methodology report provides transparency into the AI Research Agent's decision-making process. For questions or suggestions about the research approach, please open an issue in the repository.*
"""
    
    return content

def main():
    parser = argparse.ArgumentParser(description='Generate article suggestions using Claude')
    parser.add_argument('--site-analysis', required=True, help='Site analysis JSON file')
    parser.add_argument('--research-data', required=True, help='External research JSON file')
    parser.add_argument('--max-suggestions', type=int, default=3, help='Maximum number of suggestions')
    parser.add_argument('--output-dir', required=True, help='Output directory for generated articles')
    
    args = parser.parse_args()
    
    # Check for API key
    api_key = os.getenv('ANTHROPIC_API_KEY')
    if not api_key:
        print("❌ ANTHROPIC_API_KEY environment variable not set")
        return 1
    
    print("🤖 Starting article suggestion generation...")
    
    # Initialize Claude client
    client = Anthropic(api_key=api_key)
    
    # Load research data
    research_data = load_research_data(args.site_analysis, args.research_data)
    
    if not research_data['loaded_successfully']:
        print("❌ Could not load research data - cannot generate suggestions")
        return 1
    
    # Generate suggestions with Claude
    suggestions = generate_article_suggestions(client, research_data, args.max_suggestions)
    
    if not suggestions:
        print("❌ No suggestions generated")
        return 1
    
    # Create output directory
    os.makedirs(args.output_dir, exist_ok=True)
    
    # Generate article files
    generated_files = []
    
    for i, suggestion in enumerate(suggestions):
        # Create filename from title
        filename = suggestion['title'].lower().replace(' ', '-').replace(':', '').replace('?', '')
        filename = f"{datetime.now().strftime('%Y%m%d')}_{filename}.md"
        
        # Generate markdown content
        markdown_content = create_article_markdown(suggestion, research_data)
        
        # Write file
        filepath = os.path.join(args.output_dir, filename)
        with open(filepath, 'w') as f:
            f.write(markdown_content)
        
        generated_files.append(filepath)
        print(f"📝 Generated: {filename}")
    
    # Generate methodology documentation
    methodology_content = generate_research_methodology_doc(research_data, suggestions)
    methodology_path = os.path.join(args.output_dir, 'research_methodology.md')
    with open(methodology_path, 'w') as f:
        f.write(methodology_content)
    
    generated_files.append(methodology_path)
    print(f"📊 Generated: research_methodology.md")
    
    # Generate summary JSON for GitHub Action
    summary = {
        'generated_files': generated_files,
        'suggestions_count': len(suggestions),
        'generation_timestamp': datetime.now().isoformat(),
        'suggestions': [
            {
                'title': s['title'],
                'description': s['description'],
                'experiment': s['collaboration_experiment']['name']
            } for s in suggestions
        ]
    }
    
    summary_path = os.path.join(args.output_dir, 'generation_summary.json')
    with open(summary_path, 'w') as f:
        json.dump(summary, f, indent=2)
    
    print(f"✅ Article generation complete!")
    print(f"📁 Generated {len(generated_files)} files in {args.output_dir}")
    print(f"💡 Suggestions: {', '.join([s['title'] for s in suggestions])}")
    
    return 0

if __name__ == '__main__':
    exit(main())