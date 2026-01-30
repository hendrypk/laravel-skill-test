import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { LucideCalendar, LucideSave } from 'lucide-react';
import { FormEventHandler } from 'react';

interface Post {
    id?: number;
    title: string;
    content: string;
    is_draft: number;
    published_at: string | null;
}

interface Props {
    post?: Post;
}

export default function PostForm({ post: existingPost }: Props) {
    const { data, setData, post, patch, processing, errors } = useForm({
        title: existingPost?.title || '',
        content: existingPost?.content || '',
        is_draft: existingPost?.is_draft ?? 0,
        published_at: existingPost?.published_at ? new Date(existingPost.published_at).toISOString().slice(0, 16) : '',
    });

    const isEditing = !!existingPost?.id;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (isEditing) {
            patch(route('posts.update', existingPost.id));
        } else {
            post(route('posts.store'));
        }
    };
    return (
        <div className="max-w-full px-6 py-8">
            <form onSubmit={submit}>
                <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <h5 className="text-3xl font-bold tracking-tight text-zinc-700 dark:text-zinc-50">
                        {isEditing ? 'Edit Post' : 'Create New Post'}
                    </h5>

                    <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <div className="flex items-center gap-2 border-r border-zinc-200 pr-4 dark:border-zinc-800">
                            <input
                                type="checkbox"
                                id="is_draft"
                                checked={data.is_draft === 1}
                                onChange={(e) => setData('is_draft', e.target.checked ? 1 : 0)}
                                className="size-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label
                                htmlFor="is_draft"
                                className="cursor-pointer text-sm font-medium whitespace-nowrap text-zinc-700 dark:text-zinc-300"
                            >
                                Save as Draft
                            </label>
                        </div>

                        <div
                            className={`flex items-center gap-2 transition-opacity ${data.is_draft === 1 ? 'pointer-events-none opacity-30' : 'opacity-100'}`}
                        >
                            <LucideCalendar className="size-4 text-zinc-400" />
                            <input
                                type="datetime-local"
                                disabled={data.is_draft === 1}
                                value={data.published_at}
                                onChange={(e) => setData('published_at', e.target.value)}
                                className="bg-transparent text-sm outline-none dark:text-zinc-300"
                            />
                        </div>

                        <Button type="submit" disabled={processing} size="sm" className="ml-2 shadow-sm shadow-indigo-500/20">
                            {processing ? 'Saving...' : 'Save'}
                            {!processing && <LucideSave className="ml-2 size-4" />}
                        </Button>
                    </div>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="space-y-6">
                        <div>
                            <label className="mb-2 block text-xs font-bold tracking-widest text-zinc-400 uppercase">Article Title</label>
                            <input
                                type="text"
                                placeholder="Enter a catchy title..."
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className={`w-full bg-transparent text-2xl font-bold outline-none placeholder:text-zinc-300 dark:text-zinc-50 ${
                                    errors.title ? 'text-red-500' : ''
                                }`}
                            />
                            <div className={`mt-2 h-px w-full bg-zinc-100 dark:bg-zinc-800 ${errors.title ? 'bg-red-500' : ''}`} />
                            {errors.title && <p className="mt-2 text-xs text-red-500">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-bold tracking-widest text-zinc-400 uppercase">Content</label>
                            <textarea
                                placeholder="Start writing your story..."
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                rows={15}
                                className={`w-full rounded-xl border-none bg-transparent py-2 text-lg transition outline-none placeholder:text-zinc-300 dark:text-zinc-300 ${
                                    errors.content ? 'ring-1 ring-red-500' : ''
                                }`}
                            ></textarea>
                            {errors.content && <p className="mt-2 text-xs text-red-500">{errors.content}</p>}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
