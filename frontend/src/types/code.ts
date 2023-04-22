export enum Language {
  Python = "python",
  Typescript = "typescript",
  Rust = "rust",
}

export type Code = {
  data: string;
  language: Language;
};
