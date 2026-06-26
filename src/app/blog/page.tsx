import type { Metadata } from "next";
import Link from "next/link";
import { RenderBlocks } from "@/components/blocks/RenderBlocks";
import { fetchPageBySlug, fetchPosts, mediaUrl, mediaAlt, toCardPost } from "@/lib/payload";
import { payloadFieldAttrs } from "@/lib/payload-attrs";
import skinConfig from "@/skin.config";

const BLOG_INDEX_SLUG = "blog";

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchPageBySlug(BLOG_INDEX_SLUG);
  return {
    title: page?.meta?.title ?? `Blog | ${skinConfig.brandName}`,
    description:
      page?.meta?.description ??
      `Articles, tips, and guides from ${skinConfig.brandName}.`,
  };
}

export default async function BlogIndexPage() {
  const [page, posts] = await Promise.all([fetchPageBySlug(BLOG_INDEX_SLUG), fetchPosts()]);
  const cardPosts = posts.map(toCardPost);
  const headerBlocks = page?.blocks ?? [];

  return (
    <div data-nocms-component="payload-page">
      {headerBlocks.length > 0 ? (
        <RenderBlocks blocks={headerBlocks} docId={page!.id} blocksField="blocks" />
      ) : (
        <section data-nocms-component="blog-header" className="bg-surface py-10 lg:py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h1
              {...(page
                ? payloadFieldAttrs({ collection: "pages", docId: page.id, field: "title" })
                : {})}
              data-role="heading"
              className="font-heading text-4xl sm:text-5xl font-bold text-text"
            >
              {page?.title ?? `${skinConfig.brandName} blog`}
            </h1>
            <p data-role="subheading" className="mt-3 text-lg text-muted max-w-2xl">
              {page?.meta?.description ??
                "Articles, tips, and guides for residents and families."}
            </p>
          </div>
        </section>
      )}

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {cardPosts.length === 0 ? (
            <p className="text-muted">No articles yet. Check back soon.</p>
          ) : (
            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {cardPosts.map((post, idx) => {
                const original = posts[idx];
                const cover = mediaUrl(original.featuredImage);
                const coverAlt = mediaAlt(original.featuredImage) || post.title;
                return (
                  <li key={post.slug} className="group">
                    <Link href={`/blog/${post.slug}`} className="block">
                      {cover && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          data-role="media"
                          src={cover}
                          alt={coverAlt}
                          className="w-full h-48 object-cover rounded-xl mb-4"
                        />
                      )}
                      <h2
                        data-role="heading"
                        className="font-heading text-xl font-semibold text-text group-hover:text-primary transition-colors"
                      >
                        {post.title}
                      </h2>
                      {post.publishedAt && (
                        <p className="mt-1 text-sm text-muted">
                          {new Date(post.publishedAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      )}
                      {post.excerpt && (
                        <p className="mt-2 text-muted line-clamp-3">{post.excerpt}</p>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
