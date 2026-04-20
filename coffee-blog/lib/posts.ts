import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface Post {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
  excerpt: string;
  content: string;
}

export interface PostMetadata {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
  excerpt: string;
}

// 全記事のメタデータを取得
export function getAllPosts(): PostMetadata[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title || '',
        category: data.category || '',
        date: data.date || '',
        readTime: data.readTime || '',
        image: data.image || '',
        tags: data.tags || [],
        excerpt: data.excerpt || '',
      };
    });

  // 日付でソート（新しい順）
  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

// slugを指定して記事を取得
export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || '',
      category: data.category || '',
      date: data.date || '',
      readTime: data.readTime || '',
      image: data.image || '',
      tags: data.tags || [],
      excerpt: data.excerpt || '',
      content,
    };
  } catch {
    return null;
  }
}

// 全記事のslugリストを取得（generateStaticParams用）
export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''));
}
