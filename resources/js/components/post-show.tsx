import { Button } from '@/components/ui/button';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { LucideArrowLeft, LucidePencil, LucideTrash2 } from 'lucide-react';

export default function PostShow({ post }: Props) {
    const { auth } = usePage().props;

    const handleDelete = () => {
        if (confirm('Yakin ingin menghapus post ini?')) {
            router.delete(route('posts.destroy', post.id));
        }
    };

    return (
        <div className="min-h-screen bg-white py-10 dark:bg-zinc-950">
            <Head title={post.title} />

            <div className="mx-auto max-w-2xl px-6">
                <Link
                    href="/posts"
                    className="mb-10 inline-flex items-center text-sm text-zinc-500 transition hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                    <LucideArrowLeft className="me-2 size-3.5"></LucideArrowLeft>
                    Back
                </Link>

                <article>
                    <header className="mb-8">
                        <h1 className="mb-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{post.title}</h1>

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
                                            <LucidePencil className="size-3.5" />
                                            Edit
                                        </Link>
                                    </Button>

                                    <Button variant="destructive" size="sm" onClick={handleDelete}>
                                        <LucideTrash2 className="size-3.5" />
                                        Delete
                                    </Button>
                                </div>
                            )}
                        </div>
                    </header>

                    <div className="prose prose-zinc dark:prose-invert max-w-none border-t border-zinc-100 pt-8 dark:border-zinc-800">
                        <p className="text-lg leading-relaxed whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">{post.content}</p>
                    </div>
                </article>
            </div>
        </div>
    );
}
