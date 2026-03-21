# wecomtool

企业微信 API 工具 OpenClaw 插件 | 继承 OpenClaw 端口，零额外配置

## 快速开始

```bash
# 1. 安装
git clone https://github.com/jiexiaoyin/wecomtool.git /root/.openclaw/extensions/wecomtool

# 2. 配置（两种方式）

# 方式一：交互式配置（推荐）
/skill wecomtool config
# 按提示填写企业ID、Secret、AgentID等

# 方式二：手动编辑
vim /root/.openclaw/extensions/wecomtool/config.json

# 3. 重启
openclaw gateway restart
```

## 配置回调地址

企业微信后台 → 应用管理 → 自建应用 → 设置API接收：

```
URL: https://你的域名/plugins/wecomtool/callback
Token: 你的Token（必填）
EncodingAESKey: 你的EncodingAESKey（可选）
```

## 使用命令

```bash
# 交互式配置（推荐）
/skill wecomtool config

# 测试连接
/skill wecomtool test_connection

# 发送消息
/skill wecomtool send_message --userId 用户ID --content "你好"

# 查看配置
/skill wecomtool status
```

## 功能

- 继承 OpenClaw 端口，无需额外服务器
- 32+ API 模块（消息、审批、会议、打卡、客户联系等）
- 回调处理（事件监听）
- 交互式配置

## 支持的 API

| 模块 | 说明 |
|------|------|
| message | 消息收发 |
| meeting | 会议 |
| schedule | 日程 |
| approval | 审批 |
| contact | 客户联系 |
| addressbook | 通讯录 |
| checkin | 打卡 |
| custom | 微信客服 |
| ... | 更多 |

## 文件说明

```
wecomtool/
├── config.json          # 配置文件（也可通过 /skill wecomtool config 交互式配置）
├── plugin.ts            # 插件入口
├── openclaw.plugin.json
├── package.json
│
├── src/
│   ├── index.js         # 主入口
│   ├── config.js        # 配置加载
│   ├── callback/        # 回调处理
│   └── modules/         # API 模块
│
└── skills/
    └── wecomtool/       # 技能
```

## 常见问题

**回调验证失败？**
- 确认 Token 与企业微信后台一致
- 确认域名已解析到服务器
- 重启 OpenClaw

**如何更新？**
```bash
cd /root/.openclaw/extensions/wecomtool
git pull
openclaw gateway restart
```

## 获取参数

| 参数 | 位置 |
|------|------|
| corpId | 企业微信 → 我的企业 → 企业信息 → 企业ID |
| corpSecret | 企业微信 → 应用管理 → 自建应用 → 查看详情 |
| agentId | 企业微信 → 应用管理 → 自建应用 → 查看详情 |

## License

MIT
