import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

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
    links?: PaginationLink[];
};

interface SharedProps {
    auth: {
        user: User | null;
    };
    [key: string]: unknown;
}

export default function DashboardPosts() {
    const { auth } = usePage<SharedProps>().props;
    const [posts, setPosts] = useState<PaginatedPosts | null>(null);
    const [loading, setLoading] = useState(true);
    const fetchPosts = async (url = '/api/posts') => {
        setLoading(true);
        try {
            const response = await fetch(url);

            const json: PaginatedPosts = await response.json();
            setPosts(json);
        } catch (error) {
            console.error('Gagal mengambil posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    if (loading) return <div className="p-4">Memuat postingan...</div>;

    if (!posts?.data || posts.data.length === 0) {
        return <div className="p-4 text-zinc-500">Tidak ada postingan publik yang aktif.</div>;
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
                {posts.data.map((post) => {
                    const isDraft = post.is_draft;
                    const isScheduled = post.published_at && new Date(post.published_at) > new Date();

                    return (
                        <div key={post.id} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="flex items-start justify-between">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <Link href={route('posts.show', post.id)}>
                                            <h3 className="text-lg font-bold text-zinc-800 capitalize transition-colors hover:text-indigo-600 dark:text-zinc-100">
                                                {post.title}
                                            </h3>
                                        </Link>

                                        <div className="flex gap-2">
                                            {isDraft ? (
                                                <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 uppercase dark:bg-amber-900/40 dark:text-amber-400">
                                                    Draft
                                                </span>
                                            ) : isScheduled ? (
                                                <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 uppercase dark:bg-blue-900/40 dark:text-blue-400">
                                                    Scheduled
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-500">
                                        By <span className="font-medium text-zinc-700 dark:text-zinc-300">{post.author?.name}</span>
                                        <span className="mx-2">|</span>
                                        {post.published_at
                                            ? new Date(post.published_at).toLocaleDateString('id-ID', {
                                                  day: 'numeric',
                                                  month: 'long',
                                                  year: 'numeric',
                                              })
                                            : 'No date'}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    {auth.user?.id === post.author?.id && (
                                        <>
                                            <Link
                                                href={route('posts.edit', post.id)}
                                                className="rounded-md bg-amber-50 px-3 py-1 text-sm font-medium text-amber-600 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400"
                                            >
                                                Edit
                                            </Link>

                                            <Link
                                                href={route('posts.destroy', post.id)}
                                                method="delete"
                                                as="button"
                                                onBefore={() => confirm('Apakah Anda yakin ingin menghapus postingan ini?')}
                                                className="rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400"
                                            >
                                                Delete
                                            </Link>
                                        </>
                                    )}

                                    <Link
                                        href={route('posts.show', post.id)}
                                        className="rounded-md bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
                                    >
                                        Show
                                    </Link>
                                </div>
                            </div>
                            <p className="mt-2 line-clamp-2 text-zinc-600 dark:text-zinc-400">{post.content}</p>
                        </div>
                    );
                })}
            </div>

            {posts.links && posts.links.length > 3 && (
                <div className="mt-6 flex flex-wrap gap-2">
                    {posts.links.map((link, i) => (
                        <button
                            key={i}
                            disabled={!link.url || link.active}
                            onClick={() => link.url && fetchPosts(link.url)}
                            className={`rounded px-3 py-1 text-sm transition ${
                                link.active ? 'bg-zinc-800 text-white' : 'bg-white text-zinc-600 hover:bg-zinc-100'
                            } ${!link.url ? 'cursor-not-allowed opacity-30' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
