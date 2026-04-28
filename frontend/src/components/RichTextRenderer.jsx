export default function RichTextRenderer({ content }) {
  if (!content) return null;

  const renderChildren = (children = []) =>
    children.map((child, i) => {
      if (child.type === "link") {
        return (
          <a
            key={i}
            href={child.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            {renderChildren(child.children)}
          </a>
        );
      }

      if (child.type === "text") {
        let text = child.text;
        if (!text) return null;

        if (child.bold) text = <strong>{text}</strong>;
        if (child.italic) text = <em>{text}</em>;
        if (child.underline) text = <u>{text}</u>;
        if (child.strikethrough) text = <s>{text}</s>;

        return <span key={i}>{text}</span>;
      }

      return null;
    });

  return (
    <div className="prose prose-lg max-w-none mb-16">
      {content.map((block, i) => {
        
        const isEmpty =
          block.children?.every(
            (c) => !c.text || c.text.trim() === ""
          );

      
        if (isEmpty && block.type !== "image") return null;

        switch (block.type) {
        
          case "heading": {
            const level = Math.min(Math.max(block.level || 2, 1), 6);
            const Tag = `h${level}`;

            const sizes = {
              1: "text-4xl font-bold",
              2: "text-3xl font-bold",
              3: "text-2xl font-semibold",
              4: "text-xl font-semibold",
              5: "text-lg font-semibold",
              6: "text-base font-semibold",
            };

            return (
              <Tag
                key={i}
                className={`mt-8 mb-4 text-gray-900 ${sizes[level]}`}
              >
                {renderChildren(block.children)}
              </Tag>
            );
          }

         
          case "paragraph":
            return (
              <p
                key={i}
                className="text-gray-800 text-lg leading-relaxed mb-6"
              >
                {renderChildren(block.children)}
              </p>
            );

          
          case "list": {
            const isOrdered = block.format === "ordered";
            const ListTag = isOrdered ? "ol" : "ul";

            return (
              <ListTag
                key={i}
                className={`ml-6 mb-6 ${
                  isOrdered ? "list-decimal" : "list-disc"
                }`}
              >
                {block.children.map((item, j) => {
                  const isEmptyItem = item.children?.every(
                    (c) => !c.text || c.text.trim() === ""
                  );

                  if (isEmptyItem) return null;

                  return (
                    <li
                      key={j}
                      className="mb-2 text-gray-800 text-lg"
                    >
                      {renderChildren(item.children)}
                    </li>
                  );
                })}
              </ListTag>
            );
          }

       
          case "image": {
            const src = block.image?.url?.startsWith("http")
              ? block.image.url
              : `${import.meta.env.VITE_API_URL}${block.image?.url}`;

            if (!src) return null;

            return (
              <div key={i} className="my-10">
                <img
                  src={src}
                  alt={block.image?.alternativeText || "image"}
                  className="w-full rounded-lg"
                />

                {block.image?.caption && (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    {block.image.caption}
                  </p>
                )}
              </div>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}