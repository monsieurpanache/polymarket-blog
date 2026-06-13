/**
 * POLYMARKET BLOG - ARTICLE GENERATOR BOT
 * Génère automatiquement des articles SEO avec Mistral API (GRATUIT)
 * À la racine du repo!
 */

const Mistral = require('@mistralai/mistralai').default;
const fs = require('fs');
const path = require('path');

// Configuration
const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY
});

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
  console.log(`📝 Génération de: ${topic.title}...`);

  const prompt = `Écris un article SEO professionnel et complet en anglais sur: "${topic.title}"

INSTRUCTIONS CRITIQUES:
1. LONGUEUR: Minimum 2500 mots
2. STRUCTURE MARKDOWN:
   - # H1 Title: ${topic.title}
   - ## H2 sections (4-6 sections)
   - ### H3 subsections
3. SEO OPTIMIZATION:
   - Mots-clés principaux: ${topic.keywords}
   - Utilise ces keywords naturellement dans les paragraphes
   - Premiere paragraph doit contenir le mot-clé principal
4. CONTENU:
   - Professionnel, informatif, utile
   - Exemples concrets si possible
   - Pas de contenu générique/vague
   - Toujours actionnable
5. FORMATAGE:
   - Code snippets avec backticks si nécessaire
   - Bold pour points importants (**texte**)
   - Listes à puces pour clarity
   - Tableaux pour comparaisons
6. APPELS À L'ACTION:
   - 2-3 CTAs naturels vers Polymarket
   - Format: "[Start trading on Polymarket](https://polymarket.com)"
7. DISCLAIMER:
   - Termine avec: "This is educational content only. Trading involves risk of loss."

Commence directement par le contenu, pas d'introduction.`;

  try {
    const message = await client.messages.create({
      model: "mistral-large-latest",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 4000
    });

    const content = message.content[0].text;
    return {
      title: topic.title,
      content: content,
      keywords: topic.keywords,
      generated_at: new Date().toISOString()
    };
  } catch (error) {
    console.error(`❌ Erreur pour ${topic.title}:`, error.message);
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
  
  // Créer le dossier s'il n'existe pas
  if (!fs.existsSync(ARTICLES_DIR)) {
    fs.mkdirSync(ARTICLES_DIR, { recursive: true });
  }

  fs.writeFileSync(filepath, markdown, 'utf-8');
  console.log(`✅ Fichier créé: ${filepath}`);
  
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
║     Powered by Mistral API (GRATUIT)           ║
╚════════════════════════════════════════════════╝
  `);

  try {
    // Sélectionne un sujet aléatoire
    const topic = await selectRandomTopic();
    console.log(`\n📌 Sujet du jour: ${topic.title}\n`);

    // Génère l'article
    const article = await generateArticle(topic);

    // Crée le fichier
    const slug = generateSlug(topic.title);
    const filename = `${new Date().toISOString().split('T')[0]}-${slug}.md`;
    await createMarkdownFile(article, filename);

    console.log(`
✨ Article généré avec succès!
📊 Statistiques:
   - Titre: ${article.title}
   - Mots-clés: ${article.keywords}
   - Fichier: public/articles/${filename}

🎉 Ton article est prêt à être publié!
    `);
  } catch (error) {
    console.error(`\n❌ Erreur:`, error);
    process.exit(1);
  }
}

// Lance le script
if (require.main === module) {
  main();
}

module.exports = { generateArticle, createMarkdownFile };
