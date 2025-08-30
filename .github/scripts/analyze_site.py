#!/usr/bin/env python3
"""
AI Research Agent - Site Content Analysis
Analyzes existing articles on the AI Communication Patterns site to identify themes, gaps, and patterns.
"""

import argparse
import json
import os
import re
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from datetime import datetime
import frontmatter

def extract_article_metadata(content, url):
    """Extract metadata and content from an article."""
    try:
        # Try to parse as frontmatter first
        if content.strip().startswith('---'):
            post = frontmatter.loads(content)
            metadata = post.metadata
            body = post.content
        else:
            # Fallback to basic parsing
            metadata = {}
            body = content
            
        return {
            'url': url,
            'title': metadata.get('title', ''),
            'description': metadata.get('description', ''),
            'tags': metadata.get('tags', []),
            'authors': metadata.get('authors', []),
            'date': metadata.get('date', ''),
            'content_length': len(body),
            'word_count': len(body.split()),
            'body_preview': body[:500] + '...' if len(body) > 500 else body,
            'headings': extract_headings(body),
            'key_concepts': extract_key_concepts(body),
        }
    except Exception as e:
        print(f"Error parsing article {url}: {e}")
        return None

def extract_headings(content):
    """Extract markdown headings from content."""
    headings = []
    for line in content.split('\n'):
        if line.strip().startswith('#'):
            level = len(line) - len(line.lstrip('#'))
            heading = line.strip('#').strip()
            if heading:
                headings.append({'level': level, 'text': heading})
    return headings

def extract_key_concepts(content):
    """Extract key concepts and patterns from article content."""
    # Simple keyword extraction for AI collaboration concepts
    key_patterns = [
        r'\b(?:human-ai|ai-human)\b',
        r'\bcollaboration\b',
        r'\biteration\b',
        r'\bfatigue\b',
        r'\bvisual\b',
        r'\bmental model\b',
        r'\bcommunication pattern\b',
        r'\bknowledge building\b',
        r'\bdesign thinking\b',
        r'\bworkflow\b',
    ]
    
    concepts = {}
    content_lower = content.lower()
    
    for pattern in key_patterns:
        matches = re.findall(pattern, content_lower)
        if matches:
            concept = pattern.replace(r'\b', '').replace('\\', '')
            concepts[concept] = len(matches)
    
    return concepts

def crawl_site_content(base_url):
    """Crawl the site to find all articles and extract their content."""
    print(f"Analyzing site content from: {base_url}")
    
    articles = []
    
    try:
        # Get the main page
        response = requests.get(base_url)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Find article links - adjust selectors based on Docusaurus structure
        article_links = set()
        
        # Common Docusaurus article link patterns
        for link in soup.find_all('a', href=True):
            href = link['href']
            if href.startswith('/docs/') or href.startswith('docs/'):
                full_url = urljoin(base_url, href)
                article_links.add(full_url)
        
        # Also check for direct markdown files in common locations
        common_paths = ['/docs/', '/blog/', '/articles/']
        for path in common_paths:
            try:
                path_url = urljoin(base_url, path)
                path_response = requests.get(path_url)
                if path_response.status_code == 200:
                    path_soup = BeautifulSoup(path_response.content, 'html.parser')
                    for link in path_soup.find_all('a', href=True):
                        href = link['href']
                        if any(ext in href for ext in ['.html', '/']) and not href.startswith('http'):
                            full_url = urljoin(base_url, href)
                            article_links.add(full_url)
            except:
                continue
        
        print(f"Found {len(article_links)} potential articles")
        
        # Analyze each article
        for url in article_links:
            try:
                print(f"Analyzing: {url}")
                article_response = requests.get(url)
                article_response.raise_for_status()
                
                # Extract article content
                article_soup = BeautifulSoup(article_response.content, 'html.parser')
                
                # Try to find main article content
                article_content = ""
                
                # Look for common content containers
                content_selectors = [
                    'article',
                    '.markdown',
                    '.content',
                    'main',
                    '[role="main"]'
                ]
                
                for selector in content_selectors:
                    content_elem = article_soup.select_one(selector)
                    if content_elem:
                        article_content = content_elem.get_text()
                        break
                
                if not article_content:
                    article_content = article_soup.get_text()
                
                # Create article metadata
                metadata = {
                    'url': url,
                    'title': article_soup.title.string if article_soup.title else '',
                    'content_length': len(article_content),
                    'word_count': len(article_content.split()),
                    'content_preview': article_content[:500] + '...' if len(article_content) > 500 else article_content,
                    'key_concepts': extract_key_concepts(article_content),
                    'headings': []  # Could extract h1-h6 tags
                }
                
                articles.append(metadata)
                
            except Exception as e:
                print(f"Error analyzing {url}: {e}")
                continue
    
    except Exception as e:
        print(f"Error crawling site: {e}")
        return []
    
    return articles

def analyze_content_gaps(articles):
    """Analyze the existing content to identify gaps and opportunities."""
    
    # Aggregate all concepts
    all_concepts = {}
    total_articles = len(articles)
    
    for article in articles:
        for concept, count in article.get('key_concepts', {}).items():
            if concept not in all_concepts:
                all_concepts[concept] = {'count': 0, 'articles': 0}
            all_concepts[concept]['count'] += count
            all_concepts[concept]['articles'] += 1
    
    # Identify dominant themes
    dominant_themes = {k: v for k, v in sorted(all_concepts.items(), 
                                             key=lambda x: x[1]['count'], reverse=True)[:10]}
    
    # Identify potential gaps (concepts mentioned but not deeply explored)
    underexplored = {k: v for k, v in all_concepts.items() 
                    if v['articles'] < 3 and v['count'] > 0}
    
    return {
        'total_articles': total_articles,
        'dominant_themes': dominant_themes,
        'underexplored_concepts': underexplored,
        'concept_coverage': all_concepts,
        'analysis_timestamp': datetime.now().isoformat()
    }

def main():
    parser = argparse.ArgumentParser(description='Analyze AI Communication Patterns site content')
    parser.add_argument('--site-url', required=True, help='Base URL of the site to analyze')
    parser.add_argument('--output-file', required=True, help='Output JSON file for analysis results')
    
    args = parser.parse_args()
    
    print("🔍 Starting site content analysis...")
    
    # Crawl and analyze site content
    articles = crawl_site_content(args.site_url)
    
if not articles:
    print("⚠️ No articles found or analysis failed")
    gaps_analysis = {
        'total_articles': 0,
        'dominant_themes': {},
        'underexplored_concepts': {},
        'concept_coverage': {},
        'analysis_timestamp': datetime.now().isoformat(),
        'error': 'No articles could be analyzed'
    }
    analysis_result = {
        'articles': [],
        'gaps_analysis': gaps_analysis,
        'site_url': args.site_url,
        'analysis_date': datetime.now().isoformat()
    }
else:
    print(f"📊 Analyzed {len(articles)} articles")
    gaps_analysis = analyze_content_gaps(articles)
    analysis_result = {
        'articles': articles,
        'gaps_analysis': gaps_analysis,
        'site_url': args.site_url,
        'analysis_date': datetime.now().isoformat()
    }
    
    # Save results
    with open(args.output_file, 'w') as f:
        json.dump(analysis_result, f, indent=2)
    
    print(f"✅ Site analysis complete. Results saved to {args.output_file}")
    
    # Print summary
    if articles:
        print(f"\n📈 Summary:")
        print(f"  • Total articles: {len(articles)}")
        print(f"  • Average word count: {sum(a['word_count'] for a in articles) // len(articles)}")
        
        gaps = analysis_result['gaps_analysis']
        if gaps.get('dominant_themes'):
            print(f"  • Top themes: {', '.join(list(gaps['dominant_themes'].keys())[:3])}")

if __name__ == '__main__':
    main()