# 搬瓦工 VPS 流量面板

## 文件

- `Bandwagon-Traffic.sgmodule`：Surge 模组
- `Bandwagon-Traffic.js`：由模组通过 GitHub HTTPS 地址加载的查询脚本

## 使用步骤

1. 登录搬瓦工 KiwiVM 控制面板，打开 `API` 页面。
2. 记录自己的 `VEID` 和 `API Key`，不要发给任何人。
3. 在 Surge iOS 的模组页面点击“安装新模组”。
4. 输入以下地址：
   `https://raw.githubusercontent.com/succichang/surge-bandwagon-traffic/main/Bandwagon-Traffic.sgmodule`
5. 安装后进入“搬瓦工 VPS 流量”的参数设置。
6. 分别填写 `VEID` 和 `API_KEY`，然后保存并启用模组。
7. 回到 Surge 首页，找到“搬瓦工 VPS”面板并点击刷新。

也可以通过浏览器或 iCloud 打开 `.sgmodule` 文件安装。脚本会自动从 GitHub 获取，不需要单独同步 `.js` 文件。

## 安全说明

- API Key 不写死在脚本文件中，只保存在当前设备的模组参数里。
- 不要截图或分享带有模组参数的页面。
- 不要把填写密钥后的本地模组上传到网盘、GitHub或订阅服务器。
- GitHub公开仓库中只有不含密钥的模板和脚本。
- KiwiVM API 返回的是整个 VPS 的计费流量，不只是当前手机产生的流量。

## 常见问题

- 显示“请先填写”：检查模组参数是否仍是默认文字。
- 显示 API 错误：检查 VEID 和 API Key 是否正确，前后不要留空格。
- 显示 `data:text/javascript;base64` 或 `Bandwagon-Traffic.js`“资源不存在”：安装的是旧版，请删除旧模组并通过上面的 HTTPS 地址重新安装 v2.0。
- GitHub资源暂时无法更新：检查当前网络是否可以访问 `raw.githubusercontent.com`，稍后点击“全部更新”重试。
- 面板没有出现：信息面板仅支持 Surge iOS；Surge Mac 可用于编辑和同步文件，但不会显示同样的面板卡片。
- 数据略有延迟：KiwiVM 的计费流量不是实时逐秒更新，这是正常现象。
