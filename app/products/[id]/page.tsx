import Modal from "@/components/Modal";
import PriceInfoCard from "@/components/PriceInfoCard";
import ProductCard from "@/components/ProductCard";
import { getProductById, getSimilarProducts } from "@/lib/actions";
import { formatNumber } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  params: { id: string };
};

type Product = {
  id: string;
  image: string;
  title: string;
  url: string;
  currency: string;
  currentPrice: number;
  originalPrice: number;
  averagePrice: number;
  highestPrice: number;
  lowestPrice: number;
  reviewsCount: number;
  stars?: number;
  description?: string;
};

const ProductDetails = async ({ params: { id } }: Props) => {
  const product: Product | null = await getProductById(id);

  if (!product) {
    // Redirect in Next.js should be handled differently. This is just a placeholder.
    return <div>Product not found. Redirecting...</div>;
  }

  const similarProducts = await getSimilarProducts(id);

  return (
    <div className="product-container p-6 max-w-6xl mx-auto">
      <div className="flex gap-8 xl:flex-row flex-col">
        {/* Product Image */}
        <div className="product-image w-full xl:w-1/2">
          <Image
            src={product.image}
            alt={product.title}
            width={580}
            height={400}
            className="mx-auto rounded-lg object-contain"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start gap-5 pb-6">
            <div className="flex flex-col gap-3">
              <p className="text-3xl text-secondary font-semibold">{product.title}</p>
              <Link href={product.url} target="_blank" className="text-base text-blue-600 hover:underline">
                Visit Product
              </Link>
            </div>

            {/* Product Reviews, Bookmark, and Share */}
          </div>

          {/* Product Pricing */}
          <div className="product-info mb-6">
            <div className="flex flex-col gap-2">
              <p className="text-4xl text-secondary font-bold">
                {product.currency}{formatNumber(product.currentPrice)}
              </p>
              <p className="text-xl text-gray-500 line-through">
                {product.currency}{formatNumber(product.originalPrice)}
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Image src="/assets/icons/red-heart.svg" alt="heart" width={20} height={20} />
                  <p className="text-base font-semibold text-[#D46F77]">{product.reviewsCount}</p>
                </div>
                <div className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                  <Image src="/assets/icons/bookmark.svg" alt="bookmark" width={20} height={20} />
                </div>
                <div className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                  <Image src="/assets/icons/share.svg" alt="share" width={20} height={20} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Image src="/assets/icons/star.svg" alt="star" width={16} height={16} />
                <p className="text-sm text-primary-orange font-semibold">{product.stars || "25"}</p>
              </div>
              <div className="flex items-center gap-2">
                <Image src="/assets/icons/comment.svg" alt="comment" width={16} height={16} />
                <p className="text-sm text-secondary font-semibold">{product.reviewsCount} Reviews</p>
              </div>
              <p className="text-sm text-black opacity-50">
                <span className="text-primary-green font-semibold">93%</span> of buyers have recommended this.
              </p>
            </div>
          </div>

          <div className="my-7 flex flex-col gap-5">
            <div className="flex gap-5 flex-wrap">
              <PriceInfoCard
                title="Current Price"
                iconSrc="/assets/icons/price-tag.svg"
                value={`${product.currency}${product.currentPrice}`}
              />
              <PriceInfoCard
                title="Average Price"
                iconSrc="/assets/icons/chart.svg"
                value={`${product.currency}${product.averagePrice}`}
              />
              <PriceInfoCard
                title="Highest Price"
                iconSrc="/assets/icons/arrow-up.svg"
                value={`${product.currency}${product.highestPrice}`}
              />
              <PriceInfoCard
                title="Lowest Price"
                iconSrc="/assets/icons/arrow-down.svg"
                value={`${product.currency}${product.lowestPrice}`}
              />
            </div>
          </div>

          <Modal productId={id} />
        </div>
      </div>

      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-5">
          <h3 className="text-2xl text-secondary font-semibold">Product Description</h3>
          <div className="flex flex-col gap-4">
            {product.description?.split("\n").map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>
        <button className="btn w-fit mx-auto flex items-center justify-center gap-3 min-w-[200px]">
          <Image src="/assets/icons/bag.svg" alt="check" width={22} height={22} />
          <Link href="" className="text-base text-white">Buy Now</Link>
        </button>
      </div>

      {similarProducts && similarProducts?.length > 0 && (
        <div className="py-14 flex flex-col gap2 w-full">
            <p className="section-text">Similar Products</p>
            <div className="flex flex-wrap gap-10 mt-7 w-full">
                {similarProducts.map((product)=>(
                    <ProductCard key={product._id} product={product} />
                ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
