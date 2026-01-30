import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function PostForm() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        is_draft: 0,
        published_at: '',
        created_at: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('posts.store'));
    };

    return (
        <div className="p-4">
            <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow dark:bg-zinc-900">
                <h2 className="mb-4 text-xl font-bold text-zinc-800 dark:text-zinc-200">Buat Post Baru</h2>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium">Judul</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className={`w-full rounded-md border p-2 dark:bg-zinc-800 ${errors.title ? 'border-red-500' : 'border-zinc-300'}`}
                        />
                        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Konten</label>
                        <textarea
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            rows={5}
                            className={`w-full rounded-md border p-2 dark:bg-zinc-800 ${errors.content ? 'border-red-500' : 'border-zinc-300'}`}
                        ></textarea>
                        {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content}</p>}
                    </div>
                    <div className="flex flex-col gap-4 rounded-lg border bg-zinc-50 p-4 dark:bg-zinc-800/50">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_draft"
                                checked={data.is_draft === 1}
                                onChange={(e) => setData('is_draft', e.target.checked ? 1 : 0)}
                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                            />
                            <label htmlFor="is_draft" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Simpan sebagai Draft (Tidak akan tayang meskipun tanggal terlewati)
                            </label>
                        </div>

                        <div className={data.is_draft ? 'opacity-50' : ''}>
                            <label className="mb-1 block text-sm font-medium">
                                Jadwal Publikasi
                                <span className="ml-2 text-xs font-normal text-zinc-500">(Kosongkan untuk langsung publish sekarang)</span>
                            </label>
                            <input
                                type="datetime-local"
                                disabled={data.is_draft === 1}
                                value={data.published_at}
                                onChange={(e) => setData('published_at', e.target.value)}
                                className="w-full rounded border p-2 dark:bg-zinc-800"
                                placeholder="Publish sekarang..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
