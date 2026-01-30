import PostForm from '@/components/post-form';
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

export default function PostsEdit({ post }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Posts', href: route('posts.index') },
        { title: 'Detail', href: route('posts.show', post.id) },
        { title: 'Edit', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit: ${post.title}`} />
            <PostForm post={post} />
        </AppLayout>
    );
}
