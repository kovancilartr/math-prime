import { nedenBizSections } from "@/constans";
import React from "react";

const NedenBiz = () => {
  const sections = nedenBizSections;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 ">Neden Biz?</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat
            voluptatibus repellat assumenda deserunt ducimus. Voluptatum, vitae.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((section, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {section.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 max-w-3xl mx-auto">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi
            sequi officia nostrum culpa nesciunt incidunt error inventore
            possimus ipsum hic.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NedenBiz;
