export enum Language {
  Python = "python",
  Typescript = "typescript",
  Rust = "rust",
}

export type Code = {
  data: string;
  language: Language;
  continue_count: number;
};

export type ResponseData = {
  code: string;
  summary: string;
};
