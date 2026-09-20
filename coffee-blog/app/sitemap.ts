import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://coffee-blog-eta.vercel.app';
  const posts = getAllPosts();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const blogPages: MetadataRoute.Sitemap = posts.map((post) => {
    const lastModified = new Date(post.date);

    return {
      url: `${baseUrl}/blog/${post.slug}`,
      ...(Number.isNaN(lastModified.getTime()) ? {} : { lastModified }),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    };
  });

  return [...staticPages, ...blogPages];
}
