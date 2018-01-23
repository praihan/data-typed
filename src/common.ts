export type Constructor = {
  new(...args: any[]): {};
}

export type ObjectLiteral = {
  [key: string]: any;
}
