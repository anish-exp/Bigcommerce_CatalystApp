'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import CreateReview from './create-product-review';


interface ReviewsWithFormProps {
  productId: number;
}

export default function ReviewsWithForm({ productId }: ReviewsWithFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Refreshes the current page after review submission to show the new review
  const handleReviewSuccess = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-semibold">Customer Reviews</h2>
      <CreateReview 
        productId={productId} 
        onSuccess={handleReviewSuccess} 
      />
    </div>
  );
}