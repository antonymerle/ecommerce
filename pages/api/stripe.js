import { computeTTC } from "@/lib/utils";
import { client } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // console.log(req.body);

  const rawSession = await getServerSession(req, res, authOptions);
  // handling the non-serializable object throwed by getServerSideProps (sigh)
  const userSession = JSON.parse(JSON.stringify(rawSession));
  console.log("getServerSession");
  console.log({ userSession });

  const emailFromSession = userSession?.session?.user?.email ?? "";

  console.log({ emailFromSession });

  if (req.method === "POST") {
    try {
      const line_items = req.body.cartItems.map((item) => {
        const imgRef = item.image[0].asset._ref;
        const imgURL = imgRef
          .replace(
            "image-",
            `https://cdn.sanity.io/images/${process.env.SANITY_PROJECT_ID}/production/`
          )
          .replace("-webp", ".webp");
        return {
          price_data: {
            currency: "eur",
            unit_amount: Math.floor(computeTTC(item.priceHT, item.tax) * 100),
            product_data: {
              name: item.name,
              images: [imgURL],
            },
          },
          adjustable_quantity: { enabled: true, minimum: 1 },
          quantity: item.quantity,
        };
      });

      // Create Checkout Sessions from body params.
      const params = {
        mode: "payment",
        payment_method_types: ["card"],
        billing_address_collection: "auto",
        shipping_address_collection: { allowed_countries: ["FR"] },
        shipping_options: [
          { shipping_rate: process.env.STRIPE_FREE_SHIPPING },
          { shipping_rate: process.env.STRIPE_FAST_SHIPPING },
        ],
        line_items,
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
        customer_email: emailFromSession,
      };

      const session = await stripe.checkout.sessions.create(params);

      res.status(200).json(session);
    } catch (error) {
      res
        .status(error.statusCode || 500)
        .json({ statusCode: 500, message: error });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
