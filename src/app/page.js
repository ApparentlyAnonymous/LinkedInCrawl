'use client';
import { useEffect, useState } from 'react';
import supabase from '../../lib/supabase';

export default function Page() {
  const [posts, setPosts] = useState([]);
  const [replies, setReplies] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase Error:', error.message);
    } else {
      setPosts(data || []);
    }
  }

  async function generateReply(postId, postContent) {
    const res = await fetch('/api/reply', {
      method: 'POST',
      body: JSON.stringify({ postContent }),
    });

    const { reply } = await res.json();

    setReplies((prev) => ({
      ...prev,
      [postId]: reply,
    }));
  }

  return (
    <main
      style={{
        padding: 20,
        color: 'white',
        backgroundColor: '#1a1a1a',
        fontFamily: 'sans-serif',
        minHeight: '100vh',
      }}
    >
      <h1>🧠 LinkedIn Listener Dashboard</h1>

      {posts.length === 0 ? (
        <p>No posts found. Waiting for webhook input...</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            style={{
              border: '1px solid #444',
              borderRadius: 8,
              padding: 16,
              marginBottom: 20,
            }}
          >
            <p><strong>Author:</strong> {post.author_name}</p>
            <p>{post.content}</p>
            <p>👍 {post.likes} | 💬 {post.comments}</p>
            <a
              href={post.post_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#4DA6FF' }}
            >
              View on LinkedIn
            </a>
            <br />
            <button onClick={() => generateReply(post.id, post.content)} style={{ marginTop: 8 }}>
              💬 Generate GPT Reply
            </button>
            {replies[post.id] && (
              <p style={{ marginTop: 10, fontStyle: 'italic', color: '#ccc' }}>
                💡 GPT: {replies[post.id]}
              </p>
            )}
          </div>
        ))
      )}
    </main>
  );
}
