import { Link, usePage } from '@inertiajs/react';
import axios from 'axios';
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
    const [status, setStatus] = useState('published');

    const fetchPosts = (page: number = 1, currentStatus: string = status) => {
        setLoading(true);
        axios
            .get<PaginatedPosts>(`/posts/json?page=${page}&status=${currentStatus}`)
            .then((res) => setPosts(res.data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    };

    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
        fetchPosts(1, newStatus);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    if (!posts && loading) return <div className="p-4">Loading...</div>;
    if (!posts) return <div className="p-4">Tidak ada data.</div>;

    return (
        <div className="p-4">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex w-fit gap-2 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
                    {['published', 'scheduled', 'draft', 'deleted'].map((s) => (
                        <button
                            key={s}
                            onClick={() => handleStatusChange(s)}
                            className={`rounded-md px-4 py-1.5 text-sm font-medium capitalize transition ${
                                status === s
                                    ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white'
                                    : 'text-zinc-500 hover:text-zinc-700'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {auth.user && (
                    <Link
                        href={route('posts.create')}
                        className="inline-block rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-green-700"
                    >
                        + Buat Post Baru
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
                                    <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">{post.title}</h3>

                                    {status === 'deleted' && (
                                        <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-red-700 uppercase dark:bg-red-900/40 dark:text-red-400">
                                            Deleted
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-gray-500">
                                        Oleh <span className="font-medium text-zinc-700 dark:text-zinc-300">{post.author?.name || 'Anonymous'}</span>
                                        <span className="mx-2">|</span>
                                        {post.published_at
                                            ? new Date(post.published_at).toLocaleDateString('id-ID', {
                                                  day: 'numeric',
                                                  month: 'long',
                                                  year: 'numeric',
                                              })
                                            : 'Belum dipublikasikan'}
                                    </p>

                                    {/* Badge Status Tambahan */}
                                    <div className="flex gap-1">
                                        {post.is_draft === 1 && <span className="text-[10px] font-medium text-amber-600 italic">• Draft</span>}
                                        {post.is_draft === 0 && new Date(post.published_at || '') > new Date() && (
                                            <span className="text-[10px] font-medium text-blue-600 italic">• Scheduled</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {auth.user && auth.user.id === post.author?.id && (
                                <div className="flex gap-3">
                                    <button className="text-sm text-blue-500 hover:underline">Edit</button>
                                    <button className="text-sm text-red-500 hover:underline">Hapus</button>
                                </div>
                            )}
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
