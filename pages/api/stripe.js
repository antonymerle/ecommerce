const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log(req.body);
    // console.log(req.body.cartItems[0].image[0].asset._ref);
    // console.log(req.body.cartItems[0].name);
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
            unit_amount: item.price * 100,
            product_data: {
              name: item.name,
              images: [imgURL],
            },
          },
          quantity: item.quantity,
        };
      });

      // Create Checkout Sessions from body params.
      const params = {
        mode: "payment",
        payment_method_types: ["card"],
        billing_address_collection: "auto",
        shipping_options: [
          { shipping_rate: process.env.STRIPE_FREE_SHIPPING },
          { shipping_rate: process.env.STRIPE_FAST_SHIPPING },
        ],
        line_items,
        success_url: `${req.headers.origin}/?success=true`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
      };
      // console.log(params.line_items[0].product_data.name);

      const session = await stripe.checkout.sessions.create(params);
      console.log(session);

      res.status(200).json(session);

      // res.redirect(303, session.url);
      // console.log(session);

      // res.redirect(303, session.url);
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
