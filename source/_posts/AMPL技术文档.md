---
title: AMPL技术文档
date: 2026-09-15
categories: 技术文档
tags:
    - 数学建模
    - ampl
excerpt: "小众而又古老，就一定没有价值吗？"
---

## 介绍

AMPL（A Mathematical Programming Language）是**代数建模语言**，专门用来描述、求解数学优化（数学规划）问题，读音 "ample"，由贝尔实验室 Robert Fourer、David Gay、Brian Kernighan 在 1985 年开发，现在由 AMPL Optimization 公司维护。

### 特点

1. 语法贴近数学公式
    可以直接把数学规划写成代码，可读性强，不用手动写复杂的矩阵。模型文件后缀 `.mod`；数据单独放在 `.dat`，实现模型与数据分离，更换场景只改数据，不用重写目标函数与约束。
2. 求解器无关
    AMPL 本身不做求解计算，它只负责把模型翻译成标准格式，交给外部求解器。支持几乎所有主流求解器：
    - 商业：
      - Gurobi
      - CPLEX
      - MOSEK
      - KNITRO
      - BARON
      - Xpress
    - 开源：
      - HIGHS
      - CBC
      - IPOPT
      - MINOS
      - SNOPT
    同一套模型，切换求解器只需要改一行配置，不用改写模型代码。
3. 支持各类优化问题
    线性规划 LP、整数规划 MIP、非线性规划 NLP、混合整数非线性 MINLP、全局优化、随机规划等；内置集合、索引、元组，非常适合供应链、调度、能源、生产计划这类大规模索引型优化问题。
4. 丰富接口
    有 `amplpy` Python API，可以在 Python 里调用 AMPL，对接数据分析流水线；也有 R 接口；VS Code 有 AMPL 插件；学术用途可申请免费学术许可，社区版可以搭配开源求解器免费使用。

### 项目结构

- `.mod`：模型定义
- `.dat`：数据
- `.run`：运行脚本

## 使用

### 全局安装AMPL本体

#### 用vscode运行

1. 从官网下载AMPL本体。
2. 申请社区许可或学术许可。
3. 安装AMPL Optimization Inc. 出品的vscode官方插件。
4. 配置插件里 AMPL 可执行文件路径。
5. 在vscode中编写并运行。

#### 用AMPL CLI运行

```bash
# 进入AMPL命令行
apml
```

```ampl
ampl: model model.mod;
ampl: data data.dat;
ampl: solve;
ampl: display x;
```

或直接执行`ampl model.mod`进行求解。

### 用python安装并执行

```bash
pip install amplpy
# 安装开源求解器HiGHS(也可安装cbc等)
python -m amplpy.modules install highs cbc
```

> [!NOTE]
> amplpy会自动拉去AMPL社区版CE许可，永久免费，无约束，但需要联网使用。

创建`model.mod`,`data.dat`,`run.py`文件，在`run.py`中写入：

```python
from amplpy import AMPL
ampl = AMPL()
ampl.read("model.mod")
ampl.read_data("data.dat")
ampl.solve()
```

`model.mod`示例：

```apml
var x1;
var x2;
var x3;
minimize Myobj: x1-2*x2+x3;
subject to Con1: x1+ x2-2*x3 <= 10;
subject to Con2: 2*x1-x2+4*x3 <= 8;
subject to Con3: -1*x1 + 2*x2 - 4*x3 <= 4;
subject to Con4: x1 >= 0;
subject to Con5: x2 >= 0;
subject to Con6: x3 >= 0;
option solver highs;
objective Myobj;
solve;
display x1,x2,x3;
```

写好`model.mod`和`data.dat`之后就可以运行`run.py`进行求解了。

> [!IMPORTANT]
> `model.mod`中的`solve;`和`run.py`中的`ampl.solve()`会进行重复求解，根据需要保留一处即可。如果需要进行复杂的循环求解，建议在`run.py`中进行。

> 在python中也可直接编写并运行AMPL：
>
> ```python
> from amplpy import AMPL
> ampl = AMPL()
> ampl.eval("""
> var x >=0;
> minimize obj: x;
> subject to c: x >= 10;
> solve;
> display x;
> """)
> ```

### 在线运行

使用Google Colab在线运行。
