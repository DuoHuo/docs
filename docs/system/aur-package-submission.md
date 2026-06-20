---
title: 在 AUR (Archlinux User Repository) 提交你的软件包
author: loremipsum
date: 2023-09-13
comments: true
tags:
  - 系统
  - Linux
  - Arch
  - AUR
---

## 0x00 啥是 AUR

> Arch 用户软件仓库（Arch User Repository，AUR）是为用户而建、由用户主导的 Arch 软件仓库。AUR 中的软件包以软件包生成脚本（PKGBUILD）的形式提供，用户自己通过 makepkg 生成包，再由 pacman 安装。创建 AUR 的初衷是方便用户维护和分享新软件包，并由官方定期从中挑选软件包进入 community 仓库。本文介绍用户访问和使用 AUR 的方法。
>
> —— 引自 [Arch Wiki - Arch 用户软件仓库 (AUR)](https://wiki.archlinuxcn.org/wiki/Arch_%E7%94%A8%E6%88%B7%E8%BD%AF%E4%BB%B6%E4%BB%93%E5%BA%93_\(AUR\))

简单来说，`AUR` 就是 `Arch User` 在互联网上分享自己制作的软件包的地方。如果你很感兴趣，你应该去 `Wiki` 看一看，里面东西挺多的。

## 0x01 创建账号 & 配置提交环境

你可以去[这里](https://aur.archlinux.org/register)注册你的 AUR 账户。

如果你注册好了，那么恭喜你，你注册好了。不过，你要配置一下 `SSH Public Key`，让 AUR 的服务器知道这是你。你最好生成一个新的 `SSH 密钥对`，因为 [Arch Wiki](https://wiki.archlinuxcn.org/wiki/AUR_%E6%8F%90%E4%BA%A4%E5%87%86%E5%88%99#%E8%AE%A4%E8%AF%81) 让我这么做。~~这会让你的电脑被我偷走的时候，阻止我在你的 AUR 仓库造反。~~ 下面我将会告诉你该怎么做。当然，你也可以去上面提到的 `Wiki` 中索取更多细节。

要创建新的密钥对，你可以这么做：

```bash
$ ssh-keygen -f ~/.ssh/aur # 这会在 ~/.ssh 下创建 aur(私钥) 和 aur.pub(公钥)
```

然后，你可以去你账户的配置页面（`https://aur.archlinux.org/account/<你的用户名>/edit`）添加 `~/.ssh/aur.pub` 内的内容。你应该把他们放在 `SSH Public Key:` 后的文本框里面，然后在页面底部填写你的密码，更新一下就可以了。

你还需要告诉你的 `git` 在连接 `aur.archlinux.org` 的时候使用这对密钥，可以在 `.ssh/config` 里添加这些：

```
Host aur.archlinux.org
  IdentityFile ~/.ssh/aur
  User aur
```

这样，你应该就可以提交你的包了。

## 0x02 创建仓库

这很简单，你只要找一个你觉得合适的存储位置，然后执行：

```bash
$ git -c init.defaultbranch=master clone ssh://aur@aur.archlinux.org/<pkgbase>.git # 此处的 <pkgbase> 应该改成你的包名。
```

你应该会看到 `warning: You appear to have cloned an empty repository.`。这是在告诉你，你拉取了一个不存在的仓库。如果它真的不存在，那么它马上就要存在了。~~你甚至可以开一瓶可乐来祝贺它的诞生。~~

## 0x03 创建一个 PKGBUILD

`PKGBUILD` 就是一个告诉 `makepkg` 怎么造一个软件包的文件。你可以先看一下我的：

```bash
# Maintainer: TurboHsu <hsuturbo@outlook.com>
pkgname=munager-git
_pkgname=munager
pkgrel=1
pkgver=0.1.1.r0.gcc90098
pkgdesc="Music managing utils which can fetch lyrics and do sync."
arch=('any')
url="https://github.com/TurboHsu/munager"
license=('Apache')
makedepends=('git' 'go')
provides=('munager')
source=("git+${url}.git#branch=main")
pkgver() {
    cd "${srcdir}"/"${_pkgname}"/
    git describe --long --tags | sed 's/^v//;s/\([^-]*-g\)/r\1/;s/-/./g'
}
build() {
    cd "${srcdir}"/"${_pkgname}"/
    go build -ldflags="-s -w -linkmode external -extldflags \"${LDFLAGS}\"" \
         -trimpath \
         -buildmode=pie \
         -mod=readonly \
         -modcacherw \
         .
}
package() {
    cd "${srcdir}"/"${_pkgname}"/
    install -Dm 755 munager -t "${pkgdir}"/usr/bin
}
sha256sums=('SKIP')
```

如果你不想抄我的，你可以去[这里](https://wiki.archlinux.org/title/PKGBUILD)。当然，你也可以让 `man` ~~男人~~ 告诉你，只要执行 `man PKGBUILD`，`man` 就会告诉你更多细节。

对于各种变量的解释，你可以去上述的 `man page` 里面查找，里面有详细的定义。这里我就说几个。

`_pkgname` 是我自己定义的一个变量，你可以看到我在 `build()` 中引入了它。在克隆仓库之后，我需要进入源码的目录。当然，你如果想要直接写死，也是可以的。

`pkgver()` 会自动更新 `pkgver` 的版本号。如果你尝试写一个从最新源码编译的软件包，这会很有用。而且，如果你在构建从 `VCS` 编译的软件包，你最好看看[这个](https://wiki.archlinux.org/title/VCS_package_guidelines#Authentication_and_security)。

`build()` 中编译 `go` 的参数来自[这里](https://wiki.archlinux.org/title/Go_package_guidelines#Flags_and_build_options)，主要是为了让程序不包含构建时的目录，以免产生一些问题。要不然，`makepkg` 会告诉你：`WARNING: Package contains reference to $srcdir`。

`package()` 中的 `install` 来自 `coreutils`，它在这里做的事情实际上就是复制一些文件，并且给他们加上你设置的权限。这样会比较规范，我猜。

在做完了一切之后，你最好 `makepkg` 一下，看看有没有什么问题。

## 0x04 提交你的包

造好了 `PKGBUILD` 之后，你还需要生成一下 `.SRCINFO`。你可以这么做：

```bash
$ makepkg --printsrcinfo > .SRCINFO
```

然后你就可以提交了：

```bash
$ git add PKGBUILD .SRCINFO # 添加你的 PKGBUILD 和 .SRCINFO
$ git commit -m "Blah blah" # Commit
$ git push                  # Push
```

之后，你应该能在你的 `AUR` 上看见你的包了。别人应该也就可以用 `yay` 之类的来装它们。
