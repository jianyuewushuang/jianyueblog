---
title: YOLO技术文档
date: 2026-10-04
categories: 技术文档
tags:
    - YOLO
    - 深度学习
excerpt: "在LLM日益泛滥的时代中，小模型仍有着不可替代的应用场景。"
license: cc_by_sa
---

## 前置知识

这部分内容很多摘自Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola. *Dive into Deep Learning*. [https://d2l.ai](https://d2l.ai)，许可协议：CC BY-SA 4.0。

### 计算机视觉

#### 图像增广

当样本比较少时，可以通过图像增广的方式变相扩大样本量，以取得更好的训练效果。

- 裁剪（Crop）
  - 中心裁剪：transforms.CenterCrop
  - 随机裁剪：transforms.RandomCrop
  - 随机长宽比裁剪：transforms.RandomResizedCrop
  - 上下左右中心裁剪：transforms.FiveCrop
  - 上下左右中心裁剪后翻转（默认水平翻转）：transforms.TenCrop
- 翻转和旋转（Flip and Rotation）
  - 依概率p(默认p=0.5) 水平翻转：transforms.RandomHorizontalFlip
  - 依概率p(默认p=0.5) 垂直翻转：transforms.RandomVerticalFlip
  - 随机旋转：transforms.RandomRotation
- 图像变换（resize）
  - 标准化：transforms.Normalize
  - 转为tensor，并归一化至[0-1]：transforms.ToTensor
  - 填充：transforms.Pad
  - 修改亮度、对比度和饱和度：transforms.ColorJitter
  - 转灰度图：transforms.Grayscale
  - 线性变换：transforms.LinearTransformation
  - 仿射变换：transforms.RandomAffine
  - 依概率p转为灰度图：transforms.RandomGrayscale
  - 将数据转换为PILImage：transforms.ToPILImage
  - 改变色调

图像增广还能提高模型的泛化能力，减轻过拟合程度。

#### 迁移学习

**迁移学习（transfer learning）**是指把从源数据集中学到的知识迁移到目标数据集。举个简单的例子，滑旱冰和滑雪技术都已经很高的人大概率在第一次滑冰时也不会表现得太差。

迁移学习的一种方式是**微调（fine-tuning）**，简单来说，微调就是从已经在其他数据集（非目标数据集）上训练好的模型的基础上使用目标数据集开始训练，当目标数据集比源数据集小得多时，微调有助于提高模型的泛化能力。

在微调的过程中，通常使用比从头训练更小的学习率。

#### 边界框

YOLO的输入图像边界框一般用边界框中心坐标和宽高来表示，这里给出这种表示方式和用左上角和右下角的坐标表示的边界框的转换函数：

```python
def box_corner_to_center(boxes):
    """从（左上，右下）转换到（中间，宽度，高度）"""
    x1, y1, x2, y2 = boxes[:, 0], boxes[:, 1], boxes[:, 2], boxes[:, 3]
    cx = (x1 + x2) / 2
    cy = (y1 + y2) / 2
    w = x2 - x1
    h = y2 - y1
    boxes = torch.stack((cx, cy, w, h), axis=-1)
    return boxes

def box_center_to_corner(boxes):
    """从（中间，宽度，高度）转换到（左上，右下）"""
    cx, cy, w, h = boxes[:, 0], boxes[:, 1], boxes[:, 2], boxes[:, 3]
    x1 = cx - 0.5 * w
    y1 = cy - 0.5 * h
    x2 = cx + 0.5 * w
    y2 = cy + 0.5 * h
    boxes = torch.stack((x1, y1, x2, y2), axis=-1)
    return boxes
```

同时，坐标系的原点一般在图片左上角，向右为x轴正方向，向下为y轴正方向。

#### 交并比

**杰卡德系数（Jaccard）**用来衡量锚框和真实边界框之间的相似性：

$$
J(\mathcal{A},\mathcal{B}) = \frac{\left|\mathcal{A} \cap \mathcal{B}\right|}{\left| \mathcal{A} \cup \mathcal{B}\right|}.
$$

对于两个边界框，杰卡德系数也通常被叫做**交并比（intersection over union，IoU）**。它的值>=1且<=0。

下面给出计算两个用对角坐标表示的锚框的交并比的函数：

```python
def box_iou(boxes1, boxes2):
    """计算两个锚框或边界框列表中成对的交并比"""
    box_area = lambda boxes: ((boxes[:, 2] - boxes[:, 0]) *
                              (boxes[:, 3] - boxes[:, 1]))
    # boxes1,boxes2,areas1,areas2的形状:
    # boxes1：(boxes1的数量,4),
    # boxes2：(boxes2的数量,4),
    # areas1：(boxes1的数量,),
    # areas2：(boxes2的数量,)
    areas1 = box_area(boxes1)
    areas2 = box_area(boxes2)
    # inter_upperlefts,inter_lowerrights,inters的形状:
    # (boxes1的数量,boxes2的数量,2)
    inter_upperlefts = torch.max(boxes1[:, None, :2], boxes2[:, :2])
    inter_lowerrights = torch.min(boxes1[:, None, 2:], boxes2[:, 2:])
    inters = (inter_lowerrights - inter_upperlefts).clamp(min=0)
    # inter_areasandunion_areas的形状:(boxes1的数量,boxes2的数量)
    inter_areas = inters[:, :, 0] * inters[:, :, 1]
    union_areas = areas1[:, None] + areas2 - inter_areas
    return inter_areas / union_areas
```

#### 非极大值抑制

**非极大值抑制（non-maximum suppression，NMS）**用于合并属于同一目标的输出许多相似的具有明显重叠的预测边界框。

对于一个预测边界框B，目标检测模型会计算每个类别的预测概率。假设最大的预测概率为p，则该概率所对应的类别B即为预测的类别。具体来说，我们将p称为预测边界框B的**置信度（confidence）**。在同一张图像中，所有预测的非背景边界框都按置信度降序排序，以生成列表。然后我们通过以下步骤操作排序列表L。

1. 从L中选取置信度最高的$B_1$预测边界框作为基准，然后将所有与$B_1$的IoU超过预定阈值$\epsilon$的非基准预测边界框从中L移除。这时，L保留了置信度最高的预测边界框，去除了与其太过相似的其他预测边界框。简而言之，那些具有非极大值置信度的边界框被抑制了。
2. 从L中选取置信度第二高的预测边界框$B_2$作为又一个基准，然后将所有与$B_2$的IoU大于$\epsilon$的非基准预测边界框从L中移除。
3. 重复上述过程，直到L中的所有预测边界框都曾被用作基准。此时，L中任意一对预测边界框的IoU都小于阈值$\epsilon$；因此，没有一对边界框过于相似。
4. 输出列表L中的所有预测边界框。

以下函数按降序对置信度进行排序并返回其索引：

```python
def nms(boxes, scores, iou_threshold):
    """对预测边界框的置信度进行排序"""
    B = torch.argsort(scores, dim=-1, descending=True)
    keep = []  # 保留预测边界框的指标
    while B.numel() > 0:
        i = B[0]
        keep.append(i)
        if B.numel() == 1: break
        iou = box_iou(boxes[i, :].reshape(-1, 4),
                      boxes[B[1:], :].reshape(-1, 4)).reshape(-1)
        inds = torch.nonzero(iou <= iou_threshold).reshape(-1)
        B = B[inds + 1]
    return torch.tensor(keep, device=boxes.device)
```

以下函数来将非极大值抑制应用于预测边界框：

```python
def multibox_detection(cls_probs, offset_preds, anchors, nms_threshold=0.5,
                       pos_threshold=0.009999999):
    """使用非极大值抑制来预测边界框"""
    device, batch_size = cls_probs.device, cls_probs.shape[0]
    anchors = anchors.squeeze(0)
    num_classes, num_anchors = cls_probs.shape[1], cls_probs.shape[2]
    out = []
    for i in range(batch_size):
        cls_prob, offset_pred = cls_probs[i], offset_preds[i].reshape(-1, 4)
        conf, class_id = torch.max(cls_prob[1:], 0)
        predicted_bb = offset_inverse(anchors, offset_pred)
        keep = nms(predicted_bb, conf, nms_threshold)

        # 找到所有的non_keep索引，并将类设置为背景
        all_idx = torch.arange(num_anchors, dtype=torch.long, device=device)
        combined = torch.cat((keep, all_idx))
        uniques, counts = combined.unique(return_counts=True)
        non_keep = uniques[counts == 1]
        all_id_sorted = torch.cat((keep, non_keep))
        class_id[non_keep] = -1
        class_id = class_id[all_id_sorted]
        conf, predicted_bb = conf[all_id_sorted], predicted_bb[all_id_sorted]
        # pos_threshold是一个用于非背景预测的阈值
        below_min_idx = (conf < pos_threshold)
        class_id[below_min_idx] = -1
        conf[below_min_idx] = 1 - conf[below_min_idx]
        pred_info = torch.cat((class_id.unsqueeze(1),
                               conf.unsqueeze(1),
                               predicted_bb), dim=1)
        out.append(pred_info)
    return torch.stack(out)
```

在执行非极大值抑制前，可以将置信度较低的预测边界框移除，从而减少此算法中的计算量。

非极大值抑制本质上是一种贪心算法，但确实存在一种情况，即一些被移除的边界框实际上可能是有用的。例如，在目标密集的场景中，一些预测可能被错误地视为冗余，但实际上代表了不同的目标实例。这可能导致**漏检（missed detections）**问题。

为了解决这个问题，提出了一种叫做**Soft-NMS**的改进版本。Soft-NMS旨在通过减小与高置信度边界框重叠的其他边界框的置信度来柔和地抑制它们，而不是完全移除它们。这样可以保留一些被抑制的边界框，以更好地捕捉目标检测中的细微变化。

 Soft-NMS的主要思想是通过引入一个衰减函数，降低与高置信度边界框重叠的其他边界框的置信度。这样，即使边界框之间存在一定的重叠，仍然有机会保留一些低置信度的边界框。

在Soft-NMS中，算法的步骤如下：

1. 对所有的边界框按照置信度进行排序，选取置信度最高的边界框作为当前最佳边界框。
2. 对于与当前最佳边界框重叠超过一定阈值的其他边界框，使用衰减函数降低它们的置信度。
3. 重复步骤1和2，直到所有的边界框被处理完毕或达到停止条件。

通过引入衰减函数，Soft-NMS能够在一定程度上保留一些被抑制的边界框，从而提高对密集目标的检测能力。

#### 单阶段检测和多阶段检测

- 检测方式：
  - 单阶段（one-stage）目标检测方法通过将不同尺度和比例的预定义锚框（anchor boxes）应用于图像的不同位置，直接回归目标的边界框位置和类别信息。单阶段检测方法有YOLO 系列、SSD（Single Shot MultiBox Detector）、RetinaNet 等。
  - 两阶段（two-stage）目标检测方法包括R-CNN、Fast R-CNN、Faster R-CNN和Mask R-CNN等。这些方法首先在图像中生成候选区域（region proposals），然后对这些候选区域进行分类和边界框回归。
- 速度和准确性：
  - 单阶段检测方法在单次前向传播中同时执行分类和边界框回归，使得在处理速度上相对较快，适用于实时应用和对速度要求较高的场景。然而，在目标检测的准确性上可能会稍逊一筹。
  - 两阶段检测方法虽然相对较慢，但在准确性上通常优于SSD。它的两阶段设计允许更精细的特征提取和候选区域的筛选，从而提高了目标检测的准确性。尤其是Mask R-CNN在实例分割任务上表现出色。
- 训练方式：
  - 单阶段检测使用硬负样本挖掘（Hard Negative Mining）来平衡正负样本的数量，并使用多尺度特征图来检测不同尺度的目标。
  - 多阶段检测的训练过程包括候选区域生成和区域分类/边界框回归两个阶段。它们通常使用区域建议网络（Region Proposal Network，RPN）来生成候选区域，并使用RoI池化（Region of Interest pooling）等技术来提取区域特征。

总的来说，单阶段检测适用于需要快速处理速度的实时应用场景，而多阶段检测则更适合对准确性要求较高的任务。

### 计算性能

#### 编程语言

##### 命令式编程

**命令式编程（imperative programming）**就是按照命令的执行顺序来编程。比如python，它是一种**解释型语言（interpreted language）**，需要python解释器才能运行，这导致它的多线程运行能力很差，还会产生一些额外开销，用python进行高性能计算的瓶颈通常是python解释器。

##### 符号式编程

**符号式编程（symbolic programming）**是在代码完全定义了过程之后才执行计算，比如C语言和C++等，虽然需要先编译才能运行，但编译器在这个过程中会对程序进行大量优化，使得程序的执行效率很高，在执行的过程中也更省内存。

而且编译出来的可执行文件还便于在不同环境中运行。

##### 混合式编程

**混合式编程**允许用户使用纯命令式编程进行开发和调试，同时能够将大多数程序转换为符号式程序，以便在需要产品级计算性能和部署时使用。

#### 计算精度

模型里权重、中间计算结果的数值储存方式，决定速度、显存占用、精度损失。

1. **FP32（float32，单精度）**：默认训练精度，4字节。精度最高，最慢，占显存最大。
2. **FP16（float16，半精度）**：2字节。数值范围缩小，现代GPU/NPU原生支持。**速度翻倍，显存减半，精度损失很小，最常用**。N卡、Intel Arc、NPU都支持FP16加速。
3. **INT8（8位整型）**：1字节。把浮点数映射到整数。速度大概是FP32的3~4倍，显存降到1/4；**会有精度损失**，需要做量化校准，边缘设备首选。

#### 推理引擎

##### ONNX Runtime（ORT）

由微软开发的推理引擎，专门用来加载并跑ONNX模型。

- 跨硬件支持好，CPU / N卡 / A卡 / Intel核显NPU都支持，通过切换Provider后端调用不同硬件加速。
- 极致硬件优化不如硬件厂商自家引擎（比如N卡上TensorRT更快）。

##### TensorRT

N卡专属推理引擎，NVIDIA出品。

- 可以读ONNX，然后内部做深度图优化、算子融合、量化，生成TensorRT专属`.engine`文件
- 只能在NVIDIA显卡运行，推理速度最高。

##### OpenVINO

Open Visual Inference and Neural network Optimization，是Intel 推出的开源深度学习推理部署工具包，目标是把训练好的 AI 模型做优化、加速推理，在 Intel 硬件上实现从边缘设备到云端的部署。

- 可以读ONNX，再转成IR（`.xml`+`.bin`）模型
- Intel CPU、Intel核显、Arc独显、Intel NPU深度优化，但在NVIDIA显卡上性能一般。

##### NCNN

腾讯开发的移动端轻量端侧推理引擎，用C++编写，无第三方依赖。

- 输入为ONNX转ncnn的`.param`+`.bin`
- 轻量、跨平台，不依赖GPU驱动，但PC平台性能不如TensorRT/OpenVINO。

#### 权重文件格式

##### 训练权重文件

训练用权重文件只存参数，依赖代码里的网络结构。

1. **`.pt` / `.pth` / `.ckpt`**
    PyTorch权重格式。底层是Python pickle序列化，里面可以只存权重state_dict，也可以附带epoch、loss、优化器参数，用来断点续训。缺点：加载存在安全风险，必须要有对应的模型代码才能加载，不能直接拿去OpenVINO/TensorRT推理。
2. **`.bin`**
    本质也是pickle，常见于大模型分片权重，和pt/pth原理一致。
3. **`.safetensors`**
    HuggingFace推出的安全权重格式，只存张量，没有pickle代码执行漏洞，支持内存映射，加载更快。现在很多项目逐步替代bin/ckpt，同样只存权重，不带网络图，仍然需要模型代码来构建网络结构。
4. **`.h5` / `.weights.h5`**
    HDF5格式，TensorFlow和Keras的权重存储方案，存储张量，用于tensorflow训练保存。

##### 部署模型文件

部署模型文件自带计算图，可直接在推理引擎运行。

1. **`.onnx`**
    Open Neural Network Exchange。同时保存计算图和权重，跨框架通用中间格式。训练完把pt导出成onnx，就可以给ONNX Runtime、OpenVINO、TensorRT加载推理，不需要PyTorch和模型源码。是部署最通用的中转站。
2. **`.xml`和`.bin`**
    xml：网络拓扑结构；bin：模型权重。是OpenVINO原生格式，用Model Optimizer把onnx转IR，Intel CPU/GPU/NPU推理性能最优。
3. **`.engine`**
    NVIDIA专属编译后的引擎文件，onnx经过TensorRT优化、算子融合、量化编译生成，绑定硬件环境，换显卡必须重新编译，NVIDIA设备推理速度最快。
4. **`.torchscript`**
    PyTorch导出的序列化模型，图+权重打包，可以脱离Python源码在C++ libtorch中推理，但仍然绑定PyTorch生态。
5. **`.param`和`.bin`**
    NCNN的格式，param是网络结构，bin是权重，移动端部署常用。
6. **`.gguf`**
    llama.cpp使用，主打本地大模型量化推理，自带量化参数，多用于LLM。

#### 模型性能评估指标

基于**GT（Ground Truth，真值框）**和IoU的结果：

- TP（True Positive，真正例）：预测框与某个 GT 的 IoU≥0.5，且类别预测正确（比如预测 “猫”，GT 也是 “猫”）；
- FP（False Positive，假正例）：两种情况 ——①IoU<0.5（框错了）；②类别预测错（比如把 “狗” 预测成 “猫”）；
- FN（False Negative，假负例）：GT 存在，但模型没检测出来（漏检）；
- TN（True Negative，真负例）：图像里没有目标，模型也没预测出目标。

评价指标：

- 精确率（Precision）：预测对的正例占所有预测正例的比例。公式：Precision = TP / (TP + FP)例：模型预测了 10 个 “猫”，其中 8 个是对的（TP=8），2 个是错的（FP=2），则 Precision=8/(8+2)=80%。
- 召回率（Recall）：预测对的正例占所有真实正例的比例。公式：Recall = TP / (TP + FN)例：图像里实际有 10 只猫（TP+FN=10），模型只检测出 8 只（TP=8），则 Recall=8/10=80%。

计算结果：

- AP（Average Precision，单类别精度）：取一个类别，以 Recall 为横轴、Precision 为纵轴，绘制PR 曲线，计算 PR 曲线下的面积就是该类别的 AP 值。
- mAP（mean Average Precision，平均类别精度）是所有类别的 AP 值的平均值，量化了模型整体的识别效果。

PR曲线为锯齿形，因为在前几次预测时，

1. 如果预测正确，那精确度始终是1，召回率在持续升高，图线为向右的水平线；
2. 当预测错误时，召回率不变，精确度下降，图线为向下的垂线；
3. 当再次预测正确时，精确度和召回率一起上升，图线为向斜上方的斜线；
4. 当再次预测错误时，图线又为向下的垂线；
5. 如此往复，PR曲线便成了锯齿形。

## YOLOv1技术框架

[YOLOv1论文](https://arxiv.org/abs/1506.02640v5)

YOLO模型将目标检测问题直接视为一个回归问题。YOLO模型将图像划分为网格，并预测每个网格的边界框和类别的概率。对于每个边界框，YOLO模型通过回归预测其坐标和大小。此外，对于每个网格，模型还预测每个类别的置信度得分，表示该网格中是否包含该类别的目标。

$$ \text{Image} \xrightarrow{\text{一次前向}} \{\,(x,y,w,h,\text{conf}), \text{class probs}\,\} $$

因为整条流水线只有一个网络，所以能端到端地直接对检测性能做优化，推理延迟可以压到 25 ms 以内。

### 实现框架

1. 输入图像被划分为7×7的网格。
2. 物体中心落在哪个格子，就由哪个格子负责检测它。
3. 每个格子预测B 个边界框以及每个框的置信度。
4. 每个格子还预测 C 个条件类别概率 $\Pr(\text{Class}_i \mid \text{Object})$。

每个 bounding box 预测 5 个值：

| 量 | 含义 | 归一化方式 | 取值范围 |
| --- | --- | --- | --- |
| x, y | 框中心坐标 | 相对所在格子左上角的偏移 | 0~1 |
| w, h | 框宽高 | 相对整幅图像宽高 | 0~1 |
| confidence | 置信度 | $\Pr(\text{Object}) \times \text{IOU}_{pred}^{truth}$ | 0~1 |

**置信度（confidence）**的意思是格子里没物体时目标为 0；有物体时目标等于预测框与 GT 框的 IOU。

之后根据这些boxs的输出生成张量：

$$ 7\times7\times\underbrace{(B\times5 + C)}_{2\times5 + 20 = 30} = 7\times7\times30 $$

每个格子的 30 维向量排布为：

```txt
[ x1, y1, w1, h1, C1,   x2, y2, w2, h2, C2,   p1, p2, ..., p20 ]
└────── box 1 ──────┘  └────── box 2 ──────┘  └── 20 类概率 ──┘
```

这些张量对物体的信息储存采用了**独热编码（one-hot encoding）**，类别对应的分量设置为1，其他所有分量设置为0。例如：

$ y \in \{(1, 0, 0,……), (0, 1, 0，……), (0, 0, 1，……)，……\}. $

把条件类别概率与单框置信度相乘：

$$ \underbrace{\Pr(\text{Class}_i\mid\text{Object})}_{\text{格子级}}\times\underbrace{\Pr(\text{Object})\times\text{IOU}_{pred}^{truth}}_{\text{框级}} = \Pr(\text{Class}_i)\times\text{IOU}_{pred}^{truth} \tag{1} $$

相乘得到的 **class-specific confidence score** 同时表达了这个框是某类的概率和这个框的准确程度。

卷积部分设计上借鉴 GoogLeNet，但没有使用Inception模块，而是用1×1 卷积降维和3×3 卷积提特征。

| 阶段 | 层配置 | 输出尺寸 |
| --- | --- | --- |
| 特征提取 | 7×7×64-s-2 → maxpool 2×2-s-2 | 448 → 224 → 112 |
| | 3×3×192 → maxpool | 112 → 56 |
| | [1×1×128, 3×3×256, 1×1×256, 3×3×512] → maxpool | 56 → 28 |
| | [1×1×256, 3×3×512]×4, [1×1×512, 3×3×1024] → maxpool | 28 → 14 |
| | [1×1×512, 3×3×1024]×2, 3×3×1024, 3×3×1024-s-2 | 14 → 7 |
| | 3×3×1024, 3×3×1024 | 7×7×1024 |
| 检测头 | FC 4096 → FC 1470 → reshape | 7×7×30 |

最终特征图大小为 7×7，一个像素反映了输入上 64×64 像素区域的特征，而这64×64的区域便叫做感受野，感受野越大越能看清物体全貌，感受野越小越能看清物体细节。

### 损失函数

$$
\begin{aligned}
&\lambda_{coord}\sum_{i=0}^{S^2}\sum_{j=0}^{B}\mathbb{1}_{ij}^{obj}\big[(x_i-\hat x_i)^2+(y_i-\hat y_i)^2\big] &&\text{① 中心点定位损失}\\
+&\lambda_{coord}\sum_{i=0}^{S^2}\sum_{j=0}^{B}\mathbb{1}_{ij}^{obj}\big[(\sqrt{w_i}-\sqrt{\hat w_i})^2+(\sqrt{h_i}-\sqrt{\hat h_i})^2\big] &&\text{② 宽高损失}\\
+&\sum_{i=0}^{S^2}\sum_{j=0}^{B}\mathbb{1}_{ij}^{obj}(C_i-\hat C_i)^2 &&\text{③ 有物体框的置信度损失}\\
+&\lambda_{noobj}\sum_{i=0}^{S^2}\sum_{j=0}^{B}\mathbb{1}_{ij}^{noobj}(C_i-\hat C_i)^2 &&\text{④ 无物体框的置信度损失}\\
+&\sum_{i=0}^{S^2}\mathbb{1}_{i}^{obj}\sum_{c\in classes}\big(p_i(c)-\hat p_i(c)\big)^2 &&\text{⑤ 分类损失}
\end{aligned}
$$

| 设计 | 解决的问题 |
| --- | --- |
| $\lambda_{coord}=5$ | SSE 把定位误差和分类误差等权；抬高定位权重让模型更重视框准不准 |
| $\lambda_{noobj}=0.5$ | 一张图里绝大多数格子没有物体，若等权会把 confidence 全推向 0、压过正样本梯度、导致训练早期发散 |
| 预测 $\sqrt{w},\sqrt{h}$ | SSE 对大框小框偏差同等惩罚，但同样的绝对偏差在小框上 IOU 损失大得多；开根号让小框的偏差获得更大梯度 |

### 局限

当大量小物体堆积时，NMS会把很多本应是不同物体的框抑制掉，导致无法检测如鸟群这样的密集物体集群。

## 历代YOLO发展历程

推荐[这篇知乎上山河动人的文章](https://zhuanlan.zhihu.com/p/1978819629330765721)。

## YOLO使用

在[Hugging Face](https://huggingface.co/spaces/Ultralytics/YOLO26)上可以简单试玩一下YOLO。

### 环境搭建

#### python

##### windows

python解释器版本建议使用3.11或3.12。

首先从[python官网](https://www.python.org/downloads/release/pymanager-263)下载并安装python install manager或执行：

```powershell
# 安装python install manager
winget install 9NQ7512CXL7T
# 安装python 3.11
pymanager install 3.11
cd path/to/your/project
# 创建虚拟环境
py -3.11 -m venv .venv
# 或
python3.11 -m venv .venv
# 激活虚拟环境
.venv/Scripts/activate
```

##### linux

```bash
sudo apt install -y python3 python3-pip python3-venv
# 在当前目录创建名为.venv的虚拟环境
python3 -m venv .venv
# 激活当前目录的虚拟环境
source .venv/bin/activate
```

#### pytorch

分为CPU版和CUDA版，不同操作系统也有差异，详情请见[官网](https://pytorch.org/get-started/locally)。

```bash
pip install torch torchvision
```

#### YOLO

[YOLO官方文档](https://docs.ultralytics.com/zh)

```bash
pip install -U ultralytics
```

#### 运行测试

创建`main.py`：

```python
from ultralytics import YOLO

model = YOLO("yolo26n.pt")  # 加载预训练的 YOLO26n 检测模型
results = model(
    "https://ultralytics.com/images/bus.jpg", save=True
)  # 进行预测并保存标注后的图像
```

```bash
python main.py
```

如果能跑出结果并且没有报错就说明环境搭建成功了。

### 使用细节

推荐看[B站UP主林亿饼](https://space.bilibili.com/14282305?spm_id_from=333.788.upinfo.head.click)的视频。

## 实验

我也用YOLO进行了一些训练实验，以下是我的部分实验报告。

### 实验环境

| 项目 | 无GPU的电脑 | 有GPU的电脑 |
| --- | --- | --- |
| 模型 | Ultralytics 8.4.171（YOLOv8） | Ultralytics 8.4.171（YOLOv8） |
| 操作系统 | Windows 11 | Windows 11 |
| Python | 3.11.9 | 3.11.9 |
| CPU | Intel Core Ultra X7 358H，16 核 | Intel Core Ultra 7 255H，16 核 |
| GPU | 无 | NVIDIA GeForce RTX 5060 Laptop，8GB |
| 内存 | 32 GB | 32 GB |
| 驱动 | — | NVIDIA 595.95 |
| PyTorch | 2.14.1+cpu | 2.11.0+cu128 |
| ONNX Runtime | 1.30.0（CPU EP） | 1.22.0（onnxruntime-gpu，CUDA EP） |
| OpenVINO | 2026.4.1 | 2026.x |
| TensorRT | - | 11.3 |
| 其他 | — | torch-pruning 1.6.1、nvidia-modelopt |

模型：YOLOv8n， 3.2M 参数、8.7 GFLOPs@640，COCO 预训练权重迁移。

完整超参数：

```yaml
task: detect
mode: train
model: yolov8n.pt
data: ******
epochs: 25
time: null
patience: 15
batch: 32
imgsz: 320
save: true
save_period: -1
cache: false
device: cpu
workers: 6
project: ******
name: armor_yolov8n
exist_ok: true
pretrained: true
cls_remap: true
optimizer: AdamW
verbose: true
seed: 0
deterministic: true
single_cls: false
rect: false
cos_lr: true
close_mosaic: 10
resume: false
amp: true
fraction: 1.0
profile: false
freeze: null
multi_scale: 0.0
compile: false
channels_last: null
overlap_mask: true
mask_ratio: 4
dropout: 0.0
val: true
split: val
save_json: false
conf: null
iou: 0.7
max_det: 300
quantize: null
dnn: false
plots: true
nms: null
source: null
vid_stride: 1
stream_buffer: false
visualize: false
augment: false
agnostic_nms: false
classes: null
retina_masks: false
embed: null
show: false
save_frames: false
save_txt: false
save_conf: false
save_crop: false
show_labels: true
show_conf: true
show_boxes: true
line_width: null
format: torchscript
optimize: false
dynamic: false
simplify: true
opset: null
workspace: null
lr0: 0.001
lrf: 0.01
momentum: 0.937
weight_decay: 0.0005
warmup_epochs: 3.0
warmup_momentum: 0.8
warmup_bias_lr: 0.1
distill_model: null
dis: 6.0
box: 7.5
cls: 0.5
cls_pw: 0.0
dfl: 1.5
pose: 12.0
kobj: 1.0
rle: 1.0
angle: 1.0
dlog: 1.0
dgrad: 0.5
dlam: 1.0
nbs: 64
hsv_h: 0.015
hsv_s: 0.6
hsv_v: 0.4
degrees: 5.0
translate: 0.1
scale: 0.5
shear: 0.0
perspective: 0.0
flipud: 0.0
fliplr: 0.5
bgr: 0.0
mosaic: 1.0
mixup: 0.0
cutmix: 0.0
copy_paste: 0.0
copy_paste_mode: flip
auto_augment: randaugment
erasing: 0.4
cfg: null
tracker: tracktrack.yaml
save_dir: *******
```

### CPU运行实验结果

计时方法：

- imgsz=640，200 帧均值；
- 所有延迟均使用 `time.perf_counter()`记时；
- warm-up 30 次。
- mAP 使用 conf=0.001、IoU=0.6在同一验证集上评测。

不同后端在前处理、推理、后处理三个阶段的用时：

```json
[
  {
    "tag": "baseline_torch_fp32",
    "label": "Baseline (PyTorch FP32)",
    "backend": "PyTorch",
    "precision": "FP32",
    "imgsz": 640,
    "accelerated": false,
    "model_size_MB": 5.92,
    "mAP50": 0.9505157941398065,
    "mAP50-95": 0.8046238397715496,
    "inference_ms_mean": 112.12526224961039,
    "pipeline_ms_mean": 116.72645624916186,
    "fps_inference": 8.918607694587102,
    "fps_pipeline": 8.567051892233923,
    "speedup_inference_vs_baseline": 1.0,
    "speedup_pipeline_vs_baseline": 1.0,
    "mAP50_delta_vs_baseline": 0.0,
    "mAP5095_delta_vs_baseline": 0.0
  },
  {
    "tag": "ort_fp32",
    "label": "Opt-1 ONNX Runtime FP32",
    "backend": "ONNX Runtime",
    "precision": "FP32",
    "imgsz": 640,
    "accelerated": true,
    "model_size_MB": 11.68,
    "mAP50": 0.9501894688363978,
    "mAP50-95": 0.8032120643684686,
    "inference_ms_mean": 38.19132149925281,
    "pipeline_ms_mean": 45.356810499724816,
    "fps_inference": 26.223027469698696,
    "fps_pipeline": 22.073065734636707,
    "speedup_inference_vs_baseline": 2.94,
    "speedup_pipeline_vs_baseline": 2.57,
    "mAP50_delta_vs_baseline": -0.0003,
    "mAP5095_delta_vs_baseline": -0.0014
  },
  {
    "tag": "openvino_fp16",
    "label": "Opt-2 OpenVINO FP16",
    "backend": "OpenVINO",
    "precision": "FP16",
    "imgsz": 640,
    "accelerated": true,
    "model_size_MB": 5.79,
    "mAP50": 0.9501104135883671,
    "mAP50-95": 0.8011374570833458,
    "inference_ms_mean": 20.213166499888757,
    "pipeline_ms_mean": 25.12938775056682,
    "fps_inference": 49.47270408857963,
    "fps_pipeline": 39.79404593325664,
    "speedup_inference_vs_baseline": 5.55,
    "speedup_pipeline_vs_baseline": 4.65,
    "mAP50_delta_vs_baseline": -0.0004,
    "mAP5095_delta_vs_baseline": -0.0035
  },
  {
    "tag": "ort_int8",
    "label": "Opt-3 ONNX Runtime INT8 (PTQ)",
    "backend": "ONNX Runtime",
    "precision": "INT8",
    "imgsz": 640,
    "accelerated": true,
    "model_size_MB": 3.3,
    "mAP50": 0.9354864946519098,
    "mAP50-95": 0.7520962171672579,
    "inference_ms_mean": 36.950518249868765,
    "pipeline_ms_mean": 44.25296150009672,
    "fps_inference": 27.06342737799799,
    "fps_pipeline": 22.597380686529135,
    "speedup_inference_vs_baseline": 3.03,
    "speedup_pipeline_vs_baseline": 2.64,
    "mAP50_delta_vs_baseline": -0.015,
    "mAP5095_delta_vs_baseline": -0.0525
  },
  {
    "tag": "ablation_torch_320",
    "label": "Ablation PyTorch FP32 @320",
    "backend": "PyTorch",
    "precision": "FP32",
    "imgsz": 320,
    "accelerated": false,
    "model_size_MB": 5.92,
    "mAP50": 0.9844448315685903,
    "mAP50-95": 0.88847591073763,
    "inference_ms_mean": 30.816979999217438,
    "pipeline_ms_mean": 32.14170850085793,
    "fps_inference": 32.45621846988672,
    "fps_pipeline": 31.11770458617304,
    "speedup_inference_vs_baseline": 3.64,
    "speedup_pipeline_vs_baseline": 3.63,
    "mAP50_delta_vs_baseline": 0.0339,
    "mAP5095_delta_vs_baseline": 0.0839
  }
]
```

可以看出，PyTorch 路径下，约 96% 的时间花在模型前向上，预处理约 4 ms、NMS 仅约 0.5 ms。

但不同推理后端在不同阶段耗时占比有所变化，换成 OpenVINO 后推理压到 20 ms，同样的预处理/NMS 占比就升到约 20%，想要继续提速必须连预处理一起优化，比如用C++进行预处理和后处理，具体可见后文的C++优化方案分析部分。

### 对`runs/detect/`中的文件作用解释

`runs/detect/` 是 Ultralytics 训练/验证框架自动生成的工作目录。

| 文件 | 内容 | 用途 |
| --- | --- | --- |
| args.yaml | 本次训练的完整超 | 复现实验的配置依据 |
| results.csv | 逐epoch指标日志：box_loss/cls_loss/dfl_loss、P、R、mAP50、mAP50-95 | 训练过程的原始数据 |
| results.png | 由 results.csv 画出的训练曲线总览 | 判断是否收敛/过拟合，最常被引用 |
| labels.jpg | 训练开始时的数据集体检图：12 类框数量分布、框的 xywh 直方图 | 检查类别是否均衡、框尺寸分布 |
| train_batch0/1/2.jpg | 训练初期 batch 的可视化，含 mosaic 拼接、HSV 抖动等增强后的样子 | 直观看到模型“看到”的是什么 |
| train_batch1410/1411/1412.jpg | 训练最后10轮的 batch（Ultralytics 此时自动关闭 mosaic） | 对比增强开关前后的输入差异 |
| val_batch0/1/2_labels.jpg | 3 个固定验证 batch 的人工标注（Ground Truth） | 与 pred 图并排看 |
| val_batch0/1/2_pred.jpg | 同样这 3 个 batch 的模型预测 | labels vs pred 逐张对照，最直观的定性检查 |
| confusion_matrix.png / _normalized.png | 12 类混淆矩阵（原始计数 / 按列归一化） | 看哪些数字类别互相混淆（如 red_3↔red_5） |
| BoxP/R/PR/F1_curve.png | P、R、PR、F1 随置信度阈值变化的曲线 | PR 曲线下面积就是 mAP；F1 曲线可用来选最佳 conf 阈值（部署时调 conf=0.25 的依据之一） |

### 部分过程解释

#### inference latency 与完整 pipeline latency 的区别

- **inference latency（模型推理延迟）**：只统计神经网络前向耗时；

- **pipeline latency（完整流程延迟）**：除推理之外，还包含图像预处理、后处理/NMS环节的耗时。

#### 第一次推理耗时慢的原因和warm-up的作用

推理阶段耗时数据：

| 后端 | 第1帧(ms) | 第2帧(ms) | 第3帧(ms) | 稳态均值(ms) | 首帧/稳态 |
| --- | --- | --- | --- | --- | --- |
| PyTorch | 127.6 | 112.2 | 114.9 | 112.6 | 1.1× |
| ONNX Runtime | 76.8 | 43.0 | 33.9 | 36.6 | 2.1× |
| OpenVINO | 50.1 | 25.8 | 26.0 | 25.0 | 2.0× |

全流程耗时数据：

| 后端 | 第一帧完整处理耗时(ms) | 相当于稳态单帧 |
| --- | --- | --- |
| PyTorch | 6908 | 61× |
| ONNX Runtime | 1828 | 50× |
| OpenVINO | 2088 | 84× |

前几次耗时长的原因：

1. 线程池懒初始化：CPU 后端的算子线程池首次调用时才创建，涉及线程启动与亲和性设置；
2. 内核选择：推理框架第一次见到真实输入形状时，要做算子分派、内核选择或代码生成；
3. 内存池/缓存未预热：中间张量首次分配、内存页缺页、CPU 缓存与分支预测器都是冷的；
4. CUDA 场景额外有上下文初始化、cuDNN autotune、H2D 首次传输等。

因此做性能测试前必须先跑若干次 warm-up，把一次性初始化成本排除，测到的才是稳态服务延迟；否则首帧会把均值显著拉高，得到误导性结论。本项目所有 benchmark 都显式 warm-up 30 次，并单独报告冷启动数据。

### C++优化方案

#### 实现方法

使用了ultralytics官方仓库中的C++示例。

| 事项 | 做法 |
| --- | --- |
| ONNX Runtime | 官方 C++ 封装（`onnxruntime_cxx_api.h`），`Ort::InitApi` 手动初始化 + `LoadLibrary` 加载 ，nv 内同一个 onnxruntime.dll，保证 Python/C++ 对比时推理引擎二进制完全一致 |
| OpenVINO | 官方 C API（`openvino_c`）。MinGW g++ 无法链接 MSVC C++ ABI 的 `openvino.lib`，而 C 接口跨编译器兼容；参数与 Python 端一致（CPU + `PERFORMANCE_HINT=LATENCY`） |
| 图像读取 | 单头文件 `stb_image.h`替代 OpenCV |
| 预处理 | 用双线性 letterbox，采样公式与 `cv2.INTER_LINEAR` 一致 |
| 后处理 | 与 Python 语义等价的逐类贪心 NMS 和坐标还原 |
| 零拷贝输入 | 预处理直接写进与引擎绑定的输入张量缓冲，省掉 Python 版每次 `sess.run` 前的整块拷贝 |
| 构建 | `cpp_infer/build.ps1`或 `cpp_infer/CMakeLists.txt` |
| 正确性对齐验证 | `src/check_cpp_align.py`与 Python 流水线在工作点conf=0.25 下逐框对比 12 张 val 图，检出数量完全一致 |

#### 实验数据

| 配置 | 语言 | 推理延迟(ms) | 完整流程(ms) | FPS(端到端) | mAP50 | 相对 Python 同后端 | 相对 PyTorch 基线 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ORT FP32 | Python | 38.19 | 45.36 | 22.1 | 0.9473 | — | 2.57× |
| ORT FP32 | **C++** | **22.17** | **27.73** | **37.5** | 0.9473 | **1.64×** | **4.21×** |
| ORT INT8 | Python | 36.95 | 44.25 | 22.6 | 0.9362 | — | 2.64× |
| ORT INT8 | **C++** | **27.38** | **33.22** | **30.9** | 0.9364 | **1.33×** | **3.51×** |
| OpenVINO FP16 | Python | 20.21 | 25.13 | 39.8 | 0.9472 | — | 4.65× |
| OpenVINO FP16 | **C++** | **14.01** | **18.92** | **52.9** | 0.9472 | **1.33×** | **6.17×** |

#### 耗时缩短分析

1. **后处理 0.69→0.07 ms（约 10×）**：手写 NMS 直接在连续内存上贪心匹配，免去 numpy 的多维索引、掩码与临时数组分配。
2. **预处理 6.1→5.5 ms（基本持平）**：说明缩放/归一化本身是访存受限操作，C++ 手写双线性并不比 OpenCV 的 SIMD 实现更快——Python 端的预处理瓶颈不在语言而在内存带宽。
3. **精度零损失**：三种配置的 mAP50/mAP50-95 与 Python 完全一致（0.9473 / 0.9362~0.9364 / 0.9472），C++ 只是"换一种方式执行同一计算图"，不改变模型数值（INT8 的 ±0.0002 波动来自取整级浮点差）。
4. **叠加效应**：引擎级加速 × 实现级加速（C++）相乘后，最终 OpenVINO FP16 + C++ 达 18.9 ms / 52.9 FPS，相对 PyTorchPython 基线端到端 6.17×，且精度与基线几乎相同。

推理阶段时长大幅缩短：ORT 38.2→22.2 ms（1.72×）、OpenVINO20.2→14.0 ms（1.44×），原因分析：

1. 调用路径不同：Python 多穿一层绑定
   - Python 端的 `session.run(None, {name: x})` 每次都要经过 pybind11 绑定层：解析参数字典、校验 numpy 的 dtype/shape/连续性、构造临时 `OrtValue`、释放再重取 GIL；
   - C++ 端是直接的一次 C++ 成员调用 `session_.Run(...)`，参数在初始化时已绑定好。
2. 输入拷贝：Python 每帧白搬 4.9 MB
   - Python 每帧新建的 numpy 数组传给 `run()` 时，ORT 会先把数据拷贝进它自己管理的输入缓冲（想避免必须用 io_binding，Python 版没做）。1×3×640×640 FP32 = 4.9 MB，每帧一次多余 memcpy；
   - C++ 端`backends.hpp`在初始化时用 `Ort::Value::CreateTensor` 把自有的 blob 缓冲包装成输入张量，letterbox 预处理直接原地写进这块缓冲——`Run()` 时是零拷贝。
3. 输出与内存管理：Python 每帧“从零再来”
   - Python 每帧：ORT 新分配输出 → 包装成 numpy → 上一帧的 4.9 MB 输入 + 2.15 MB 输出变成垃圾，等引用计数回收。大块内存反复 malloc/mmap 往返，带来页错误和分配器抖动；
   - C++ 每帧：所有缓冲初始化时一次分配、终身复用，`Run()` 只读指针。

### GPU推理测试

#### 完整实验结果

本次训练与先前训练的数据集、超参数均相同。

| 指标 | CPU | GPU | 变化 |
| --- | --- | --- | --- |
| 训练总时长 | 1.266 h | 0.061 h | 快约 20.7× |
| mAP50（val@640） | 0.9498 | 0.9572 | +0.74 pt |
| mAP50-95 | 0.8057 | 0.8101 | +0.44 pt |
| Precision / Recall | 0.898 / 0.885 | 0.928 / 0.907 | 均提升 |

以下为GPU各方案训练结果与CPU训练的详细对比表格：

| 方案 | 推理后端 | 精度 | 输入尺寸 | mAP50 | mAP50-95 | 推理延迟(ms) | 完整流程延迟(ms) | FPS(端到端) | 模型体积(MB) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Baseline PyTorch FP32 (CPU) | PyTorch | 0.9321282328542856 | 640 | 0.9583 | 0.8085 | 29.45 | 33.89 | 29.5 | 5.9 |
| ONNX Runtime FP32 (CPU) | ONNX Runtime | 0.9269013484566134 | 640 | 0.9576 | 0.8065 | 20.71 | 25.58 | 39.3 | 11.7 |
| OpenVINO FP16 (CPU) | OpenVINO | 0.9263983983783515 | 640 | 0.9576 | 0.8048 | 13.26 | 17.76 | 56.3 | 5.8 |
| ONNX Runtime INT8 PTQ (CPU) | ONNX Runtime | 0.922730855465666 | 640 | 0.9514 | 0.7578 | 26.44 | 30.98 | 32.3 | 3.3 |
| PyTorch FP32 (GPU) | PyTorch | 0.9322424735757225 | 640 | 0.9583 | 0.8086 | 5.72 | 10.05 | 99.6 | 5.9 |
| PyTorch FP16 (GPU) | PyTorch | 0.9322424735757225 | 640 | 0.9583 | 0.8086 | 6.03 | 10.33 | 96.8 | 5.9 |
| ONNX Runtime FP32 (GPU) | ONNX Runtime | 0.9266441000942266 | 640 | 0.9576 | 0.8065 | 6.66 | 11.12 | 90.0 | 11.7 |
| TensorRT FP16 (GPU) | TensorRT | 0.9264951179320607 | 640 | 0.9575 | 0.8065 | 3.99 | 8.45 | 118.3 | 7.6 |
| TensorRT INT8 (GPU) | TensorRT | 0.9285398916453214 | 640 | 0.9572 | 0.8000 | 4.58 | 9.07 | 110.2 | 27.6 |
| 剪枝模型 PyTorch FP32 (GPU) | PyTorch | 0.754513396028322 | 640 | 0.8054 | 0.6370 | 5.96 | 10.29 | 97.2 | 5.9 |
| Ablation PyTorch FP32 @320 (CPU) | PyTorch | 0.9693189468910351 | 320 | 0.9858 | 0.8917 | 15.77 | 17.07 | 59.1 | 5.9 |

最快整体方案：TensorRT FP16，118 FPS。

### 优化方案

#### 多线程异步流水线

采用预处理 / 推理 / 后处理各一线程的方案，测试结果如下：

| 后端 | 同步 FPS | 异步流水线 FPS | 吞吐提升 | 异步单帧延迟 |
| --- | --- | --- | --- | --- |
| PyTorch FP32 (CPU) | 27.4 | 33.6 | 1.22× | 291 ms |
| PyTorch FP16 (GPU) | 93.8 | 144.9 | 1.54× | 67 ms |
| TensorRT FP16 (GPU) | 118.3 | 213.5 | 1.80× | 42 ms |

#### 图像预处理与数据传输优化

| 方案 | CPU 预处理 | H2D 传输 | GPU 预处理 | 预处理+传输合计 | 端到端 | FPS |
| --- | --- | --- | --- | --- | --- | --- |
| CPU 预处理 + 可分页 H2D（基线） | 3.83 ms | 0.56 ms | — | 4.39 ms | 9.85 ms | 101.5 |
| CPU 预处理 + pinned memory 异步 H2D | 4.30 ms | 0.37 ms | — | 4.66 ms | 9.72 ms | 102.9 |
| uint8 原图直传 + GPU 端预处理 | — | 0.09 ms | 0.20 ms | 0.29 ms | 4.85 ms | 206.3 |

#### 模型剪枝

用 torch-pruning 做结构化通道剪枝。

| 指标 | 剪枝前 | 剪枝后（ratio=0.2） | 保留 |
| --- | --- | --- | --- |
| MACs@640 | 4.08 G | 2.94 G | 72.2% |
| 参数量 | 3.01 M | 2.08 M | 69.1% |
| mAP50（未微调） | 0.957 | **0.000** | 完全崩坏 |
| mAP50（微调 25 epochs） | — | **0.8054** | −15.2 pt |
| mAP50-95（微调后） | 0.810 | 0.6370 | −17.3 pt |
| GPU 推理延迟 | 5.72 ms | 5.96 ms | 无提速 |

从实验结果可以看出，枝剪对模型的性能有副作用。可能的原因是模型已经很小了，强行枝剪不仅会是模型的识别精度下降，还会使模型的识别速度变慢。

### Profiler 性能分析

| top GPU 层 | 类型 | ms/帧 | 占比 |
| --- | --- | --- | --- |
| model.22 | Detect 头 | 1.337 | **25.6%** |
| model.6 | C2f | 0.462 | 8.8% |
| model.4 | C2f | 0.444 | 8.5% |
| model.2 | C2f | 0.332 | 6.4% |
| model.8 | C2f | 0.325 | 6.2% |

## 问题回答

### YOLO 推理速度主要受哪些因素影响？

#### 模型本身

| 因素 | 对速度的影响 |
| --- | --- |
| **模型大小/结构** | 参数量与计算量（FLOPs）越大越慢。YOLOv8n（3.2M 参数 / 8.7 GFLOPs@640）比 YOLOv8x（68M / 258 GFLOPs）快一个数量级。深度可分离卷积、更少的通道数、更少的检测头分支都能降延迟。 |
| **输入分辨率 imgsz** | 计算量近似随分辨率平方增长：640→320，输入像素数变为 1/4，骨干特征面积也约为 1/4，推理延迟通常显著下降（实测见实验报告“消融实验”）。但小目标会更难检出。 |
| **数值精度（FP32/FP16/INT8）** | 低精度单元素占字节少、吞吐高、访存省；INT8 还能使用 CPU 的 VNNI 指令 / GPU 的 Tensor Core。 |

#### 运行平台

- **硬件算力**：CPU 主频与核数、是否支持 AVX2/AVX-512/VNNI/AMX 向量指令；GPU 的 CUDA 核 / Tensor Core；NPU；内存带宽（卷积常常是访存密集而非纯计算密集）。
- **推理框架**：PyTorch Eager（通用、灵活但开销大） vs ONNX Runtime / OpenVINO / TensorRT / NCNN（静态图、算子融合、内核特化、内存复用），差异可达数倍。
- **线程与调度**：CPU 后端的线程数、亲和性；GPU 上的 stream 与异步；batch 大小。

#### 流水线非模型部分

- **预处理**：解码 JPEG、resize/letterbox、色彩空间转换、归一化、HWC↔CHW、连续内存拷贝；
- **数据传输**：主机内存→GPU 显存的 H2D 拷贝（本项目 CPU 推理无此环节，但真实 CUDA 部署中不可忽略）；
- **后处理**：8400 个候选框的解析、置信度过滤、NMS（NMS 是逐目标、难并行的串行操作，目标密集时会明显变慢）；
- **输出/绘制**：画框、写字、编码视频、写盘。

### 为什么 TensorRT、OpenVINO、NCNN 等推理框架可能比直接使用 PyTorch 更快？

直接调用 PyTorch 走的是 Eager（动态图）模式：每个算子是一段通用实现，运行时由 Python 逐算子分派、解释执行，为了兼顾训练所需的自动求导与灵活性，保留了大量“用不上”的东西（autograd 上下文、通用 stride 支持、中间张量临时分配等）。

专用推理框架拿到的是冻结的静态计算图（ONNX / IR），只做前向，可以做很多PyTorch Eager 不方便做的优化：

1. **算子融合（Layer/Graph Fusion）**
   把 Conv+BN+ReLU 等多个小算子合并成一个内核，减少访存与内核启动次数。YOLO 中大量的 `Conv-BN-SiLU` 串联，融合收益非常可观。

2. **常量折叠（Constant Folding）与死代码消除**
   把只依赖权重、不依赖输入的子图（如 reshape、部分 transpose、anchor 生成）在编译期算好；把用不到的分支删掉。

3. **内核自动选择与特化（kernel auto-tuning）**
   针对当前硬件、固定的输入形状、实际的张量尺寸，从多个内核实现中挑最快的（OpenVINO 按 CPU 型号做 ISA 选择；TensorRT 构建时会逐个试跑选最优；NCNN 针对 ARM NEON/移动端微架构手工优化）。

4. **内存规划与复用**
   静态图下每个中间张量的生命周期已知，可以提前一次性分配大块显存/内存并复用，避免推理时反复 malloc/free。

5. **低精度与平台指令**
   无缝使用 FP16/INT8、GPU Tensor Core、CPU AVX2/AVX-512/VNNI/AMX、ARM NEON/Winograd等硬件特性；权重可按更利于向量计算的内存布局重排（如 NCHWc / blocked layout）。

6. **轻量化的运行时**
   纯 C++ 运行、无 Python 解释器开销、无 autograd、无全局解释锁（GIL），方便在移动端/嵌入式部署，启动也更快。

### FP32、FP16、INT8 有什么区别？为什么降低精度可以加速推理？

#### 数值格式区别

| 格式 | 全称 | 总位数 | 指数/尾数 | 动态范围 | 精度 |
| --- | --- | --- | --- | --- | --- |
| **FP32** | 单精度浮点 | 32 bit | 8 / 23 | 极大（±10^38） | 约 7 位有效十进制数字 |
| **FP16** | 半精度浮点 | 16 bit | 5 / 10 | 较小（±65504，易溢出） | 约 3～4 位有效数字 |
| **INT8** | 8 位整数 | 8 bit | 无指数，定点 | 仅表示 256 个离散值（有符号 -128~127 或无符号 0~255） | 量化区间 / 256 |

- FP32 是训练时的通用格式，数值最稳；
- FP16 是浮点，只是“小数位”变少，乘法结果为 FP32 累加时精度损失通常很小；
- INT8 不是浮点，必须先确定一个量化映射：
    真实浮点值 `x ≈ scale × (q − zero_point)`，其中 `q` 是 8 位整数。scale（与 zero_point）怎么来？用一批代表性数据做校准（Calibration），统计激活的数值范围（MinMax / 熵 / 百分位等方法），这就是训练后量化（PTQ）。

#### 为什么低精度更快？

1. **计算吞吐更高**：同一块芯片上，INT8/FP16 的算术单元吞吐往往是 FP32 的
   2～10 倍（向量寄存器一条指令能装下更多元素；专用矩阵单元/Tensor Core 尤其明显）。
   CPU 上有 AVX-VNNI/AMX 指令专门做 INT8 点积。
2. **内存带宽占用更低**：INT8 权重只有 FP32 的 1/4、FP16 是 1/2。
   卷积在相当多情况下是“带宽受限”的，数据搬运变少直接提速；
   同时模型体积同比例缩小，更利于嵌入式部署。
3. **缓存命中率更高**：同样的缓存能装下 4 倍 INT8 数据，减少对慢速主存的访问。

#### 代价：精度损失与缓解

- FP16 通常几乎无损；INT8 风险最大，可能出现小目标置信度下降、罕见类掉点。
- 缓解手段：按通道量化（per-channel）权重、只量化敏感算子、QAT（量化感知训练）、用更多更有代表性的校准数据等。
- 本项目实测：INT8 模型体积约为 FP32 的 1/4，mAP 变化见实验报告，属于“速度—精度”权衡的真实案例。

### 如果神经网络前向推理耗时 10 ms，实际视觉系统是否一定能够达到 100 FPS？为什么？

通常达不到。

100 FPS 的含义是：端到端处理一帧（取流→预处理→推理→后处理→输出/控制）的平均周期 ≤ 10 ms。神经网络前向只是其中一个环节：

相机曝光/采集 → 图像解码/拷贝 → 预处理(letterbox/归一化/排布)→ GPU：H2D 传输 → 前向 10 ms → D2H 回传→ 解码/置信度过滤/NMS → 画框/业务逻辑 → 编码/显示/发送给下位机

- 若预处理 2 ms、传输 1 ms、NMS 2 ms、绘制与输出 1 ms，则端到端约16 ms，实际只有 ≈62 FPS；
- 相机自身可能只有 60 FPS（帧周期 16.7 ms），此时天花板是相机而不是模型；
- 若各环节串行在同一个线程/同一资源上，延迟直接相加；
- 调度抖动、线程同步、GC（Python）、热降频、多个进程抢 CPU/GPU 都会让 P95延迟远高于均值——实时控制更关心抖动（尾延迟）而不只是平均 FPS；

工程对策：

- 让采集、预处理、推理、后处理分别跑在独立线程/队列中，形成生产者-消费者流水线；稳态吞吐由最慢一环决定，但多帧重叠后 CPU/GPU 空闲减少；
- GPU 上用 CUDA Stream 异步、双缓冲（double buffering）掩盖 H2D/计算/D2H；
- 固定输入尺寸避免形状特化反复编译；推理服务连续运行保持“热”状态；
- 必要时牺牲分辨率/模型规模，把端到端延迟（而非只看模型）压进帧周期预算。
