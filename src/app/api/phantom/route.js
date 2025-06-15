import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function POST(req) {
  const body = await req.json();

  // ✅ Log incoming body
  console.log('📨 Received from PhantomBuster:', JSON.stringify(body, null, 2));

  const { content, post_url, author_name, likes, comments } = body;

  // ✅ Log destructured values
  console.log('🧩 Parsed values:', { content, post_url, author_name, likes, comments });

  const { error } = await supabase.from('posts').insert([
    {
      content,
      post_url,
      author_name,
      likes,
      comments,
      post_date: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error('❌ Supabase insert error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
