import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Head from 'next/head';
import matter from 'gray-matter';

export default function Home({ articles }) {
  return (
    <>
      <Head>
        <title>Polymarket Guide - Complete Trading Guide & Tips 2026</title>
        <meta name="description" content="Learn how to trade on Polymarket with our comprehensive guides, strategies, and tips for beginners and advanced traders." />
        <meta name="keywords" content="polymarket, guide, tips, trading, prediction market" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.headerContent}>
            <h1 style={styles.title}>🎯 Polymarket Trading Guide</h1>
            <p style={styles.subtitle}>Master prediction markets with our AI-generated guides, strategies, and tips</p>
            <div style={styles.stats}>
              <span>{articles ? articles.length : 0} articles</span>
              <span>•</span>
              <span>Updated daily</span>
              <span>•</span>
              <span>100% free</span>
            </div>
          </div>
        </header>

        <main style={styles.main}>
          {articles && articles.length > 0 && (
            <section style={styles.featuredSection}>
              <h2 style={styles.sectionTitle}>📌 Latest Article</h2>
              <div style={styles.featuredArticle}>
                <h3 style={styles.featuredTitle}>{articles[0].title}</h3>
                <p style={styles.featuredExcerpt}>{articles[0].excerpt}</p>
                <div style={styles.articleMeta}>
                  <small>
                    📅 {new Date(articles[0].date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </small>
                  <span style={styles.divider}>•</span>
                  <small>{articles[0].keywords}</small>
                </div>
                <Link href={`/article/${articles[0].slug}`}>
                  <a style={styles.readMoreButton}>Read Full Article →</a>
                </Link>
              </div>
            </section>
          )}

          <section style={styles.articlesSection}>
            <h2 style={styles.sectionTitle}>📚 All Articles</h2>
            
            {articles && articles.length > 1 ? (
              <div style={styles.grid}>
                {articles.slice(1).map((article) => (
                  <article key={article.slug} style={styles.articleCard}>
                    <h3 style={styles.cardTitle}>{article.title}</h3>
                    <p style={styles.cardExcerpt}>{article.excerpt}</p>
                    <div style={styles.cardMeta}>
                      <small>
                        {new Date(article.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </small>
                    </div>
                    <Link href={`/article/${article.slug}`}>
                      <a style={styles.cardLink}>Read more →</a>
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <div style={styles.noArticles}>
                <p>🤖 <strong>No articles yet</strong></p>
                <p>Articles are auto-generated daily at 8 AM UTC (Coordinated Universal Time).</p>
                <p>The first article will be published tomorrow morning!</p>
                <p style={styles.comingSoon}>📅 Come back tomorrow!</p>
              </div>
            )}
          </section>

          <section style={styles.infoSection}>
            <h2 style={styles.sectionTitle}>ℹ️ About This Blog</h2>
            <div style={styles.infoContent}>
              <p>
                This blog is <strong>automatically generated</strong> using Mistral AI. Every day, new articles about Polymarket trading, strategies, and tips are created and published without any manual effort.
              </p>
              <p>
                Articles cover topics including:
              </p>
              <ul style={styles.list}>
                <li>✅ Complete guides and tutorials</li>
                <li>✅ Trading strategies and tips</li>
                <li>✅ Risk management advice</li>
                <li>✅ Step-by-step instructions</li>
                <li>✅ SEO-optimized content</li>
              </ul>
              <p style={styles.disclaimer}>
                <strong>Disclaimer:</strong> This content is for educational purposes only. Trading involves significant risk of loss. Always do your own research before trading.
              </p>
            </div>
          </section>
        </main>

        <footer style={styles.footer}>
          <p>🤖 Powered by Mistral AI • Articles auto-generated daily</p>
        </footer>
      </div>
    </>
  );
}

export async function getStaticProps() {
  try {
    const articlesDir = path.join(process.cwd(), 'public', 'articles');
    
    let articles = [];
    
    if (fs.existsSync(articlesDir)) {
      const files = fs.readdirSync(articlesDir).filter(file => file.endsWith('.md'));
      
      articles = files.map((file) => {
        const filePath = path.join(articlesDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        
        const { data, content } = matter(fileContent);
        
        const excerpt = content
          .replace(/^#.*\n/m, '')
          .replace(/[#*`]/g, '')
          .split('\n')
          .filter(line => line.trim())
          .slice(0, 2)
          .join(' ')
          .substring(0, 160) + '...';
        
        return {
          title: data.title || file.replace('.md', ''),
          slug: data.slug || file.replace('.md', ''),
          date: data.date || new Date().toISOString(),
          keywords: data.keywords || 'polymarket',
          excerpt: excerpt,
        };
      }).sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    return {
      props: { articles },
      revalidate: 60
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: { articles: [] },
      revalidate: 60
    };
  }
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '60px 20px',
    textAlign: 'center',
  },
  headerContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  title: {
    fontSize: '48px',
    fontWeight: '700',
    margin: '0 0 10px 0',
  },
  subtitle: {
    fontSize: '18px',
    margin: '0 0 20px 0',
    opacity: 0.95,
  },
  stats: {
    fontSize: '14px',
    opacity: 0.9,
  },
  main: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  featuredSection: {
    marginBottom: '60px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '20px',
    color: '#333',
  },
  featuredArticle: {
    background: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    borderLeft: '4px solid #667eea',
  },
  featuredTitle: {
    fontSize: '28px',
    margin: '0 0 15px 0',
    color: '#333',
  },
  featuredExcerpt: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#666',
    margin: '0 0 15px 0',
  },
  articleMeta: {
    fontSize: '13px',
    color: '#999',
    marginBottom: '15px',
  },
  divider: {
    margin: '0 8px',
    color: '#ddd',
  },
  readMoreButton: {
    display: 'inline-block',
    backgroundColor: '#667eea',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: '600',
    cursor: 'pointer',
  },
  articlesSection: {
    marginBottom: '60px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  articleCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 10px 0',
    color: '#333',
  },
  cardExcerpt: {
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#666',
    margin: '0 0 10px 0',
  },
  cardMeta: {
    fontSize: '12px',
    color: '#999',
    marginBottom: '12px',
  },
  cardLink: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px',
  },
  noArticles: {
    textAlign: 'center',
    color: '#999',
    fontSize: '16px',
    padding: '60px 20px',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
  },
  comingSoon: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#667eea',
    marginTop: '20px',
  },
  infoSection: {
    background: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
    marginBottom: '40px',
  },
  infoContent: {
    lineHeight: '1.8',
    color: '#555',
  },
  list: {
    paddingLeft: '20px',
    margin: '15px 0',
  },
  disclaimer: {
    background: '#fff3cd',
    padding: '15px',
    borderRadius: '6px',
    borderLeft: '4px solid #ffc107',
    marginTop: '20px',
    fontSize: '14px',
  },
  footer: {
    background: '#333',
    color: 'white',
    padding: '30px 20px',
    textAlign: 'center',
  },
};
