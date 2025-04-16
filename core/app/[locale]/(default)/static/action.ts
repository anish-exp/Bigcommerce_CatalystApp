'use server';

import { client } from '~/client';
import { graphql, VariablesOf } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';
import { parseWithZod } from '@conform-to/zod';
import { schema, Field, FieldGroup } from '@/vibes/soul/primitives/dynamic-form/schema';

const CreateProductReviewMutation = graphql(`
  mutation CreateProductReviewMutation(
    $productId: Long!,
    $title: String!,
    $text: String!,
    $rating: Int!,
    $name: String!,
    $email: String!
  ) {
    catalog {
      addProductReview(
        input: {
          productEntityId: $productId,
          review: {
            title: $title,
            text: $text,
            rating: $rating,
            author: $name,
            email: $email
          }
        }
      ) {
        errors {
          ... on NotAuthorizedToAddProductReviewError {
            message
          }
          ... on CustomerAlreadyReviewedProductError {
            message
          }
          ... on ProductIdNotFoundError {
            message
          }
          ... on InvalidInputFieldsError {
            message
            fields
          }
          ... on Error {
            message
          }
        }
      }
    }
  }
`);

type ReviewVariables = VariablesOf<typeof CreateProductReviewMutation>;

export async function submitProductReview({
  productId,
  title,
  text,
  rating,
  name,
  email,
}: {
  productId: number;
  title: string;
  text: string;
  rating: number;
  name: string;
  email: string;
}) {
  try {
    const variables: ReviewVariables = {
      productId,
      title,
      text,
      rating,
      name,
      email,
    };

    const response = await client.fetch({
      document: CreateProductReviewMutation,
      variables,
      fetchOptions: { next: { revalidate } },
    });

    const errors = response.data?.catalog?.addProductReview?.errors || [];
    
    if (errors.length > 0) {
      return {
        success: false,
        errors: errors.map((err: any) => err.message || 'An error occurred.'),
      };
    }

    return {
      success: true,
      errors: [],
    };
  } catch (error: any) {
    console.error('Error submitting product review:', error);
    return {
      success: false,
      errors: [error.message || 'Failed to submit review. Please try again.'],
    };
  }
}

// Form action to be imported by the client component
export async function formAction(
  prevState: { fields: Array<Field | FieldGroup<Field>>; lastResult: any },
  formData: FormData
) {
  const fields = prevState.fields;
  
  const submission = parseWithZod(formData, { schema: schema(fields) });

  if (submission.status !== 'success') {
    return {
      fields,
      lastResult: submission.reply({ formErrors: ['Please fill out all required fields correctly.'] }),
    };
  }

  const { score, title, review, name, email } = submission.value;
  const productId = parseInt(formData.get('productId') as string, 10);

  try {
    const result = await submitProductReview({
      productId,
      title,
      text: review,
      rating: score,
      name,
      email,
    });

    if (result.errors && result.errors.length > 0) {
      return {
        fields,
        lastResult: submission.reply({ formErrors: result.errors }),
      };
    }

    return {
      fields,
      lastResult: submission.reply({ resetForm: true }),
    };
  } catch (error: any) {
    return {
      fields,
      lastResult: submission.reply({ formErrors: [error.message || 'Unexpected error.'] }),
    };
  }
}