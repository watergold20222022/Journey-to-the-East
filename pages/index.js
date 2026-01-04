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
        <p className="subtitle">SYSTEM STATUS: ONLINE | PROTOCOL: GREAT SAGE EQUAL TO HEAVEN</p>
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
          font-family: 'Courier New', monospace;
          line-height: 1.6;
          color: #00ffff;
          background: 
            linear-gradient(rgba(10, 10, 26, 0.85), rgba(10, 10, 26, 0.85)),
            url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=2000');
          background-size: cover;
          background-attachment: fixed;
          background-position: center;
        }
        
        .container {
          max-width: 1400px;
          margin: 0 auto;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: rgba(0, 255, 255, 0.02);
          position: relative;
        }

        .container::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 255, 0.03) 2px,
            rgba(0, 255, 255, 0.03) 4px
          );
          pointer-events: none;
          z-index: 10;
        }
        
        .header {
          background: linear-gradient(90deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a1a 100%);
          color: #00ffff;
          padding: 2rem;
          text-align: center;
          border-bottom: 2px solid #00ffff;
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.3), inset 0 0 60px rgba(0, 255, 255, 0.05);
          position: relative;
          overflow: hidden;
        }
        
        .header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 255, 0.03) 2px,
            rgba(0, 255, 255, 0.03) 4px
          );
          pointer-events: none;
        }
        
        .header h1 {
          font-size: 3rem;
          margin-bottom: 0.5rem;
          text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff;
          letter-spacing: 2px;
          font-weight: bold;
          animation: glitch 5s infinite;
        }

        @keyframes glitch {
          0% { text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff; }
          2% { text-shadow: 2px 0 #ff00ff, -2px 0 #00ffff; }
          4% { text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff; }
          98% { text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff; }
          99% { text-shadow: -2px 0 #ff00ff, 2px 0 #00ffff; }
          100% { text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff; }
        }
        
        .subtitle {
          color: #8a2be2;
          text-shadow: 0 0 10px #8a2be2;
          font-size: 0.9rem;
          letter-spacing: 3px;
          font-weight: bold;
          margin-top: 0.5rem;
        }
        
        .main {
          display: flex;
          flex: 1;
          padding: 2rem;
          gap: 2rem;
        }
        
        .sidebar {
          width: 280px;
          background: rgba(10, 10, 26, 0.8);
          border: 1px solid #00ffff;
          border-radius: 0;
          padding: 1.5rem;
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.2), inset 0 0 30px rgba(0, 255, 255, 0.05);
          height: fit-content;
          backdrop-filter: blur(10px);
        }
        
        .sidebar h2 {
          color: #8a2be2;
          font-size: 1.3rem;
          margin-bottom: 1rem;
          text-shadow: 0 0 10px #8a2be2;
          letter-spacing: 1px;
          border-bottom: 1px solid #8a2be2;
          padding-bottom: 0.5rem;
        }
        
        .chapter-list {
          list-style: none;
        }
        
        .chapter-list li {
          margin-bottom: 0.75rem;
        }
        
        .chapter-list button {
          width: 100%;
          text-align: left;
          padding: 0.8rem 1rem;
          border: 1px solid #00ffff;
          border-radius: 0;
          cursor: pointer;
          background: rgba(0, 255, 255, 0.05);
          color: #00ffff;
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .chapter-list button::before {
          content: '>';
          margin-right: 8px;
          opacity: 0.5;
        }
        
        .chapter-list button:hover {
          background: rgba(0, 255, 255, 0.15);
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.4), inset 0 0 10px rgba(0, 255, 255, 0.1);
        }
        
        .chapter-list button.active {
          background: linear-gradient(90deg, rgba(0, 255, 255, 0.3) 0%, rgba(138, 43, 226, 0.3) 100%);
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.5), inset 0 0 15px rgba(0, 255, 255, 0.2);
          border-color: #00ffff;
          text-shadow: 0 0 10px #00ffff;
        }
        
        .content {
          flex: 1;
          background: rgba(10, 10, 26, 0.9);
          border: 1px solid #8a2be2;
          padding: 2.5rem;
          box-shadow: 0 0 20px rgba(138, 43, 226, 0.3), inset 0 0 40px rgba(138, 43, 226, 0.05);
          overflow-y: auto;
          backdrop-filter: blur(10px);
        }
        
        .content h2 {
          margin-bottom: 2rem;
          color: #00ffff;
          font-size: 1.8rem;
          text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff;
          letter-spacing: 2px;
          border-bottom: 2px solid #00ffff;
          padding-bottom: 0.8rem;
          position: relative;
        }
        
        .content h2::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, #00ffff 0%, #8a2be2 100%);
        }
        
        .chapter-content {
          font-size: 1.05rem;
          line-height: 1.9;
          color: #e0e0e0;
        }
        
        .chapter-content p {
          margin-bottom: 1.5rem;
        }
        
        .chapter-content h1,
        .chapter-content h2,
        .chapter-content h3 {
          color: #00ffff;
          text-shadow: 0 0 5px #00ffff;
        }
        
        .chapter-content h3 {
          font-size: 1.4rem;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        
        .footer {
          background: linear-gradient(90deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a1a 100%);
          color: #8a2be2;
          padding: 1.5rem;
          text-align: center;
          margin-top: auto;
          border-top: 1px solid #8a2be2;
          text-shadow: 0 0 5px #8a2be2;
          font-size: 0.85rem;
        }
        
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(10, 10, 26, 0.5);
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #00ffff 0%, #8a2be2 100%);
          border-radius: 4px;
        }
        
        @media (max-width: 768px) {
          .main {
            flex-direction: column;
            padding: 1rem;
          }
          
          .sidebar {
            width: 100%;
          }
          
          .header h1 {
            font-size: 2rem;
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

