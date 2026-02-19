import { Button } from '@/components/ui/button';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { LucideArrowLeft, LucideLoader2, LucidePencil, LucideTrash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Post {
    id: number;
    title: string;
    content: string;
    published_at: string | null;
    user_id: number;
    author?: {
        id: number;
        name: string;
    };
}

interface SharedProps {
    auth: {
        user: {
            id: number;
            name: string;
        } | null;
    };
    [key: string]: unknown;
}

interface Props {
    id: number;
}

export default function PostShow({ id }: Props) {
    const { auth } = usePage<SharedProps>().props;
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/posts/${id}`);
                if (!response.ok) throw new Error('Post not found');
                const data = await response.json();
                setPost(data);
            } catch (error) {
                console.error('Gagal mengambil data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <LucideLoader2 className="animate-spin text-zinc-500" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="p-10 text-center">
                <p className="text-zinc-500">Postingan tidak ditemukan atau sudah dihapus.</p>
                <Link href="/posts" className="mt-4 inline-block text-sm text-indigo-600">
                    Kembali ke Daftar
                </Link>
            </div>
        );
    }

    const handleDelete = () => {
        if (confirm('Yakin ingin menghapus post ini?')) {
            router.delete(route('posts.destroy', id));
        }
    };

    return (
        <div className="bg-white py-10 dark:bg-zinc-950">
            <Head title={post.title} />
            <div className="mx-auto max-w-2xl px-6">
                <Link href="/posts" className="mb-10 inline-flex items-center text-sm text-zinc-500 hover:text-zinc-900">
                    <LucideArrowLeft className="me-2 size-3.5" /> Back
                </Link>

                <article>
                    <header className="mb-8">
                        <h1 className="mb-4 text-3xl font-bold tracking-tight text-zinc-900 capitalize dark:text-zinc-50">{post.title}</h1>
                        <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
                            <div className="text-zinc-500">
                                By <span className="font-medium text-zinc-900 dark:text-zinc-100">{post.author?.name}</span>
                                <span className="mx-2 text-zinc-300">•</span>
                                {post.published_at ? new Date(post.published_at).toLocaleDateString('id-ID', { dateStyle: 'medium' }) : 'Draf'}
                            </div>

                            {auth.user?.id === post.author?.id && (
                                <div className="flex items-center gap-4">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={route('posts.edit', post.id)}>
                                            <LucidePencil className="mr-2 size-3.5" /> Edit
                                        </Link>
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={handleDelete}>
                                        <LucideTrash2 className="mr-2 size-3.5" /> Delete
                                    </Button>
                                </div>
                            )}
                        </div>
                    </header>

                    <div className="prose prose-zinc dark:prose-invert max-w-none border-t border-zinc-100 pt-8 dark:border-zinc-800">
                        <div className="text-lg leading-relaxed whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">{post.content}</div>
                    </div>
                </article>
            </div>
        </div>
    );
}
