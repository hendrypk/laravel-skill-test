import { Link, router, usePage } from '@inertiajs/react';

type User = {
    id: number;
    name: string;
};

type Post = {
    id: number;
    title: string;
    content: string;
    published_at: string;
    is_draft: boolean;
    author: User;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedPosts = {
    data: Post[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
};

interface SharedProps {
    auth: {
        user: User | null;
    };
    posts: PaginatedPosts;
}

export default function AuthorPosts() {
    const { auth, posts } = usePage<SharedProps>().props;

    if (!posts?.data || posts.data.length === 0) {
        return <div className="p-4 text-zinc-500">Tidak ada postingan yang ditemukan.</div>;
    }

    return (
        <div className="p-4">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {auth.user && (
                    <Link
                        href={route('posts.create')}
                        className="inline-block rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-green-700"
                    >
                        New Post
                    </Link>
                )}
            </div>

            <div className="grid gap-3">
                {posts.data.map((post) => (
                    <div key={post.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-start justify-between">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <Link href={route('posts.show', post.id)}>
                                        <h3 className="text-lg font-bold text-zinc-800 capitalize transition-colors hover:text-indigo-600 dark:text-zinc-100">
                                            {post.title}
                                        </h3>
                                    </Link>

                                    {auth.user?.id === post.author?.id && (
                                        <div className="flex gap-2">
                                            <span className="rounded bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 uppercase dark:bg-indigo-900/40">
                                                Mine
                                            </span>
                                            <Link
                                                href={route('posts.edit', post.id)}
                                                className="text-[10px] font-bold text-amber-600 hover:underline"
                                            >
                                                EDIT
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                <p className="text-sm text-gray-500">
                                    By <span className="font-medium text-zinc-700 dark:text-zinc-300">{post.author?.name}</span>
                                    <span className="mx-2">|</span>
                                    {new Date(post.published_at).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>

                            <Link
                                href={route('posts.show', post.id)}
                                className="rounded-md bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
                            >
                                Show
                            </Link>
                        </div>
                        <p className="mt-2 line-clamp-2 text-zinc-600 dark:text-zinc-400">{post.content}</p>
                    </div>
                ))}
            </div>

            {posts.links && posts.links.length > 3 && (
                <div className="mt-6 flex flex-wrap gap-2">
                    {posts.links.map((link, i) => (
                        <button
                            key={i}
                            disabled={!link.url || link.active}
                            onClick={() => link.url && router.get(link.url)}
                            className={`rounded px-3 py-1 text-sm transition ${
                                link.active ? 'bg-zinc-800 text-white dark:bg-zinc-100 dark:text-black' : 'bg-white text-zinc-600 hover:bg-zinc-100'
                            } ${!link.url ? 'cursor-not-allowed opacity-30' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
