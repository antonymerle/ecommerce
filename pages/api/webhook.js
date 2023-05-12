// https://github.com/stripe/stripe-node/blob/master/examples/webhook-signing/nextjs/pages/api/webhooks.ts
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import Stripe from "stripe";
import { client } from "./auth/[...nextauth]";

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

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
  // TODO: fill me in
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
    .dec({ inventory: quantityOrdered }) // Decrement `inStock` by 1
    .commit()
    .then((updatedProduct) => {
      console.log("New inventory has been decreased by : ", quantityOrdered);
      console.log(updatedProduct);
      return {
        result: true,
        inventory: productInDB.inventory - quantityOrdered,
      };
    });
  // TODO
  // envoyer les infos par mail au vendeur ?
  // sauvegarder en BDD ?
};

export default async function handler(req, res) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2022-11-15",
  });

  if (req.method === "POST") {
    const sig = req.headers["stripe-signature"];

    console.log({ sig });

    // SECURE

    console.log({
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    });

    console.log("**** ENTERING WEBHOOK ****");

    let event = Stripe.Event;

    // const payload = await getRawBody(req);
    // console.log(payload);

    try {
      const body = await buffer(req);

      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
      console.log(`❌ Error message: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    console.log("✅ Success:", event.id);

    // Handle the event
    // Cast event data to Stripe object
    // if (event.type === "checkout.session.completed") {
    //   const stripeObject = event.data.object;
    //   console.log(`💰 PaymentIntent status: ${stripeObject.status}`);
    // } else if (event.type === "charge.succeeded") {
    //   const charge = event.data.object;
    //   console.log(`💵 Charge id: ${charge.id}`);
    // } else {
    //   console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
    // }
    // res.json({ received: true });

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

        // Fulfill the purchase...
        const response = await fulfillOrder(lineItems);
        return res.status(200).json(response);
        // TODO Traiter la commande
        /*
https://stripe.com/docs/payments/checkout/fulfill-orders#g%C3%A9rer-l%E2%80%99%C3%A9v%C3%A9nement
 vous pouvez gérer l’événement checkout.session.completed. 
 Celui-ci comprend l’objet de la session Checkout, 
 qui contient les informations concernant votre client et son paiement.
Lorsque vous gérez cet événement, il est également conseillé de :
  - sauvegarder une copie de la commande dans votre propre base de données ;
  - envoyer un reçu par e-mail au client ;
  - rapprocher les postes et les quantités achetées par le client si vous utilisez line_item.adjustable_quantity. 
    */
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

export const config = {
  api: {
    bodyParser: false,
  },
};
