import dotenv from "dotenv";
dotenv.config();

const STRIPE_SECRET_KEY = process.env.stripe_secret_key;
const STRIPE_BASE_URL = process.env.stripe_base_url;

/**
 * @param {*} productName
 * @returns {Promise} product
 * */
async function createProduct(productName) {
  try {
    const response = await fetch(`${STRIPE_BASE_URL}/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `name=${productName}`,
    });

    const product = await response.json();
    return product;
  } catch (err) {
    console.log("Error at create product", err);
  }
}

/**
 * @param {*} productId
 * @param {*} amount
 * @param {*} currency
 * @returns {Promise} price
 * */
async function addPriceToProduct(productId, amount, currency) {
  try {
    const response = await fetch(`${STRIPE_BASE_URL}/prices`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `unit_amount=${amount}&currency=${currency}&product=${productId}`,
    });

    const price = await response.json();
    return price;
  } catch (err) {
    console.log("Error at add price to product", err);
  }
}

/**
 * @param {*} priceId
 * @returns {Promise} paymentLink
 * */
async function createPaymentLink(priceId) {
  try {
    const response = await fetch(`${STRIPE_BASE_URL}/checkout/sessions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `mode=payment&payment_method_types[0]=card&success_url=http://www.your-website.com/success&cancel_url=http://www.your-website.com/cancel&line_items[0][price]=${priceId}&line_items[0][quantity]=1`,
    });

    const paymentLink = await response.json();
    return paymentLink;
  } catch (err) {
    console.log("Error at createPaymentLink", err);
  }
}

(async () => {
  try {
    const product = await createProduct("TESTING");
    console.error("product created", product);

    const price = await addPriceToProduct(product.id, 1000, "USD");
    console.error("price added to product", price);

    const paymentLink = await createPaymentLink(price.id);
    console.error("payment link:", paymentLink);
  } catch (error) {
    console.error("Exception Errors", error);
  }
})();
