# Hayaoshi-Button-Online
Webブラウザを使った早押しボタンアプリです。URL共有するだけで複数人と早押しクイズをすることができます。

[試してみる](https://btn.anyfrog.net)

* Express + WebSocket(Socket.io)
* Dockerでのデプロイ対応
* GitHub ActionsからDocker HubへのPush

| | |
|--|--|
| ![サンプル1](https://raw.githubusercontent.com/kznrluk/hayaoshi-button-online/master/sample/sample1.png) | ![サンプル2](https://raw.githubusercontent.com/kznrluk/hayaoshi-button-online/master/sample/sample2.png) |

## ローカルで起動する(Docker)

```
> docker run -p 3000:80 kznrluk/hayaoshi-button-online
// http://localhost:3000
```

## ローカルで起動する(Node)

```
> npm install && node index.js
// http://localhost:80
```

## 背景画像
Background images provided by Unsplash source.

[Unsplash Source | A Simple API for Embedding Free Photos from Unsplash](https://source.unsplash.com/)

早押しボタンWebアプリRTAで作成した成果物です。
結果commit 263c75727beda66804bc6709234756832fbee9c1まで1時間51分42秒でした。

![サンプル3](./sample/sample.gif)