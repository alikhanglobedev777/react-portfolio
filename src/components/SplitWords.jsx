import { Fragment } from "react";

/**
 * Splits text into masked words for reveal animations.
 * Words wrapped in *asterisks* are rendered in the italic serif accent.
 * Screen readers get the plain sentence once.
 */
export default function SplitWords({ text, as = "span", className = "", reveal = "words", ...rest }) {
  const Tag = as;
  const plain = text.replace(/\*/g, "");
  const tokens = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  let index = 0;

  return (
    <Tag className={`split ${className}`} data-reveal={reveal} {...rest}>
      <span className="sr-only">{plain}</span>
      <span aria-hidden="true">
        {tokens.map((token, tokenIndex) => {
          const isAccent = token.startsWith("*") && token.endsWith("*");
          const words = (isAccent ? token.slice(1, -1) : token).split(/\s+/).filter(Boolean);
          const leadingSpace = /^\s/.test(token) && tokenIndex > 0;
          return (
            <Fragment key={tokenIndex}>
              {leadingSpace && " "}
              {words.map((word, wordIndex) => {
                const current = index++;
                return (
                  <Fragment key={wordIndex}>
                    <span className="split__w">
                      <span className={`split__i${isAccent ? " serif-accent" : ""}`} style={{ "--i": current }}>
                        {word}
                      </span>
                    </span>
                    {wordIndex < words.length - 1 || /\s$/.test(token) ? " " : ""}
                  </Fragment>
                );
              })}
            </Fragment>
          );
        })}
      </span>
    </Tag>
  );
}
