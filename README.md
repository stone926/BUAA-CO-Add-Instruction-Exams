# 加指令练习

本仓库收录课程题库和往届博客材料。下方 JS/TS 运行说明适用于实际附有脚本的课程加指令题；博客条目只提供整理后的题面及题解，不自动生成指令编码、脚本或 Java 附件。P0/P1 的电路与状态机、P2 的汇编算法题按各自阶段实现，不能作为 CPU 自定义指令直接加载。

## 在 BUAA CO Toolkit 中使用 TS 脚本

需要 **VS Code 1.101 或更新版本**，以及已包含 JS/TS 自定义指令功能的 [BUAA CO Toolkit](https://github.com/stone926/BUAA-CO-Toolkit)。脚本由插件调用 VS Code 自带的运行时加载，无需额外安装 Node、npm 包、`tsc` 或 MARS。

1. 在 VS Code 中打开待测 CPU 的工作区，选择与 CPU 对应的课程 Profile。
2. 选择一道练习，将目录中的 `<指令名>.ts` 复制到 CPU 工作区的 `.co/custom-instructions/`。
3. 保存 ASM，使用插件的运行、机器码导出、用户 ASM 对拍或随机测试功能。

例如练习 `P5_L3_blztal_2022` 的放置方式为：

```text
CPU 工作区/
├── .co/
│   └── custom-instructions/
│       └── blztal.ts
├── mips.v
└── test.asm
```

脚本中的 `import type ... from '@buaa-co/instructions'` 只用于编辑器类型检查，加载时会被擦除。**直接复制脚本即可运行**。如需编辑器补全和类型提示，可先运行 **CO: 创建 JS/TS 自定义指令**，选择 TypeScript 并填写所选指令名，再用本仓库的同名 `.ts` 覆盖生成的示例；保留该命令创建的 `co-instructions.d.ts` 和 `tsconfig.json`。

### 运行、导出与对拍

- ASM 运行和机器码导出使用已加载脚本的编码及语义。
- **CO: 测试用户汇编文件或目录** 接受单个 ASM 或目录；目录只测试直属的 `.asm`、`.s`、`.mips` 文件，不递归。选择自动参考引擎即可使用 TS 定义。
- CPU 对拍用的程序应以标准停机自环及随后的 `nop` 结束，例如：

  ```asm
  halt:
      beq $0, $0, halt
      nop
  ```

- 脚本带有随机生成配方。在 `co.test.instructions` 中加入助记符可选择测试重点；配置留空时，支持当前模式的自定义指令会加入默认生成集合。测试 CPU 必须实现所选指令及测试前导需要的课程基础指令。
- 测试用例会保存定义快照。修改 `.ts` 后请创建新测试；旧用例重跑仍使用原定义。

P3、P4 按课程不启用延迟槽，P5～P7 按课程启用。脚本声明了普通 MARS 和 P3～P7 模式，便于跨阶段验证；题目所属阶段仍以目录和题面为准。测试 P6/P7 CPU 时应选择实际 CPU 阶段。P7 的异常、中断、Timer、MMIO 和返回黑盒测试继续由插件现有链路处理。

## 使用原始 `.class` 附件

有附件的题目可将 `.class` 加载到支持自定义指令的课程魔改 MARS。具体加载方法取决于所用 MARS 版本。

在 BUAA CO Toolkit 中使用这条参考路径时，将所需 `.class` 放到原 ASM 工作区的 `.co/custom-instructions/`，并配置：

```json
{
  "co.toolchain.mars": "D:/Tools/Mars/Mars.jar"
}
```

需要可用的 Java；不在 PATH 时另设 `co.toolchain.java`。普通官方 MARS 不一定提供所需的扩展加载功能。

用户 ASM 对拍可以显式选择自定义 MARS 参考。自动模式在没有 JS/TS 定义绑定且遇到未知指令时，可切换到完整的 MARS 参考。已绑定 TS 定义的程序不会把部分指令交给 `.class` 混合执行。比较两种实现时，请分别运行并明确所选参考；尤其注意下方 BOMEZ 的已知错误。

## 已知错误、差异与注意事项

### BOMEZ：两份原始附件都有取模方向错误

涉及 [P4 2022 题目](P4_L2_BOMEZ_2022/P4_L2_BOMEZ_2022.md) 和 [P3 2023 题目](P3_L15_bomez_2023/P3_L15_bomez_2023.md)。2022 题面已提示其 `.class` 有误；2023 的附件与它**字节完全相同**，SHA-256 为：

```text
4cc38f179c862cccdf6010974da731af7a31a1a6a18408d3f9c15213ed02b8d1
```

按逻辑汇编操作数，题意使用 `popcount(rs) % popcount(rt)`，两个原始附件实际使用 `popcount(rt) % popcount(rs)`。本仓库两个 `bomez.ts` 均按题意实现；两个原始 `.class` 作为历史附件保留，未修改。

当两个 popcount 都非零且不对称时，两种参考的跳转结果可能不同。不要把这种已知参考差异直接归因于 CPU 错误。验证已为每个年份设置 4 组明确的差异断言。

### BOMEZ / BONALL：编码图与附件的源寄存器排列不同

两个 BOMEZ 附件及 [BONALL 附件](P5_L2_bonall_2022/bonall.class) 的两个源寄存器字段，与题面编码图的排列相反。TS 脚本保留经过附件验证的实际机器码排列，即 `rt:5 rs:5`，回调字段按逻辑汇编操作数命名。

汇编结果与附件逐字比较，不通过事后改写机器码掩盖差异。设计 CPU 译码时，应同时核对实际汇编结果与题面，不要仅根据编码图推断字段顺序。

### 同名和编码冲突的练习需要分开加载

不同题目可能复用助记符或机器码。例如：

- `addei` 与 `lhogez` 使用相同主操作码 `110011`。
- `bonall` 与 `lwer` 使用相同主操作码 `011001`。
- 不同年份的 `bomez`、`lboez`、`pcadd` 保留独立目录。

每次只复制当前题目所需的定义；不要把本仓库全部 TS 脚本或全部 `.class` 一起放进加载目录。

### 没有附件的题目

- [SB](P4_L8_SB_2022/P4_L8_SB_2022.md) 是标准字节存储练习，没有附带 `.class`；TS 脚本可用，参考验证使用原生 MARS 的 SB。
- [LWER](P5_M_lwer_2022/P5_M_lwer_2022.md) 没有附带 `.class`；TS 实现按题意验证，未伪造 Java 附件。它会强制按字对齐地址，并根据内存和旧目标寄存器值选择偶数目的寄存器，包括零寄存器。
- [SHL](P6_shl_hack/P6_shl_hack.md) 没有附带 `.class`；平台只给出“交换乘除法单元中 HI 与 LO”的题面，TS 按题面实现，未伪造 Java 附件。

### 保留题目特有的边界语义

- ADDM 按原附件先进行 32 位加法回绕，再进行有符号比较，不使用无限精度整数加法替代。
- RLB 的题目输入范围为立即数 `0..31`。
- ADDEI 将立即数高位补 1；表示原始位 `0xffff` 时可使用 `-1`，避免不同汇编器对十进制 `65535` 的范围检查差异。
- BLZTAL 的分支位移会受寄存器值影响；BONALL 不跳转时取消延迟槽，但仍写链接寄存器；LHOGEZ 可能改写 `$31 = PC + 4`。实现时需按各自题意处理。
- BDS 在除数为 0 时，题面与原附件都没有定义 HI/LO 结果：原 `.class` 会抛出 `ArithmeticException`，TS 同样报错，不自行约定写回值。
- JAP 把链接地址（P6 为 PC+8）写入 `$sp` 指向的字，再把 `$sp` 减 4，然后跳到 `PC[31:28] || target || 00`；题面明确不考虑地址不对齐等异常。

脚本含潜在读写、随机生成与课程冒险时机声明。冒险覆盖来自课程模型，并非对实际 CPU 内部流水线的测量。若自定义定义覆盖了测试前导、处理程序或停机代码所需基础指令的编码，插件会报告具体冲突；可以用用户 ASM 构造相应测试。

## 本地题目管理页面

仓库自带一个本地页面，用于浏览题库、跳转原题链接，以及增删改题目并同步下方索引：

```bash
node tools/exercise-web/server.js
```

打开 <http://127.0.0.1:8787/> 浏览，<http://127.0.0.1:8787/#admin> 进入管理模式。需要 Node.js 18 或更新版本，后端只使用内置模块，浏览器端已随仓库附带 DOMPurify，无需安装依赖或连接 CDN。这个工具只管理题库文件；实际指令助记符以 JS/TS 源码中的 `mnemonic` 为准，修改脚本文件名不会修改指令定义。配置与接口说明见 [tools/exercise-web/README.md](tools/exercise-web/README.md)。

## 题目索引

<!-- Exercise table generated from the verified fixture index. -->

| 练习 | 阶段 | 状态 | 来源 | JS/TS 脚本 | 附件 |
| --- | --- | --- | --- | --- | --- |
| [Pre_LogisimFSM_2024_blog](supplemented/Pre_LogisimFSM_2024_blog/Pre_LogisimFSM_2024_blog.md) | Pre | 残题补全 | 博客整理 | 无 | [Pre_LogisimFSM_2024_blog_题解.md](supplemented/Pre_LogisimFSM_2024_blog/Pre_LogisimFSM_2024_blog_题解.md) |
| [Pre_Verilog按位相乘后统计1的个数_2024_blog](Pre_Verilog按位相乘后统计1的个数_2024_blog/Pre_Verilog按位相乘后统计1的个数_2024_blog.md) | Pre | 行为完整 | 博客整理 | 无 | [Pre_Verilog按位相乘后统计1的个数_2024_blog_题解.md](Pre_Verilog按位相乘后统计1的个数_2024_blog/Pre_Verilog按位相乘后统计1的个数_2024_blog_题解.md) |
| [Pre_三题概述_2023_blog](supplemented/Pre_三题概述_2023_blog/Pre_三题概述_2023_blog.md) | Pre | 残题补全 | 博客整理 | 无 | [Pre_三题概述_2023_blog_题解.md](supplemented/Pre_三题概述_2023_blog/Pre_三题概述_2023_blog_题解.md) |
| [Pre_字符自动机_2021_blog](supplemented/Pre_字符自动机_2021_blog/Pre_字符自动机_2021_blog.md) | Pre | 残题补全 | 博客整理 | 无 | [Pre_字符自动机_2021_blog_题解.md](supplemented/Pre_字符自动机_2021_blog/Pre_字符自动机_2021_blog_题解.md) |
| [P0_MD5前处理电路_2020_blog](supplemented/P0_MD5前处理电路_2020_blog/P0_MD5前处理电路_2020_blog.md) | P0 | 残题补全 | 博客整理 | 无 | [P0_MD5前处理电路_2020_blog_题解.md](supplemented/P0_MD5前处理电路_2020_blog/P0_MD5前处理电路_2020_blog_题解.md) |
| [P0_三元递推式求项_2021_blog](P0_三元递推式求项_2021_blog/P0_三元递推式求项_2021_blog.md) | P0 | 行为完整 | 博客整理 | 无 | [P0_三元递推式求项_2021_blog_题解.md](P0_三元递推式求项_2021_blog/P0_三元递推式求项_2021_blog_题解.md) |
| [P0_三数求和组合电路_2020_blog](P0_三数求和组合电路_2020_blog/P0_三数求和组合电路_2020_blog.md) | P0 | 行为完整 | 博客整理 | 无 | 无 |
| [P0_字符自动机_2021_blog](supplemented/P0_字符自动机_2021_blog/P0_字符自动机_2021_blog.md) | P0 | 残题补全 | 博客整理 | 无 | [P0_字符自动机_2021_blog_题解.md](supplemented/P0_字符自动机_2021_blog/P0_字符自动机_2021_blog_题解.md) |
| [P0_序列检测Moore状态机_2023_blog](P0_序列检测Moore状态机_2023_blog/P0_序列检测Moore状态机_2023_blog.md) | P0 | 行为完整 | 博客整理 | 无 | [P0_序列检测Moore状态机_2023_blog_题解.md](P0_序列检测Moore状态机_2023_blog/P0_序列检测Moore状态机_2023_blog_题解.md) |
| [P0_打分求和电路_2020_blog](P0_打分求和电路_2020_blog/P0_打分求和电路_2020_blog.md) | P0 | 行为完整 | 博客整理 | 无 | [P0_打分求和电路_2020_blog_题解.md](P0_打分求和电路_2020_blog/P0_打分求和电路_2020_blog_题解.md) |
| [P0_投票表决器_2021_blog](P0_投票表决器_2021_blog/P0_投票表决器_2021_blog.md) | P0 | 行为完整 | 博客整理 | 无 | [P0_投票表决器_2021_blog_题解.md](P0_投票表决器_2021_blog/P0_投票表决器_2021_blog_题解.md) |
| [P0_摆渡车换乘状态机_2020_blog](supplemented/P0_摆渡车换乘状态机_2020_blog/P0_摆渡车换乘状态机_2020_blog.md) | P0 | 残题补全 | 博客整理 | 无 | [P0_摆渡车换乘状态机_2020_blog_题解.md](supplemented/P0_摆渡车换乘状态机_2020_blog/P0_摆渡车换乘状态机_2020_blog_题解.md) |
| [P0_方向信号Mealy状态机_2023_blog](P0_方向信号Mealy状态机_2023_blog/P0_方向信号Mealy状态机_2023_blog.md) | P0 | 行为完整 | 博客整理 | 无 | [P0_方向信号Mealy状态机_2023_blog_题解.md](P0_方向信号Mealy状态机_2023_blog/P0_方向信号Mealy状态机_2023_blog_题解.md) |
| [P0_最长不降后缀串_2024_blog](supplemented/P0_最长不降后缀串_2024_blog/P0_最长不降后缀串_2024_blog.md) | P0 | 残题补全 | 博客整理 | 无 | [P0_最长不降后缀串_2024_blog_题解.md](supplemented/P0_最长不降后缀串_2024_blog/P0_最长不降后缀串_2024_blog_题解.md) |
| [P0_未出现的最小正整数_2023_blog](P0_未出现的最小正整数_2023_blog/P0_未出现的最小正整数_2023_blog.md) | P0 | 行为完整 | 博客整理 | 无 | [P0_未出现的最小正整数_2023_blog_题解.md](P0_未出现的最小正整数_2023_blog/P0_未出现的最小正整数_2023_blog_题解.md) |
| [P0_自习室人数统计_2024_blog](supplemented/P0_自习室人数统计_2024_blog/P0_自习室人数统计_2024_blog.md) | P0 | 残题补全 | 博客整理 | 无 | [P0_自习室人数统计_2024_blog_题解.md](supplemented/P0_自习室人数统计_2024_blog/P0_自习室人数统计_2024_blog_题解.md) |
| [P0_逆序数对_2024_blog](P0_逆序数对_2024_blog/P0_逆序数对_2024_blog.md) | P0 | 行为完整 | 博客整理 | 无 | [P0_逆序数对_2024_blog_题解.md](P0_逆序数对_2024_blog/P0_逆序数对_2024_blog_题解.md) |
| [P1_numberNest数字匹配合法性判定_2023_blog](supplemented/P1_numberNest数字匹配合法性判定_2023_blog/P1_numberNest数字匹配合法性判定_2023_blog.md) | P1 | 残题补全 | 博客整理 | 无 | [P1_numberNest数字匹配合法性判定_2023_blog_题解.md](supplemented/P1_numberNest数字匹配合法性判定_2023_blog/P1_numberNest数字匹配合法性判定_2023_blog_题解.md) |
| [P1_加权投票计分_2020_blog](P1_加权投票计分_2020_blog/P1_加权投票计分_2020_blog.md) | P1 | 行为完整 | 博客整理 | 无 | [P1_加权投票计分_2020_blog_题解.md](P1_加权投票计分_2020_blog/P1_加权投票计分_2020_blog_题解.md) |
| [P1_奇偶交替串判定_2024_blog](P1_奇偶交替串判定_2024_blog/P1_奇偶交替串判定_2024_blog.md) | P1 | 行为完整 | 博客整理 | 无 | [P1_奇偶交替串判定_2024_blog_题解.md](P1_奇偶交替串判定_2024_blog/P1_奇偶交替串判定_2024_blog_题解.md) |
| [P1_心情状态机_2021_blog](supplemented/P1_心情状态机_2021_blog/P1_心情状态机_2021_blog.md) | P1 | 残题补全 | 博客整理 | 无 | [P1_心情状态机_2021_blog_题解.md](supplemented/P1_心情状态机_2021_blog/P1_心情状态机_2021_blog_题解.md) |
| [P1_日期串合法性状态机_2020_blog](supplemented/P1_日期串合法性状态机_2020_blog/P1_日期串合法性状态机_2020_blog.md) | P1 | 残题补全 | 博客整理 | 无 | [P1_日期串合法性状态机_2020_blog_题解.md](supplemented/P1_日期串合法性状态机_2020_blog/P1_日期串合法性状态机_2020_blog_题解.md) |
| [P1_煎饼翻面状态机_2020_blog](supplemented/P1_煎饼翻面状态机_2020_blog/P1_煎饼翻面状态机_2020_blog.md) | P1 | 残题补全 | 博客整理 | 无 | [P1_煎饼翻面状态机_2020_blog_题解.md](supplemented/P1_煎饼翻面状态机_2020_blog/P1_煎饼翻面状态机_2020_blog_题解.md) |
| [P1_逐位统计不同_2024_blog](P1_逐位统计不同_2024_blog/P1_逐位统计不同_2024_blog.md) | P1 | 行为完整 | 博客整理 | 无 | [P1_逐位统计不同_2024_blog_题解.md](P1_逐位统计不同_2024_blog/P1_逐位统计不同_2024_blog_题解.md) |
| [P1_键值对个数_2024_blog](supplemented/P1_键值对个数_2024_blog/P1_键值对个数_2024_blog.md) | P1 | 残题补全 | 博客整理 | 无 | [P1_键值对个数_2024_blog_题解.md](supplemented/P1_键值对个数_2024_blog/P1_键值对个数_2024_blog_题解.md) |
| [P2_三道汇编题_2020_blog](supplemented/P2_三道汇编题_2020_blog/P2_三道汇编题_2020_blog.md) | P2 | 残题补全 | 博客整理 | 无 | [P2_三道汇编题_2020_blog_题解.md](supplemented/P2_三道汇编题_2020_blog/P2_三道汇编题_2020_blog_题解.md) |
| [P2_删数使剩余最大_2021_blog](P2_删数使剩余最大_2021_blog/P2_删数使剩余最大_2021_blog.md) | P2 | 行为完整 | 博客整理 | 无 | [P2_删数使剩余最大_2021_blog_题解.md](P2_删数使剩余最大_2021_blog/P2_删数使剩余最大_2021_blog_题解.md) |
| [P2_双关键字排序_2021_blog](supplemented/P2_双关键字排序_2021_blog/P2_双关键字排序_2021_blog.md) | P2 | 残题补全 | 博客整理 | 无 | [P2_双关键字排序_2021_blog_题解.md](supplemented/P2_双关键字排序_2021_blog/P2_双关键字排序_2021_blog_题解.md) |
| [P2_合并有序数组_2023_blog](P2_合并有序数组_2023_blog/P2_合并有序数组_2023_blog.md) | P2 | 行为完整 | 博客整理 | 无 | [P2_合并有序数组_2023_blog_题解.md](P2_合并有序数组_2023_blog/P2_合并有序数组_2023_blog_题解.md) |
| [P2_拆分数字_2021_blog](supplemented/P2_拆分数字_2021_blog/P2_拆分数字_2021_blog.md) | P2 | 残题补全 | 博客整理 | 无 | [P2_拆分数字_2021_blog_题解.md](supplemented/P2_拆分数字_2021_blog/P2_拆分数字_2021_blog_题解.md) |
| [P2_消除游戏_2023_blog](P2_消除游戏_2023_blog/P2_消除游戏_2023_blog.md) | P2 | 行为完整 | 博客整理 | 无 | [P2_消除游戏_2023_blog_题解.md](P2_消除游戏_2023_blog/P2_消除游戏_2023_blog_题解.md) |
| [P3_L10_addm_2023](P3_L10_addm_2023/P3_L10_addm_2023.md) | P3 | 行为完整 | 课程题库 | [addm.ts](P3_L10_addm_2023/addm.ts) | [addm.class](P3_L10_addm_2023/addm.class) |
| [P3_L12_lsh_2023](P3_L12_lsh_2023/P3_L12_lsh_2023.md) | P3 | 行为完整 | 课程题库 | [lsh.ts](P3_L12_lsh_2023/lsh.ts) | [lsh.class](P3_L12_lsh_2023/lsh.class) |
| [P3_L15_bomez_2023](P3_L15_bomez_2023/P3_L15_bomez_2023.md) | P3 | 行为完整 | 课程题库 | [bomez.ts](P3_L15_bomez_2023/bomez.ts) | [bomez.class](P3_L15_bomez_2023/bomez.class) |
| [P3_L16_lboez_2023](P3_L16_lboez_2023/P3_L16_lboez_2023.md) | P3 | 行为完整 | 课程题库 | [lboez.ts](P3_L16_lboez_2023/lboez.ts) | [lboez.class](P3_L16_lboez_2023/lboez.class) |
| [P3_balr_2020_blog](P3_balr_2020_blog/P3_balr_2020_blog.md) | P3 | 行为完整 | 博客整理 | 无 | [P3_balr_2020_blog_题解.md](P3_balr_2020_blog/P3_balr_2020_blog_题解.md) |
| [P3_bgc_2024_blog](supplemented/P3_bgc_2024_blog/P3_bgc_2024_blog.md) | P3 | 残题补全 | 博客整理 | 无 | [P3_bgc_2024_blog_题解.md](supplemented/P3_bgc_2024_blog/P3_bgc_2024_blog_题解.md) |
| [P3_lbi_2020_blog](P3_lbi_2020_blog/P3_lbi_2020_blog.md) | P3 | 行为完整 | 博客整理 | 无 | [P3_lbi_2020_blog_题解.md](P3_lbi_2020_blog/P3_lbi_2020_blog_题解.md) |
| [P3_wsbh_2020_blog](P3_wsbh_2020_blog/P3_wsbh_2020_blog.md) | P3 | 行为完整 | 博客整理 | 无 | [P3_wsbh_2020_blog_题解.md](P3_wsbh_2020_blog/P3_wsbh_2020_blog_题解.md) |
| [P4_L1_RLB_2022](P4_L1_RLB_2022/P4_L1_RLB_2022.md) | P4 | 行为完整 | 课程题库 | [rlb.ts](P4_L1_RLB_2022/rlb.ts) | [rlb.class](P4_L1_RLB_2022/rlb.class) |
| [P4_L2_BOMEZ_2022](P4_L2_BOMEZ_2022/P4_L2_BOMEZ_2022.md) | P4 | 行为完整 | 课程题库 | [bomez.ts](P4_L2_BOMEZ_2022/bomez.ts) | [bomez.class](P4_L2_BOMEZ_2022/bomez.class) |
| [P4_L3_LWRR_2022](P4_L3_LWRR_2022/P4_L3_LWRR_2022.md) | P4 | 行为完整 | 课程题库 | [lwrr.ts](P4_L3_LWRR_2022/lwrr.ts) | [lwrr.class](P4_L3_LWRR_2022/lwrr.class) |
| [P4_L4_PCADD_2022](P4_L4_PCADD_2022/P4_L4_PCADD_2022.md) | P4 | 行为完整 | 课程题库 | [pcadd.ts](P4_L4_PCADD_2022/pcadd.ts) | [pcadd.class](P4_L4_PCADD_2022/pcadd.class) |
| [P4_L4_SSZE_2022](P4_L4_SSZE_2022/P4_L4_SSZE_2022.md) | P4 | 行为完整 | 课程题库 | [ssze.ts](P4_L4_SSZE_2022/ssze.ts) | [ssze.class](P4_L4_SSZE_2022/ssze.class) |
| [P4_L5_BNEZALC_2022](P4_L5_BNEZALC_2022/P4_L5_BNEZALC_2022.md) | P4 | 行为完整 | 课程题库 | [bnezalc.ts](P4_L5_BNEZALC_2022/bnezalc.ts) | [bnezalc.class](P4_L5_BNEZALC_2022/bnezalc.class) |
| [P4_L5_sbsam_2023](P4_L5_sbsam_2023/P4_L5_sbsam_2023.md) | P4 | 行为完整 | 课程题库 | [sbsam.ts](P4_L5_sbsam_2023/sbsam.ts) | [sbsam.class](P4_L5_sbsam_2023/sbsam.class) |
| [P4_L6_LBOEZ_2022](P4_L6_LBOEZ_2022/P4_L6_LBOEZ_2022.md) | P4 | 行为完整 | 课程题库 | [lboez.ts](P4_L6_LBOEZ_2022/lboez.ts) | [lboez.class](P4_L6_LBOEZ_2022/lboez.class) |
| [P4_L7_TFTC_2022](P4_L7_TFTC_2022/P4_L7_TFTC_2022.md) | P4 | 行为完整 | 课程题库 | [tftc.ts](P4_L7_TFTC_2022/tftc.ts) | [tftc.class](P4_L7_TFTC_2022/tftc.class) |
| [P4_L8_SB_2022](P4_L8_SB_2022/P4_L8_SB_2022.md) | P4 | 行为完整 | 课程题库 | [sb.ts](P4_L8_SB_2022/sb.ts) | 无 |
| [P4_L9_BAO_2022](P4_L9_BAO_2022/P4_L9_BAO_2022.md) | P4 | 行为完整 | 课程题库 | [bao.ts](P4_L9_BAO_2022/bao.ts) | [bao.class](P4_L9_BAO_2022/bao.class) |
| [P4_L9_ras_2023](P4_L9_ras_2023/P4_L9_ras_2023.md) | P4 | 行为完整 | 课程题库 | [ras.ts](P4_L9_ras_2023/ras.ts) | [ras.class](P4_L9_ras_2023/ras.class) |
| [P4_L10_pcadd_2023](P4_L10_pcadd_2023/P4_L10_pcadd_2023.md) | P4 | 行为完整 | 课程题库 | [pcadd.ts](P4_L10_pcadd_2023/pcadd.ts) | [pcadd.class](P4_L10_pcadd_2023/pcadd.class) |
| [P4_ES_2024_blog](P4_ES_2024_blog/P4_ES_2024_blog.md) | P4 | 行为完整 | 博客整理 | 无 | [P4_ES_2024_blog_题解.md](P4_ES_2024_blog/P4_ES_2024_blog_题解.md) |
| [P4_bsoal_2020_blog](P4_bsoal_2020_blog/P4_bsoal_2020_blog.md) | P4 | 行为完整 | 博客整理 | 无 | [P4_bsoal_2020_blog_题解.md](P4_bsoal_2020_blog/P4_bsoal_2020_blog_题解.md) |
| [P4_cptl_2024_blog](supplemented/P4_cptl_2024_blog/P4_cptl_2024_blog.md) | P4 | 残题补全 | 博客整理 | 无 | [P4_cptl_2024_blog_题解.md](supplemented/P4_cptl_2024_blog/P4_cptl_2024_blog_题解.md) |
| [P4_eam_2024_blog](supplemented/P4_eam_2024_blog/P4_eam_2024_blog.md) | P4 | 残题补全 | 博客整理 | 无 | [P4_eam_2024_blog_题解.md](supplemented/P4_eam_2024_blog/P4_eam_2024_blog_题解.md) |
| [P4_ibs_2024_blog](supplemented/P4_ibs_2024_blog/P4_ibs_2024_blog.md) | P4 | 残题补全 | 博客整理 | 无 | [P4_ibs_2024_blog_题解.md](supplemented/P4_ibs_2024_blog/P4_ibs_2024_blog_题解.md) |
| [P4_olw_2024_blog](supplemented/P4_olw_2024_blog/P4_olw_2024_blog.md) | P4 | 残题补全 | 博客整理 | 无 | [P4_olw_2024_blog_题解.md](supplemented/P4_olw_2024_blog/P4_olw_2024_blog_题解.md) |
| [P4_swmm_2024_blog](P4_swmm_2024_blog/P4_swmm_2024_blog.md) | P4 | 行为完整 | 博客整理 | 无 | [P4_swmm_2024_blog_题解.md](P4_swmm_2024_blog/P4_swmm_2024_blog_题解.md) |
| [P4_swrr_2020_blog](P4_swrr_2020_blog/P4_swrr_2020_blog.md) | P4 | 行为完整 | 博客整理 | 无 | [P4_swrr_2020_blog_题解.md](P4_swrr_2020_blog/P4_swrr_2020_blog_题解.md) |
| [P4_xor_2020_blog](P4_xor_2020_blog/P4_xor_2020_blog.md) | P4 | 行为完整 | 博客整理 | 无 | 无 |
| [P5_L2_bonall_2022](P5_L2_bonall_2022/P5_L2_bonall_2022.md) | P5 | 行为完整 | 课程题库 | [bonall.ts](P5_L2_bonall_2022/bonall.ts) | [bonall.class](P5_L2_bonall_2022/bonall.class) |
| [P5_L3_blztal_2022](P5_L3_blztal_2022/P5_L3_blztal_2022.md) | P5 | 行为完整 | 课程题库 | [blztal.ts](P5_L3_blztal_2022/blztal.ts) | [blztal.class](P5_L3_blztal_2022/blztal.class) |
| [P5_L4_addei_2022](P5_L4_addei_2022/P5_L4_addei_2022.md) | P5 | 行为完整 | 课程题库 | [addei.ts](P5_L4_addei_2022/addei.ts) | [addei.class](P5_L4_addei_2022/addei.class) |
| [P5_L5_lhogez_2022](P5_L5_lhogez_2022/P5_L5_lhogez_2022.md) | P5 | 行为完整 | 课程题库 | [lhogez.ts](P5_L5_lhogez_2022/lhogez.ts) | [lhogez.class](P5_L5_lhogez_2022/lhogez.class) |
| [P5_L6_lbget_2022](P5_L6_lbget_2022/P5_L6_lbget_2022.md) | P5 | 行为完整 | 课程题库 | [lbget.ts](P5_L6_lbget_2022/lbget.ts) | [lbget.class](P5_L6_lbget_2022/lbget.class) |
| [P5-P6_bmel_blog](P5-P6_bmel_blog/P5-P6_bmel_blog.md) | P5-P6 | 行为完整 | 博客整理 | 无 | [P5-P6_bmel_blog_题解.md](P5-P6_bmel_blog/P5-P6_bmel_blog_题解.md) |
| [P5-P6_bnvl_blog](supplemented/P5-P6_bnvl_blog/P5-P6_bnvl_blog.md) | P5-P6 | 残题补全 | 博客整理 | 无 | [P5-P6_bnvl_blog_题解.md](supplemented/P5-P6_bnvl_blog/P5-P6_bnvl_blog_题解.md) |
| [P5-P6_bsnz_blog](P5-P6_bsnz_blog/P5-P6_bsnz_blog.md) | P5-P6 | 行为完整 | 博客整理 | 无 | [P5-P6_bsnz_blog_题解.md](P5-P6_bsnz_blog/P5-P6_bsnz_blog_题解.md) |
| [P5-P6_jsp_blog](P5-P6_jsp_blog/P5-P6_jsp_blog.md) | P5-P6 | 行为完整 | 博客整理 | 无 | [P5-P6_jsp_blog_题解.md](P5-P6_jsp_blog/P5-P6_jsp_blog_题解.md) |
| [P5-P6_jzal_blog](P5-P6_jzal_blog/P5-P6_jzal_blog.md) | P5-P6 | 行为完整 | 博客整理 | 无 | [P5-P6_jzal_blog_题解.md](P5-P6_jzal_blog/P5-P6_jzal_blog_题解.md) |
| [P5-P6_lbnd_blog](P5-P6_lbnd_blog/P5-P6_lbnd_blog.md) | P5-P6 | 行为完整 | 博客整理 | 无 | [P5-P6_lbnd_blog_题解.md](P5-P6_lbnd_blog/P5-P6_lbnd_blog_题解.md) |
| [P5-P6_lwad_blog](P5-P6_lwad_blog/P5-P6_lwad_blog.md) | P5-P6 | 行为完整 | 博客整理 | 无 | [P5-P6_lwad_blog_题解.md](P5-P6_lwad_blog/P5-P6_lwad_blog_题解.md) |
| [P5-P6_lwcmp_blog](P5-P6_lwcmp_blog/P5-P6_lwcmp_blog.md) | P5-P6 | 行为完整 | 博客整理 | 无 | [P5-P6_lwcmp_blog_题解.md](P5-P6_lwcmp_blog/P5-P6_lwcmp_blog_题解.md) |
| [P5-P6_lwse_blog](P5-P6_lwse_blog/P5-P6_lwse_blog.md) | P5-P6 | 行为完整 | 博客整理 | 无 | [P5-P6_lwse_blog_题解.md](P5-P6_lwse_blog/P5-P6_lwse_blog_题解.md) |
| [P5-P6_movp_blog](supplemented/P5-P6_movp_blog/P5-P6_movp_blog.md) | P5-P6 | 残题补全 | 博客整理 | 无 | [P5-P6_movp_blog_题解.md](supplemented/P5-P6_movp_blog/P5-P6_movp_blog_题解.md) |
| [P5-P6_rotp_blog](P5-P6_rotp_blog/P5-P6_rotp_blog.md) | P5-P6 | 行为完整 | 博客整理 | 无 | [P5-P6_rotp_blog_题解.md](P5-P6_rotp_blog/P5-P6_rotp_blog_题解.md) |
| [P5-P6_sloz_blog](P5-P6_sloz_blog/P5-P6_sloz_blog.md) | P5-P6 | 行为完整 | 博客整理 | 无 | [P5-P6_sloz_blog_题解.md](P5-P6_sloz_blog/P5-P6_sloz_blog_题解.md) |
| [P5-P6_xore_blog](P5-P6_xore_blog/P5-P6_xore_blog.md) | P5-P6 | 行为完整 | 博客整理 | 无 | [P5-P6_xore_blog_题解.md](P5-P6_xore_blog/P5-P6_xore_blog_题解.md) |
| [P5_M_lwer_2022](P5_M_lwer_2022/P5_M_lwer_2022.md) | P5 | 行为完整 | 课程题库 | [lwer.ts](P5_M_lwer_2022/lwer.ts) | 无 |
| [P5_addoi_2024_blog](supplemented/P5_addoi_2024_blog/P5_addoi_2024_blog.md) | P5 | 残题补全 | 博客整理 | 无 | [P5_addoi_2024_blog_题解.md](supplemented/P5_addoi_2024_blog/P5_addoi_2024_blog_题解.md) |
| [P5_ae_2024_blog](P5_ae_2024_blog/P5_ae_2024_blog.md) | P5 | 行为完整 | 博客整理 | 无 | [P5_ae_2024_blog_题解.md](P5_ae_2024_blog/P5_ae_2024_blog_题解.md) |
| [P5_bcl_blog](supplemented/P5_bcl_blog/P5_bcl_blog.md) | P5 | 残题补全 | 博客整理 | 无 | [P5_bcl_blog_题解.md](supplemented/P5_bcl_blog/P5_bcl_blog_题解.md) |
| [P5_bgezall_2020_blog](P5_bgezall_2020_blog/P5_bgezall_2020_blog.md) | P5 | 行为完整 | 博客整理 | 无 | [P5_bgezall_2020_blog_题解.md](P5_bgezall_2020_blog/P5_bgezall_2020_blog_题解.md) |
| [P5_blezalc_2020_blog](P5_blezalc_2020_blog/P5_blezalc_2020_blog.md) | P5 | 行为完整 | 博客整理 | 无 | [P5_blezalc_2020_blog_题解.md](P5_blezalc_2020_blog/P5_blezalc_2020_blog_题解.md) |
| [P5_bmoal_2024_blog](P5_bmoal_2024_blog/P5_bmoal_2024_blog.md) | P5 | 行为完整 | 博客整理 | 无 | [P5_bmoal_2024_blog_题解.md](P5_bmoal_2024_blog/P5_bmoal_2024_blog_题解.md) |
| [P5_cco_2020_blog](P5_cco_2020_blog/P5_cco_2020_blog.md) | P5 | 行为完整 | 博客整理 | 无 | [P5_cco_2020_blog_题解.md](P5_cco_2020_blog/P5_cco_2020_blog_题解.md) |
| [P5_cmco_2020_blog](P5_cmco_2020_blog/P5_cmco_2020_blog.md) | P5 | 行为完整 | 博客整理 | 无 | [P5_cmco_2020_blog_题解.md](P5_cmco_2020_blog/P5_cmco_2020_blog_题解.md) |
| [P5_jtl_2024_blog](supplemented/P5_jtl_2024_blog/P5_jtl_2024_blog.md) | P5 | 残题补全 | 博客整理 | 无 | [P5_jtl_2024_blog_题解.md](supplemented/P5_jtl_2024_blog/P5_jtl_2024_blog_题解.md) |
| [P5_lrm_2020_blog](P5_lrm_2020_blog/P5_lrm_2020_blog.md) | P5 | 行为完整 | 博客整理 | 无 | [P5_lrm_2020_blog_题解.md](P5_lrm_2020_blog/P5_lrm_2020_blog_题解.md) |
| [P5_lwoc_2024_blog](P5_lwoc_2024_blog/P5_lwoc_2024_blog.md) | P5 | 行为完整 | 博客整理 | 无 | [P5_lwoc_2024_blog_题解.md](P5_lwoc_2024_blog/P5_lwoc_2024_blog_题解.md) |
| [P5_lwso_2020_blog](supplemented/P5_lwso_2020_blog/P5_lwso_2020_blog.md) | P5 | 残题补全 | 博客整理 | 无 | [P5_lwso_2020_blog_题解.md](supplemented/P5_lwso_2020_blog/P5_lwso_2020_blog_题解.md) |
| [P5_swc_2021_blog](P5_swc_2021_blog/P5_swc_2021_blog.md) | P5 | 行为完整 | 博客整理 | 无 | 无 |
| [P5_xe_2024_blog](supplemented/P5_xe_2024_blog/P5_xe_2024_blog.md) | P5 | 残题补全 | 博客整理 | 无 | [P5_xe_2024_blog_题解.md](supplemented/P5_xe_2024_blog/P5_xe_2024_blog_题解.md) |
| [P6_L1_bds_2022](P6_L1_bds_2022/P6_L1_bds_2022.md) | P6 | 行为完整 | 课程题库 | [bds.ts](P6_L1_bds_2022/bds.ts) | [bds.class](P6_L1_bds_2022/bds.class) |
| [P6_L2_bezal_2022](P6_L2_bezal_2022/P6_L2_bezal_2022.md) | P6 | 行为完整 | 课程题库 | [bezal.ts](P6_L2_bezal_2022/bezal.ts) | [bezal.class](P6_L2_bezal_2022/bezal.class) |
| [P6_L4_jap_2022](P6_L4_jap_2022/P6_L4_jap_2022.md) | P6 | 行为完整 | 课程题库 | [jap.ts](P6_L4_jap_2022/jap.ts) | [jap.class](P6_L4_jap_2022/jap.class) |
| [P6_bds_2021_blog](supplemented/P6_bds_2021_blog/P6_bds_2021_blog.md) | P6 | 残题补全 | 博客整理 | 无 | [P6_bds_2021_blog_题解.md](supplemented/P6_bds_2021_blog/P6_bds_2021_blog_题解.md) |
| [P6_bezal_2021_blog](P6_bezal_2021_blog/P6_bezal_2021_blog.md) | P6 | 行为完整 | 博客整理 | 无 | [P6_bezal_2021_blog_题解.md](P6_bezal_2021_blog/P6_bezal_2021_blog_题解.md) |
| [P6_bgezalr_2020_blog](P6_bgezalr_2020_blog/P6_bgezalr_2020_blog.md) | P6 | 行为完整 | 博客整理 | 无 | [P6_bgezalr_2020_blog_题解.md](P6_bgezalr_2020_blog/P6_bgezalr_2020_blog_题解.md) |
| [P6_btd_2024_blog](P6_btd_2024_blog/P6_btd_2024_blog.md) | P6 | 行为完整 | 博客整理 | 无 | [P6_btd_2024_blog_题解.md](P6_btd_2024_blog/P6_btd_2024_blog_题解.md) |
| [P6_crt_2024_blog](P6_crt_2024_blog/P6_crt_2024_blog.md) | P6 | 行为完整 | 博客整理 | 无 | [P6_crt_2024_blog_题解.md](P6_crt_2024_blog/P6_crt_2024_blog_题解.md) |
| [P6_fmultu_2024_blog](P6_fmultu_2024_blog/P6_fmultu_2024_blog.md) | P6 | 行为完整 | 博客整理 | 无 | [P6_fmultu_2024_blog_题解.md](P6_fmultu_2024_blog/P6_fmultu_2024_blog_题解.md) |
| [P6_jmv_2024_blog](P6_jmv_2024_blog/P6_jmv_2024_blog.md) | P6 | 行为完整 | 博客整理 | 无 | [P6_jmv_2024_blog_题解.md](P6_jmv_2024_blog/P6_jmv_2024_blog_题解.md) |
| [P6_lhs_2020_blog](P6_lhs_2020_blog/P6_lhs_2020_blog.md) | P6 | 行为完整 | 博客整理 | 无 | [P6_lhs_2020_blog_题解.md](P6_lhs_2020_blog/P6_lhs_2020_blog_题解.md) |
| [P6_lpx_2024_blog](supplemented/P6_lpx_2024_blog/P6_lpx_2024_blog.md) | P6 | 残题补全 | 博客整理 | 无 | [P6_lpx_2024_blog_题解.md](supplemented/P6_lpx_2024_blog/P6_lpx_2024_blog_题解.md) |
| [P6_lwc_2024_blog](P6_lwc_2024_blog/P6_lwc_2024_blog.md) | P6 | 行为完整 | 博客整理 | 无 | [P6_lwc_2024_blog_题解.md](P6_lwc_2024_blog/P6_lwc_2024_blog_题解.md) |
| [P6_lwm_2024_blog](P6_lwm_2024_blog/P6_lwm_2024_blog.md) | P6 | 行为完整 | 博客整理 | 无 | [P6_lwm_2024_blog_题解.md](P6_lwm_2024_blog/P6_lwm_2024_blog_题解.md) |
| [P6_lwmx_2021_blog](P6_lwmx_2021_blog/P6_lwmx_2021_blog.md) | P6 | 行为完整 | 博客整理 | 无 | [P6_lwmx_2021_blog_题解.md](P6_lwmx_2021_blog/P6_lwmx_2021_blog_题解.md) |
| [P6_lwz_2024_blog](supplemented/P6_lwz_2024_blog/P6_lwz_2024_blog.md) | P6 | 残题补全 | 博客整理 | 无 | [P6_lwz_2024_blog_题解.md](supplemented/P6_lwz_2024_blog/P6_lwz_2024_blog_题解.md) |
| [P6_msub_2020_blog](P6_msub_2020_blog/P6_msub_2020_blog.md) | P6 | 行为完整 | 博客整理 | 无 | [P6_msub_2020_blog_题解.md](P6_msub_2020_blog/P6_msub_2020_blog_题解.md) |
| [P6_sbc_2024_blog](P6_sbc_2024_blog/P6_sbc_2024_blog.md) | P6 | 行为完整 | 博客整理 | 无 | [P6_sbc_2024_blog_题解.md](P6_sbc_2024_blog/P6_sbc_2024_blog_题解.md) |
| [P6_shl_2022_blog](P6_shl_2022_blog/P6_shl_2022_blog.md) | P6 | 行为完整 | 博客整理 | 无 | [P6_shl_2022_blog_题解.md](P6_shl_2022_blog/P6_shl_2022_blog_题解.md) |
| [P6_shl_hack](P6_shl_hack/P6_shl_hack.md) | P6 | 行为完整 | 课程题库 | [shl.ts](P6_shl_hack/shl.ts) | 无 |
| [P6_wtd_2024_blog](P6_wtd_2024_blog/P6_wtd_2024_blog.md) | P6 | 行为完整 | 博客整理 | 无 | [P6_wtd_2024_blog_题解.md](P6_wtd_2024_blog/P6_wtd_2024_blog_题解.md) |
| [P7_CP0内存限制异常_2024_blog](P7_CP0内存限制异常_2024_blog/P7_CP0内存限制异常_2024_blog.md) | P7 | 行为完整 | 博客整理 | 无 | [P7_CP0内存限制异常_2024_blog_题解.md](P7_CP0内存限制异常_2024_blog/P7_CP0内存限制异常_2024_blog_题解.md) |
| [P7_Watch异常_2024_blog](supplemented/P7_Watch异常_2024_blog/P7_Watch异常_2024_blog.md) | P7 | 残题补全 | 博客整理 | 无 | [P7_Watch异常_2024_blog_题解.md](supplemented/P7_Watch异常_2024_blog/P7_Watch异常_2024_blog_题解.md) |
| [P7_lww_2024_blog](supplemented/P7_lww_2024_blog/P7_lww_2024_blog.md) | P7 | 残题补全 | 博主自拟资料（非考题） | 无 | [P7_lww_2024_blog_题解.md](supplemented/P7_lww_2024_blog/P7_lww_2024_blog_题解.md) |
| [P7_tltiu_2021_blog](P7_tltiu_2021_blog/P7_tltiu_2021_blog.md) | P7 | 行为完整 | 博客整理 | 无 | [P7_tltiu_2021_blog_题解.md](P7_tltiu_2021_blog/P7_tltiu_2021_blog_题解.md) |
| [P7_withdraw_2024_blog](supplemented/P7_withdraw_2024_blog/P7_withdraw_2024_blog.md) | P7 | 残题补全 | 博客整理 | 无 | [P7_withdraw_2024_blog_题解.md](supplemented/P7_withdraw_2024_blog/P7_withdraw_2024_blog_题解.md) |


## 博客来源题目（`*_blog`）

本仓库共有93个博客条目：59个原本行为完整的条目放在根目录，另34个条目已补齐必要条件，作为[残题补全](supplemented/README.md)练习存放于 `supplemented/`。补全题的新增规则集中列在“补充条件”中，题解与规则同步；来源、校勘及原始资料记录存放于各目录的隐藏文件 `.exercise.json`。

- 目录命名：加指令题 `P?_<指令名>_<年份>_blog`；非加指令题 `P?_<内容概述>_<年份>_blog`；年份无法确定的省略。保留 `Pre` 和来源未分清的 `P5-P6` 阶段，不强行改为单一阶段。
- **不提供 TS 脚本与 `.class` 附件**：博客只留下题面/回忆，没有课程组原始附件；请按题面自行设计 CPU 改动。
- 同一题的题解另存为同目录 `<目录名>_题解.md`（有则存在）。
- 编码图中的操作数默认采用 rs=`25..21`、rt=`20..16`、rd=`15..11`、立即数=`15..0`；未知 opcode/funct 及其他未知位以等宽 `x` 表示，已知字段和固定位保留。操作记号按 MIPS Vol. II 及非 blog 官方题统一，见[题面编辑规范](.agents/docs/blog-statement-style.md)。
- 原来用功能描述命名的指令改用助记符，例如 `bcl`、`movp`、`bnvl`；目录、题面、题解和格式同步。名称及释义见[命名表](.agents/docs/residual-completion.md#新助记符)。
- “残题补全”表示在原有片段上补充练习规则，区别于直接整理的完整博客题；新增条件及补全日期另存于 `.exercise.json.completion`。
- `P7_lww_2024_blog` 是原博主自行提出的变体，**不是2024年考题记录**；现作为残题补全练习保存，其自拟身份继续保留。
- 管理页面可按阶段、课程题库、原完整博客题或残题补全筛选，支持查看、编辑和管理题解附件。编辑状态可在根目录与 `supplemented/` 之间移动整题，脚本字段可留空。
- P6 的 2022 年原创题（`bds`、`bezal`、`jap`、`shl`）已按课程题库收录，与同名的博客整理条目并存；编码和语义以原创题面与 `.class` 为准，博客条目保留原有出处与补全记录。
