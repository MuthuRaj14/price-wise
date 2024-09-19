'use server'
import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDB } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { generateEmailBody, sendEmail } from "../nodemailer";
type User = {
  email: string;
};
export async function scrapeAndStoreProduct(productUrl: string) {
  if (!productUrl) return;

  try {
    // Connect to the database
    await connectToDB();

    // Scrape product details
    const scrapedProduct = await scrapeAmazonProduct(productUrl);
    if (!scrapedProduct) return;

    let product = scrapedProduct;

    // Check if the product already exists
    const existingProduct = await Product.findOne({ url: scrapedProduct.url });

    if (existingProduct) {
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice },
      ];

      // Update product details with the updated price history and calculated values
      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      };
    }

    // Update or create the product in the database
    const newProduct = await Product.findOneAndUpdate(
      { url: scrapedProduct.url },
      product,
      { upsert: true, new: true }
    );

    // Revalidate the product page
    revalidatePath(`/products/${newProduct._id}`);
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`);
  }
}

export async function getProductById(productId: string) {
  try {
    connectToDB();
    const product = await Product.findOne({ _id: productId });
    if (!product) return null;
    return product;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllproducts() {
  try {
    connectToDB();
    const products = await Product.find();
    return products;
  } catch (error) {
    console.log(error);
  }
}

export async function getSimilarProducts(productId:string) {
  try {
    connectToDB();
    const currentProduct = await Product.findById(productId);

    if(!currentProduct) return null;

    const similarProducts = await Product.find({
      _id : {$ne : productId},
    }).limit(3)

    return similarProducts;
  } catch (error) {
    console.log(error);
  }
}

export async function addUserEmailToProduct(productId:string, userEmail:string) {

  try {
    const product = await Product.findById(productId);
    if(!product) return;

    const userExists = product.users.some((user:User) => user.email === userEmail);
    if(!userExists){
      product.users.push({email:userEmail});

      await product.save()
      const emailContent = await generateEmailBody(product,"WELCOME");
      await sendEmail(emailContent,[userEmail])
    }


  } catch (error) {
    console.log(error);
    
  }
  
}