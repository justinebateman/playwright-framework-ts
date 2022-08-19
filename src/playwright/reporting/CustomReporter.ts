import { Reporter } from "@playwright/test/reporter";

class CustomReporter implements Reporter {
  // print all console logs to standard out

  onStdOut(chunk: string | Buffer): void {
    process.stdout.write(chunk);
  }
}
export default CustomReporter;
