export function jsonToTypeScript(input: string) {
  const value = JSON.parse(input);
  const lines: string[] = [];
  const seen = new Set<string>();

  function build(name: string, node: unknown, depth = 0): string {
    const indent = "  ".repeat(depth);

    if (Array.isArray(node)) {
      const first = node[0];
      if (first === undefined) return "any[]";
      return `${build(`${name}Item`, first, depth)}[]`;
    }

    if (node === null) return "null";

    const type = typeof node;
    if (type === "string") return "string";
    if (type === "number") return "number";
    if (type === "boolean") return "boolean";

    if (type === "object") {
      const objectNode = node as Record<string, unknown>;
      const interfaceName = toPascalCase(name);

      if (!seen.has(interfaceName)) {
        seen.add(interfaceName);
        const props = Object.entries(objectNode).map(([key, value]) => {
          const safeKey = /^[a-zA-Z_$][\w$]*$/.test(key) ? key : JSON.stringify(key);
          return `${indent}  ${safeKey}: ${build(key, value, depth + 1)};`;
        });

        lines.push(`${indent}interface ${interfaceName} {`);
        lines.push(...props);
        lines.push(`${indent}}`);
      }

      return interfaceName;
    }

    return "any";
  }

  const rootType = build("RootObject", value);
  const body = lines.join("\n");

  return [body, `type Root = ${rootType};`].filter(Boolean).join("\n\n");
}

function toPascalCase(value: string) {
  return value
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}
