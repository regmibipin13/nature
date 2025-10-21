import { saveCategory } from "../action";
import { CategoryForm } from "../form";

export default function CreateCategoryPage() {
  return <CategoryForm onSubmit={saveCategory} />;
}
