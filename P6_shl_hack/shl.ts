// Course exercise translation; provenance and known historical differences: ../README.md.
import type { CustomInstructionDefinition } from '@buaa-co/instructions';

const instruction: CustomInstructionDefinition = {
  "apiVersion": 1,
  "mnemonic": "shl",
  "modes": [
    "mars",
    "P3",
    "P4",
    "P5",
    "P6",
    "P7"
  ],
  "override": true,
  "encoding": "000000 00000 00000 00000 00000 111100",
  "operands": [],
  "access": {
    "reads": [
      "hi",
      "lo"
    ],
    "writes": [
      "hi",
      "lo"
    ]
  },
  "generation": {},
  execute(ctx) {
    const hi=ctx.readHi()>>>0,lo=ctx.readLo()>>>0;
    return {hiLoWrites:[{register:'hi',value:lo},{register:'lo',value:hi}]};
  }
};
export default instruction;
