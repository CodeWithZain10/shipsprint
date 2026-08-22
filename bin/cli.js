#!/usr/bin/env node

import { program } from "commander";
import {createPromptModule} from "inquirer";
import init from "../src/commands/init.js";

const prompt = createPromptModule();

program
    .name("create-shipsprint")
    .description("A modern full-stack project scaffolding CLI")
    .action(init);

program.parse();
