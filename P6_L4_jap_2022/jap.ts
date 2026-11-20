// Course exercise translation; provenance and known historical differences: ../README.md.
import type { CustomInstructionDefinition } from '@buaa-co/instructions';

const instruction: CustomInstructionDefinition = {
  "apiVersion": 1,
  "mnemonic": "jap",
  "modes": [
    "mars",
    "P3",
    "P4",
    "P5",
    "P6",
    "P7"
  ],
  "override": true,
  "encoding": "110110 target:26",
  "operands": [
    {
      "kind": "immediate",
      "field": "target",
      "relocation": "jump"
    }
  ],
  "access": {
    "reads": [
      "$29"
    ],
    "writes": [
      "$29"
    ],
    "memory": "store",
    "width": 4
  },
  "controlFlow": true,
  "generation": {
    "control": {
      "targetField": "target",
      "relocation": "jump"
    }
  },
  execute(ctx, fields) {
    const sp=ctx.readGpr(29)>>>0;
    const target=((ctx.pc&0xf0000000)|((fields.target<<2)>>>0))>>>0;
    return {store:{address:sp,width:4,value:ctx.linkAddress},gprWrites:[{register:29,value:(sp-4)>>>0}],control:{taken:true,target}};
  }
};
export default instruction;
