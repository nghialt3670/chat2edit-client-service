import ImageUpload from "./image-upload";
import ImageDownload from "./image-download";

export default function Toolbar() {
  return (
    <div className="flex flex-row rounded-md border">
      <ImageUpload />
      <ImageDownload />
    </div>
  );
}