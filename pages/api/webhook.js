const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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

const fulfillOrder = (lineItems) => {
  // TODO: fill me in
  console.log("Fulfilling order", lineItems);

  // TODO
  // envoyer les infos par mail au vendeur ?
  // sauvegarder en BDD ?
};

export default async function handler(req, res) {
  //   const payload = req.body;

  //   console.log("Got payload: " + payload);

  //   res.status(200).end();
  // }

  // SECURE

  const sig = req.headers["stripe-signature"];

  let event;

  // const payload = await getRawBody(req);
  // console.log(payload);

  try {
    const body = await buffer(req);

    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const paymentIntentSucceeded = event.data.object;
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
      fulfillOrder(lineItems);
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
  res.status(200).json({ paiement: true });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
