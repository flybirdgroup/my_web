---
id: ML3
title: 机器学习-- 3 梯度下降法
sidebar_label: Style Guide
---

[官方文档信息](https://developers.google.com/machine-learning/crash-course/reducing-loss/gradient-descent)

## 梯度下降法
![img](https://developers.google.com/machine-learning/crash-course/images/GradientDescentDiagram.svg)

现在，这个神秘的绿色框是怎么产生新值的呢?

![img](https://developers.google.com/machine-learning/crash-course/images/convex.svg)

假设我们有时间和计算资源来计算w1的所有可能损失值.那么所产生的损失值和W1的关系图就是凸性,碗状的,因为是一元二次函数 loss = (observation - predict(x))^2

凸性问题只有一个最低点:即只存在一个斜率为0的位置.这个最小值就是损失函数收敛之处.

通过计算整个数据集中w1每个可能值得损失函数来找到收敛点的方法效率低,我们用一个叫做梯度下降法.

梯度下降法的第一个阶段是为w1选择一个起点,起点可以是任意值.因此很多算法就直接将  设为 0 或随机选择一个值。下图显示的是我们选择了一个稍大于 0 的起点：

![img](https://developers.google.com/machine-learning/crash-course/images/GradientDescentStartingPoint.svg)

梯度下降算法会计算损失曲线在起点处的梯度.简而言之,梯度系编导数的矢量;他可以让您了解哪个方向距离目标更近或者更远
请注意，梯度是一个矢量，因此具有以下两个特征：
方向
大小
梯度始终指向损失函数中增长最为迅猛的方向。梯度下降法算法会沿着负梯度的方向走一步，以便尽快降低损失。

![img](https://developers.google.com/machine-learning/crash-course/images/GradientDescentNegativeGradient.svg)

为了确定损失函数曲线的下一个点,梯度下降法算法会将梯度大小的一部分与起点相加,
![img](https://developers.google.com/machine-learning/crash-course/images/GradientDescentGradientStep.svg)

一个梯度步长将我们移动到损失曲线的下一个点

## 学习率
正如之前所述，梯度矢量具有方向和大小。梯度下降法算法用梯度乘以一个称为学习速率（有时也称为步长）的标量，以确定下一个点的位置。例如，如果梯度大小为 2.5，学习速率为 0.01，则梯度下降法算法会选择距离前一个点 0.025 的位置作为下一个点。
![img](https://developers.google.com/machine-learning/crash-course/images/LearningRateTooSmall.svg)

相反，如果您指定的学习速率过大，下一个点将永远在 U 形曲线的底部随意弹跳，就好像量子力学实验出现了严重错误一样：
![img](https://developers.google.com/machine-learning/crash-course/images/LearningRateTooLarge.svg)

每个回归问题都存在一个金发姑娘学习速率。“金发姑娘”值与损失函数的平坦程度相关。如果您知道损失函数的梯度较小，则可以放心地试着采用更大的学习速率，以补偿较小的梯度并获得更大的步长。
![img](https://developers.google.com/machine-learning/crash-course/images/LearningRateJustRight.svg)

## 降低损失 (Reducing Loss)：随机梯度下降法
在梯度下降中,批量指的是用于单次迭代中计算梯度的样本总数.到目前为止，我们一直假定批量是指整个数据集。就 Google 的规模而言，数据集通常包含数十亿甚至数千亿个样本。此外，Google 数据集通常包含海量特征。因此，一个批量可能相当巨大。如果是超大批量，则单次迭代就可能要花费很长时间进行计算

包含随机抽样样本的大型数据集可能包含冗余数据。实际上，批量大小越大，出现冗余的可能性就越高。一些冗余可能有助于消除杂乱的梯度，但超大批量所具备的预测价值往往并不比大型批量高。

如果我们可以通过更少的计算量得出正确的平均梯度，会怎么样？通过从我们的数据集中随机选择样本，我们可以通过小得多的数据集估算（尽管过程非常杂乱）出较大的平均值。 随机梯度下降法 (SGD) 将这种想法运用到极致，它每次迭代只使用一个样本（批量大小为 1）。如果进行足够的迭代，SGD 也可以发挥作用，但过程会非常杂乱。“随机”这一术语表示构成各个批量的一个样本都是随机选择的。

小批量随机梯度下降法（小批量 SGD）是介于全批量迭代与 SGD 之间的折衷方案。小批量通常包含 10-1000 个随机选择的样本。小批量 SGD 可以减少 SGD 中的杂乱样本数量，但仍然比全批量更高效。

为了简化说明，我们只针对单个特征重点介绍了梯度下降法。请放心，梯度下降法也适用于包含多个特征的特征集