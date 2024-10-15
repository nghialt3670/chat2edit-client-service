import ImageDownload from "./image-download";
import QueryBoxAdd from "./query-box-add";
import ImageUpload from "./image-upload";
import ImageAttach from "./image-attach";
import ImageFit from "./image-fit";

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
