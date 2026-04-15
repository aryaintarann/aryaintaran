import { createClient } from '@supabase/supabase-js';
import NewsSectionClient from './NewsSectionClient';

export default async function NewsSection() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, slug, description, published_at, cover_image')
    .order('published_at', { ascending: false })
    .limit(3);

  return <NewsSectionClient articles={articles} />;
}
