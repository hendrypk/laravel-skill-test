import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import React from 'react';

interface User {
    id: number;
    name: string;
}

interface Post {
    id: number;
    title: string;
    content: string;
    published_at: string;
    user: User;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Meta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

interface Props {
    posts: {
        data: Post[];
        links: {
            first: string;
            last: string;
            prev: string | null;
            next: string | null;
        };
        meta: Meta;
    };
    auth: {
        user: User | null;
    };
}

const Index: React.FC<Props> = ({ posts, auth }) => {
    return (
        <AppLayout>
            <div className="min-h-screen bg-slate-50 px-4 py-12 transition-colors duration-300 dark:bg-slate-950">
                <Head title="Posts Feed" />

                <div className="mx-auto max-w-4xl">
                    <div className="mb-10 flex items-end justify-between">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Posts Insights</h1>
                        </div>

                        {auth.user && (
                            <Link
                                href="/posts/create"
                                className="rounded-2xl bg-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-95 dark:shadow-indigo-900/20"
                            >
                                + Buat Postingan
                            </Link>
                        )}
                    </div>

                    <div className="grid gap-6">
                        {posts.data.length > 0 ? (
                            posts.data.map((post) => (
                                <article
                                    key={post.id}
                                    className="group rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition-all hover:border-indigo-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/50"
                                >
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 uppercase dark:bg-indigo-900/30 dark:text-indigo-400">
                                            {post.user.name.charAt(0)}
                                        </div>
                                        <div className="text-xs font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
                                            <span className="text-slate-700 dark:text-slate-300">{post.user.name}</span>
                                            <span className="mx-2">•</span>
                                            <span>{post.published_at}</span>
                                        </div>
                                    </div>

                                    <Link href={`/posts/${post.id}`}>
                                        <h2 className="mb-3 text-2xl leading-tight font-extrabold text-slate-800 transition group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400">
                                            {post.title}
                                        </h2>
                                    </Link>

                                    <p className="mb-6 line-clamp-2 leading-relaxed text-slate-600 dark:text-slate-400">{post.content}</p>

                                    <div className="flex items-center text-sm font-black text-indigo-600 transition-all group-hover:gap-2 dark:text-indigo-400">
                                        <Link href={`/posts/${post.id}`}>BACA SELENGKAPNYA</Link>
                                        <span className="opacity-0 transition-opacity group-hover:opacity-100">→</span>
                                    </div>
                                </article>
                            ))
                        ) : (
                            <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white py-20 text-center dark:border-slate-800 dark:bg-slate-900">
                                <p className="text-lg font-bold text-slate-400 dark:text-slate-500">Belum ada konten publik untuk saat ini.</p>
                            </div>
                        )}
                    </div>

                    <nav className="mt-16 flex flex-wrap justify-center gap-2">
                        {posts.meta.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`rounded-xl px-5 py-2.5 text-sm font-bold text-slate-900 transition-all dark:text-slate-400 ${
                                    link.active
                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100 dark:shadow-none'
                                        : 'border border-slate-100 bg-white text-slate-500 hover:bg-indigo-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
                                } ${!link.url ? 'cursor-not-allowed opacity-30' : ''}`}
                            />
                        ))}
                    </nav>
                </div>
            </div>
        </AppLayout>
    );
};

export default Index;
