---
title: OpenWrt 路由器让校园网速度超级加倍
author: Shen H
date: 2023-09-16
comments: true
tags:
  - 网络
  - OpenWrt
  - 校园网
  - 多拨
---

!!! warning "声明"
    **这是趟坑指南，不是保姆教学。**

## 思路

墙上的网口已被限制，目前只能使用多线多拨。

- 将希望使用的 LAN 从网桥端口移除，然后仿照 WAN 配置即可。
- 虚拟网卡连接的物理网卡需要新建一个不配置协议的接口，并加入 WAN 防火墙组。

## 本地启动脚本

加入以下内容：

```bash
ip link add link 接口名字 name 虚拟网卡设备名字 type macvlan
ifconfig 虚拟网卡设备名字 hw ether 虚拟MAC地址
ifconfig 虚拟网卡设备名字 up

echo "/root/login.sh >> /root/login.log 2>&1" | at now+1min
```

## `/root/login.sh`

```bash
#!/bin/sh
set -o errexit
set -o nounset
set -o pipefail

if [ -z $(mwan3 status | grep "error\|offline") ]
then
    echo "$(date "+%Y-%m-%d %H:%M:%S") nothing to do"
    exit 0
fi

function login() {
    HOST=$(ifconfig $1 | grep "inet addr" | awk '{ print $2}' | awk -F: '{print $2}')
    result=$(curl 'http://10.255.255.46/api/v1/login' \
        -H 'Accept: application/json, text/plain, */*' \
        -H 'Accept-Language: zh-CN,zh;q=0.9,zh-US;q=0.8' \
        -H 'Access-Control-Allow-Origin: *' \
        -H 'Connection: keep-alive' \
        -H 'Content-Type: application/json;charset=UTF-8' \
        -H 'DNT: 1' \
        -H 'Origin: http://10.255.255.46' \
        -H 'Referer: http://10.255.255.46/?LanmanUserURL=$USERURL' \
        -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36' \
        --data-raw '{"username":"'${2}'","password":"'${3}'","ifautologin":"1","channel":"'${4}'","pagesign":"secondauth","usripadd":"'${HOST}'"}')
    echo "$result"
}

login vwan0 phone_number password channel

echo "$(mwan3 restart)"
```

## 加入计划任务

```
0 * * * * /root/login.sh >> /root/login.log 2>&1
```

祝你好运。
