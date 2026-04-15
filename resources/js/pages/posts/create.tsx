import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';

const CreatePost = () => {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        is_draft: true,
        published_at: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mengirim data ke route posts.store
        post(route('posts.store'));
    };

    return (
        <AppLayout>
            <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
                <Head title="Create New Post" />

                <div className="mb-8 md:flex md:items-center md:justify-between">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-2xl leading-7 font-bold text-gray-900 sm:truncate sm:text-3xl">Create New Post</h2>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6 rounded-lg bg-white p-6 shadow">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={data.title}
                            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm ${
                                errors.title ? 'border-red-300' : 'border-gray-300'
                            }`}
                            onChange={(e) => setData('title', e.target.value)}
                        />
                        {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
                    </div>

                    {/* Content */}
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                            Content
                        </label>
                        <textarea
                            id="content"
                            rows={6}
                            value={data.content}
                            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm ${
                                errors.content ? 'border-red-300' : 'border-gray-300'
                            }`}
                            onChange={(e) => setData('content', e.target.value)}
                        />
                        {errors.content && <p className="mt-2 text-sm text-red-600">{errors.content}</p>}
                    </div>

                    {/* Status Selection */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <input
                                id="is_draft"
                                type="checkbox"
                                checked={data.is_draft}
                                onChange={(e) => setData('is_draft', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="is_draft" className="ml-2 block text-sm text-gray-900">
                                Save as Draft
                            </label>
                        </div>
                    </div>

                    {/* Published At (Optional) */}
                    <div>
                        <label htmlFor="published_at" className="block text-sm font-medium text-gray-700">
                            Publish Schedule (YYYY-MM-DD HH:MM:SS)
                        </label>
                        <input
                            type="text"
                            id="published_at"
                            placeholder="e.g. 2026-04-15 10:00:00"
                            value={data.published_at}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                            onChange={(e) => setData('published_at', e.target.value)}
                        />
                        <p className="mt-1 text-xs text-gray-500 italic">Leave empty to publish immediately if not a draft.</p>
                        {errors.published_at && <p className="mt-2 text-sm text-red-600">{errors.published_at}</p>}
                    </div>

                    <div className="flex justify-end border-t border-gray-200 pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Save Post'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
};

export default CreatePost;
