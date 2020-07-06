/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51Gz3IlLvhL2UfZ6F4wpojxKngTr0k6oXzAGOyrAU9LWTHmmSz4FFxiszKAiJBwQQdf5quNS57aditl7iL4iY3OgZ00gupMqLP9'
);

export const bookTour = async (tourId) => {
  // 1. Get checkout sessin from API
  try {
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`
    );
    // 2. Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.Message);
  }
};
