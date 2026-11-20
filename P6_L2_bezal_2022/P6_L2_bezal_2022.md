# P6_L2_bezal_2022

> 项目：P6 ｜ 题目 ID：1036 ｜ 来源 PieId：1398 ｜ 类型：文件上传

<table style="border-collapse:collapse; width: 500pt;">
    <tr>
        <td id="td-head" rowspan="3">
            编码
        </td>
        <td id="td-opcode-top">
            <span style="float: left;">31</span>
            <span style="float: right;">26</span>
        </td>
        <td id="td-rs-top">
            <span style="float: left;">25</span>
            <span style="float: right;">21</span>
        </td>
        <td id="td-rt-top">
            <span style="float: left;">20</span>
            <span style="float: right;">16</span>
        </td>
        <td id="td-rd-top">
            <span style="float: left;">15</span>
            <span style="float: right;">11</span>
        </td>
        <td id="td-shamt-top">
            <span style="float: left;">10</span>
            <span style="float: right;">6</span>
        </td>
        <td id="td-func-top">
            <span style="float: left;">5</span>
            <span style="float: right;">0</span>
        </td>
    </tr>
    <tr>
        <td id="td-opcode">
            SPECIAL<br/>
            000000
        </td>
        <td id="td-rs">
            rs
        </td>
        <td id="td-rt">
            rt
        </td>
        <td id="td-rd">
          0<br/>00000
        </td>
        <td id="td-shamt">
            0<br/>00000
        </td>
        <td id="td-func">
            BEZAL<br/>
            110001
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
                bezal rs,rt
            </p>
        </td>
    </tr>
    <tr>
        <td id="td-head">
            描述
        </td>
        <td colspan="6">
            <p id="p-code">若GPR[rt]==0，跳转到GPR[rs]并link</p>
        </td>
    </tr>
    <tr>
        <td id="td-head">
            操作
        </td>
        <td colspan="6">
            <p id="p-code">I :</p>
            <p id="p-code" style="text-indent: 2em">Condition ← GPR[rt] = 0</p>
            <p id="p-code" style="text-indent: 2em">temp ← GPR[rs]</p>
        	<p id="p-code" style="text-indent: 2em">If Condition :</p>
            <p id="p-code" style="text-indent: 4em">GPR[31] ← PC + 8</p>
        	<p id="p-code" style="text-indent: 2em">endif</p>
            <p id="p-code">I + 1 :</p>
        	<p id="p-code" style="text-indent: 2em">If Condition :</p>
        	<p id="p-code" style="text-indent: 4em">PC ← temp</p>
        	<p id="p-code" style="text-indent: 2em">endif</p>
        </td>
    </tr>
    <tr>
        <td id="td-head">
            示例
        </td>
        <td colspan="6">
            <p id="p-code">
                bezal $t1,$t2
            </p>
        </td>
    </tr>
    <tr>
        <td id="td-head">
            其他
        </td>
        <td colspan="6">
            <p id="p-text">
                注意延迟槽
            </p>
        </td>
    </tr>
	</table>
