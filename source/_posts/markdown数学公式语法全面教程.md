---
title: markdown数学公式语法全面教程
date: 2026-07-30
tags: 
  - 转载
  - 技术文档
---

本教程覆盖 LaTeX 数学语法在 Markdown 中的完整用法，适用于 GitHub、Jupyter Notebook、Typora、Obsidian、MathJax、KaTeX 等主流渲染环境。

---

## 目录

1. [基础语法：行内公式与块级公式](#1-基础语法行内公式与块级公式)
2. [数字与基本运算](#2-数字与基本运算)
3. [上标与下标](#3-上标与下标)
4. [分数](#4-分数)
5. [根号](#5-根号)
6. [求和、积分与极限](#6-求和积分与极限)
7. [矩阵与行列式](#7-矩阵与行列式)
8. [希腊字母](#8-希腊字母)
9. [数学运算符与关系符](#9-数学运算符与关系符)
10. [括号与定界符](#10-括号与定界符)
11. [多行公式与对齐](#11-多行公式与对齐)
12. [分段函数](#12-分段函数)
13. [集合与逻辑符号](#13-集合与逻辑符号)
14. [箭头符号](#14-箭头符号)
15. [字体与样式](#15-字体与样式)
16. [空格与间距](#16-空格与间距)
17. [颜色（MathJax/KaTeX）](#17-颜色mathjaxkatex)
18. [常用公式速查表](#18-常用公式速查表)

---

## 1. 基础语法：行内公式与块级公式

### 行内公式（Inline）

用单个美元符号 `$...$` 包裹，公式嵌入文字中：

```markdown
质能方程为 $E = mc^2$，其中 $c$ 是光速。
```

渲染效果：质能方程为 $E = mc^2$，其中 $c$ 是光速。

### 块级公式（Display）

用双美元符号 `$$...$$` 包裹，公式独占一行并居中：

```markdown
$$
E = mc^2
$$
```

渲染效果：

$$
E = mc^2
$$

> **注意**：部分平台（如 GitHub）需要在 `$$` 前后各留一个空行。

---

## 2. 数字与基本运算

| 运算 | 语法 | 效果 |
|------|------|------|
| 加法 | `$a + b$` | $a + b$ |
| 减法 | `$a - b$` | $a - b$ |
| 乘法（点） | `$a \cdot b$` | $a \cdot b$ |
| 乘法（叉） | `$a \times b$` | $a \times b$ |
| 除法 | `$a \div b$` | $a \div b$ |
| 正负号 | `$\pm a$` | $\pm a$ |
| 负正号 | `$\mp a$` | $\mp a$ |

---

## 3. 上标与下标

### 上标（Superscript）

```markdown
$x^2$        % 单字符上标
$x^{10}$     % 多字符上标（必须用花括号）
$e^{i\pi}$   % 复合上标
```

效果：$x^2$，$x^{10}$，$e^{i\pi}$

### 下标（Subscript）

```markdown
$x_1$        % 单字符下标
$x_{10}$     % 多字符下标
$a_{ij}$     % 双下标
```

效果：$x_1$，$x_{10}$，$a_{ij}$

### 上下标组合

```markdown
$x_i^2$
$\sum_{i=1}^{n}$
$x_{i_j}^{k^2}$
```

效果：$x_i^2$，$\sum_{i=1}^{n}$，$x_{i_j}^{k^2}$

---

## 4. 分数

### 基本分数 `\frac`

```markdown
$\frac{a}{b}$
$\frac{x^2 + 1}{2x - 3}$
```

效果：$\frac{a}{b}$，$\frac{x^2 + 1}{2x - 3}$

### 行内小分数 `\tfrac`

```markdown
$\tfrac{1}{2}$
```

效果：$\tfrac{1}{2}$（比 `\frac` 更紧凑，适合行内）

### 大号分数 `\dfrac`

```markdown
$$\dfrac{1}{2}$$
```

效果（块级）：

$$\dfrac{1}{2}$$

### 连分数

```markdown
$$
x = a_0 + \cfrac{1}{a_1 + \cfrac{1}{a_2 + \cfrac{1}{a_3}}}
$$
```

效果：

$$
x = a_0 + \cfrac{1}{a_1 + \cfrac{1}{a_2 + \cfrac{1}{a_3}}}
$$

### 二项式系数

```markdown
$\binom{n}{k}$
$\dbinom{n}{k}$
```

效果：$\binom{n}{k}$，$\dbinom{n}{k}$

---

## 5. 根号

```markdown
$\sqrt{x}$           % 平方根
$\sqrt[3]{x}$        % 立方根
$\sqrt[n]{x^2 + y^2} % n次根
```

效果：$\sqrt{x}$，$\sqrt[3]{x}$，$\sqrt[n]{x^2 + y^2}$

---

## 6. 求和、积分与极限

### 求和 `\sum`

```markdown
$\sum_{i=1}^{n} i$

$$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$$
```

效果：

$$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$$

### 连乘 `\prod`

```markdown
$$\prod_{i=1}^{n} i = n!$$
```

效果：

$$\prod_{i=1}^{n} i = n!$$

### 积分

| 类型 | 语法 | 效果 |
|------|------|------|
| 不定积分 | `$\int f(x)\,dx$` | $\int f(x)\,dx$ |
| 定积分 | `$\int_a^b f(x)\,dx$` | $\int_a^b f(x)\,dx$ |
| 二重积分 | `$\iint_D f\,dA$` | $\iint_D f\,dA$ |
| 三重积分 | `$\iiint_V f\,dV$` | $\iiint_V f\,dV$ |
| 曲线积分 | `$\oint_C f\,ds$` | $\oint_C f\,ds$ |

块级定积分示例：

```markdown
$$
\int_0^{\infty} e^{-x^2}\,dx = \frac{\sqrt{\pi}}{2}
$$
```

$$
\int_0^{\infty} e^{-x^2}\,dx = \frac{\sqrt{\pi}}{2}$$

### 极限 `\lim`

```markdown
$\lim_{x \to 0} \frac{\sin x}{x} = 1$

$$\lim_{n \to \infty} \left(1 + \frac{1}{n}\right)^n = e$$
```

效果：

$$\lim_{n \to \infty} \left(1 + \frac{1}{n}\right)^n = e$$

### 导数与偏导数

```markdown
$f'(x)$                    % 一阶导
$f''(x)$                   % 二阶导
$\frac{dy}{dx}$            % 莱布尼茨记法
$\frac{d^2y}{dx^2}$        % 二阶导
$\frac{\partial f}{\partial x}$   % 偏导数
$\nabla f$                 % 梯度
```

效果：$f'(x)$，$\frac{dy}{dx}$，$\frac{\partial f}{\partial x}$，$\nabla f$

---

## 7. 矩阵与行列式

### 基本矩阵（无括号）

```markdown
$$
\begin{matrix}
a & b \\
c & d
\end{matrix}
$$
```

$$
\begin{matrix}
a & b \\
c & d
\end{matrix}
$$

### 圆括号矩阵 `pmatrix`

```markdown
$$
\begin{pmatrix}
1 & 2 & 3 \\
4 & 5 & 6 \\
7 & 8 & 9
\end{pmatrix}
$$
```

$$
\begin{pmatrix}
1 & 2 & 3 \\
4 & 5 & 6 \\
7 & 8 & 9
\end{pmatrix}
$$

### 方括号矩阵 `bmatrix`

```markdown
$$
\mathbf{A} = \begin{bmatrix}
a_{11} & a_{12} \\
a_{21} & a_{22}
\end{bmatrix}
$$
```

$$
\mathbf{A} = \begin{bmatrix}
a_{11} & a_{12} \\
a_{21} & a_{22}
\end{bmatrix}
$$

### 行列式 `vmatrix`

```markdown
$$
\det(A) = \begin{vmatrix}
a & b \\
c & d
\end{vmatrix} = ad - bc
$$
```

$$
\det(A) = \begin{vmatrix}
a & b \\
c & d
\end{vmatrix} = ad - bc
$$

### 矩阵类型汇总

| 环境 | 括号类型 |
|------|---------|
| `matrix` | 无括号 |
| `pmatrix` | 圆括号 `()` |
| `bmatrix` | 方括号 `[]` |
| `Bmatrix` | 花括号 `{}` |
| `vmatrix` | 单竖线 `\|` |
| `Vmatrix` | 双竖线 `‖` |

### 省略号

```markdown
$$
\begin{pmatrix}
a_{11} & \cdots & a_{1n} \\
\vdots & \ddots & \vdots \\
a_{m1} & \cdots & a_{mn}
\end{pmatrix}
$$
```

$$
\begin{pmatrix}
a_{11} & \cdots & a_{1n} \\
\vdots & \ddots & \vdots \\
a_{m1} & \cdots & a_{mn}
\end{pmatrix}
$$

---

## 8. 希腊字母

### 小写希腊字母

| 字母 | 语法 | 字母 | 语法 |
|------|------|------|------|
| $\alpha$ | `\alpha` | $\nu$ | `\nu` |
| $\beta$ | `\beta` | $\xi$ | `\xi` |
| $\gamma$ | `\gamma` | $o$ | `o` |
| $\delta$ | `\delta` | $\pi$ | `\pi` |
| $\epsilon$ | `\epsilon` | $\rho$ | `\rho` |
| $\varepsilon$ | `\varepsilon` | $\sigma$ | `\sigma` |
| $\zeta$ | `\zeta` | $\tau$ | `\tau` |
| $\eta$ | `\eta` | $\upsilon$ | `\upsilon` |
| $\theta$ | `\theta` | $\phi$ | `\phi` |
| $\vartheta$ | `\vartheta` | $\varphi$ | `\varphi` |
| $\iota$ | `\iota` | $\chi$ | `\chi` |
| $\kappa$ | `\kappa` | $\psi$ | `\psi` |
| $\lambda$ | `\lambda` | $\omega$ | `\omega` |
| $\mu$ | `\mu` | | |

### 大写希腊字母

| 字母 | 语法 | 字母 | 语法 |
|------|------|------|------|
| $\Gamma$ | `\Gamma` | $\Sigma$ | `\Sigma` |
| $\Delta$ | `\Delta` | $\Upsilon$ | `\Upsilon` |
| $\Theta$ | `\Theta` | $\Phi$ | `\Phi` |
| $\Lambda$ | `\Lambda` | $\Psi$ | `\Psi` |
| $\Xi$ | `\Xi` | $\Omega$ | `\Omega` |
| $\Pi$ | `\Pi` | | |

---

## 9. 数学运算符与关系符

### 比较关系

| 符号 | 语法 | 符号 | 语法 |
|------|------|------|------|
| $=$ | `=` | $\neq$ | `\neq` |
| $<$ | `<` | $>$ | `>` |
| $\leq$ | `\leq` | $\geq$ | `\geq` |
| $\ll$ | `\ll` | $\gg$ | `\gg` |
| $\approx$ | `\approx` | $\equiv$ | `\equiv` |
| $\sim$ | `\sim` | $\simeq$ | `\simeq` |
| $\propto$ | `\propto` | $\cong$ | `\cong` |

### 二元运算符

| 符号 | 语法 | 符号 | 语法 |
|------|------|------|------|
| $\oplus$ | `\oplus` | $\otimes$ | `\otimes` |
| $\cup$ | `\cup` | $\cap$ | `\cap` |
| $\vee$ | `\vee` | $\wedge$ | `\wedge` |
| $\circ$ | `\circ` | $\bullet$ | `\bullet` |
| $\ast$ | `\ast` | $\star$ | `\star` |

### 取整符号

```markdown
$\lfloor x \rfloor$    % 向下取整
$\lceil x \rceil$      % 向上取整
$\lfloor \frac{n}{2} \rfloor$
```

效果：$\lfloor x \rfloor$，$\lceil x \rceil$

---

## 10. 括号与定界符

### 自动缩放括号（推荐）

使用 `\left` 和 `\right` 让括号自动适应内容大小：

```markdown
$$
\left( \frac{a}{b} \right)
\left[ \frac{x^2}{y} \right]
\left\{ \frac{1}{n} \right\}
\left| x \right|
\left\| \mathbf{v} \right\|
$$
```

$$
\left( \frac{a}{b} \right)
\left[ \frac{x^2}{y} \right]
\left\{ \frac{1}{n} \right\}
\left| x \right|
\left\| \mathbf{v} \right\|
$$

### 手动指定大小

```markdown
$\big( \Big( \bigg( \Bigg($
```

效果：$\big( \Big( \bigg( \Bigg($

### 单侧括号（用 `.` 表示空）

```markdown
$$
\left. \frac{dy}{dx} \right|_{x=0}
$$
```

$$
\left. \frac{dy}{dx} \right|_{x=0}
$$

---

## 11. 多行公式与对齐

### `align` 环境（按 `&` 对齐）

```markdown
$$
\begin{align}
f(x) &= x^2 + 2x + 1 \\
     &= (x + 1)^2
\end{align}
$$
```

$$
\begin{align}
f(x) &= x^2 + 2x + 1 \\
     &= (x + 1)^2
\end{align}
$$

### 多列对齐

```markdown
$$
\begin{align}
x &= 1 & y &= 2 \\
a &= 3 & b &= 4
\end{align}
$$
```

$$
\begin{align}
x &= 1 & y &= 2 \\
a &= 3 & b &= 4
\end{align}
$$

### `aligned`（嵌入行内）

```markdown
$$
f(x) = \begin{aligned}
&x^2 + 1 & (x > 0) \\
&-x^2 - 1 & (x \leq 0)
\end{aligned}
$$
```

$$
f(x) = \begin{aligned}
&x^2 + 1 & (x > 0) \\
&-x^2 - 1 & (x \leq 0)
\end{aligned}
$$

### `gather`（每行居中，无对齐）

```markdown
$$
\begin{gather}
a + b = c \\
x^2 + y^2 = r^2
\end{gather}
$$
```

$$
\begin{gather}
a + b = c \\
x^2 + y^2 = r^2
\end{gather}
$$

### 公式编号（部分平台支持）

```markdown
$$
E = mc^2 \tag{1}
$$
```

$$
E = mc^2 \tag{1}
$$

---

## 12. 分段函数

### `cases` 环境

```markdown
$$
f(x) = \begin{cases}
x^2 & \text{if } x \geq 0 \\
-x  & \text{if } x < 0
\end{cases}
$$
```

$$
f(x) = \begin{cases}
x^2 & \text{if } x \geq 0 \\
-x  & \text{if } x < 0
\end{cases}
$$

### 复杂分段函数

```markdown
$$
|x| = \begin{cases}
 x  & x > 0 \\
 0  & x = 0 \\
-x  & x < 0
\end{cases}
$$
```

$$
|x| = \begin{cases}
 x  & x > 0 \\
 0  & x = 0 \\
-x  & x < 0
\end{cases}
$$

---

## 13. 集合与逻辑符号

### 集合符号

| 符号 | 语法 | 含义 |
|------|------|------|
| $\in$ | `\in` | 属于 |
| $\notin$ | `\notin` | 不属于 |
| $\subset$ | `\subset` | 真子集 |
| $\subseteq$ | `\subseteq` | 子集 |
| $\supset$ | `\supset` | 真超集 |
| $\supseteq$ | `\supseteq` | 超集 |
| $\cup$ | `\cup` | 并集 |
| $\cap$ | `\cap` | 交集 |
| $\setminus$ | `\setminus` | 差集 |
| $\emptyset$ | `\emptyset` | 空集 |
| $\varnothing$ | `\varnothing` | 空集（另一种） |

### 常用数集

```markdown
$\mathbb{N}$   % 自然数
$\mathbb{Z}$   % 整数
$\mathbb{Q}$   % 有理数
$\mathbb{R}$   % 实数
$\mathbb{C}$   % 复数
```

效果：$\mathbb{N}$，$\mathbb{Z}$，$\mathbb{Q}$，$\mathbb{R}$，$\mathbb{C}$

### 逻辑符号

| 符号 | 语法 | 含义 |
|------|------|------|
| $\forall$ | `\forall` | 任意 |
| $\exists$ | `\exists` | 存在 |
| $\nexists$ | `\nexists` | 不存在 |
| $\neg$ | `\neg` | 非 |
| $\land$ | `\land` | 与（AND） |
| $\lor$ | `\lor` | 或（OR） |
| $\Rightarrow$ | `\Rightarrow` | 蕴含 |
| $\Leftrightarrow$ | `\Leftrightarrow` | 等价 |
| $\therefore$ | `\therefore` | 因此 |
| $\because$ | `\because` | 因为 |

---

## 14. 箭头符号

| 符号 | 语法 | 符号 | 语法 |
|------|------|------|------|
| $\to$ | `\to` | $\gets$ | `\gets` |
| $\rightarrow$ | `\rightarrow` | $\leftarrow$ | `\leftarrow` |
| $\Rightarrow$ | `\Rightarrow` | $\Leftarrow$ | `\Leftarrow` |
| $\leftrightarrow$ | `\leftrightarrow` | $\Leftrightarrow$ | `\Leftrightarrow` |
| $\uparrow$ | `\uparrow` | $\downarrow$ | `\downarrow` |
| $\nearrow$ | `\nearrow` | $\searrow$ | `\searrow` |
| $\mapsto$ | `\mapsto` | $\longmapsto$ | `\longmapsto` |
| $\hookrightarrow$ | `\hookrightarrow` | $\rightharpoonup$ | `\rightharpoonup` |

### 带文字的箭头

```markdown
$\xrightarrow{f}$
$\xrightarrow[下方]{上方}$
$\xleftarrow{n \to \infty}$
```

效果：$\xrightarrow{f}$，$\xrightarrow[下方]{上方}$，$\xleftarrow{n \to \infty}$

---

## 15. 字体与样式

### 数学字体

| 效果 | 语法 | 示例 |
|------|------|------|
| 粗体 | `\mathbf{A}` | $\mathbf{A}$ |
| 斜体（默认） | `\mathit{x}` | $\mathit{x}$ |
| 罗马体 | `\mathrm{d}` | $\mathrm{d}$ |
| 无衬线 | `\mathsf{A}` | $\mathsf{A}$ |
| 打字机 | `\mathtt{A}` | $\mathtt{A}$ |
| 花体 | `\mathcal{A}` | $\mathcal{A}$ |
| 黑板粗体 | `\mathbb{R}` | $\mathbb{R}$ |
| 哥特体 | `\mathfrak{A}` | $\mathfrak{A}$ |

### 文字嵌入公式

```markdown
$x \text{ is real}$
$\text{当 } n \to \infty \text{ 时}$
```

效果：$x \text{ is real}$
$\text{当 } n \to \infty \text{ 时}$

### 上下划线与帽子

```markdown
$\hat{x}$          % 帽子
$\bar{x}$          % 上划线（均值）
$\tilde{x}$        % 波浪号
$\vec{v}$          % 向量箭头
$\dot{x}$          % 一阶时间导数
$\ddot{x}$         % 二阶时间导数
$\overline{AB}$    % 长上划线
$\underline{AB}$   % 下划线
$\widehat{ABC}$    % 宽帽子
$\widetilde{ABC}$  % 宽波浪
$\overbrace{a+b+c}^{n}$   % 上花括号
$\underbrace{a+b+c}_{n}$  % 下花括号
```

效果：$\hat{x}$，$\bar{x}$，$\tilde{x}$，$\vec{v}$，$\dot{x}$，$\ddot{x}$

```markdown
$$\overbrace{a_1 + a_2 + \cdots + a_n}^{n \text{ 项}}$$
$$\underbrace{a_1 + a_2 + \cdots + a_n}_{n \text{ 项}}$$
```

$$\overbrace{a_1 + a_2 + \cdots + a_n}^{n \text{ 项}}$$
$$\underbrace{a_1 + a_2 + \cdots + a_n}_{n \text{ 项}}$$

---

## 16. 空格与间距

LaTeX 中普通空格在数学模式下被忽略，需要手动控制间距：

| 间距 | 语法 | 宽度 |
|------|------|------|
| 负间距 | `\!` | $-\frac{3}{18}$ em |
| 无间距 | （默认） | 0 |
| 细间距 | `\,` | $\frac{3}{18}$ em |
| 中间距 | `\:` | $\frac{4}{18}$ em |
| 粗间距 | `\;` | $\frac{5}{18}$ em |
| 空格 | `\ ` | 1 em |
| 大空格 | `\quad` | 1 em |
| 超大空格 | `\qquad` | 2 em |

示例：

```markdown
$\int f(x)\,dx$        % 积分中 dx 前加细间距
$a \quad b \qquad c$   % 大间距
```

效果：$\int f(x)\,dx$，$a \quad b \qquad c$

---

## 17. 颜色（MathJax/KaTeX）

> ⚠️ 颜色支持依赖渲染引擎，GitHub 不支持，Typora/Obsidian/Jupyter 通常支持。

```markdown
$\color{red}{x^2}$
$\textcolor{blue}{\frac{a}{b}}$
$$\color{green}{\sum_{i=1}^n i}$$
```

$\color{red}{x^2}$
$\textcolor{blue}{\frac{a}{b}}$
$$\color{green}{\sum_{i=1}^n i}$$

常用颜色名：`red`、`blue`、`green`、`orange`、`purple`、`gray`

也可使用十六进制：

```markdown
$\color{#FF6600}{E = mc^2}$
```

{% raw %}$\color{#FF6600}{E = mc^2}${% endraw %}

---

## 18. 常用公式速查表

### 三角函数

```markdown
$\sin x$, $\cos x$, $\tan x$
$\arcsin x$, $\arccos x$, $\arctan x$
$\sinh x$, $\cosh x$, $\tanh x$
```

效果：$\sin x$，$\cos x$，$\tan x$，$\arcsin x$

### 对数与指数

```markdown
$\ln x$          % 自然对数
$\log x$         % 常用对数
$\log_2 x$       % 以2为底
$\exp(x)$        % 指数函数
$e^x$            % 自然指数
```

效果：$\ln x$，$\log_2 x$，$\exp(x)$

### 最大最小值

```markdown
$\max(a, b)$
$\min(a, b)$
$\sup A$
$\inf A$
$\arg\max_x f(x)$
$\arg\min_x f(x)$
```

效果：$\max(a, b)$，$\arg\max_x f(x)$

### 概率与统计

```markdown
$P(A \mid B)$              % 条件概率
$\mathbb{E}[X]$            % 期望
$\text{Var}(X)$            % 方差
$\sigma^2$                 % 方差符号
$\mu$                      % 均值
$X \sim \mathcal{N}(\mu, \sigma^2)$  % 正态分布
```

效果：$P(A \mid B)$，$\mathbb{E}[X]$，$X \sim \mathcal{N}(\mu, \sigma^2)$

### 线性代数

```markdown
$\mathbf{A}^T$             % 转置
$\mathbf{A}^{-1}$          % 逆矩阵
$\text{tr}(\mathbf{A})$    % 迹
$\text{rank}(\mathbf{A})$  % 秩
$\det(\mathbf{A})$         % 行列式
$\|\mathbf{v}\|$           % 向量范数
$\mathbf{u} \cdot \mathbf{v}$  % 点积
$\mathbf{u} \times \mathbf{v}$ % 叉积
```

### 微积分经典公式

```markdown
$$
\frac{d}{dx}\left[x^n\right] = nx^{n-1}
$$

$$
\int x^n\,dx = \frac{x^{n+1}}{n+1} + C \quad (n \neq -1)
$$

$$
\frac{\partial^2 f}{\partial x^2} + \frac{\partial^2 f}{\partial y^2} = 0
$$
```

$$
\frac{d}{dx}\left[x^n\right] = nx^{n-1}
$$

$$
\int x^n\,dx = \frac{x^{n+1}}{n+1} + C \quad (n \neq -1)
$$

### 欧拉公式

```markdown
$$e^{i\pi} + 1 = 0$$
```

$$e^{i\pi} + 1 = 0$$

### 二次方程求根公式

```markdown
$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$
```

$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

### 泰勒展开

```markdown
$$
e^x = \sum_{n=0}^{\infty} \frac{x^n}{n!} = 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + \cdots
$$
```

$$
e^x = \sum_{n=0}^{\infty} \frac{x^n}{n!} = 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + \cdots
$$

---

## 附录：常见问题

### Q1：公式不渲染怎么办？

- 确认平台支持 LaTeX（GitHub 需要在 `.md` 文件中，且仓库开启了数学渲染）
- 检查 `$` 符号是否成对
- 块级公式 `$$` 前后需要空行

### Q2：花括号 `{}` 怎么显示？

```markdown
$\{a, b, c\}$
```

效果：$\{a, b, c\}$

### Q3：百分号、&、# 等特殊字符？

```markdown
$100\%$        % 百分号
$a \& b$       % &（部分环境）
```

### Q4：行内公式与文字间距太紧？

在公式前后加 `\,` 或使用 `\text{}` 包裹文字部分。

### Q5：如何写省略号？

| 类型 | 语法 | 效果 |
|------|------|------|
| 水平居中 | `\cdots` | $\cdots$ |
| 水平底部 | `\ldots` | $\ldots$ |
| 垂直 | `\vdots` | $\vdots$ |
| 对角线 | `\ddots` | $\ddots$ |

---

*本教程基于 LaTeX / MathJax / KaTeX 语法，适用于大多数支持数学公式的 Markdown 渲染器。*

> 原作者未知
