import PostShow from '@/components/post-show';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Props {
    id: number;
}

export default function PostDetail({ id }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Posts', href: '/posts' },
        { title: 'Detail', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <PostShow id={id} />
        </AppLayout>
    );
}
