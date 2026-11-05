export interface Entry {
  title: string;
  style: string;
  rows: { label: string; style: string; value: unknown }[];
}

const escape = (text: string): string => text.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

const inspect = (value: unknown): string =>
  value instanceof Error
    ? String(value)
    : (JSON.stringify(value) ?? "undefined").replace(/"(\w+)":/g, "$1: ").replace(/,/g, ", ");

export const render = (entries: Entry[]): string =>
  entries
    .map(
      ({ title, style, rows }) =>
        `<details open><summary style="${escape(style)}">${escape(title)}</summary>${rows
          .map(
            (row) =>
              `<div><span style="${escape(row.style)}">${escape(row.label)}</span> ${escape(inspect(row.value))}</div>`,
          )
          .join("")}</details>`,
    )
    .join("");

export const css = `
.console { background: #202124; color: #e8eaed; font: 12px/1.6 ui-monospace, Menlo, monospace; padding: 4px 0; }
.console details { border-bottom: 1px solid #3c4043; padding: 2px 12px; }
.console summary { cursor: default; }
.console div { padding-left: 22px; white-space: pre-wrap; word-break: break-all; }
`;
