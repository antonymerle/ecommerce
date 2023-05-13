import Stripe from "stripe";
import { client } from "./auth/[...nextauth]";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2022-11-15",
  });

  if (req.method === "POST") {
    const sig = req.headers["stripe-signature"];

    console.log({ sig });

    console.log({
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    });

    console.log("**** ENTERING WEBHOOK ****");

    let event = Stripe.Event;

    try {
      const body = await buffer(req);

      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
      console.log(`❌ Error message: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    console.log("✅ Success:", event.id);

    switch (event.type) {
      case "checkout.session.completed":
        const checkoutSessionSucceeded = event.data.object;
        // Then define and call a function to handle the event payment_intent.succeeded
        console.log("Le client a payé sa commande.");
        console.log({ event });
        // Retrieve the session. If you require line items in the response, you may include them by expanding line_items.
        const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
          event.data.object.id,
          {
            expand: ["line_items"],
          }
        );
        const lineItems = sessionWithLineItems.line_items;

        // Fulfill the purchase && decrement inventory...
        const response = await fulfillOrder(lineItems);
        return res.status(200).json(response);

        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

const buffer = (req) => {
  return new Promise((resolve, reject) => {
    const chunks = [];

    req.on("data", (chunk) => {
      chunks.push(chunk);
    });

    req.on("end", () => {
      resolve(Buffer.concat(chunks));
    });

    req.on("error", reject);
  });
};

const fulfillOrder = async (lineItems) => {
  console.log("Fulfilling order", lineItems);

  const quantityOrdered = lineItems.data[0].quantity;
  const productName = lineItems.data[0].description;

  console.log({ quantityOrdered });

  const groqQuery = `*[_type == "product" && name == $productName][0]`;

  const productInDB = await client.fetch(groqQuery, {
    productName,
  });

  console.log({ productInDB });

  await client
    .patch(productInDB._id)
    .dec({ inventory: quantityOrdered })
    .commit()
    .then((updatedProduct) => {
      console.log("New inventory has been decreased by : ", quantityOrdered);
      console.log(updatedProduct);
      return {
        result: true,
        inventory: productInDB.inventory - quantityOrdered,
      };
    });
};

export const config = {
  api: {
    bodyParser: false,
  },
};
