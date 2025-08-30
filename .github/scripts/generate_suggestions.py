#!/usr/bin/env python3
import argparse
import json
import os
import re
from datetime import datetime
from anthropic import Anthropic


# --- Helper: robust JSON extraction ---
def extract_json_array(text: str):
    """Extract and sanitize JSON array from Claude's response."""
    # Strip code fences like ```json ... ```
    text = re.sub(r"```(?:json)?", "", text).strip()

    # Look for the first [...] block
    match = re.search(r"\[.*\]", text, re.DOTALL)
    if not match:
        return None

    json_str = match.group(0)

    # Remove trailing commas before ] or }
    json_str = re.sub(r",\s*([\]}])", r"\1", json_str)

    try:
        return json.loads(json_str)
    except Exception as e:
        print(f"⚠️ JSON parse error even after cleanup: {e}")
        return None


def generate_article_suggestions(site_analysis, research_data, max_suggestions=3):
    """Call Claude to generate article suggestions based on site + research data."""

    client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

    prompt = f"""
    You are an expert research assistant. 
    The following is a site content analysis (JSON) and a set of external research papers (JSON).

    Site Analysis:
    {json.dumps(site_analysis, indent=2)}

    External Research:
    {json.dumps(research_data, indent=2)}

    Task:
    Suggest up to {max_suggestions} new article ideas that would expand the site's coverage. 
    Each suggestion must include:
      - title (string)
      - summary (string)
      - rationale (string: why it’s useful given the site & research data)

    Respond ONLY with a JSON array of objects, no commentary.
    """

    try:
        response = client.messages.create(
            model="claude-3-opus-20240229",
            max_tokens=1000,
            messages=[{"role": "user", "content": prompt}],
        )
        response_text = response.content[0].text.strip()

        suggestions = extract_json_array(response_text)
        if not suggestions:
            print("❌ Could not parse valid JSON from Claude response")
            print("Response sample:", response_text[:400])
            return []

        return suggestions[:max_suggestions]

    except Exception as e:
        print(f"❌ Error generating suggestions with Claude: {e}")
        return []


def main():
    parser = argparse.ArgumentParser(description="Generate article suggestions")
    parser.add_argument("--site-analysis", required=True, help="Path to site_analysis.json")
    parser.add_argument("--research-data", required=True, help="Path to external_research.json")
    parser.add_argument("--max-suggestions", type=int, default=3)
    parser.add_argument("--output-dir", required=True, help="Directory to write suggestions")
    args = parser.parse_args()

    print("🤖 Starting article suggestion generation...")

    with open(args.site_analysis) as f:
        site_analysis = json.load(f)
    print(f"✅ Loaded site analysis: {site_analysis.get('gaps_analysis', {}).get('total_articles', 0)} articles analyzed")

    with open(args.research_data) as f:
        research_data = json.load(f)
    print(f"✅ Loaded external research: {len(research_data.get('papers', []))} ArXiv papers")

    # Generate suggestions
    suggestions = generate_article_suggestions(site_analysis, research_data, args.max_suggestions)

    # Ensure output directory exists
    os.makedirs(args.output_dir, exist_ok=True)

    # Write individual suggestion files
    for i, suggestion in enumerate(suggestions, start=1):
        out_path = os.path.join(args.output_dir, f"suggestion_{i}.json")
        with open(out_path, "w") as f:
            json.dump(suggestion, f, indent=2)
        print(f"💡 Wrote suggestion {i}: {out_path}")

    # Always write a generation summary, even if empty
    summary = {
        "generated_at": datetime.now().isoformat(),
        "num_suggestions": len(suggestions),
        "suggestions": suggestions,
    }
    with open(os.path.join(args.output_dir, "generation_summary.json"), "w") as f:
        json.dump(summary, f, indent=2)

    if not suggestions:
        print("⚠️ No suggestions were generated, but continuing with empty results.")
    else:
        print(f"✅ Generated {len(suggestions)} suggestions")


if __name__ == "__main__":
    main()
