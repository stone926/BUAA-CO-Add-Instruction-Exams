// Course exercise translation; provenance and known historical differences: ../README.md.
import type { CustomInstructionDefinition } from '@buaa-co/instructions';

const instruction: CustomInstructionDefinition = {
  "apiVersion": 1,
  "mnemonic": "bezal",
  "modes": [
    "mars",
    "P3",
    "P4",
    "P5",
    "P6",
    "P7"
  ],
  "override": true,
  "encoding": "000000 rs:5 rt:5 00000 00000 110001",
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
      "$31"
    ]
  },
  "controlFlow": true,
  "generation": {
    "cases": [
      {
        "registerValues": {
          "rt": 0
        }
      },
      {
        "registerValues": {
          "rt": 1
        }
      }
    ]
  },
  "timing": {
    "hazardClass": "br_r2",
    "reads": [
      {
        "field": "rs",
        "role": "rs",
        "useStage": "D"
      },
      {
        "field": "rt",
        "role": "rt",
        "useStage": "D"
      }
    ],
    "readyStage": "E"
  },
  execute(ctx, fields) {
    const taken=ctx.readGpr(fields.rt)===0;
    return {gprWrites:taken?[{register:31,value:ctx.linkAddress}]:[],control:{taken,target:ctx.readGpr(fields.rs)>>>0}};
  }
};
export default instruction;
