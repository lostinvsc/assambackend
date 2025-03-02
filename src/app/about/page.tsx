import React from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "../Components/Header";

const AboutPage: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navigation Bar */}
      <Header/>
      
      {/* About Section */}
      <section className="max-w-6xl mx-auto bg-white mt-6 shadow-md rounded-lg overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Image */}
          <div>
            <Image
              src="/assam.jpg"
              alt="Teamwork"
              width={600}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text Content */}
          <div className="bg-teal-800 text-white flex flex-col justify-center p-6">
            <h2 className="text-2xl font-bold">About Us</h2>
            <p className="mt-2 text-gray-300">
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut"
            </p>
            <button className="mt-4 bg-white text-teal-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-200">
              Read More
            </button>
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="max-w-6xl mx-auto mt-4 p-6 bg-white shadow-md rounded-lg">
        <p className="text-gray-600">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
        </p>
      </section>
    </div>
  );
};

export default AboutPage;
