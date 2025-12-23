// app/blogs/page.tsx

import BlogsClient from './BlogsClient';

export const metadata = {
  title: 'Pet Care Blogs & Guides | MyFellowPet',
  description:
    'Expert-written blogs on pet care, grooming, boarding, training and veterinary tips by MyFellowPet.',
};

export default function BlogsPage() {
  return <BlogsClient />;
}
