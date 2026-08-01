---
title: Matplotlib从入门到精通
date: 2026-07-30
tags: 
  - 转载
  - 技术文档
---

Matplotlib 是 Python 数据可视化领域最经典、最基础的绘图库之一。
无论你正在学习数据分析、机器学习、科研绘图，还是希望制作高质量报表，Matplotlib 都是一项绕不开的基本功。

很多初学者第一次接触 Matplotlib 时，会觉得它的代码有些零散：

```python
plt.plot(x, y)
plt.xlabel("X")
plt.ylabel("Y")
plt.title("Demo")
plt.show()
```

再往后学习，又会遇到 `Figure`、`Axes`、`subplot`、`legend`、`tick`、`spines` 等概念，很容易陷入"会画图，但不会控制图"的状态。

实际上，Matplotlib 的核心逻辑并不复杂。只要理解它的对象模型，并掌握一套稳定的绘图流程，就能从"调用几个函数"逐渐进阶到"精确控制一张图的每个细节"。

本文将从零开始，系统讲解 Matplotlib 的核心知识，并通过大量可运行示例，带你完成从入门到精通的完整学习路径。

---

## 目录

1. [Matplotlib 是什么](#一matplotlib-是什么)
2. [安装 Matplotlib](#二安装-matplotlib)
3. [第一张 Matplotlib 图表](#三第一张-matplotlib-图表)
4. [理解 Figure 和 Axes](#四理解-figure-和-axes)
5. [折线图详解](#五折线图详解)
6. [在一张图中绘制多条曲线](#六在一张图中绘制多条曲线)
7. [柱状图](#七柱状图)
8. [分组柱状图](#八分组柱状图)
9. [堆叠柱状图](#九堆叠柱状图)
10. [散点图](#十散点图)
11. [直方图](#十一直方图)
12. [饼图](#十二饼图)
13. [箱线图](#十三箱线图)
14. [多子图布局](#十四多子图布局)
15. [使用 GridSpec 创建复杂布局](#十五使用-gridspec-创建复杂布局)
16. [标题、坐标轴与刻度](#十六标题坐标轴与刻度)
17. [网格线](#十七网格线)
18. [控制坐标轴边框](#十八控制坐标轴边框)
19. [文本与注释](#十九文本与注释)
20. [中文字体与负号显示](#二十中文字体与负号显示)
21. [全局样式设置](#二十一是全局样式设置)
22. [颜色的正确使用](#二十二颜色的正确使用)
23. [透明度与层级](#二十三透明度与层级)
24. [坐标轴比例](#二十四坐标轴比例)
25. [双 Y 轴](#二十五双-y-轴)
26. [日期时间数据](#二十六日期时间数据)
27. [误差线与置信区间](#二十七误差线与置信区间)
28. [热力图](#二十八热力图)
29. [等高线图](#二十九等高线图)
30. [三维图形](#三十三维图形)
31. [与 NumPy 配合](#三十一与-numpy-配合)
32. [与 Pandas 配合](#三十二与-pandas-配合)
33. [保存高质量图片](#三十三保存高质量图片)
34. [一个推荐的标准绘图模板](#三十四一个推荐的标准绘图模板)
35. [实战：制作一个销售数据仪表盘](#三十五实战制作一个销售数据仪表盘)
36. [封装可复用的绘图函数](#三十六封装可复用的绘图函数)
37. [动态更新图表](#三十七动态更新图表)
38. [交互事件](#三十八交互事件)
39. [性能优化](#三十九性能优化)
40. [常见错误与解决方法](#四十常见错误与解决方法)
41. [Matplotlib 的最佳实践](#四十一matplotlib-的最佳实践)
42. [从入门到精通的学习路线](#四十二从入门到精通的学习路线)
43. [总结](#四十三总结)

- [附录：Matplotlib 常用 API 速查表](#附录matplotlib-常用-api-速查表)

---

## 一、Matplotlib 是什么

Matplotlib 是 Python 中用于创建静态图表、动态图表和交互式图表的可视化库。

它可以绘制：

- 折线图
- 柱状图
- 散点图
- 饼图
- 直方图
- 箱线图
- 热力图
- 等高线图
- 三维图形
- 多子图仪表盘
- 科研论文级图片

Matplotlib 的优势主要体现在三个方面。

**1. 控制能力强**

一张图中的标题、坐标轴、刻度、颜色、线条、字体、图例、网格、边框、注释和布局，都可以被单独控制。

**2. 生态成熟**

NumPy、Pandas、SciPy、Scikit-learn 等工具生成的数据，都可以直接交给 Matplotlib 绘制。

**3. 适用范围广**

它既适合数据分析，也适合科研、教学、工程、金融、机器学习和自动化报告。

---

## 二、安装 Matplotlib

使用 `pip` 安装：

```bash
pip install matplotlib
```

使用 Conda 安装：

```bash
conda install matplotlib
```

验证是否安装成功：

```python
import matplotlib
print(matplotlib.__version__)
```

在代码中，通常使用下面的导入方式：

```python
import matplotlib.pyplot as plt
```

`pyplot` 是 Matplotlib 中最常用的绘图接口，通常缩写为 `plt`。

后续示例还会使用 NumPy：

```bash
pip install numpy
```

```python
import numpy as np
import matplotlib.pyplot as plt
```

---

## 三、第一张 Matplotlib 图表

先从最简单的折线图开始。

```python
import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]
y = [2, 4, 1, 5, 3]

plt.plot(x, y)
plt.show()
```

运行后，会得到一张折线图。其中：

- `plt.plot(x, y)`：绘制折线
- `plt.show()`：显示图表

继续添加标题和坐标轴名称：

```python
import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]
y = [2, 4, 1, 5, 3]

plt.plot(x, y)
plt.title("Simple Line Chart")
plt.xlabel("X")
plt.ylabel("Y")
plt.show()
```

这就是 Matplotlib 最基本的绘图流程：

```
准备数据
   ↓
创建图表
   ↓
绘制数据
   ↓
添加标题、坐标轴、图例
   ↓
调整样式
   ↓
显示或保存
```

---

## 四、理解 Figure 和 Axes

这是从 Matplotlib 入门走向熟练最重要的一步。Matplotlib 中最核心的两个对象是：

- `Figure`
- `Axes`

**1. Figure：整张画布**

`Figure` 可以理解为一张白纸，代表整个图片。

**2. Axes：具体的绘图区**

`Axes` 是真正绘制折线、柱状图、坐标轴和标题的区域。一张 `Figure` 中可以包含一个或多个 `Axes`。

```
Figure：整张画布
└── Axes：第一个绘图区
└── Axes：第二个绘图区
└── Axes：第三个绘图区
```

推荐使用面向对象方式绘图：

```python
import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]
y = [2, 4, 1, 5, 3]

fig, ax = plt.subplots()
ax.plot(x, y)
ax.set_title("Simple Line Chart")
ax.set_xlabel("X")
ax.set_ylabel("Y")
plt.show()
```

这里 `fig, ax = plt.subplots()` 会同时创建 `Figure` 对象 `fig` 和 `Axes` 对象 `ax`。之后通过 `ax` 控制绘图区，通过 `fig` 控制整张图片：

```python
fig.set_size_inches(10, 6)
fig.savefig("chart.png")
```

**pyplot 风格与面向对象风格**

- pyplot 风格：

```python
plt.plot(x, y)
plt.title("Title")
plt.xlabel("X")
plt.show()
```

- 面向对象风格：

```python
fig, ax = plt.subplots()
ax.plot(x, y)
ax.set_title("Title")
ax.set_xlabel("X")
plt.show()
```

简单临时绘图可以使用 `pyplot` 风格；对于复杂图表、多子图、工程项目和科研绘图，建议优先使用面向对象风格。

---

## 五、折线图详解

折线图适合展示数据随时间或连续变量的变化趋势。

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 2 * np.pi, 200)
y = np.sin(x)

fig, ax = plt.subplots(figsize=(10, 5))
ax.plot(x, y)
ax.set_title("Sine Wave")
ax.set_xlabel("x")
ax.set_ylabel("sin(x)")
ax.grid(True)
plt.show()
```

1. 设置颜色：`ax.plot(x, y, color="red")` 或 `color="#2E86DE"`
2. 设置线宽：`ax.plot(x, y, linewidth=3)`
3. 设置线型：`ax.plot(x, y, linestyle="--")`（`"-"` 实线、`"--"` 虚线、`"-."` 点划线、`":"` 点线）
4. 设置数据点标记：`ax.plot(x, y, marker="o")`（`"o"` 圆形、`"s"` 正方形、`"^"` 三角形、`"*"` 星形、`"x"` 叉号、`"D"` 菱形）

综合示例：

```python
import matplotlib.pyplot as plt

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
sales = [18, 25, 23, 32, 38, 45]

fig, ax = plt.subplots(figsize=(10, 5))
ax.plot(
    months,
    sales,
    color="#2E86DE",
    linewidth=2.5,
    linestyle="-",
    marker="o",
    markersize=8,
    label="Sales"
)
ax.set_title("Monthly Sales")
ax.set_xlabel("Month")
ax.set_ylabel("Sales")
ax.legend()
ax.grid(alpha=0.3)
plt.show()
```

---

## 六、在一张图中绘制多条曲线

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 2 * np.pi, 200)

fig, ax = plt.subplots(figsize=(10, 5))
ax.plot(x, np.sin(x), label="sin(x)")
ax.plot(x, np.cos(x), label="cos(x)")
ax.plot(x, np.sin(2 * x), label="sin(2x)")

ax.set_title("Multiple Curves")
ax.set_xlabel("x")
ax.set_ylabel("y")
ax.legend()
ax.grid(alpha=0.3)
plt.show()
```

`label` 用于设置每条曲线的名称，`legend()` 用于显示图例。图例位置通过 `loc` 参数控制：`"upper left"`、`"upper right"`、`"lower left"`、`"lower right"`、`"center"`、`"best"`。

---

## 七、柱状图

```python
import matplotlib.pyplot as plt

categories = ["Python", "Java", "C++", "Go", "Rust"]
values = [95, 82, 78, 73, 68]

fig, ax = plt.subplots(figsize=(10, 5))
ax.bar(categories, values)
ax.set_title("Programming Language Scores")
ax.set_xlabel("Language")
ax.set_ylabel("Score")
plt.show()
```

1. 设置柱子颜色和宽度：`ax.bar(categories, values, color="#5DADE2", width=0.65)`
2. 横向柱状图：`ax.barh(categories, values)`
3. 显示数值：

```python
bars = ax.bar(categories, values)
ax.bar_label(bars, padding=3)
ax.set_ylim(0, 110)
```

---

## 八、分组柱状图

分组柱状图适合比较多个类别在不同组中的表现。

```python
import numpy as np
import matplotlib.pyplot as plt

categories = ["Q1", "Q2", "Q3", "Q4"]
product_a = [20, 35, 30, 45]
product_b = [25, 30, 38, 42]

x = np.arange(len(categories))
width = 0.35

fig, ax = plt.subplots(figsize=(10, 5))

bars1 = ax.bar(x - width / 2, product_a, width, label="Product A")
bars2 = ax.bar(x + width / 2, product_b, width, label="Product B")

ax.set_xticks(x)
ax.set_xticklabels(categories)
ax.set_title("Quarterly Sales")
ax.set_ylabel("Sales")
ax.legend()

ax.bar_label(bars1, padding=3)
ax.bar_label(bars2, padding=3)

plt.show()
```

关键是为每组柱子设置不同的横坐标偏移：

```python
x - width / 2
x + width / 2
```

---

## 九、堆叠柱状图

堆叠柱状图适合展示总体与组成部分之间的关系。

```python
import matplotlib.pyplot as plt

quarters = ["Q1", "Q2", "Q3", "Q4"]
online = [30, 35, 42, 50]
offline = [20, 24, 21, 26]

fig, ax = plt.subplots(figsize=(9, 5))

ax.bar(quarters, online, label="Online")
ax.bar(quarters, offline, bottom=online, label="Offline")

ax.set_title("Sales Channel Composition")
ax.set_ylabel("Sales")
ax.legend()

plt.show()
```

`bottom=online` 表示第二组柱子从第一组柱子的顶部开始绘制。

---

## 十、散点图

散点图适合观察两个变量之间的关系。

```python
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(42)

x = rng.normal(50, 12, 100)
y = 0.8 * x + rng.normal(0, 8, 100)

fig, ax = plt.subplots(figsize=(8, 6))

ax.scatter(x, y)
ax.set_title("Scatter Plot")
ax.set_xlabel("Feature X")
ax.set_ylabel("Feature Y")
ax.grid(alpha=0.3)

plt.show()
```

常用参数：

```python
ax.scatter(
    x,
    y,
    s=80,          # 点的大小
    c="#E74C3C",   # 点的颜色
    alpha=0.7,     # 透明度
    marker="o",    # 点的形状
    edgecolors="black"
)
```

### 使用第三个变量控制颜色

```python
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(42)

x = rng.normal(size=200)
y = rng.normal(size=200)
value = np.sqrt(x**2 + y**2)

fig, ax = plt.subplots(figsize=(8, 6))

scatter = ax.scatter(
    x,
    y,
    c=value,
    s=60,
    cmap="viridis",
    alpha=0.8
)

fig.colorbar(scatter, ax=ax, label="Distance")

ax.set_title("Scatter Plot with Color Mapping")
ax.set_xlabel("X")
ax.set_ylabel("Y")

plt.show()
```

`cmap` 表示颜色映射方案。

常用颜色映射包括：

- `viridis`
- `plasma`
- `inferno`
- `magma`
- `coolwarm`
- `Blues`
- `Reds`

---

## 十一、直方图

直方图用于观察连续数据的分布情况。

```python
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(42)
data = rng.normal(loc=100, scale=15, size=1000)

fig, ax = plt.subplots(figsize=(9, 5))

ax.hist(
    data,
    bins=30,
    edgecolor="black",
    alpha=0.75
)

ax.set_title("Data Distribution")
ax.set_xlabel("Value")
ax.set_ylabel("Frequency")

plt.show()
```

`bins` 控制区间数量。

- `bins` 太小：分布细节不足
- `bins` 太大：图形过于零碎
- 合理的 `bins`：能较清晰地反映数据结构

显示概率密度：

```python
ax.hist(data, bins=30, density=True)
```

---

## 十二、饼图

饼图适合展示少量类别的占比。

```python
import matplotlib.pyplot as plt

labels = ["Python", "Java", "JavaScript", "Other"]
sizes = [40, 25, 20, 15]

fig, ax = plt.subplots(figsize=(7, 7))

ax.pie(
    sizes,
    labels=labels,
    autopct="%.1f%%",
    startangle=90
)

ax.set_title("Language Share")

plt.show()
```

常用参数：

- `labels`：分类标签
- `autopct`：百分比格式
- `startangle`：起始角度
- `explode`：突出某个扇区
- `shadow`：显示阴影

突出某一部分：

```python
explode = [0.1, 0, 0, 0]

ax.pie(
    sizes,
    labels=labels,
    autopct="%.1f%%",
    explode=explode,
    startangle=90
)
```

需要注意：当类别过多时，饼图会变得难以阅读。此时通常更适合使用柱状图。

---

## 十三、箱线图

箱线图可以显示数据的中位数、四分位数、离群点和整体分布范围。

```python
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(42)

group_a = rng.normal(70, 8, 100)
group_b = rng.normal(75, 10, 100)
group_c = rng.normal(80, 6, 100)

fig, ax = plt.subplots(figsize=(9, 5))

ax.boxplot(
    [group_a, group_b, group_c],
    tick_labels=["A", "B", "C"],
    showmeans=True
)

ax.set_title("Score Distribution")
ax.set_ylabel("Score")

plt.show()
```

箱线图特别适合：

- 对比多组数据分布
- 检测离群值
- 观察数据偏态
- 比较中位数和波动范围

---

## 十四、多子图布局

在数据分析中，经常需要把多张图放在同一个画布中。

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 10, 200)

fig, axes = plt.subplots(
    nrows=2,
    ncols=2,
    figsize=(12, 8)
)

axes[0, 0].plot(x, np.sin(x))
axes[0, 0].set_title("sin(x)")

axes[0, 1].plot(x, np.cos(x))
axes[0, 1].set_title("cos(x)")

axes[1, 0].plot(x, np.exp(-x / 3))
axes[1, 0].set_title("exp(-x/3)")

axes[1, 1].plot(x, x**2)
axes[1, 1].set_title("x²")

fig.tight_layout()
plt.show()
```

这里的 `axes` 是一个二维数组：

```
axes[0, 0]  axes[0, 1]
axes[1, 0]  axes[1, 1]
```

### 共享坐标轴

```python
fig, axes = plt.subplots(
    2,
    2,
    sharex=True,
    sharey=True
)
```

### 调整子图间距

```python
fig.subplots_adjust(
    left=0.08,
    right=0.95,
    bottom=0.08,
    top=0.92,
    wspace=0.3,
    hspace=0.4
)
```

### 自动布局

常用方式：

```python
fig.tight_layout()
```

或者在创建时启用约束布局：

```python
fig, ax = plt.subplots(
    figsize=(10, 6),
    constrained_layout=True
)
```

对于复杂子图，`constrained_layout=True` 往往更方便。

---

## 十五、使用 GridSpec 创建复杂布局

当普通的网格子图不能满足需求时，可以使用 `GridSpec`。

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 10, 200)

fig = plt.figure(figsize=(12, 8))
grid = fig.add_gridspec(2, 2)

ax1 = fig.add_subplot(grid[0, :])
ax2 = fig.add_subplot(grid[1, 0])
ax3 = fig.add_subplot(grid[1, 1])

ax1.plot(x, np.sin(x))
ax1.set_title("Main Chart")

ax2.bar(["A", "B", "C"], [3, 7, 5])
ax2.set_title("Bar Chart")

ax3.scatter(x[::10], np.cos(x[::10]))
ax3.set_title("Scatter Chart")

fig.tight_layout()
plt.show()
```

关键代码：

```python
grid[0, :]
```

表示第一行跨越所有列。

`GridSpec` 适合制作：

- 数据仪表盘
- 论文复合图
- 主图加辅助图
- 不规则布局图表

---

## 十六、标题、坐标轴与刻度

### 1. 设置标题

```python
ax.set_title(
    "Monthly Revenue",
    fontsize=18,
    fontweight="bold",
    pad=15
)
```

### 2. 设置坐标轴标签

```python
ax.set_xlabel("Month", fontsize=12)
ax.set_ylabel("Revenue", fontsize=12)
```

### 3. 设置坐标轴范围

```python
ax.set_xlim(0, 10)
ax.set_ylim(0, 100)
```

### 4. 设置刻度位置

```python
ax.set_xticks([0, 2, 4, 6, 8, 10])
ax.set_yticks([0, 20, 40, 60, 80, 100])
```

### 5. 设置刻度标签

```python
ax.set_xticks([0, 1, 2])
ax.set_xticklabels(["Low", "Medium", "High"])
```

### 6. 旋转刻度标签

```python
ax.tick_params(axis="x", labelrotation=45)
```

或：

```python
plt.setp(ax.get_xticklabels(), rotation=45, ha="right")
```

### 7. 设置刻度样式

```python
ax.tick_params(
    axis="both",
    labelsize=11,
    length=6,
    width=1.2
)
```

---

## 十七、网格线

网格线可以提高数据读取效率。

```python
ax.grid(True)
```

进一步控制：

```python
ax.grid(
    True,
    axis="y",
    linestyle="--",
    linewidth=0.8,
    alpha=0.4
)
```

常见建议：

- 柱状图：保留横向网格线
- 折线图：使用浅色网格
- 散点图：根据点的密集程度决定
- 展示型图表：网格线不要过重

---

## 十八、控制坐标轴边框

坐标轴四周的边框被称为 `spines`。

隐藏顶部和右侧边框：

```python
ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)
```

设置边框颜色：

```python
ax.spines["left"].set_color("#888888")
ax.spines["bottom"].set_color("#888888")
```

设置边框宽度：

```python
ax.spines["left"].set_linewidth(1.2)
ax.spines["bottom"].set_linewidth(1.2)
```

现代数据图表通常会隐藏顶部和右侧边框，让视觉更简洁。

---

## 十九、文本与注释

图表不仅要展示数据，还要突出重点。

### 1. 添加普通文本

```python
ax.text(
    3,
    8,
    "Important Point",
    fontsize=12
)
```

### 2. 添加带箭头注释

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 10, 100)
y = np.sin(x)

fig, ax = plt.subplots(figsize=(10, 5))

ax.plot(x, y)

index = np.argmax(y)
peak_x = x[index]
peak_y = y[index]

ax.scatter([peak_x], [peak_y], s=80)

ax.annotate(
    "Peak",
    xy=(peak_x, peak_y),
    xytext=(peak_x + 1.2, peak_y - 0.5),
    arrowprops={
        "arrowstyle": "->",
        "connectionstyle": "arc3"
    },
    fontsize=12
)

ax.set_title("Annotation Example")
plt.show()
```

`xy` 表示被标记点的位置，`xytext` 表示文字的位置。

### 3. 添加文本框

```python
ax.text(
    0.05,
    0.95,
    "R² = 0.92",
    transform=ax.transAxes,
    va="top",
    bbox={
        "boxstyle": "round",
        "facecolor": "white",
        "alpha": 0.8
    }
)
```

`transform=ax.transAxes` 表示使用相对坐标：

- 左下角是 `(0, 0)`
- 右上角是 `(1, 1)`

这种方式特别适合在固定位置显示指标说明。

---

## 二十、中文字体与负号显示

在部分系统中，Matplotlib 默认字体无法正确显示中文，可能出现方框或乱码。

可以设置中文字体：

```python
import matplotlib.pyplot as plt

plt.rcParams["font.sans-serif"] = [
    "Arial Unicode MS",
    "Microsoft YaHei",
    "SimHei"
]

plt.rcParams["axes.unicode_minus"] = False
```

说明：

- macOS 常见字体：`Arial Unicode MS`、`PingFang SC`
- Windows 常见字体：`Microsoft YaHei`、`SimHei`
- Linux 可以安装 Noto CJK 字体

更稳妥的方式是根据当前操作系统指定实际存在的字体。

完整示例：

```python
import matplotlib.pyplot as plt

plt.rcParams["font.sans-serif"] = ["Microsoft YaHei"]
plt.rcParams["axes.unicode_minus"] = False

x = ["一月", "二月", "三月", "四月"]
y = [10, 16, 13, 21]

fig, ax = plt.subplots(figsize=(8, 5))

ax.plot(x, y, marker="o")
ax.set_title("月度销售趋势")
ax.set_xlabel("月份")
ax.set_ylabel("销售额")

plt.show()
```

---

## 二十一、全局样式设置

Matplotlib 支持多种内置样式。

查看可用样式：

```python
import matplotlib.pyplot as plt

print(plt.style.available)
```

使用样式：

```python
plt.style.use("ggplot")
```

也可以在局部范围内使用：

```python
with plt.style.context("ggplot"):
    fig, ax = plt.subplots()
    ax.plot([1, 2, 3], [2, 5, 3])
    plt.show()
```

使用局部样式可以避免影响后续图表。

### 通过 rcParams 设置全局参数

```python
import matplotlib.pyplot as plt

plt.rcParams.update({
    "figure.figsize": (10, 6),
    "axes.titlesize": 16,
    "axes.labelsize": 12,
    "xtick.labelsize": 10,
    "ytick.labelsize": 10,
    "legend.fontsize": 10,
    "lines.linewidth": 2
})
```

在项目中，可以把这些参数封装成统一的可视化主题。

---

## 二十二、颜色的正确使用

颜色是图表设计中非常重要的一部分。

### 1. 使用名称

```python
color="red"
color="steelblue"
color="orange"
```

### 2. 使用十六进制

```python
color="#2E86DE"
```

### 3. 使用 RGB 或 RGBA

```python
color=(0.2, 0.5, 0.8)
color=(0.2, 0.5, 0.8, 0.6)
```

### 4. 使用颜色循环

```python
from cycler import cycler
import matplotlib.pyplot as plt

plt.rcParams["axes.prop_cycle"] = cycler(
    color=[
        "#2E86DE",
        "#E74C3C",
        "#27AE60",
        "#F39C12"
    ]
)
```

### 颜色使用原则

1. 同一含义使用同一种颜色
2. 不要在一张图中使用过多高饱和颜色
3. 重点数据使用强调色
4. 背景、网格和辅助线尽量使用低饱和颜色
5. 连续数值使用连续色带
6. 正负变化可以使用发散色带

---

## 二十三、透明度与层级

### 1. 透明度

```python
ax.scatter(x, y, alpha=0.5)
```

`alpha` 的取值范围为 `0` 到 `1`。

- `0`：完全透明
- `1`：完全不透明

对于大量散点，适当降低透明度可以减少重叠干扰。

### 2. 图层顺序

通过 `zorder` 控制元素的前后顺序：

```python
ax.grid(zorder=0)
ax.bar(categories, values, zorder=2)
ax.scatter(x, y, zorder=3)
```

`zorder` 数值越大，元素越靠上。

---

## 二十四、坐标轴比例

### 1. 对数坐标

```python
ax.set_yscale("log")
```

或：

```python
ax.set_xscale("log")
```

适合跨越多个数量级的数据。

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.arange(1, 10)
y = 10 ** x

fig, ax = plt.subplots()

ax.plot(x, y, marker="o")
ax.set_yscale("log")
ax.set_title("Logarithmic Scale")

plt.show()
```

### 2. 对称对数坐标

```python
ax.set_yscale("symlog")
```

适合同时包含正值、负值和接近零的数据。

---

## 二十五、双 Y 轴

当两组数据数量级不同，但共享同一个 X 轴时，可以使用双 Y 轴。

```python
import matplotlib.pyplot as plt

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
sales = [120, 150, 180, 170, 210, 240]
growth = [5, 8, 12, 9, 15, 18]

fig, ax1 = plt.subplots(figsize=(10, 5))

ax1.plot(
    months,
    sales,
    marker="o",
    label="Sales"
)
ax1.set_xlabel("Month")
ax1.set_ylabel("Sales")

ax2 = ax1.twinx()

ax2.plot(
    months,
    growth,
    marker="s",
    linestyle="--",
    label="Growth"
)
ax2.set_ylabel("Growth (%)")

ax1.set_title("Sales and Growth")

plt.show()
```

需要注意，双 Y 轴容易造成视觉误导。

使用时应做到：

- 清楚标注两侧单位
- 使用不同线型或颜色
- 避免人为调整坐标范围制造夸张趋势
- 在可以拆成两张图时，优先考虑拆图

---

## 二十六、日期时间数据

Matplotlib 可以直接绘制 Python 日期时间对象。

```python
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
import matplotlib.dates as mdates

dates = [
    datetime(2026, 1, 1) + timedelta(days=i)
    for i in range(30)
]

values = [
    100 + i * 2 + (i % 5) * 3
    for i in range(30)
]

fig, ax = plt.subplots(figsize=(11, 5))

ax.plot(dates, values, marker="o", markersize=4)

ax.xaxis.set_major_locator(
    mdates.DayLocator(interval=5)
)

ax.xaxis.set_major_formatter(
    mdates.DateFormatter("%m-%d")
)

fig.autofmt_xdate()

ax.set_title("Daily Trend")
ax.set_xlabel("Date")
ax.set_ylabel("Value")

plt.show()
```

常用日期格式：

```
%Y      年
%m      月
%d      日
%H      小时
%M      分钟
```

例如：

```python
mdates.DateFormatter("%Y-%m-%d")
```

---

## 二十七、误差线与置信区间

### 1. 误差线

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.arange(5)
y = np.array([12, 18, 15, 22, 26])
error = np.array([2, 3, 2, 4, 3])

fig, ax = plt.subplots(figsize=(8, 5))

ax.errorbar(
    x,
    y,
    yerr=error,
    fmt="o-",
    capsize=5
)

ax.set_title("Error Bar")
plt.show()
```

### 2. 阴影置信区间

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 10, 200)
y = np.sin(x)
error = 0.2 + 0.05 * x

fig, ax = plt.subplots(figsize=(10, 5))

ax.plot(x, y, label="Mean")
ax.fill_between(
    x,
    y - error,
    y + error,
    alpha=0.25,
    label="Confidence Interval"
)

ax.legend()
ax.set_title("Confidence Interval")
plt.show()
```

`fill_between()` 也常用于展示范围、区间和累计面积。

---

## 二十八、热力图

Matplotlib 可以通过 `imshow()` 绘制矩阵热力图。

```python
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(42)
data = rng.random((6, 8))

fig, ax = plt.subplots(figsize=(9, 6))

image = ax.imshow(
    data,
    cmap="viridis",
    aspect="auto"
)

fig.colorbar(image, ax=ax)

ax.set_title("Heatmap")
ax.set_xlabel("Column")
ax.set_ylabel("Row")

plt.show()
```

在单元格中显示数值：

```python
for row in range(data.shape[0]):
    for col in range(data.shape[1]):
        ax.text(
            col,
            row,
            f"{data[row, col]:.2f}",
            ha="center",
            va="center"
        )
```

热力图常用于：

- 相关系数矩阵
- 混淆矩阵
- 时间与类别交叉数据
- 特征强度展示
- 空间数据展示

---

## 二十九、等高线图

等高线图用于展示二维函数的高度变化。

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(-3, 3, 200)
y = np.linspace(-3, 3, 200)

X, Y = np.meshgrid(x, y)
Z = np.sin(X**2 + Y**2)

fig, ax = plt.subplots(figsize=(8, 6))

contour = ax.contourf(
    X,
    Y,
    Z,
    levels=20,
    cmap="viridis"
)

fig.colorbar(contour, ax=ax)

ax.set_title("Contour Plot")
ax.set_xlabel("X")
ax.set_ylabel("Y")

plt.show()
```

只绘制等高线：

```python
ax.contour(X, Y, Z, levels=15)
```

绘制填充等高线：

```python
ax.contourf(X, Y, Z, levels=20)
```

---

## 三十、三维图形

Matplotlib 支持基础三维绘图。

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(-5, 5, 100)
y = np.linspace(-5, 5, 100)

X, Y = np.meshgrid(x, y)
Z = np.sin(np.sqrt(X**2 + Y**2))

fig = plt.figure(figsize=(10, 7))
ax = fig.add_subplot(111, projection="3d")

surface = ax.plot_surface(
    X,
    Y,
    Z,
    cmap="viridis",
    edgecolor="none"
)

fig.colorbar(surface, ax=ax, shrink=0.6)

ax.set_title("3D Surface")
ax.set_xlabel("X")
ax.set_ylabel("Y")
ax.set_zlabel("Z")

plt.show()
```

Matplotlib 的三维功能适合：

- 数学函数演示
- 科研结果预览
- 三维散点图
- 简单曲面图

对于大型三维场景或强交互可视化，通常需要使用更专业的三维可视化工具。

---

## 三十一、与 NumPy 配合

Matplotlib 与 NumPy 配合非常自然。

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(-2 * np.pi, 2 * np.pi, 500)

functions = {
    "sin(x)": np.sin(x),
    "cos(x)": np.cos(x),
    "sin(x) + cos(x)": np.sin(x) + np.cos(x)
}

fig, ax = plt.subplots(figsize=(11, 6))

for label, y in functions.items():
    ax.plot(x, y, label=label)

ax.axhline(0, linewidth=1)
ax.axvline(0, linewidth=1)

ax.set_title("Functions")
ax.legend()
ax.grid(alpha=0.25)

plt.show()
```

使用 NumPy 可以方便地完成：

- 生成等间隔数据
- 计算数学函数
- 向量化处理
- 随机数据模拟
- 矩阵与网格计算

---

## 三十二、与 Pandas 配合

Pandas 的绘图功能底层通常使用 Matplotlib。

```python
import pandas as pd
import matplotlib.pyplot as plt

data = {
    "month": ["Jan", "Feb", "Mar", "Apr", "May"],
    "sales": [20, 28, 25, 35, 42],
    "cost": [12, 15, 14, 18, 22]
}

df = pd.DataFrame(data)

ax = df.plot(
    x="month",
    y=["sales", "cost"],
    kind="line",
    marker="o",
    figsize=(10, 5)
)

ax.set_title("Sales and Cost")
ax.set_xlabel("Month")
ax.set_ylabel("Amount")

plt.show()
```

也可以先使用 Pandas 创建图表，再使用 Matplotlib 继续精细调整：

```python
ax = df.plot(
    x="month",
    y="sales",
    kind="bar"
)

ax.set_title("Monthly Sales")
ax.grid(axis="y", alpha=0.3)
ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)
```

这是一种非常常见的工作方式：

```
Pandas 快速出图
        ↓
Matplotlib 精细调整
```

---

## 三十三、保存高质量图片

使用 `savefig()` 保存图片：

```python
fig.savefig("chart.png")
```

常用参数：

```python
fig.savefig(
    "chart.png",
    dpi=300,
    bbox_inches="tight",
    transparent=False
)
```

参数说明：

- `dpi=300`：提高输出分辨率
- `bbox_inches="tight"`：裁剪多余空白
- `transparent=True`：透明背景
- `facecolor="white"`：设置图片背景

保存为不同格式：

```python
fig.savefig("chart.png", dpi=300)
fig.savefig("chart.jpg", dpi=300)
fig.savefig("chart.pdf")
fig.savefig("chart.svg")
```

格式选择建议：

| 场景 | 推荐格式 |
| --- | --- |
| 公众号、网页 | PNG |
| 普通照片型图像 | JPG |
| 论文、印刷 | PDF |
| 网页矢量图 | SVG |

需要注意：保存操作通常应放在 `plt.show()` 之前。

```python
fig.savefig("chart.png", dpi=300)
plt.show()
```

在部分环境中，先调用 `show()` 再保存，可能得到空白图片。

---

## 三十四、一个推荐的标准绘图模板

在实际项目中，可以使用下面这套稳定流程。

```python
import numpy as np
import matplotlib.pyplot as plt

# 1. 准备数据
x = np.arange(1, 7)
y = np.array([12, 18, 15, 24, 28, 35])

# 2. 创建画布与坐标轴
fig, ax = plt.subplots(
    figsize=(10, 5),
    constrained_layout=True
)

# 3. 绘制数据
ax.plot(
    x,
    y,
    marker="o",
    linewidth=2.5,
    label="Revenue"
)

# 4. 标题与坐标轴
ax.set_title("Monthly Revenue", fontsize=16)
ax.set_xlabel("Month")
ax.set_ylabel("Revenue")

# 5. 刻度与范围
ax.set_xticks(x)
ax.set_xlim(0.5, 6.5)
ax.set_ylim(0, 40)

# 6. 图例和网格
ax.legend()
ax.grid(axis="y", alpha=0.25)

# 7. 简化边框
ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)

# 8. 数据标签
for x_value, y_value in zip(x, y):
    ax.text(
        x_value,
        y_value + 1,
        str(y_value),
        ha="center"
    )

# 9. 保存与显示
fig.savefig(
    "monthly_revenue.png",
    dpi=300,
    bbox_inches="tight"
)

plt.show()
```

这套模板适合大多数业务图表。

---

## 三十五、实战：制作一个销售数据仪表盘

下面通过一个完整案例，把前面学到的知识串起来。

```python
import numpy as np
import matplotlib.pyplot as plt

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
sales = np.array([120, 150, 145, 180, 210, 240])
cost = np.array([80, 95, 92, 110, 130, 145])
profit = sales - cost
growth = np.array([0, 25, -3.3, 24.1, 16.7, 14.3])

fig = plt.figure(
    figsize=(14, 9),
    constrained_layout=True
)

grid = fig.add_gridspec(2, 2)

ax1 = fig.add_subplot(grid[0, :])
ax2 = fig.add_subplot(grid[1, 0])
ax3 = fig.add_subplot(grid[1, 1])

# 主图：销售额与成本
ax1.plot(
    months,
    sales,
    marker="o",
    linewidth=2.5,
    label="Sales"
)

ax1.plot(
    months,
    cost,
    marker="s",
    linewidth=2.5,
    label="Cost"
)

ax1.fill_between(
    months,
    cost,
    sales,
    alpha=0.15,
    label="Profit Area"
)

ax1.set_title("Sales and Cost Trend")
ax1.set_ylabel("Amount")
ax1.legend(ncol=3)
ax1.grid(axis="y", alpha=0.25)

# 左下：利润
bars = ax2.bar(
    months,
    profit
)

ax2.bar_label(
    bars,
    padding=3
)

ax2.set_title("Monthly Profit")
ax2.set_ylabel("Profit")
ax2.grid(axis="y", alpha=0.25)

# 右下：增长率
ax3.plot(
    months,
    growth,
    marker="o",
    linestyle="--"
)

ax3.axhline(
    0,
    linewidth=1
)

ax3.set_title("Growth Rate")
ax3.set_ylabel("Growth (%)")
ax3.grid(axis="y", alpha=0.25)

# 统一简化边框
for ax in [ax1, ax2, ax3]:
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)

fig.suptitle(
    "Sales Dashboard",
    fontsize=20,
    fontweight="bold"
)

fig.savefig(
    "sales_dashboard.png",
    dpi=300,
    bbox_inches="tight"
)

plt.show()
```

这个案例包含：

- 多子图布局
- 折线图
- 柱状图
- 面积填充
- 数据标签
- 图例
- 网格线
- 边框控制
- 图片保存

掌握这类组合图后，就可以进一步制作业务报表和数据看板。

---

## 三十六、封装可复用的绘图函数

当多个图表拥有相同风格时，不要重复写大量样式代码，可以进行封装。

```python
import matplotlib.pyplot as plt


def apply_chart_style(ax, title, xlabel="", ylabel=""):
    ax.set_title(
        title,
        fontsize=16,
        fontweight="bold",
        pad=12
    )

    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)

    ax.grid(
        axis="y",
        alpha=0.25,
        linestyle="--"
    )

    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)


def plot_line_chart(x, y, title, output=None):
    fig, ax = plt.subplots(
        figsize=(10, 5),
        constrained_layout=True
    )

    ax.plot(
        x,
        y,
        marker="o",
        linewidth=2.5
    )

    apply_chart_style(
        ax,
        title=title,
        xlabel="X",
        ylabel="Y"
    )

    if output:
        fig.savefig(
            output,
            dpi=300,
            bbox_inches="tight"
        )

    return fig, ax
```

使用：

```python
x = [1, 2, 3, 4, 5]
y = [10, 18, 15, 25, 30]

fig, ax = plot_line_chart(
    x,
    y,
    title="Demo",
    output="demo.png"
)

plt.show()
```

封装的优点：

- 统一图表风格
- 减少重复代码
- 降低修改成本
- 方便团队协作
- 便于自动生成报表

---

## 三十七、动态更新图表

Matplotlib 可以更新已有图形。

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 2 * np.pi, 200)

fig, ax = plt.subplots()
line, = ax.plot(x, np.sin(x))

ax.set_ylim(-1.2, 1.2)

for phase in np.linspace(0, 2 * np.pi, 100):
    line.set_ydata(
        np.sin(x + phase)
    )

    fig.canvas.draw()
    fig.canvas.flush_events()
    plt.pause(0.03)

plt.show()
```

核心是：

```python
line.set_ydata(...)
```

用于更新曲线数据。

对于复杂动画，可以使用：

```python
from matplotlib.animation import FuncAnimation
```

Matplotlib 动画适合：

- 算法演示
- 数据流变化
- 数学过程展示
- 教学视频素材
- 简单实时监控

---

## 三十八、交互事件

Matplotlib 可以监听鼠标点击等事件。

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [2, 5, 3], marker="o")


def on_click(event):
    if event.inaxes is not None:
        print(
            f"x={event.xdata:.2f}, "
            f"y={event.ydata:.2f}"
        )


fig.canvas.mpl_connect(
    "button_press_event",
    on_click
)

plt.show()
```

常见事件：

- `button_press_event`
- `button_release_event`
- `motion_notify_event`
- `key_press_event`
- `scroll_event`

这种能力适合制作轻量级交互分析工具。

---

## 三十九、性能优化

当数据量很大时，Matplotlib 可能变慢。

### 1. 对数据降采样

原始数据有 100 万个点时，不一定需要全部绘制。

```python
step = 100
ax.plot(x[::step], y[::step])
```

### 2. 避免重复创建对象

更新图表时，尽量修改已有对象：

```python
line.set_data(x, y)
```

不要在循环中反复执行：

```python
ax.plot(x, y)
```

### 3. 减少标记数量

```python
ax.plot(
    x,
    y,
    marker="o",
    markevery=20
)
```

### 4. 使用更简单的图形元素

大量透明散点、阴影、复杂路径和高分辨率输出都会增加渲染负担。

### 5. 保存时合理设置 DPI

屏幕展示通常不需要过高 DPI，印刷和论文才需要较高分辨率。

### 6. 及时关闭 Figure

批量生成图表时：

```python
plt.close(fig)
```

否则会占用越来越多内存。

```python
for i in range(100):
    fig, ax = plt.subplots()
    ax.plot([1, 2, 3], [i, i + 1, i + 2])
    fig.savefig(f"chart_{i}.png")
    plt.close(fig)
```

---

## 四十、常见错误与解决方法

### 问题 1：中文显示为方框

原因：默认字体不支持中文。

解决：

```python
plt.rcParams["font.sans-serif"] = ["Microsoft YaHei"]
plt.rcParams["axes.unicode_minus"] = False
```

### 问题 2：保存的图片是空白

常见原因：在 `plt.show()` 之后才调用 `savefig()`。

推荐：

```python
fig.savefig("chart.png")
plt.show()
```

### 问题 3：标签被截断

解决：

```python
fig.tight_layout()
```

或者：

```python
fig.savefig(
    "chart.png",
    bbox_inches="tight"
)
```

### 问题 4：多张图相互影响

原因：混用全局 `plt` 状态。

解决：优先使用面向对象方式。

```python
fig, ax = plt.subplots()
ax.plot(...)
```

### 问题 5：循环生成大量图表后内存升高

解决：

```python
plt.close(fig)
```

### 问题 6：图例遮挡数据

解决：

```python
ax.legend(loc="best")
```

或者将图例放到图外：

```python
ax.legend(
    loc="upper left",
    bbox_to_anchor=(1.02, 1)
)
```

### 问题 7：横坐标标签重叠

解决：

```python
ax.tick_params(
    axis="x",
    labelrotation=45
)
```

再配合：

```python
fig.tight_layout()
```

---

## 四十一、Matplotlib 的最佳实践

### 1. 优先使用面向对象 API

推荐：

```python
fig, ax = plt.subplots()
ax.plot(x, y)
```

而不是在复杂项目中完全依赖：

```python
plt.plot(x, y)
```

### 2. 一张图只表达一个主要结论

不要把所有指标都堆在同一张图里。

### 3. 标注单位

例如：

```python
ax.set_ylabel("Revenue (USD)")
```

不要只写：

```python
ax.set_ylabel("Revenue")
```

### 4. 避免误导性的坐标轴

柱状图通常应该从零开始，避免放大微小差异。

### 5. 使用合理的小数位

数据标签应避免显示过多无意义小数。

### 6. 让颜色承担信息，而不是装饰

颜色应该帮助区分类别、突出重点或表达数值变化。

### 7. 建立统一主题

同一个项目中的字体、标题字号、颜色、线宽和背景应保持一致。

### 8. 保存源代码与数据处理逻辑

不要只保留最终图片。可复现性是数据可视化的重要原则。

---

## 四十二、从入门到精通的学习路线

可以按下面的路径学习 Matplotlib。

### 第一阶段：基础绘图

掌握：

- `plot`
- `bar`
- `scatter`
- `hist`
- `pie`
- 标题
- 坐标轴
- 图例
- 网格

### 第二阶段：对象模型

重点理解：

- `Figure`
- `Axes`
- `fig, ax = plt.subplots()`
- `Axes` 的各种方法

这是从"会用"到"熟练"的关键阶段。

### 第三阶段：布局与样式

掌握：

- 多子图
- `GridSpec`
- 字体
- 颜色
- 刻度
- 边框
- 注释
- 主题配置

### 第四阶段：高级图表

学习：

- 热力图
- 等高线图
- 三维图
- 双坐标轴
- 误差线
- 区间填充
- 日期时间轴

### 第五阶段：工程化

重点掌握：

- 样式封装
- 绘图函数封装
- 批量生成图表
- 高质量图片导出
- 性能优化
- 可复现的数据可视化流程

真正的"精通"，不是记住所有参数，而是能够快速找到合适的图表形式，并稳定地将数据转化为清晰、准确、可解释的视觉结果。

---

## 四十三、总结

Matplotlib 的学习可以归纳为四个层次。

### 第一层：能够画图

会使用：

```python
plt.plot()
plt.bar()
plt.scatter()
plt.show()
```

### 第二层：能够控制图

理解：

```python
fig, ax = plt.subplots()
```

并能控制标题、坐标轴、图例、网格、字体和刻度。

### 第三层：能够设计图

知道如何选择图表、突出重点、控制颜色、简化视觉元素，并避免误导。

### 第四层：能够工程化

可以封装绘图函数、批量生成报表、统一项目样式，并保证图表可复现。

如果只记住一句话，那就是：

> Figure 是整张画布，Axes 是真正绘图的区域；复杂图表优先使用面向对象 API。

Matplotlib 的参数很多，但不需要一次性全部记住。先掌握稳定的绘图流程，再根据实际需求逐步补充高级能力，才是最高效的学习方式。

---

## 附录：Matplotlib 常用 API 速查表

### 创建图表

```python
fig, ax = plt.subplots()
fig, axes = plt.subplots(2, 2)
```

### 绘图

```python
ax.plot(x, y)
ax.bar(x, y)
ax.barh(x, y)
ax.scatter(x, y)
ax.hist(data)
ax.pie(values)
ax.boxplot(data)
ax.imshow(matrix)
ax.contour(X, Y, Z)
ax.contourf(X, Y, Z)
ax.fill_between(x, y1, y2)
ax.errorbar(x, y, yerr=error)
```

### 标题与标签

```python
ax.set_title("Title")
ax.set_xlabel("X")
ax.set_ylabel("Y")
fig.suptitle("Main Title")
```

### 坐标轴

```python
ax.set_xlim(0, 10)
ax.set_ylim(0, 100)
ax.set_xscale("log")
ax.set_yscale("log")
```

### 刻度

```python
ax.set_xticks([...])
ax.set_yticks([...])
ax.set_xticklabels([...])
ax.tick_params(...)
```

### 图例和网格

```python
ax.legend()
ax.grid(True)
```

### 文本与注释

```python
ax.text(x, y, "Text")
ax.annotate("Note", xy=(x, y))
```

### 保存图片

```python
fig.savefig(
    "chart.png",
    dpi=300,
    bbox_inches="tight"
)
```

### 关闭图表

```python
plt.close(fig)
```

---

## 写在最后

数据可视化的目标不是"画出一张漂亮的图"，而是让读者更快地理解数据、发现规律并做出判断。

工具只是手段，表达才是目的。

当你能够根据问题选择合适的图表，并用简洁、准确的视觉语言讲清楚数据时，你才真正掌握了 Matplotlib。

> [原文链接](https://mp.weixin.qq.com/s/S0U2SMgQFfZesg_ny0RLPA)
