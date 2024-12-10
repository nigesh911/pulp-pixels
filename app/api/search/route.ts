import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase();

  if (!query) {
    return NextResponse.json({ data: [] });
  }

  let dbQuery = supabase
    .from('wallpapers')
    .select('*');

  // Handle category and price filters
  if (query.includes('free mobile')) {
    dbQuery = dbQuery
      .eq('price', 0)
      .eq('category', 'mobile');
  } else if (query.includes('free desktop')) {
    dbQuery = dbQuery
      .eq('price', 0)
      .eq('category', 'desktop');
  } else if (query.includes('mobile')) {
    dbQuery = dbQuery
      .eq('category', 'mobile');
  } else if (query.includes('desktop')) {
    dbQuery = dbQuery
      .eq('category', 'desktop');
  } else if (query.includes('free')) {
    dbQuery = dbQuery
      .eq('price', 0);
  } else {
    // Regular search in title and description
    dbQuery = dbQuery
      .or(`title.ilike.%${query}%, description.ilike.%${query}%`);
  }

  // Always order by most recent first
  const { data, error } = await dbQuery.order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Failed to search wallpapers' }, { status: 500 });
  }

  return NextResponse.json({ data });
} 