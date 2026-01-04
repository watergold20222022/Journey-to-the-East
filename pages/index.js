import Head from 'next/head';
import { useState, useEffect } from 'react';

export default function Home({ initialChapters }) {
  const [chapters, setChapters] = useState(initialChapters || []);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [chapterContent, setChapterContent] = useState('');

  useEffect(() => {
    // Fetch chapters list from API
    const fetchChapters = async () => {
      try {
        const response = await fetch('/api/chapters');
        const data = await response.json();
        setChapters(data.chapters);
      } catch (error) {
        console.error('Error fetching chapters:', error);
      }
    };

    fetchChapters();
  }, []);

  useEffect(() => {
    if (chapters.length > 0 && !selectedChapter) {
      setSelectedChapter(chapters[0]);
    }
  }, [chapters, selectedChapter]);

  useEffect(() => {
    if (selectedChapter) {
      fetchChapterContent(selectedChapter.slug);
    }
  }, [selectedChapter]);

  const fetchChapterContent = async (slug) => {
    try {
      const response = await fetch(`/api/chapter/${slug}`);
      const data = await response.json();
      setChapterContent(data.content);
    } catch (error) {
      console.error('Error fetching chapter:', error);
      setChapterContent('<p>Failed to load chapter content.</p>');
    }
  };

  return (
    <div className="container">
      <Head>
        <title>Journey to the East</title>
        <meta name="description" content="A reimagining of the classic Chinese novel Journey to the West for contemporary US readers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="header">
        <h1>Journey to the East</h1>
        <p>A reimagining of the classic Chinese novel Journey to the West for contemporary US readers</p>
      </header>

      <main className="main">
        <div className="sidebar">
          <h2>Chapters</h2>
          <ul className="chapter-list">
            {chapters.map((chapter) => (
              <li key={chapter.slug} className={selectedChapter?.slug === chapter.slug ? 'active' : ''}>
                <button 
                  onClick={() => setSelectedChapter(chapter)}
                  className={selectedChapter?.slug === chapter.slug ? 'active' : ''}
                >
                  {chapter.title}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="content">
          {selectedChapter ? (
            <>
              <h2>{selectedChapter.title}</h2>
              <div 
                className="chapter-content" 
                dangerouslySetInnerHTML={{ __html: chapterContent }} 
              />
            </>
          ) : (
            <p>Select a chapter to begin reading.</p>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>Journey to the East &copy; {new Date().getFullYear()}</p>
      </footer>

      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f5f5f5;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        
        .header {
          background-color: #2c3e50;
          color: white;
          padding: 2rem;
          text-align: center;
        }
        
        .header h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        
        .main {
          display: flex;
          flex: 1;
          padding: 1rem;
          gap: 1rem;
        }
        
        .sidebar {
          width: 250px;
          background-color: white;
          border-radius: 8px;
          padding: 1rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          height: fit-content;
        }
        
        .chapter-list {
          list-style: none;
        }
        
        .chapter-list li {
          margin-bottom: 0.5rem;
        }
        
        .chapter-list button {
          width: 100%;
          text-align: left;
          padding: 0.75rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          background-color: #f8f9fa;
          transition: background-color 0.2s;
        }
        
        .chapter-list button:hover {
          background-color: #e9ecef;
        }
        
        .chapter-list button.active {
          background-color: #3498db;
          color: white;
        }
        
        .content {
          flex: 1;
          background-color: white;
          border-radius: 8px;
          padding: 2rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          overflow-y: auto;
        }
        
        .content h2 {
          margin-bottom: 1.5rem;
          color: #2c3e50;
          border-bottom: 2px solid #3498db;
          padding-bottom: 0.5rem;
        }
        
        .chapter-content {
          font-size: 1.1rem;
          line-height: 1.8;
        }
        
        .chapter-content p {
          margin-bottom: 1rem;
        }
        
        .footer {
          background-color: #ecf0f1;
          padding: 1.5rem;
          text-align: center;
          margin-top: auto;
        }
        
        @media (max-width: 768px) {
          .main {
            flex-direction: column;
          }
          
          .sidebar {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      initialChapters: [] // This will be populated dynamically on the client
    }
  };
}

