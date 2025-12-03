import Image from "next/image";
import Link from "next/link";
import Carousel from "@/components/Carousel";
import ProductCard from "@/components/ProductCard";
import { productCategories, companyInfo } from "@/lib/data";

export default function Home() {
  return (
    <>
      {/* Hero Carousel */}
      <Carousel />

      {/* Welcome Section */}
      <div className="container mx-auto px-4 text-center py-12">
        <h2 className="text-3xl md:text-4xl text-[#3685d2] font-bold mb-8 relative pb-6">
          Welcome to Mittal Enterprises
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-[#3685d2]"></span>
        </h2>
        <p className="mb-4 text-lg">{companyInfo.about.short}</p>
        <p className="text-lg">{companyInfo.about.distinction}</p>
      </div>

      {/* Our Products Section */}
      <div className="bg-[#f6f6f6] py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl text-[#3685d2] font-bold mb-12 text-center relative pb-6">
            Our Products
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-[#3685d2]"></span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {productCategories.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productCategories.slice(3, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-[#00c2c7] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6 relative pb-6">
                Why Choose Us
                <span className="absolute bottom-0 left-0 w-32 h-1 bg-white"></span>
              </h3>
              <p className="mb-6">
                Mittal Enterprises has distinction in manufacturing Nanofluid Interferometer, Ultrasonic Interferometers and other scientific equipments for Research and Laboratory experiments in Physics, Chemistry, Polymer Science and Material Science departments of Engineering colleges, Post Graduate colleges and Universities.
              </p>
              <Link
                href="/profile"
                className="inline-block border-2 border-white px-10 py-4 hover:bg-white hover:text-[#00c2c7] transition-colors"
              >
                Read More
              </Link>
            </div>

            <div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6 relative pb-6">
                Latest Update
                <span className="absolute bottom-0 left-0 w-32 h-1 bg-white"></span>
              </h3>
              <p className="font-bold mb-2">Our Ultrasonic Interferometer</p>
              <p className="mb-6">
                MOLECULAR INTERACTIONS IN SUBSTITUTED PYRIMIDINESACETONITRILE SOLUTIONS AT 298.15318.15 K1; A. B. Naika, M. L. Narwadeb, P. S. Bodakheb, and G. G. Muleyc a Physical Chemistry Laboratory, Department of Chemical Technology, SGB Amravati University, Amravati-444602 (M.S.) India b Vidyabharati Mahavidyalaya, Amravati-444602 (M.S.) India c Department of Physics, SGB Amravati University, Amravati-444602 (M.S.) ISSN 0036-0244, Russian Journal of Physical
              </p>
              <a
                href="/media_upload/files/file/LIST-OF-LATEST-PAPERS.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border-2 border-white px-10 py-4 hover:bg-white hover:text-[#00c2c7] transition-colors"
              >
                Read More
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Banner */}
      <div className="bg-[#6bbf39] py-8">
        <div className="container mx-auto px-4">
          <Link href="/profile">
            <Image
              src="/images/bottom-banner.jpg"
              alt="Bottom Banner"
              width={1200}
              height={200}
              className="w-full h-auto"
            />
          </Link>
        </div>
      </div>
    </>
  );
}
