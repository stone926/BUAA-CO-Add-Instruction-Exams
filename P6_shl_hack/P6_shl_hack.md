# P6_shl_hack

> 项目：P6 ｜ 题目 ID：1095 ｜ 来源 PieId：1398 ｜ 类型：文件上传

<table style="border-collapse:collapse; width: 500pt;">
        <tr>
          <td id="td-head" rowspan="3">
      编码
     </td>
          <td id="td-opcode-top">
            <span style="float: left;">
       31
      </span>
            <span style="float: right;">
       26
      </span>
          </td>
          <td id="td-rs-top">
            <span style="float: left;">
       25
      </span>
            <span style="float: right;">
       21
      </span>
          </td>
          <td id="td-rt-top">
            <span style="float: left;">
       20
      </span>
            <span style="float: right;">
       16
      </span>
          </td>
          <td id="td-rd-top">
            <span style="float: left;">
       15
      </span>
            <span style="float: right;">
       11
      </span>
          </td>
          <td id="td-shamt-top">
            <span style="float: left;">
       10
      </span>
            <span style="float: right;">
       6
      </span>
          </td>
          <td id="td-func-top">
            <span style="float: left;">
       5
      </span>
            <span style="float: right;">
       0
      </span>
          </td>
        </tr>
        <tr>
          <td id="td-opcode">
            SPECIAL<br/> 000000
     </td>
          <td id="td-rs">
      00000
     </td>
          <td id="td-rt">
      00000
     </td>
          <td id="td-rd">
      00000
     </td>
          <td id="td-shamt">
      00000
     </td>
          <td id="td-func">
      shl
      <br/>
      111100
     </td>
        </tr>
        <tr>
          <td id="td-opcode-bottom">
      6
     </td>
          <td id="td-rs-bottom">
      5
     </td>
          <td id="td-rt-bottom">
      5
     </td>
          <td id="td-rd-bottom">
      5
     </td>
          <td id="td-shamt-bottom">
      5
     </td>
          <td id="td-func-bottom">
      6
     </td>
        </tr>
        <tr>
          <td id="td-head">
      格式
     </td>
          <td colspan="6">
            <p id="p-code">
       shl
      </p>
          </td>
        </tr>
        <tr>
          <td id="td-head">
      描述
     </td>
          <td colspan="6">
            <p id="p-code">
       交换乘除法单元中的hi和lo
      </p>
          </td>
        </tr>
        <tr>
          <td id="td-head">
      操作
     </td>
          <td colspan="6">
            <p id="p-code"> temp ← hi </p>
            <p id="p-code"> hi ← lo </p>
      		<p id="p-code"> lo ← temp </p>
          </td>
        </tr>
        <tr>
          <td id="td-head">
      示例
     </td>
          <td colspan="6">
            <p id="p-code">
       shl
      </p>
          </td>
        </tr>
        <tr>
          <td id="td-head">
      其他
     </td>
          <td colspan="6">
            <p id="p-text">
              在进行乘/除法之后的五/十个周期内，不能对hi和lo寄存器进行任何读写操作<br/>
      </p>
          </td>
        </tr>
      </table>
