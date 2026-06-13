/**
 * POLYMARKET BLOG - ARTICLE GENERATOR BOT
 * Version FIXÉE - Utilise fetch directement (pas de package npm)
 */

const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = 'public/articles';

const TOPICS = [
  { title: 'Polymarket Complete Beginners Guide 2026', keywords: 'polymarket guide, how to use polymarket, polymarket tutorial' },
  { title: 'How to Get Started on Polymarket in 5 Steps', keywords: 'polymarket setup, polymarket for beginners, get started polymarket' },
  { title: 'Understanding Polymarket Odds Explained', keywords: 'polymarket odds, how to read odds, probability polymarket' },
  { title: '10 Polymarket Tips to Increase Your Win Rate', keywords: 'polymarket tips, how to win polymarket, trading tips' },
  { title: 'Polymarket Trading Strategies That Actually Work', keywords: 'polymarket strategies, trading strategies, prediction market strategies' },
  { title: 'Risk Management on Polymarket: Complete Guide', keywords: 'polymarket risk management, position sizing, bankroll management' },
  { title: 'MetaMask Setup for Polymarket: Step-by-Step', keywords: 'metamask polymarket, wallet setup, usdc polygon' },
  { title: 'How to Buy USDC on Polygon Network', keywords: 'buy usdc polygon, polygon network, stablecoin' },
  { title: 'Reading Polymarket Charts: Technical Analysis Guide', keywords: 'polymarket charts, technical analysis, price prediction' },
  { title: 'Polymarket vs Kalshi: Detailed Comparison 2026', keywords: 'polymarket vs kalshi, prediction markets comparison' },
  { title: 'Polymarket vs Traditional Betting: Key Differences', keywords: 'polymarket vs betting, prediction market vs sports betting' },
  { title: 'Polymarket Arbitrage: How to Exploit Price Differences', keywords: 'arbitrage polymarket, price differences, trading profits' },
  { title: 'What is a Prediction Market? Comprehensive Explanation', keywords: 'prediction market, how prediction markets work' },
  { title: 'Is Polymarket Legal? Regulatory Status by Country', keywords: 'polymarket legal, is polymarket safe, regulations' },
  { title: 'How Do Polymarket Markets Resolve? Complete Guide', keywords: 'market resolution, polymarket settlement, outcome verification' },
  { title: 'Political Prediction Markets on Polymarket Explained', keywords: 'political markets, election prediction, political betting' },
  { title: 'Crypto Price Prediction Markets: How to Trade', keywords: 'crypto markets, bitcoin prediction, price prediction' },
  { title: 'Sports Markets on Polymarket: Complete Overview', keywords: 'sports markets, sports betting, game outcomes' },
  { title: 'Polymarket Security: Protect Your Funds Guide', keywords: 'polymarket security, wallet security, stay safe' },
  { title: 'Common Polymarket Mistakes Beginners Make', keywords: 'polymarket mistakes, avoid losses, beginner errors' },
  { title: 'Polymarket Fees Explained: How Much You Pay', keywords: 'polymarket fees, trading fees, cost analysis' },
  { title: 'Trading Psychology on Polymarket: Control Emotions', keywords: 'trading psychology, emotional trading, discipline' },
  { title: 'How to Stay Disciplined in Prediction Markets', keywords: 'trading discipline, emotional control, strategy discipline' },
  { title: 'Avoiding Common Cognitive Biases in Trading', keywords: 'trading biases, cognitive biases, better decisions' },
  { title: 'Best Tools for Polymarket Trading 2026', keywords: 'polymarket tools, trading tools, analytics tools' },
  { title: 'Polymarket Dashboard Guide: Track Your Performance', keywords: 'polymarket dashboard, portfolio tracking, analytics' },
  { title: 'How Crypto Traders Use Polymarket for Hedging', keywords: 'hedging crypto, risk mitigation, portfolio protection' },
  { title: 'Long-term Polymarket Strategy: Build Sustainable Profits', keywords: 'long-term strategy, sustainable trading, consistent profits' },
  { title: 'From Beginner to Pro: Polymarket Trading Evolution', keywords: 'trading progression, skill development, trader journey' },
  { title: 'Why Most Traders Lose Money and How to Win', keywords: 'trader losses, why traders fail, winning strategies' }
];

async function generateArticle(topic) {
  console.log(`📝 Generating: ${topic.title}...`);

  const prompt = `Write a professional SEO-optimized article in English about: "${topic.title}"

CRITICAL REQUIREMENTS:
1. LENGTH: Minimum 2500 words
2. MARKDOWN STRUCTURE:
   - # H1 Title: ${topic.title}
   - ## H2 sections (4-6 sections)
   - ### H3 subsections
3. SEO OPTIMIZATION:
   - Main keywords: ${topic.keywords}
   - Use keywords naturally throughout
   - Include keywords in first paragraph
4. CONTENT:
   - Professional and informative
   - Concrete examples
   - Action-oriented
   - High-quality
5. FORMATTING:
   - Use bold for key points (**text**)
   - Use bullet lists for clarity
   - Use tables for comparisons
6. CALL TO ACTION:
   - 2-3 CTAs to Polymarket
   - Format: "[Start trading on Polymarket](https://polymarket.com)"
7. DISCLAIMER:
   - End with: "This is educational content only. Trading involves risk of loss."

Start directly with content, no introduction.`;

  try {
    const response = await fetch('https://api.mistral.ai/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('API Error:', error);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.content[0].text;

    return {
      title: topic.title,
      content: content,
      keywords: topic.keywords,
      generated_at: new Date().toISOString()
    };
  } catch (error) {
    console.error(`❌ Error for ${topic.title}:`, error.message);
    throw error;
  }
}

async function createMarkdownFile(article, filename) {
  const slug = filename.replace('.md', '');
  const frontmatter = `---
title: "${article.title}"
date: ${article.generated_at}
keywords: "${article.keywords}"
slug: "${slug}"
---

`;

  const markdown = frontmatter + article.content;
  
  const filepath = path.join(ARTICLES_DIR, filename);
  
  if (!fs.existsSync(ARTICLES_DIR)) {
    fs.mkdirSync(ARTICLES_DIR, { recursive: true });
  }

  fs.writeFileSync(filepath, markdown, 'utf-8');
  console.log(`✅ File created: ${filepath}`);
  
  return filepath;
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50);
}

async function selectRandomTopic() {
  return TOPICS[Math.floor(Math.random() * TOPICS.length)];
}

async function main() {
  console.log(`
╔════════════════════════════════════════════════╗
║  🤖 POLYMARKET ARTICLE GENERATOR BOT           ║
║     Powered by Mistral API (FREE)              ║
╚════════════════════════════════════════════════╝
  `);

  try {
    const topic = await selectRandomTopic();
    console.log(`\n📌 Topic: ${topic.title}\n`);

    const article = await generateArticle(topic);

    const slug = generateSlug(topic.title);
    const filename = `${new Date().toISOString().split('T')[0]}-${slug}.md`;
    await createMarkdownFile(article, filename);

    console.log(`
✨ Article generated successfully!
📊 Statistics:
   - Title: ${article.title}
   - Keywords: ${article.keywords}
   - File: public/articles/${filename}

🎉 Article ready to publish!
    `);
  } catch (error) {
    console.error(`\n❌ Error:`, error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { generateArticle, createMarkdownFile };
