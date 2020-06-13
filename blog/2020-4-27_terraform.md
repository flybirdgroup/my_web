---
id: terraform1
title: 使用terraform基本语法和创建vm
author: 招晓贤
author_title: AI Engineer
author_url: https://github.com/flybirdgroup
author_image_url: https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1615738601,1434436036&fm=26&gp=0.jpg
tags: [terraform, gcp, compute engine,vm]
---

# terraform 基本语法:
我觉得terraform的基本语法就是字典对象式语法.

总体结构就是 
1. instance.tf 用来创作资源的文件,比如vm instance,storage bucket,bigquery等

2. variables.tf 参数变量文件,用来写那些变量的,变量的格式为 variable "project" {} 就是: variable + 名字 + {}

3. terraform.tfvars 用来写变量具体等于什么的, 比如 project = "terraform-45110831"

4. output.tf 在创建实例后,打印输出我们觉得重要的参数, 具体格式 output 名字 {value = "${变量}"} 如output "ip" {value = "${google_compute_address.vm_static_ip.address}"} 口诀: 2美元1file4引号,简称"214"!!

<!--truncate-->

## 其中详细的用法我们可以去[官网9步教程学习](https://learn.hashicorp.com/terraform/gcp/change),非常简单,但是很多坑,但是走完坑后,感觉就基本上手了

## 其中5个点需要注意的是: 

1. 变量的写法 "${var.project}"
   
2. 如果变量是个文件的话: "${file("${var.jupyter_sh}")}"  ${file("${var.jupyter.sh}")} 也就是 "${file("${变量}")}"
   
3. 还有就是字典属性都是用.来引用
   
4. tag的使用,因为tag属性的添加对于vm instance尤其重要

5. 使用meta_startup_script脚本,可以在创建vm instance后通过脚本运行程序,非常有用
   
## 使用vs code连接远程服务器

在vs code 界面 按fn+F1, 
```
F1
ssh -i ~/.ssh/id_rsa flybird@34.73.166.222 (连接远程服务器)
```
连接成功后,我们就可以在服务器准备创建vm instance了
# 使用terraform创建VM
使用terraform可以很快的,可复制性的配置一个vm机器
<!--truncate-->
# 1 首先我们要安装terraform,安装的具体教程请看[terraform安装](https://learn.hashicorp.com/terraform/gcp/install)

大致步骤是
```
下载 terraform_0.12.24_linux_amd64.zip
unzip terraform_0.12.24_linux_amd64.zip
sudo snap install terraform 安装terraform
terraform 确认terraform是否安装成功
```

terraform安装好后,我们去GCP>>APIs$Services>>Credentials创建service account,下载json文件,保存好
terraform创建教程我们可以去[terraform入门教程](https://learn.hashicorp.com/terraform/gcp/change)看到

## 2 我们这里会创建一个instance.tf文件
```
provider "google" {
  credentials = "terraform-45110831-450974fa2608.json"
  project = "terraform-45110831"
  region  = "us-central1"
  zone    = "us-central1-a"
}
resource "google_compute_network" "vpc_network" {
  name = "terraform-network"
}
resource "google_compute_instance" "default" {
  project      = "terraform-45110831"
  name         = "terraform"
  machine_type = "n1-standard-1"
  zone         = "us-central1-a"

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-9"
    }
  }

  network_interface {
    network = "default"
    access_config {
    }
  }
}
```

resource 后面跟两个字段,第一个是resource type字段和resource name, 这里的resource type是google_compute_instance, name是 terraform, google_compute_instance 会自动告诉terraform这个是谷歌的provider

## 3 写好配置后,我们输入一下命令
```
terraform init
```
这个命令或初始化很多后续会被用到的命令的本地设置和数据
google provider plugin 会被下载和安装

## 4 初始化后,我们可以查看整体计划,查看设置是否符合我们的要求,输入这个命令的时候,GCP不会部署vm
```
terraform plan
```

## 5 觉得没有问题,我们就可以应用了
```
terraform apply
```
这个命令就会执行之前plan的东西
```
An execution plan has been generated and is shown below.
Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  # google_compute_instance.default will be created
  + resource "google_compute_instance" "default" {
      + can_ip_forward       = false
      + cpu_platform         = (known after apply)
      + deletion_protection  = false
      + guest_accelerator    = (known after apply)
      + id                   = (known after apply)
      + instance_id          = (known after apply)
      + label_fingerprint    = (known after apply)
      + machine_type         = "n1-standard-1"
      + metadata_fingerprint = (known after apply)
      + name                 = "terraform"
      + project              = "qwiklabs-gcp-42390cc9da8a4c4b"
      + self_link            = (known after apply)
      + tags_fingerprint     = (known after apply)
      + zone                 = "us-central1-a"

      + boot_disk {
          + auto_delete                = true
          + device_name                = (known after apply)
          + disk_encryption_key_sha256 = (known after apply)
          + kms_key_self_link          = (known after apply)
          + source                     = (known after apply)

          + initialize_params {
              + image  = "debian-cloud/debian-9"
              + labels = (known after apply)
              + size   = (known after apply)
              + type   = (known after apply)
            }
        }

      + network_interface {
          + address            = (known after apply)
          + name               = (known after apply)
          + network            = "default"
          + network_ip         = (known after apply)
          + subnetwork         = (known after apply)
          + subnetwork_project = (known after apply)

          + access_config {
              + assigned_nat_ip = (known after apply)
              + nat_ip          = (known after apply)
              + network_tier    = (known after apply)
            }
        }

      + scheduling {
          + automatic_restart   = (known after apply)
          + on_host_maintenance = (known after apply)
          + preemptible         = (known after apply)

          + node_affinities {
              + key      = (known after apply)
              + operator = (known after apply)
              + values   = (known after apply)
            }
        }
    }

Plan: 1 to add, 0 to change, 0 to destroy.

Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

  Enter a value:
```

我们看到 +, 这意味Terraform会创建这个资源,我们能看到很多属性,如果有的value是显示computed,这意味着这value会等到resource创建后才知道

## 6 显示vm 的配置
```
terraform show
```

## 7.1 我们可以使用terraform去修改resources
比如我们可以在 resource google_compute_instance 上添加tags
### 敲黑板!!! 如果tags上添加"http-server","https-server"后,Firewalls防火墙就allow http traffic和 https traffic了

```
resource "google_compute_instance" "default" {
  project      = "terraform-45110831"
  name         = "terraform"
  machine_type = "n1-standard-1"
  zone         = "us-central1-a"
  tags         = ["web", "dev","http-server","https-server"]
```
然后在终端输入terraform init, terraform plan后,就会出现
```
Terraform will perform the following actions:

  ~ google_compute_instance.default
    tags.#:         "0" => "2"
    tags.292811013: "" => "dev"
    tags.365508689: "" => "web"
```
terraform apply 就会对resource进行修改

## 7.2 也支持破坏性修改,比如更换磁盘镜像,比如从Debian 9映像更改为使用Google的Container-Optimized OS
```
boot_disk {
    initialize_params {
      image = "cos-cloud/cos-stable"
    }
  }
```
terrform init> terrform plan >terrform apply后
我们可以看到internal IP 和 external ip改变了,然后我们登陆进vm instance后,我们之前的所以资料都没有了
<h1> 所以如果进行destructive change前,一定要注意 </h1>


## 8 terraform destroy
输入命令后:
```
An execution plan has been generated and is shown below.
Resource actions are indicated with the following symbols:
  - destroy

Terraform will perform the following actions:

  - google_compute_instance.default

  - google_compute_network.vpc_network
```
terraform destroy命令销毁资源,该命令类型于terraform apply,terraform确定必须销毁物件的顺序,如果还有资源,GCP将不允许删除VPC网络,因此Terraform会等到实例被销毁后再销毁网络,terraform执行操作的时候,terraform将建一个依赖关系图已确定销毁顺序.在具有多个资源的更复杂的情况下,Terraform将在安全的情况下并行执行操作.


## GCP也可以删除
我们可以去GCP shell中输入一下命令
```
gcloud compute instances delete instance名字
```

我们还可以使resource与resource之间相互依赖,使用depends_on = [""]
比如我可以现在创建一个storage bucket, 我们可以设置在创建storage bucket前一定要创建 vm先

resource "google
```
resource "google_compute_instance" "default" {
  project      = "terraform-45110831"
  name         = "terraform"
  machine_type = "n1-standard-1"
  zone         = "us-central1-a"
  tags         = ["web", "dev"]
}

resource "google_storage_bucket" "example_bucket" {
  depends_on = ["google_compute_instance.default"]
  ...
}
```

## 9 可以在本终端输入命令[Provisioners](https://www.terraform.io/docs/provisioners/index.html)
```
resource "google_compute_instance" "vm_instance" {
  name         = "terraform-instance"
  machine_type = "f1-micro"
  tags         = ["web", "dev"]

  provisioner "local-exec" {
    command = "echo ${google_compute_instance.vm_instance.name}:  ${google_compute_instance.vm_instance.network_interface.0.access_config.0.nat_ip} >> ip_address.txt"
  }
```
## 每个vm实例可以具有多个网络接口,因此我们的network interface.0就是引用第一个,每个网络接口也具有多个access_config快,我们选择acess_config.0指定引用第一个
# terraform的核心在于变量,我个人感觉就像是javascript的字典对象,所以属性都用.来引用, 另外变量的表示方法为美元符号$ + {变量} 就是 ${google_compute_instance.vm_instance}
## 但是你发现ip_address.txt在terraform apply后没有创建成功
因为预配器provisioner只是在创建资源时运行,但是添加provisioner不会强制销毁和重新创建该资源,所以我们要用terraform taint告诉terraform,需要重新创建实例
```
terraform taint google_compute_instance.vm_instance
terraform apply
cat ip_address.txt
```
我们可以看到txt文件内容了


## 10.1 创建vm instance成功后,我们需要添加sshkey,然后我们可以连接external ip,通过以下命令:
```linux
ssh-keygen 产生id-rsa.pub, 复制其内容,在vm的meta data上粘贴好
ssh username@external_ip
```
## 10.2 如果出现permisson dennied,可以直接在vm机上把ssh key删掉,然后在本地重新创建ssh key,然后复制粘贴到 meta data上

## 11 起始脚本metadata_startup_script
我们在创建resouce google_compute_instance 的时候,我们可以添加一个metadata_startup_script属性,这个是用来运行在创建的vm虚拟机上的,比如我们可以通过这个脚本创建[jupyter和python的工具(请看案例)](jupyterhub_GCP)等,脚本是在root目录运行,

### 如果我们想在home目录运行,请cd home/用户名
```linux
metadata_startup_script = "${file("${var.jupyter_sh}")}" 
```
