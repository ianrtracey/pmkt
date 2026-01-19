import { render } from "ink";
import { Command } from "commander";
import { App } from "./components/App.js";

const program = new Command();

program
  .name("pmkt")
  .description("Rich terminal UI for Polymarket")
  .version("0.0.1")
  .action(() => {
    render(<App />);
  });

program.parse();
