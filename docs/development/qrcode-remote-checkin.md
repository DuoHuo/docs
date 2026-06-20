---
title: 二维码远程签到机
author: Shen H
date: 2023-09-18
comments: true
tags:
  - 开发
  - WebSocket
  - Go
  - 前端
---

!!! warning "声明"
    本文仅为技术讨论，不鼓励翘课行为。

部分老师有设置 5 秒二维码签到的坏毛病，不能惯着他们。

那么，我们的需求是：

- 发送者在前端扫描二维码
- 后端接收发送者获取的二维码数据，低延迟同步给接收者
- 接收者扫描前端生成的二维码

虽然用长轮询也能实现以上需求，但 Websocket 是更加优雅、便捷的选择。
本文将使用原生 JS 编写前端（没必要用框架），Golang 编写后端（减少心智负担）。

## 后端

虽然这只是个小工具，但毕竟部署在公网，裸跑大概率会被脚本小子撅。
所以随便签个证书吧，静态资源用 BasicAuth 意思一下，可以加个错误等待时间什么，自行发挥。

```go
//go:embed html
var html embed.FS
var hfs http.Handler

func init() {
    fsys, err := fs.Sub(html, "html")
    if err != nil {
        panic(err)
    }
    hfs = http.FileServer(http.FS(fsys))
}

func handleHtml(w http.ResponseWriter, r *http.Request) {
    name, passwd, ok := r.BasicAuth()
    if !ok {
        w.Header().Set("WWW-Authenticate", `Basic realm="Restricted"`)
        w.WriteHeader(http.StatusUnauthorized)
        return
    }
    if name != "fkqrcode" || passwd != "nopasswd" {
        http.Error(w, "Fuck off!", http.StatusUnauthorized)
        return
    }
    hfs.ServeHTTP(w, r)
}
```

Websocket 部分抄样例即可，用一个 channel 保存二维码。

```go
var qrch = make(chan string, 3)
var upgrader = websocket.Upgrader{
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,
    CheckOrigin: func(r *http.Request) bool {
        return true
    },
}

func handleSend(w http.ResponseWriter, r *http.Request) {
    conn, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        return
    }
    defer conn.Close()

    for {
        _, data, err := conn.ReadMessage()
        if err != nil {
            log.Printf("failed to read data from %s : %v\n", r.RemoteAddr, err)
            return
        }
        qr := string(data)
        log.Println(qr)
        select {
        case qrch <- qr:
        default:
        }
    }
}

func handleReceive(w http.ResponseWriter, r *http.Request) {
    conn, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        return
    }
    defer conn.Close()

    for {
        qr := <-qrch
        err = conn.WriteMessage(websocket.TextMessage, []byte(qr))
        if err != nil {
            log.Printf("failed to send qr to %s : %v\n", r.RemoteAddr, err)
            return
        }
    }
}
```

## 前端

前端使用 `adapter`、`instascan`、`qrcode` 三个库。

发送端：

```html
<video id="preview"></video>
<select id="select">
</select>
<button onclick="startScan()" id="start" disabled>Start</button>

<script>
    let ws = new WebSocket("wss://" + location.host + "/send");
    let err = () => location.reload();
    ws.onclose = err;
    ws.onerror = err;

    let opts = {};
    let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
    scanner.refractoryPeriod = 1000;
    scanner.mirror = false;
    scanner.addListener('scan', (content) => ws.send(content));
    Instascan.Camera.getCameras()
        .then((cameras) => {
            if (cameras.length > 0) {
                let select = document.getElementById('select');
                for (camera of cameras) {
                    opts[camera.name] = camera;
                    select.appendChild(new Option(camera.name));
                }
                document.getElementById('start').disabled = '';
            } else {
                err();
            }
        })
        .catch(err);

    function startScan() {
        scanner.stop()
            .then(() => {
                let select = document.getElementById('select');
                scanner.start(opts[select.item(select.selectedIndex).text]).catch(err)
            })
            .catch(err);
    }
</script>
```

接收端：

```html
<div id="qrcode"></div>
<script>
    let qrcode = new QRCode(document.getElementById("qrcode"), "https://" + location.host);
    let ws = new WebSocket("wss://" + location.host + "/receive");
    ws.onmessage = () => {
        qrcode.clear();
        qrcode.makeCode(event.data);
    };
    ws.onclose = location.reload();
    ws.onerror = location.reload();
</script>
```

OK，齐活。
