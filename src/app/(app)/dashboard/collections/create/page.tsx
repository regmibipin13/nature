import { saveCollection } from "../action";
import { CollectionForm } from "../form";

export default function CreateCollectionPage() {
  return <CollectionForm onSubmit={saveCollection} />;
}
