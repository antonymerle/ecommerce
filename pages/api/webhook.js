import Stripe from "stripe";
import { client } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { getToken } from "next-auth/jwt";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
  // 1. retrieve email from user session to record the order later
  // The email is passed to fulfillOrder()

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
        const emailFromCheckoutSession = event.data.object.customer_email ?? "";

        console.log({ emailFromCheckoutSession });
        // TODO : stocker cet event en DB. les donnes sont dans event.data.

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
        const response = await fulfillOrder(
          emailFromCheckoutSession,
          lineItems
        );
        console.log({ fulfillOrder: response });
        // return res.status(200).json(response);

        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json({ checkoutSessionCompleted: true });
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

const fulfillOrder = async (emailFromSession, lineItems) => {
  // 1. record order in database if user is logged

  if (emailFromSession) {
    const newOrder = lineItems.data;
    await updateUserWithNewOrders(emailFromSession, newOrder);
  } else {
    // TODO : record anyway in another table ???
    console.log("No email from user session, skipping order recording in DB");
  }

  // 2. decrement inventory
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

// Function to update the user document with new orders
const updateUserWithNewOrders = async (userEmail, newOrder) => {
  try {
    // Fetch the existing user document
    const existingUser = await client.fetch(
      `*[_type == "user" && email == $userEmail][0]`,
      { userEmail }
    );

    const filteredNewOrders = newOrder.map((order) => {
      return {
        id: order.id,
        object: order.object,
        amount_discount: order.amount_discount,
        amount_subtotal: order.amount_subtotal,
        amount_tax: order.amount_tax,
        amount_total: order.amount_total,
        currency: order.currency,
        description: order.description,
        // price: newOrder.price,
        quantity: order.quantity,
      };
    });

    // Append the new orders to the existing orders array
    let updatedOrders = [];
    if (existingUser.orders?.length > 0) {
      updatedOrders = [...existingUser.orders, ...filteredNewOrders];
    } else {
      updatedOrders = [...filteredNewOrders];
    }

    console.log({ updatedOrders });

    // Update the user document with the new orders
    await client
      .patch(existingUser._id)
      .setIfMissing({ orders: [] })
      .set({ orders: updatedOrders })
      .commit({ autoGenerateArrayKeys: true });

    console.log("User document updated with new orders successfully");
  } catch (error) {
    console.error("Error updating user document:", error);
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};
