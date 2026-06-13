import fs from 'fs';
import path from 'path';
import Head from 'next/head';
import Link from 'next/link';
import { marked } from 'marked';
import matter from 'gray-matter';

export default function Article({ article, content }) {
  return (
    <>
      <Head>
        <title>{article.title} - Polymarket Guide</title>
        <meta name="description" content={article.excerpt} />
        <meta name="keywords" content={article.keywords} />
      </Head>

      <div style={styles.container}>
        <header style={styles.header}>
          <Link href="/">
            <a style={styles.backLink}>← Back to all articles</a>
          </Link>
        </header>

        <main style={styles.main}>
          <article style={styles.article}>
            <div style={styles.articleHeader}>
              <h1 style={styles.title}>{article.title}</h1>
              
              <div style={styles.meta}>
                <span>
                  📅 {new Date(article.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span style={styles.divider}>•</span>
                <span>{article.keywords}</span>
              </div>
            </div>

            <div 
              style={styles.content}
              dangerouslySetInnerHTML={{ __html: content }}
            />

            <div style={styles.ctaSection}>
              <div style={styles.ctaBox}>
                <h3 style={styles.ctaTitle}>Ready to start trading?</h3>
                <p style={styles.ctaText}>
                  Join Polymarket today and start trading on prediction markets.
                </p>
                <a 
                  href="https://polymarket.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.ctaButton}
                >
                  Open Polymarket →
                </a>
              </div>
            </div>

            <div style={styles.disclaimer}>
              <strong>Disclaimer:</strong> This content is for educational purposes only. Trading involves significant risk of loss. Always do your own research and only trade what you can afford to lose.
            </div>
          </article>

          <aside style={styles.sidebar}>
            <h3 style={styles.sidebarTitle}>More Articles</h3>
            <p style={styles.sidebarText}>Check back tomorrow for more content!</p>
            <Link href="/">
              <a style={styles.backToHome}>← Back to all articles</a>
            </Link>
          </aside>
        </main>

        <footer style={styles.footer}>
          <p>🤖 Powered by Mistral AI • Auto-generated articles</p>
        </footer>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const articlesDir = path.join(process.cwd(), 'public', 'articles');
  
  if (!fs.existsSync(articlesDir)) {
    return { paths: [], fallback: true };
  }

  const files = fs.readdirSync(articlesDir).filter(file => file.endsWith('.md'));
  
  const paths = files.map((file) => {
    const filePath = path.join(articlesDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);
    
    return {
      params: {
        slug: data.slug || file.replace('.md', '')
      }
    };
  });

  return {
    paths,
    fallback: 'blocking'
  };
}

export async function getStaticProps({ params }) {
  const articlesDir = path.join(process.cwd(), 'public', 'articles');
  const files = fs.readdirSync(articlesDir);
  
  let article = null;
  let content = '';

  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    
    const filePath = path.join(articlesDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content: rawContent } = matter(fileContent);
    
    if ((data.slug || file.replace('.md', '')) === params.slug) {
      marked.setOptions({
        breaks: true,
        gfm: true,
      });

      let html = marked(rawContent);
      html = html.replace(/<h2>(.*?)<\/h2>/g, (match, content) => {
        const id = content.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        return `<h2 id="${id}">${content}</h2>`;
      });

      article = {
        title: data.title || file.replace('.md', ''),
        slug: params.slug,
        date: data.date || new Date().toISOString(),
        keywords: data.keywords || 'polymarket',
        excerpt: rawContent.slice(0, 160) + '...'
      };
      
      content = html;
      break;
    }
  }

  if (!article) {
    return { notFound: true };
  }

  return {
    props: { article, content },
    revalidate: 3600
  };
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    color: 'white',
  },
  backLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
    opacity: 0.9,
  },
  main: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px 20px',
    display: 'grid',
    gridTemplateColumns: '1fr 250px',
    gap: '40px',
  },
  article: {
    background: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
  },
  articleHeader: {
    marginBottom: '30px',
  },
  title: {
    fontSize: '36px',
    fontWeight: '700',
    margin: '0 0 15px 0',
    color: '#333',
    lineHeight: '1.3',
  },
  meta: {
    fontSize: '14px',
    color: '#999',
    marginBottom: '20px',
  },
  divider: {
    margin: '0 8px',
  },
  content: {
    lineHeight: '1.8',
    color: '#333',
    fontSize: '16px',
  },
  ctaSection: {
    marginTop: '40px',
    paddingTop: '40px',
    borderTop: '1px solid #eee',
  },
  ctaBox: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '30px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  ctaTitle: {
    fontSize: '20px',
    fontWeight: '700',
    margin: '0 0 10px 0',
  },
  ctaText: {
    fontSize: '16px',
    margin: '0 0 20px 0',
  },
  ctaButton: {
    display: 'inline-block',
    backgroundColor: 'white',
    color: '#667eea',
    padding: '12px 30px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: '600',
    cursor: 'pointer',
  },
  disclaimer: {
    background: '#fff3cd',
    padding: '15px',
    borderRadius: '6px',
    borderLeft: '4px solid #ffc107',
    fontSize: '13px',
    color: '#856404',
    marginTop: '30px',
  },
  sidebar: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
    height: 'fit-content',
  },
  sidebarTitle: {
    fontSize: '16px',
    fontWeight: '700',
    margin: '0 0 15px 0',
    color: '#333',
  },
  sidebarText: {
    fontSize: '14px',
    color: '#666',
    margin: '0 0 20px 0',
  },
  backToHome: {
    display: 'block',
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px',
  },
  footer: {
    background: '#333',
    color: 'white',
    padding: '20px',
    textAlign: 'center',
    fontSize: '14px',
  },
};
