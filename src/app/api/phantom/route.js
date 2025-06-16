// src/app/api/phantom/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const body = await req.json();
    console.log('📦 Payload received:', body);

    const { content, post_url, author_name, likes, comments } = body;

    const { data, error } = await supabase.from('posts').insert([
      {
        content,
        post_url,
        author_name,
        likes,
        comments,
      },
    ]);

    if (error) {
      console.error('❌ Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('❌ Handler error:', err);
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
