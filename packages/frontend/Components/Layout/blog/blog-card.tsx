import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import sanitizeHtml from "sanitize-html";
import { BlogProps } from "../../../lib/types/interfaces";
import { getRelativeDate } from "../../../lib/utils/getRelativeDate";


export default function BlogCard(props: BlogProps) {
  const { title, description, imageUri, createdAt } = props;
  const [pageLoaded, setPageLoaded] = useState<Boolean>(false);
  useEffect(() => {
    setPageLoaded(true);
  }, []);
  return (

    <Link href={`/blog/${title}`}>
      <article className="flex flex-col gap-2 h-[500px] w-[450px] rounded-md p-4">
        <figure className="w-full aspect-video">
          <Image src={imageUri} alt={title} width={800} height={550} />
        </figure>
        <div>
          <p className="font-extralight text-s italic">
            {getRelativeDate(new Date(createdAt))}
          </p>
          <span className="flex flex-col gap-2">
            <h2 className="font-black text-2xl">{title}</h2>
            {!!pageLoaded && (
              <div
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
                suppressHydrationWarning={true}
              />
            )}
          </span>
        </div>
      </article>
    </Link>
  );
}
