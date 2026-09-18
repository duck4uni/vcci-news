import parse, {
  domToReact,
  DOMNode,
  Element,
  type HTMLReactParserOptions,
} from "html-react-parser";

const summaryParserOptions: HTMLReactParserOptions = {
  replace: (node) => {
    if (!(node instanceof Element)) return;

    const tagName = node.tagName.toLowerCase();

    if (tagName === "img") {
      return <></>;
    }

    if (tagName === "a") {
      return <>{domToReact(node.children as DOMNode[], summaryParserOptions)}</>;
    }
  },
};

export function renderPostSummary(html: string) {
  return parse(html, summaryParserOptions);
}
