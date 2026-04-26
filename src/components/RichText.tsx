import { Fragment, type ReactNode } from "react";
import { glossary } from "../data/glossary";
import { TermTooltip } from "./TermTooltip";

interface RichTextProps {
  text: string;
}

const TERM_PATTERN = /\[\[([^|\]]+)\|([^\]]+)\]\]/g;

export const stripRichText = (text: string) =>
  text.replace(TERM_PATTERN, (_match, _key, display: string) => display);

export function RichText({ text }: RichTextProps) {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  TERM_PATTERN.lastIndex = 0;

  while ((match = TERM_PATTERN.exec(text)) !== null) {
    const [raw, key, display] = match;
    const start = match.index;

    if (start > lastIndex) {
      nodes.push(text.slice(lastIndex, start));
    }

    const explanation = glossary[key];
    nodes.push(
      explanation ? (
        <TermTooltip key={`${key}-${start}`} term={display} explanation={explanation} />
      ) : (
        display
      ),
    );

    lastIndex = start + raw.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return (
    <>
      {nodes.map((node, index) => (
        <Fragment key={index}>{node}</Fragment>
      ))}
    </>
  );
}
