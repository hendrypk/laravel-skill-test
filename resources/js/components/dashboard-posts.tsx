import { Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

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

type PaginatedPosts = {
    data: Post[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

interface PageProps extends Record<string, unknown> {
    auth: {
        user: User | null;
    };
}

export default function DashboardPosts() {
    const { auth } = usePage<PageProps>().props;

    const [posts, setPosts] = useState<PaginatedPosts | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchPosts = useCallback((page: number = 1) => {
        setLoading(true);
        axios
            .get<PaginatedPosts>(`/posts/json?page=${page}`)
            .then((res) => setPosts(res.data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    });

    useEffect(() => {
        fetchPosts();
    }, []);

    if (!posts && loading) return <div className="p-4">Loading...</div>;
    if (!posts) return <div className="p-4">Tidak ada data.</div>;

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

            <div className={loading ? 'opacity-50' : ''}>
                {posts.data.map((post) => (
                    <div
                        key={post.id}
                        className="mb-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <Link href={route('posts.show', post.id)}>
                                                <h3 className="cursor-pointer text-lg font-bold text-zinc-800 capitalize transition-colors hover:text-indigo-600 dark:text-zinc-100 dark:hover:text-indigo-400">
                                                    {post.title}
                                                </h3>
                                            </Link>

                                            {auth.user?.id === post.author?.id && (
                                                <span className="rounded bg-indigo-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-indigo-700 uppercase dark:bg-indigo-900/40 dark:text-indigo-400">
                                                    Mine
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {status === 'deleted' && (
                                        <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-red-700 uppercase dark:bg-red-900/40 dark:text-red-400">
                                            Deleted
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-gray-500">
                                        By <span className="font-medium text-zinc-700 dark:text-zinc-300">{post.author?.name || 'Anonymous'}</span>
                                        <span className="mx-2">|</span>
                                        {post.published_at
                                            ? new Date(post.published_at).toLocaleDateString('id-ID', {
                                                  day: 'numeric',
                                                  month: 'long',
                                                  year: 'numeric',
                                              })
                                            : 'Belum dipublikasikan'}
                                    </p>

                                    <div className="flex gap-1">
                                        {post.is_draft === 1 && <span className="text-[10px] font-medium text-amber-600 italic">• Draft</span>}
                                        {post.is_draft === 0 && new Date(post.published_at || '') > new Date() && (
                                            <span className="text-[10px] font-medium text-blue-600 italic">• Scheduled</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Link
                                    href={route('posts.show', post.id)}
                                    className="text-sm font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                >
                                    Show
                                </Link>
                            </div>
                        </div>
                        <p className="mt-2 leading-relaxed text-zinc-600 dark:text-zinc-400">{post.content}</p>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
                {Array.from({ length: posts.last_page }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => fetchPosts(page)}
                        disabled={loading}
                        className={`rounded border px-3 py-1 transition ${
                            posts.current_page === page
                                ? 'border-zinc-800 bg-zinc-800 text-white dark:bg-zinc-100 dark:text-black'
                                : 'bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}
                    >
                        {page}
                    </button>
                ))}
            </div>
        </div>
    );
}
