/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

const stripe = Stripe(
  'pk_test_51H2yx5FqwHnGCNOb3rHcMiLEOrDHaIuPg6D92OYKQGlhf1Y5jL34bsWLPQNLd4bKsGZROyfOC9LSlbNruF48Bk4600WSbKEe7I'
);

export const bookTour = async (tourID) => {
  try {
    const session = await axios(`/api/v1/bookings/checkout-session/${tourID}`);

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (error) {
    console.log(error);
    showAlert('error', error);
  }
};
