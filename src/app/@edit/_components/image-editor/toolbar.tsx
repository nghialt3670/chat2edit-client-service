import ImageDownload from "./image-download";
import ImageUpload from "./image-upload";

export default function Toolbar() {
  return (
    <div className="flex flex-row rounded-md bg-accent/20">
      <ImageUpload />
      <ImageDownload />
    </div>
  );
}
