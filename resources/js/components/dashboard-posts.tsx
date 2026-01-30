import { usePage } from '@inertiajs/react';
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

    const fetchPosts = (page: number = 1) => {
        setLoading(true);
        axios
            .get<PaginatedPosts>(`/posts/json?page=${page}`)
            .then((res) => setPosts(res.data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    if (!posts && loading) return <div className="p-4">Loading...</div>;
    if (!posts) return <div className="p-4">Tidak ada data.</div>;

    return (
        <div className="p-4">
            {auth.user && (
                <button className="mb-4 rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700">+ Buat Post Baru</button>
            )}

            <div className={loading ? 'opacity-50' : ''}>
                {posts.data.map((post) => (
                    <div
                        key={post.id}
                        className="mb-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">{post.title}</h3>
                                <p className="text-sm text-gray-500">
                                    Oleh {post.author?.name || 'Sistem'} | {new Date(post.published_at).toLocaleDateString()}
                                </p>
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
