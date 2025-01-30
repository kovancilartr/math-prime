import React from "react";
import CategoryItem from "./CategoryItem";
import { Category } from "@/types/globalTypes";

interface CategoriesProps {
  dataCategories: Category[] | undefined;
}
const Categories = ({ dataCategories }: CategoriesProps) => {
  return (
    <div className="flex items-center gap-1 flex-wrap justify-center">
      {dataCategories?.map((category: Category) => (
        <CategoryItem
          key={category.id}
          slug={category.slug}
          id={category.id}
          name={category.name}
        />
      ))}
    </div>
  );
};

export default Categories;
