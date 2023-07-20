import Image, { ImageProps } from "next/image";
import { ImgHTMLAttributes, useState } from "react";

import Spinner from "./Spinner";

export default function LazyImage(props: ImgHTMLAttributes<HTMLImageElement>) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="h-full w-full flex items-center">
      <img
        {...props}
        style={{ display: !isLoaded ? "none" : "block" }}
        onLoad={() => setIsLoaded(true)}
      />
      {!isLoaded && <Spinner />}
    </div>
  );
}
