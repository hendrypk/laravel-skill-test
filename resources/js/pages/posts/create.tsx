import PostForm from '@/components/post-form';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Posts', href: route('posts.index') },
    { title: 'Create', href: '#' },
];

export default function PostsIndex() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create New Post" />
            <PostForm />
        </AppLayout>
    );
}
