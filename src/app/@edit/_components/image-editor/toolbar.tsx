import ImageDownload from "./image-download";
import ImageUpload from "./image-upload";
import ImageFit from "./image-fit";
import QueryBoxAdd from "./query-box-add";
import ImageAttach from "./image-attach";

export default function Toolbar() {
  return (
    <div className="flex flex-row rounded-md bg-accent/20">
      <ImageUpload />
      <ImageDownload />
      <ImageFit />
      <QueryBoxAdd />
      <ImageAttach />
    </div>
  );
}
