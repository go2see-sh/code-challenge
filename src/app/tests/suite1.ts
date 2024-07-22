import { TestSuite } from "../app.component";

declare const test: any;
declare const describe: any;
declare const it: any;
declare const testFunction: any;

export const suite1: TestSuite = {
  title: "Quadrate",
  description: `## Beschreibung
  Gegeben ist eine Liste an natürlichen Zahlen.\  
  Berechne für jede Zahl der Liste das Quadrat und gib die neue Liste zurück.

  Die Liste kann
  * leer sein
  * nur ein Element beinhalten
  * beliebig viele Elemente beinhalten

  Die Liste ist niemals _undefined_.
  ### Beispiel
  Eingabe: n = [1, 2, 3, 4]\  
  Ausgabe: [1, 4, 9, 16]  
`,
  tests: () => {
    describe('Quadrate', () => {
      it('should square empty list', () => {
        test.array(testFunction([])).is([]);
      });
      it('should square list with one element', () => {
        test.array(testFunction([1])).is([1]);
      });
      it('should square list with multiple elements', () => {
        test.array(testFunction([1, 2, 3, 4])).is([1, 4, 9, 16]);
      });
    })
  },
  preset: `function testFunction(n) {
  return n.map((e) => Math.pow(e, 2));
}`,
  elapsed: false
}