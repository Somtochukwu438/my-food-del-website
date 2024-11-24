
// Placing User Order for Frontend using stripe

// Promo code definitions (moved from promo controller)

// Configuration


import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

// Configuration
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const CURRENCY = "usd";
const DELIVERY_CHARGE = 5;
const FRONTEND_URL = 'http://localhost:5173';

// Promo code definitions
const PROMO_CODES = {
  'SAVE10': 0.10, // 10% discount
  'SAVE20': 0.20, // 20% discount
  'WELCOME': 0.15  // 15% discount
};

const placeOrder = async (req, res) => {
  try {
    const { userId, items, address, promoCode } = req.body;

    // Validate required fields
    if (!userId || !items || !items.length || !address) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Calculate subtotal
    const subtotal = items.reduce((sum, item) => {
      if (!item.price || !item.quantity) {
        throw new Error("Invalid item data");
      }
      return sum + (item.price * item.quantity);
    }, 0);

    // Apply promo code discount
    let discountAmount = 0;
    let discountPercentage = 0;
    if (promoCode && PROMO_CODES[promoCode]) {
      discountPercentage = PROMO_CODES[promoCode];
      discountAmount = subtotal * discountPercentage;
    }

    // Calculate final totals
    const discountedSubtotal = subtotal - discountAmount;
    const finalTotal = discountedSubtotal + DELIVERY_CHARGE;

    // Create new order in database
    const newOrder = new orderModel({
      userId,
      items,
      amount: finalTotal,
      address,
      promoCode: promoCode || null,
      promoDiscount: discountAmount,
      status: 'Food Processing'
    });
    await newOrder.save();

    // Clear user's cart
    await userModel.findByIdAndUpdate(userId, {
      cartData: {},
      $push: { orderHistory: newOrder._id }
    });
    const discount = PROMO_CODES[promoCode];
    console.log(PROMO_CODES[promoCode]);

    // Create Stripe line items
    const line_items = items.map((item) => {
      const unitPrice = item.price * item.quantity;
      const discountedPrice = discount;
      return {
        price_data: {
          currency: CURRENCY,
          product_data: {
            name: item.name,
            description: discountPercentage > 0
              ? `Original price: $${unitPrice.toFixed(2)} (${discountPercentage * 100}% off)`
              : undefined
          },
          unit_amount: Math.round(discountedPrice * 100), // Convert to cents
        },
        quantity: item.quantity,
      };
    });

    // Add delivery charge as separate line item
    line_items.push({
      price_data: {
        currency: CURRENCY,
        product_data: {
          name: "Delivery Charge",
          description: "Standard delivery fee"
        },
        unit_amount: DELIVERY_CHARGE * 100, // Convert to cents
      },
      quantity: 1,
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${FRONTEND_URL}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url: `${FRONTEND_URL}/verify?success=false&orderId=${newOrder._id}`,
        line_items,
        mode: 'payment',
        metadata: {
          orderId: newOrder._id.toString(),
          userId: userId.toString(),
          promoCode: promoCode || 'N/A', // Include promo code
          discountAmount: discountAmount.toFixed(2), // Add discount details
        },
      });
      

    res.json({
      success: true,
      session_url: session.url
    });

  } catch (error) {
    console.error("Error in placeOrder:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error placing order"
    });
  }
};
// Placing User Order for Frontend using stripe
const placeOrderCod = async (req, res) => {

    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            payment: true,
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        res.json({ success: true, message: "Order Placed" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// Listing Order for Admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// User Orders for Frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

const updateStatus = async (req, res) => {
    console.log(req.body);
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" })
    } catch (error) {
        res.json({ success: false, message: "Error" })
    }

}

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Paid" })
        }
        else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({ success: false, message: "Not Paid" })
        }
    } catch (error) {
        res.json({ success: false, message: "Not  Verified" })
    }

}

export { placeOrder, listOrders, userOrders, updateStatus, verifyOrder, placeOrderCod }