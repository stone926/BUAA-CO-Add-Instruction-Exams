// Course exercise translation; provenance and known historical differences: ../README.md.
import type { CustomInstructionDefinition } from '@buaa-co/instructions';

const instruction: CustomInstructionDefinition = {
  "apiVersion": 1,
  "mnemonic": "bds",
  "modes": [
    "mars",
    "P3",
    "P4",
    "P5",
    "P6",
    "P7"
  ],
  "override": true,
  "encoding": "000000 rs:5 rt:5 00000 00000 001010",
  "operands": [
    {
      "kind": "register",
      "field": "rs"
    },
    {
      "kind": "register",
      "field": "rt"
    }
  ],
  "access": {
    "reads": [
      "rs",
      "rt"
    ],
    "writes": [
      "hi",
      "lo"
    ]
  },
  "generation": {
    "cases": [
      {
        "registerValues": {
          "rs": 10,
          "rt": 6
        }
      },
      {
        "registerValues": {
          "rs": 6,
          "rt": 10
        }
      }
    ]
  },
  "timing": {
    "hazardClass": "mul_div"
  },
  execute(ctx, fields) {
    const left=ctx.readGpr(fields.rs)>>>0,right=ctx.readGpr(fields.rt)>>>0;
    const dividend=left>=right?left:right,divisor=left>=right?right:left;
    if (divisor===0) throw new Error('bds: divisor is zero and the statement defines no HI/LO result');
    return {hiLoWrites:[{register:'lo',value:Math.floor(dividend/divisor)>>>0},{register:'hi',value:dividend%divisor}]};
  }
};
export default instruction;
