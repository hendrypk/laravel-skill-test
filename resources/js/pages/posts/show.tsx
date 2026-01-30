import PostShow from '@/components/post-show';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

interface Post {
    id: number;
    title: string;
    content: string;
    published_at: string | null;
    is_draft: number;
    author?: {
        id: number;
        name: string;
    };
}

interface Props {
    post: Post;
}

export default function PostDetail({ post }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Posts', href: '/posts' },
        { title: 'Detail', href: '#' },
    ];

    if (!post) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="p-8 text-center">Data post tidak ditemukan.</div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={post.title} />
            <PostShow post={post} />
        </AppLayout>
    );
}
