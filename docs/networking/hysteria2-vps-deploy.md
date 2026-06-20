---
title: 在 VPS 上部署 Hysteria2
author: 真真夜夜
date: 2025-11-30
comments: true
tags:
  - 网络
  - Hysteria2
  - VPS
---

在远程服务器 VPS 上部署 Hysteria2 服务，在本地通过软件连接到 VPS 的 Hy2 服务端，实现外网的访问。

## 1、什么是 Hysteria2

询问大模型之后我得出的总结就是 Hysteria2（以下简称 Hy2）是一个代理工具，是一种基于 QUIC/UDP 的代理协议，适用于科学上网和高速传输，并且具有较强的抗干扰能力。主要由服务端和客户端组成。

### 服务端

Hy2 的服务端运行在远程 VPS 服务器上，负责：

- **接受客户端的 QUIC / UDP 加密链接**
- **解密这些流量，并向外网转发**
- **将外网返回的数据再加密发给客户端**
- **提供一些传输性能上的优化**

### 客户端

Hy2 的客户端运行在本地的 PC 上（包括 Hy2 本身和其他具备客户端功能的代理软件如 **Sing-box、Sparkle 等**），负责：

- **发起向服务端的 QUIC / UDP 加密链接**
- **提供一个本地的代理接口**
- **将本地软件的流量加密后发送给服务端**
- **接收服务端返回的数据并解密**

## 2、服务端配置

首先你需要有一个自己的 VPS，连接到 VPS 中，下载 Hy2，输入如下指令：

```bash
bash <(curl -fsSL https://get.hy2.sh/)
```

下载好之后修改 Hy2 的配置：

```bash
nano /etc/hysteria/config.yaml
```

将配置文件修改为如下：

```yaml
listen: :8443

tls:
  cert: /etc/hysteria/certs/cert.pem
  key: /etc/hysteria/certs/key.pem
  insecure: true

auth:
  type: password
  password: "***********"
```

有几个注意点：

### 监听端口的设置

一般默认的监听端口为 443，但是这个端口非常容易被一些网络标记并拦截，例如公共网络、校园网等，导致客户端发出的流量无法被接收。因此这里使用 8443 作为监听端口，高位端口一般不会被拦截。

### TLS 证书的设置

这里的证书一般是通过绑定域名获得的，而我主要是自用，所以没有域名，因此使用的是自签证书，由系统自动生成，可以通过如下指令：

```bash
hysteria2 cert gen -o cert.pem -k key.pem --cn Hysteria2
```

生成对应的证书，一般会生成在 `/etc/hysteria/certs` 目录下。同时在使用自签证书时要将 insecure 参数设置为 `true`。

在配置完成之后启动 Hy2 的服务端，并查看服务端的运行状态：

```bash
sudo systemctl start hysteria-server
sudo systemctl status hysteria-server
```

若输出为 `active (running)`，则说明服务端配置成功。

## 3、客户端配置

客户端有两种配置方法，目前我只测试了 MacOS 平台，Win 和 Linux 效果如何还不清楚。

### 1、使用 Sparkle 作为 Hy2 的客户端

Sparkle 能够解析 Hy2 的加密链接，因此其本身就可以作为 Hy2 的客户端，只需要下载 Sparkle 并引入正确的配置即可连接至客户端。

Sparkle 的下载链接 <https://mihomoparty.net/sparkle/>，下载对应操作系统的版本。
在"订阅管理"中点击右上角 ➕ 导入配置文件，配置文件内容如下，记得设置为 `.yaml` 格式：

```yaml
# ==========================
# Sparkle / Clash Meta HY2 配置
# ==========================

mixed-port: 7890
allow-lan: false
mode: rule
log-level: info

proxies:
  - name: "HY2-Server"
    type: hysteria2
    server: <你的服务器IP>  # 替换成自己的服务器IP
    port: 8443

    # 你的 HY2 密码，需要与服务端相同
    password: "***********"

    # 无证书服务器必须这样写
    insecure: true
    sni: Hysteria2
    skip-cert-verify: true

proxy-groups:
  - name: "Proxy"
    type: select
    proxies:
      - "HY2-Server"
      - DIRECT

rules:
  - MATCH,Proxy
```

导入完成后查看代理组中的 HY2-Server 的具体情况。
如果显示为绿色数字，则代表配置成功，已经可以科学上网了，可以打开 **Google** 或 **Youtube** 看看能不能连接。

### 2、使用 Clash 连接远程服务器

由于 clash 的限制，其无法直接解析 Hy2 加密链接连接，因此我们需要启动本地 Hy2 客户端，通过 socks5 将 clash 连接到本地的 Hy2 客户端，再通过本地 Hy2 客户端连接到远程 Hy2 服务端。

#### 配置并启动本地客户端

首先在本地安装 Hy2，下载对应的 Hy2 发行版，MacOS 下载 `hysteria-darwin-arm64` 版本，之后将其替换原本的 Hy2 并添加当前用户的执行权限：

```bash
chmod +x hysteria-darwin-arm64
sudo mv hysteria-darwin-arm64 /usr/local/bin/hysteria
```

配置本地 Hy2，配置文件如下，注意保存为 `.yaml` 格式：

```yaml
# ==============================
# Hysteria2 客户端配置示例
# ==============================

# 服务端信息
server: <你的服务器IP>:8443       # 替换成自己的服务器IP或域名
auth: "************"             # 与服务端的密码保持一致

tls:
  insecure: true

socks5:
  listen: 127.0.0.1:1080
```

之后启动 Hy2 客户端即可，此处的 `hy2-client.yaml` 为保存的配置文件：

```bash
hysteria client --config ~/Desktop/hy2-client.yaml
```

如果出现如下输出，则本地客户端启动成功。

#### 配置 Clash

clash 的配置文件如下：

```yaml
port: 7890
socks-port: 7891
redir-port: 7892
allow-lan: true
mode: Rule
log-level: info

proxies:
  - name: "HY2-Local"
    type: socks5
    server: 127.0.0.1
    port: 1080
    udp: true

proxy-groups:
  - name: "Auto"
    type: select
    proxies:
      - "HY2-Local"

rules:
  - MATCH,Auto
```

保存为 `.yaml` 配置文件后，导入 clash，进入代理组中，查看 `HY2-Local` 节点是否成功连接（显示为绿色数字）即可。
