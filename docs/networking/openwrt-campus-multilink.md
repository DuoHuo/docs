---
title: OpenWrt 路由器让校园网速度超级加倍
author: Shen H, Airline233
date: 2026-06-21
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
> 配虚拟Mac好像是可以的，但目前是对账号限速，即单个账号下所有设备总网速限制

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
#!/bin/bash

LOGIN_URL="http://10.255.255.46/api/v1/login"
IP_API_URL="http://10.255.255.46/api/v1/ip"

CHECK_TARGET="https://www.baidu.com"

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)

ACCOUNTS_FILE="${SCRIPT_DIR}/accounts.txt"

LOG_FILE="/tmp/wanlogin.log"

if ! command -v curl &> /dev/null; then
    echo "错误: curl 命令未找到。请先安装: opkg update && opkg install curl"
    exit 1
fi
if ! command -v jq &> /dev/null; then
    echo "错误: jq 命令未找到。请先安装: opkg update && opkg install jq"
    exit 1
fi

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

check_network() {
    local iface="$1"
    local http_code=$(curl --interface "$iface" --connect-timeout 5 -s -o /dev/null -w "%{http_code}" "$CHECK_TARGET")

    if [ "$http_code" = "200" ] || [ "$http_code" = "204" ]; then
        log "接口 [$iface] 网络正常 (HTTP Code: $http_code)。"
        return 0
    else
        log "接口 [$iface] 网络异常 (HTTP Code: $http_code)，准备执行登录操作。"
        return 1
    fi
}

if [ ! -r "$ACCOUNTS_FILE" ]; then
    log "错误: 账号文件不存在或无法读取: $ACCOUNTS_FILE"
    echo "错误: 账号文件不存在或无法读取: $ACCOUNTS_FILE"
    exit 1
fi

if command -v shuf &> /dev/null; then
    mapfile -t ACCOUNTS < <(shuf "$ACCOUNTS_FILE")
else
    mapfile -t ACCOUNTS < <(grep -vE '^\s*$' "$ACCOUNTS_FILE")
    for ((i=${#ACCOUNTS[@]}-1; i>0; i--)); do
        j=$((RANDOM % (i+1)))
        tmp=${ACCOUNTS[i]}
        ACCOUNTS[i]=${ACCOUNTS[j]}
        ACCOUNTS[j]=$tmp
    done
fi

NUM_ACCOUNTS=${#ACCOUNTS[@]}
if [ "$NUM_ACCOUNTS" -eq 0 ]; then
    log "错误: 账号文件为空: $ACCOUNTS_FILE"
    echo "错误: 账号文件为空: $ACCOUNTS_FILE"
    exit 1
fi
log "加载了 $NUM_ACCOUNTS 个账号。"

INTERFACES=($(ip -4 addr show | grep 'inet 10\.' | awk '{print $NF}'))

if [ ${#INTERFACES[@]} -eq 0 ]; then
    log "未找到 IP 地址为 10.x.x.x 的网络接口，脚本退出。"
    exit 0
fi

log "发现需要检查的接口: ${INTERFACES[*]}"

account_index=0
for iface in "${INTERFACES[@]}"; do
    if check_network "$iface"; then
        continue
    fi

    log "正在为接口 [$iface] 获取内网IP..."
    ip_response=$(curl --interface "$iface" --connect-timeout 5 -s -X GET "$IP_API_URL")
    myip=$(echo "$ip_response" | jq -r '.data')

    if [ -z "$myip" ] || [[ ! "$myip" =~ ^10\. ]]; then
        log "接口 [$iface] 获取内网IP失败或IP格式不正确。返回内容: $ip_response"
        ip link set "$iface" down && ip link set "$iface" up
        if [ "$flag" = 1 ]; then
            continue
        fi
        flag = 1
    fi
    log "接口 [$iface] 获取到内网IP: $myip"

    current_account_line=${ACCOUNTS[$account_index]}
    account_index=$(( (account_index + 1) % NUM_ACCOUNTS ))

    IFS=':' read -r username password channel <<< "$current_account_line"

    channel=$(echo "$channel" | tr -d '\r')

    if [ -z "$username" ] || [ -z "$password" ]; then
        log "警告: 从 '$current_account_line' 中解析账号密码失败，跳过。"
        continue
    fi
    log "为接口 [$iface] 分配账号: $username"

    payload="{\"username\":\"$username\",\"password\":\"$password\",\"channel\":\"$channel\",\"ifautologin\":\"0\",\"pagesign\":\"secondauth\",\"usripadd\":\"$myip\"}"

    log "接口 [$iface] 正在使用账号 [$username] 和 IP [$myip] 尝试登录..."
    login_return_data=$(curl --interface "$iface" --connect-timeout 5 -s \
        -X POST "$LOGIN_URL" \
        -H "Content-Type: application/json" \
        -H "Accept: */*" \
        -H "Cache-Control: no-cache" \
        -d "$payload")
    login_http_code=$(echo "$login_return_data" | jq -r '.code')
    return_text=$(echo "$login_return_data" | jq -r '.data.text')

    if [ "$login_http_code" = "200" ]; then
        log "接口 [$iface] 登录成功！IP: $myip, 返回码: $login_http_code"
        echo "IP:$myip,code:$login_http_code"
    else
        log "接口 [$iface] 登录失败。IP: $myip, 账号: $username, 返回: $return_text"
        echo $payload
    fi

done

log "--- 本次检查任务结束 ---"
```

## /root/accounts.txt
示例：
```
13800138000|123456|2
```
## 加入计划任务

```
0 * * * * /root/login.sh >> /root/login.log 2>&1
```

祝你好运。
