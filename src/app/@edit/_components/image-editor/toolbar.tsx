import ImageDownload from "./image-download";
import ImageUpload from "./image-upload";
import SelectorAdd from "./selector-add";
import ImageFit from "./image-fit";

export default function Toolbar() {
  return (
    <div className="flex flex-row rounded-md bg-accent/20">
      <ImageUpload />
      <ImageDownload />
      <ImageFit />
      <SelectorAdd />
    </div>
  );
}
