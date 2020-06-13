---
id: ML4
title: 机器学习-- 4 TF基本步骤
sidebar_label: Style Guide
---

[官方文档信息](https://developers.google.com/machine-learning/crash-course/first-steps-with-tensorflow/toolkit)

![img](https://developers.google.com/machine-learning/crash-course/images/TFHierarchy.svg)

总结不同层的用途:
Estimator (tf.estimator)	高级 OOP API。
tf.layers/tf.losses/tf.metrics	用于常见模型组件的库。
TensorFlow	低级 API

您应该使用哪个 API？您应该使用能够解决问题的最高级抽象层。较高级别的抽象层更易于使用，但（设计方面）不够灵活。我们建议您先从最高级 API 入手，让所有组件正常运作起来。如果您希望在某些特殊建模方面能够更加灵活一些，则可以降低一个级别。请注意，每个级别都是使用低级 API 构建的，因此降低层次结构级别应该比较直观。

# 简单的线性回归程序
```
import tensorflow as tf
# set up a linear classifier
classifer = tf.estimator.linearClassifier()
# train the model on some example data
classifer.train(input_fn=train_input_fn,steps=2000)
# use the model to predict
predictions = classifer.predict(input_fn=predict_input_fn)
```

机器学习速成课程练习中的常用超参数
很多编码练习都包含以下超参数：

steps：训练迭代的总次数。一步计算一批样本产生的损失，然后使用该值修改一次模型的权重。
batch size：单步的样本数量（随机选择）。例如，SGD 的批次大小为 1。

total number of trained examples = batch sizes * steps

机器学习速成课程练习中的方便变量
有些练习中会出现以下方便变量：

periods：控制报告的粒度。例如，如果 periods 设为 7 且 steps 设为 70，则训练将每 10 步输出一次损失值（即 7 次）。与超参数不同，我们不希望您修改 periods 的值。请注意，修改 periods 不会更改模型所学习的规律。

# 编程练习
[colab练习1](https://colab.research.google.com/notebooks/mlcc/first_steps_with_tensor_flow.ipynb?utm_source=mlcc&utm_campaign=colab-external&utm_medium=referral&utm_content=firststeps-colab&hl=zh-cn#scrollTo=UzoZUSdLIolF)

# 步骤1 读入csv文件,设置参数:
```
from __future__ import print_function

import math

from IPython import display
from matplotlib import cm
from matplotlib import gridspec
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import sklearn.metrics as metrics
%tensorflow_version 1.x
import tensorflow as tf
from tensorflow.python.data import Dataset

tf.logging.set_verbosity(tf.logging.ERROR)
pd.options.display.max_rows = 10
pd.options.display.float_format = '{:.1f}'.format #设置dataframe小数点

california_housing_dataframe = pd.read_csv("https://download.mlcc.google.cn/mledu-datasets/california_housing_train.csv", sep=",")

california_housing_dataframe = california_housing_dataframe.reindex(
    np.random.permutation(california_housing_dataframe.index))
california_housing_dataframe["median_house_value"] /= 1000.0
california_housing_dataframe
```

# 步骤2 设置输入函数,并针对模型训练来定义函数
```
def my_input_fn(features, targets, batch_size=1, shuffle=True, num_epochs=None):
"""Trains a linear regression model of one feature.

Args:
    features: pandas DataFrame of features,特征
    targets: pandas DataFrame of targets,目标值
    batch_size: Size of batches to be passed to the model,批量的大小
    shuffle: True or False. Whether to shuffle the data.
    num_epochs: Number of epochs for which data should be repeated. None = repeat indefinitely
Returns:
    Tuple of (features, labels) for next data batch
"""
# Convert pandas data into a dict of np arrays.
features = {key:np.array(value) for key,value in dict(features).items()}   

# Construct a dataset, and configure batching/repeating.
# 创建Dataset,设置批次和重复次数
ds = Dataset.from_tensor_slices((features,targets)) # warning: 2GB limit
ds = ds.batch(batch_size).repeat(num_epochs)

# Shuffle the data, if specified.
if shuffle:
    ds = ds.shuffle(buffer_size=10000)

# Return the next batch of data.
features, labels = ds.make_one_shot_iterator().get_next()
return features, labels
```

步骤3: 训练模型
```
def train_model(learning_rate, steps, batch_size, input_feature):
  """Trains a linear regression model.
  
  Args:
    learning_rate: A `float`, the learning rate.
    steps: A non-zero `int`, the total number of training steps. A training step
      consists of a forward and backward pass using a single batch.
    batch_size: A non-zero `int`, the batch size.
    input_feature: A `string` specifying a column from `california_housing_dataframe`
      to use as input feature.
      
  Returns:
    A Pandas `DataFrame` containing targets and the corresponding predictions done
    after training the model.
  """
    periods = 10
    steps_per_period = steps / periods
    my_feature = input_feature
    my_feature_data = california_housing_dataframe[[my_feature]].astype('float32')
    my_label = "median_house_value"
    targets = california_housing_dataframe[my_label].astype('float32')

    # Create input functions.
    training_input_fn = lambda: my_input_fn(my_feature_data, targets, batch_size=batch_size)
    predict_training_input_fn = lambda: my_input_fn(my_feature_data, targets, num_epochs=1, shuffle=False)

    # Create feature columns.
    feature_columns = [tf.feature_column.numeric_column(my_feature)]

    # Create a linear regressor object.
    my_optimizer = tf.train.GradientDescentOptimizer(learning_rate=learning_rate)
    my_optimizer = tf.contrib.estimator.clip_gradients_by_norm(my_optimizer, 5.0)
    linear_regressor = tf.estimator.LinearRegressor(
        feature_columns=feature_columns,
        optimizer=my_optimizer
    )

    # Set up to plot the state of our model's line each period.
    plt.figure(figsize=(15, 6))
    plt.subplot(1, 2, 1)
    plt.title("Learned Line by Period")
    plt.ylabel(my_label)
    plt.xlabel(my_feature)
    sample = california_housing_dataframe.sample(n=300)
    plt.scatter(sample[my_feature], sample[my_label])
    colors = [cm.coolwarm(x) for x in np.linspace(-1, 1, periods)]

    # Train the model, but do so inside a loop so that we can periodically assess
    # loss metrics.
    print("Training model...")
    print("RMSE (on training data):")
    root_mean_squared_errors = []
    for period in range (0, periods):
        # Train the model, starting from the prior state.
        linear_regressor.train(
            input_fn=training_input_fn,
            steps=steps_per_period,
        )
        # Take a break and compute predictions.
        predictions = linear_regressor.predict(input_fn=predict_training_input_fn)
        predictions = np.array([item['predictions'][0] for item in predictions])
    
    # Compute loss.
    root_mean_squared_error = math.sqrt(
    metrics.mean_squared_error(predictions, targets))

    # Occasionally print the current loss.
    print("  period %02d : %0.2f" % (period, root_mean_squared_error))
    # Add the loss metrics from this period to our list.
    root_mean_squared_errors.append(root_mean_squared_error)
    # Finally, track the weights and biases over time.
    # Apply some math to ensure that the data and line are plotted neatly.
    y_extents = np.array([0, sample[my_label].max()])

    weight = linear_regressor.get_variable_value('linear/linear_model/%s/weights' % input_feature)[0]
    bias = linear_regressor.get_variable_value('linear/linear_model/bias_weights')

    x_extents = (y_extents - bias) / weight
    x_extents = np.maximum(np.minimum(x_extents,
                                      sample[my_feature].max()),
                           sample[my_feature].min())
    y_extents = weight * x_extents + bias
    plt.plot(x_extents, y_extents, color=colors[period]) 
  print("Model training finished.")

  # Output a graph of loss metrics over periods.
  plt.subplot(1, 2, 2)
  plt.ylabel('RMSE')
  plt.xlabel('Periods')
  plt.title("Root Mean Squared Error vs. Periods")
  plt.tight_layout()
  plt.plot(root_mean_squared_errors)
  
  # Create a table with calibration data.
  calibration_data = pd.DataFrame()
  calibration_data["predictions"] = pd.Series(predictions)
  calibration_data["targets"] = pd.Series(targets)
  display.display(calibration_data.describe())

  print("Final RMSE (on training data): %0.2f" % root_mean_squared_error)
  
  return calibration_data
```



