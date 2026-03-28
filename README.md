# openclaw-wecom-api

企业微信 API OpenClaw 插件，为 OpenClaw 提供完整的企业微信 API 调用能力和事件回调处理。

## 与其他 OpenClaw 企业微信插件的关系

| 插件 | 职责 | 通道 |
|------|------|------|
| **其他 Channel 插件**（如 @sunnoy/wecom） | 消息收发（WebSocket 长连接） | `"wecom"` 通道 |
| **openclaw-wecom-api** | API 调用 + 事件回调 | Skill 方式被 AI 触发 |

两者**不冲突**，共用同一套 `corpId`/`corpSecret` 凭证。

## 功能特性

- **32+ API 模块**：消息、会议、审批、打卡、客户联系、通讯录等
- **事件回调**：支持客户变更、审批、签到、会议等事件的 HTTP 接收
- **零额外部署**：继承 OpenClaw HTTP 端口（80/443），无需单独开端口
- **智能权限控制**：admin / manager / staff 三级数据隔离
- **回调路径隔离**：与 Channel 插件使用不同路径，互不干扰

## HTTP 回调路径

| 插件 | 回调路径 |
|------|---------|
| @sunnoy/wecom | `/plugins/wecom/agent/default` |
| openclaw-wecom-api | `/plugins/wecom-api/callback` |

## 安装

### 方式一：npm 安装（推荐）

```bash
openclaw plugins install @jiexiaoyin/wecom-api
```

### 方式二：OpenClaw CLI（Git 克隆）

```bash
openclaw plugins install https://github.com/jiexiaoyin/openclaw-wecom-api
```

### 方式三：手动克隆

```bash
git clone https://github.com/jiexiaoyin/openclaw-wecom-api.git /root/.openclaw/extensions/wecom-api
cd /root/.openclaw/extensions/wecom-api
npm install
```

## 配置

### 1. 修改 openclaw.json

在 `plugins.entries` 中添加插件注册：

```json
{
  "plugins": {
    "entries": {
      "wecom-api": {
        "enabled": true
      }
    }
  }
}
```

### 2. 创建 config.json

npm 安装方式会自动注册插件到 `openclaw.json`，但需要手动创建配置：

```bash
cd /root/.openclaw/extensions/wecom-api
cp config.example.json config.json
# 编辑 config.json 填入你的凭证
```

```json
{
  "corpId": "你的企业ID",
  "corpSecret": "你的应用Secret",
  "agentId": "你的应用AgentID",
  "token": "回调Token",
  "encodingAESKey": "EncodingAESKey"
}
```

| 参数 | 说明 | 必填 |
|------|------|------|
| corpId | 企业ID | ✅ |
| corpSecret | 应用Secret | ✅ |
| agentId | 应用AgentID | ✅ |
| token | 回调Token | ✅ |
| encodingAESKey | 回调加密Key | ✅ |

### 3. 重启 OpenClaw

```bash
systemctl --user restart openclaw-gateway
# 或
nohup systemctl --user restart openclaw-gateway > /tmp/restart.log 2>&1 &
```

### 4. 配置企业微信后台

登录 [企业微信管理后台](https://console.work.weixin.qq.com)，找到你的自建应用，在「接收消息」设置中：

- 填写「URL」：`https://你的域名/plugins/wecom-api/callback`
- 填写「Token」和「EncodingAESKey」：与 config.json 中一致

## 与其他 OpenClaw 企业微信插件共用应用

当本插件与其他 OpenClaw 企业微信 Channel 插件（如 @sunnoy/wecom）共用同一个企业微信自建应用时，需要使用 Nginx Mirror 将企业微信的回调同时分发给两个插件：

```nginx
# 企业微信回调入口（其他 Channel 插件的路径，以 @sunnoy/wecom 为例）
location /plugins/wecom/agent/default {
    mirror /plugins/wecom-api/callback;
    mirror_request_body on;
    proxy_pass http://127.0.0.1:18789;
}

# openclaw-wecom-api 的回调路径（mirror 目标）
location = /plugins/wecom-api/callback {
    internal;
    proxy_pass http://127.0.0.1:18789;
}
```

两者共用同一套凭证（corpId / corpSecret / token / encodingAESKey），各自验证签名、解析消息，互不干扰。

## 使用方式

插件安装后，OpenClaw 会自动注册 Skill，通过自然语言即可调用：

```
查一下 JieXiaoYin 的客户列表
发送消息给 张三，内容是测试
查询昨天的客户统计
查一下审批列表
获取通讯录
```

### 命令行测试

```bash
# 测试连接
/skill wecom-api test_connection

# 查看配置状态
/skill wecom-api status
```

## 支持的 API 模块

| 模块 | 说明 |
|------|------|
| `addressbook` | 通讯录管理 |
| `approval` | 审批管理 |
| `checkin` | 打卡考勤 |
| `contact` | 客户联系 |
| `contact_stats` | 客户统计 |
| `customer` | 客户管理 |
| `document` | 文档管理 |
| `meeting` | 会议管理 |
| `message` | 消息收发 |
| `schedule` | 日程管理 |
| `media` | 素材管理 |
| ... | 更多模块 |

## 支持的回调事件

- **客户联系**：`add_external_contact`、`del_external_contact`、`change_external_contact` 等
- **客户群**：`create_chat`、`update_chat`、`dismiss_chat`
- **审批**：`submit_approval`、`Approval`
- **打卡**：`checkin`、`report_checkin`
- **会议**：`meeting_start`、`meeting_end`、`meeting_created` 等
- **通讯录**：`change_member`、`change_department`、`change_tag`

## 文件结构

```
openclaw-wecom-api/
├── openclaw.plugin.json     # 插件清单
├── plugin.cjs               # 插件入口（HTTP 回调注册）
├── package.json
│
├── src/
│   ├── index.js             # WeComPlugin 主类
│   ├── callback-helper.js   # 回调处理工具
│   ├── crypto.js           # 加密/解密
│   ├── config.js            # 配置加载
│   │
│   └── modules/             # 32+ API 模块
│       ├── approval/
│       ├── contact/
│       ├── contact_stats/
│       ├── customer/
│       ├── message/
│       ├── meeting/
│       ├── schedule/
│       └── ...
│
└── skills/
    └── wecom-api/          # Skill 入口（供 AI 调用）
        ├── index.js
        └── SKILL.md
```

## 更新

```bash
# npm 安装方式
openclaw plugins update @jiexiaoyin/wecom-api
systemctl --user restart openclaw-gateway

# 或手动更新
cd /root/.openclaw/extensions/wecom-api
git pull
npm install
systemctl --user restart openclaw-gateway
```

## 常见问题

**Q: 与 @sunnoy/wecom 冲突吗？**
A: 不冲突。@sunnoy/wecom 负责消息收发，本插件负责 API 调用和事件回调，走不同的 HTTP 路径。

**Q: 回调验证失败？**
A: 确认 Token / EncodingAESKey 与企业微信后台一致，且 URL 能在公网访问。

**Q: 如何查询昨天的客户新增数？**
A: 通过 `contact_stats` 模块查询，配合事件回调可以获取实时数据。

## License

MIT
