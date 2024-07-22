import { TestSuite } from "../app.component";

declare const test: any;
declare const describe: any;
declare const it: any;

export const suite2: TestSuite = {
  title: "Suite 2",
  description: "## Beschreibung",
  tests: () => {
    describe('Suite 2', () => {
      it('should test inline', () => {
        test.assert.equal(4, 4);
      });
    })
  },
  preset: `function testFunction() {
}`,
  elapsed: true
}