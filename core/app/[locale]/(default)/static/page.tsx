'use client';

import { useState } from 'react';
import { Button } from '@/vibes/soul/primitives/button';
import { Modal } from '@/vibes/soul/primitives/modal';
import { Field, FieldGroup } from '@/vibes/soul/primitives/dynamic-form/schema';
import { DynamicFormSection } from '@/vibes/soul/sections/dynamic-form-section';
import { formAction } from './action'; // Import the form action from actions.ts

export default function CreateReview({ productId = 155 }) {
  const [isOpen, setIsOpen] = useState(false);

  const fields = [
    { type: 'number', label: 'Score (1–5):', name: 'score', required: true, min: 1, max: 5, step: 1 },
    { type: 'text', label: 'Title:', name: 'title', required: true },
    { type: 'textarea', label: 'Review:', name: 'review', required: true },
    { type: 'text', label: 'Your name:', name: 'name', required: true },
    { type: 'email', label: 'Email:', name: 'email', required: true }
  ] satisfies Array<Field | FieldGroup<Field>>;

  // Bind the productId to the form action
  const boundFormAction = async (prevState: any, formData: FormData) => {
    // Create a new FormData instance with the productId added
    const newFormData = new FormData(formData as any);
    newFormData.append('productId', productId.toString());
    
    return formAction(prevState, newFormData);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        setOpen={setIsOpen}
        title="Write a Review"
        trigger={<Button>Write a review</Button>}
      >
        <div className="min-w-[500px] w-full">
          <DynamicFormSection  
            fields={fields}
            action={boundFormAction}
            submitLabel="POST"
            title="Product Review"
            subtitle="Submit your review"
          />
        </div>
      </Modal>
    </>
  );
}