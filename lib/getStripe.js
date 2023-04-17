import { loadStripe } from "@stripe/stripe-js";

let stripePromise;

const getStripe = async () => {
  const key = `${process.env.PUBLISHABLE_KEY}`;
  if (!stripePromise) stripePromise = loadStripe(key);

  return stripePromise;
};

export default getStripe;
