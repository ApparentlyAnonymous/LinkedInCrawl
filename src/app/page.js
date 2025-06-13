'use client';

import { useEffect, useState } from 'react';
import supabase from '../../lib/supabase';

export default function Page() {
  const [posts, setPosts] = useState([]);
  const [replies, setReplies] = useState({});
  const [newPost, setNewPost] = useState({
    author_name: '',
    content: '',
    post_url: '',
    likes: 0,
    comments: 0,
  });

  // Fetch posts on load
  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('post_date', { ascending: false });

    if (error) {
      console.error('Supabase Error:', error.message);
    } else {
      setPosts(data);
    }
  }

  // Submit a new post to Supabase
  async function submitPost(e) {
    e.preventDefault();

    const { error } = await supabase.from('posts').insert([
      {
        ...newPost,
        post_date: new Date().toISOString(), // Add timestamp
        keywords: [], // optional empty array
      },
    ]);

    if (error) {
      console.error('Error inserting post:', error.message);
    } else {
      setNewPost({ author_name: '', content: '', post_url: '', likes: 0, comments: 0 });
      fetchPosts(); // Refresh the list
    }
  }

  // Generate GPT reply
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
    <main style={{ padding: 20 }}>
      <h1>🧠 LinkedIn Listener Dashboard</h1>

      <form onSubmit={submitPost} style={{ marginBottom: 30 }}>
        <h2>➕ Add New Post</h2>
        <input
          type="text"
          placeholder="Author Name"
          value={newPost.author_name}
          onChange={(e) => setNewPost({ ...newPost, author_name: e.target.value })}
          required
        /><br /><br />
        <textarea
          placeholder="Post Content"
          rows="4"
          cols="50"
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          required
        /><br /><br />
        <input
          type="url"
          placeholder="LinkedIn Post URL"
          value={newPost.post_url}
          onChange={(e) => setNewPost({ ...newPost, post_url: e.target.value })}
        /><br /><br />
        <input
          type="number"
          placeholder="Likes"
          value={newPost.likes}
          onChange={(e) => setNewPost({ ...newPost, likes: Number(e.target.value) })}
        />
        <input
          type="number"
          placeholder="Comments"
          value={newPost.comments}
          onChange={(e) => setNewPost({ ...newPost, comments: Number(e.target.value) })}
        />
        <br /><br />
        <button type="submit">Submit Post</button>
      </form>

      {posts.length === 0 && <p>No posts yet.</p>}

      {posts.map((post) => (
        <div key={post.id} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 20, borderRadius: 6 }}>
          <p><strong>Author:</strong> {post.author_name}</p>
          <p>{post.content}</p>
          <p>👍 {post.likes} | 💬 {post.comments}</p>
          <a href={post.post_url} target="_blank" rel="noopener noreferrer">View on LinkedIn</a>
          <br /><br />
          <button onClick={() => generateReply(post.id, post.content)}>💬 Generate GPT Reply</button>
          {replies[post.id] && (
            <p style={{ marginTop: 10, fontStyle: 'italic', color: '#444' }}>
              💡 GPT: {replies[post.id]}
            </p>
          )}
        </div>
      ))}
    </main>
  );
}
