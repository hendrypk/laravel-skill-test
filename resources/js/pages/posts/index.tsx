import DashboardPosts from '@/components/dashboard-posts';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Posts', href: '#' }];

export default function PostsIndex() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts" />
            <DashboardPosts />
        </AppLayout>
    );
}
