import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req) {
  try {
    const body = await req.json();

    const { content, post_url, author_name, likes, comments } = body;

    const { error } = await supabase.from('posts').insert([
      {
        content,
        post_url,
        author_name,
        likes,
        comments,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('Supabase insert error:', error.message);
      return NextResponse.json({ success: false, error: error.message });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Webhook error:', err.message);
    return NextResponse.json({ success: false, error: 'Invalid request' });
  }
}
