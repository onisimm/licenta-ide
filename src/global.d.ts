export {};

declare global {
  interface Window {
    myAPI: {
      sayHello: () => string;
    };
  }
}
