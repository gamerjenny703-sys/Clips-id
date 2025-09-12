import type { Transform } from "jscodeshift";

const transform: Transform = (file, api) => {
  const j = api.jscodeshift;
  const root = j(file.source);

  // ... (definisi class tetap sama) ...
  const coreBrutalistClasses = ["border-4", "border-black", "shadow-["];
  const allPossibleBrutalistClasses = [
    "border-4",
    "border-black",
    "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
    "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
    "shadow-[12px_12px_0px_0px_rgba(255,255,255,1)]",
    "shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]",
    "transition-all",
    "hover:translate-x-1",
    "hover:translate-y-1",
    "hover:translate-x-2",
    "hover:translate-y-2",
    "hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
    "hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]",
  ];

  const cardImports = root.find(j.ImportDeclaration, {
    source: { value: "@/components/ui/card" },
  });

  if (cardImports.length === 0) return null;

  let fileModified = false;
  const cardsToTransform = new Set<any>();

  // Langkah 1: Identifikasi <Card> yang perlu diubah
  root.find(j.JSXOpeningElement, { name: { name: "Card" } }).forEach((path) => {
    const classNameAttribute = path.node.attributes?.find(
      (attr) => attr.type === "JSXAttribute" && attr.name.name === "className",
    ) as any;

    if (
      classNameAttribute &&
      classNameAttribute.value?.type === "StringLiteral"
    ) {
      const classValue = classNameAttribute.value.value || "";
      if (coreBrutalistClasses.every((cls) => classValue.includes(cls))) {
        cardsToTransform.add(path.node);
        fileModified = true;

        // Bersihkan className
        const originalClasses = classValue.split(" ").filter(Boolean);
        const remainingClasses = originalClasses.filter(
          (cls) =>
            !allPossibleBrutalistClasses.includes(cls) &&
            !cls.startsWith("hover:"),
        );

        if (remainingClasses.length > 0) {
          classNameAttribute.value.value = remainingClasses.join(" ");
        } else {
          path.node.attributes = path.node.attributes?.filter(
            (attr) => attr !== classNameAttribute,
          );
        }
      }
    }
  });

  if (!fileModified) return null;

  // Langkah 2: Ubah semua <Card> dan </Card> yang telah diidentifikasi
  root.find(j.JSXIdentifier, { name: "Card" }).forEach((path) => {
    // Cek apakah parent-nya (JSXOpeningElement atau JSXClosingElement) ada dalam daftar transformasi
    if (
      cardsToTransform.has(path.parent.node) ||
      (path.parent.node.type === "JSXClosingElement" &&
        cardsToTransform.has(path.parent.node.openingElement))
    ) {
      path.node.name = "BrutalCard";
    }
  });

  // Langkah 3: Perbarui import
  cardImports.remove();

  // ... (logika import tetap sama) ...
  const brutalCardImportPath = "@/components/shared/brutal-card";
  const brutalCardComponents = new Set(["BrutalCard"]);
  root.find(j.JSXIdentifier).forEach((path) => {
    if (
      path.parent.value.type === "JSXOpeningElement" ||
      path.parent.value.type === "JSXClosingElement"
    ) {
      if (
        path.node.name.startsWith("Card") ||
        path.node.name === "BrutalCard"
      ) {
        brutalCardComponents.add(path.node.name);
      }
    }
  });

  const existingBrutalImport = root.find(j.ImportDeclaration, {
    source: { value: brutalCardImportPath },
  });

  if (existingBrutalImport.length === 0) {
    const specifiers = Array.from(brutalCardComponents).map((name) =>
      j.importSpecifier(j.identifier(name)),
    );
    const newImport = j.importDeclaration(
      specifiers,
      j.literal(brutalCardImportPath),
    );
    root.get().node.program.body.unshift(newImport);
  }

  return root.toSource();
};

export default transform;
