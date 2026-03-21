/**
 * 企业微信 OpenClaw Skill 入口
 */

const fs = require('fs');
const path = require('path');
const WeComPlugin = require('../src/index');

// 配置文件路径
const CONFIG_PATH = path.join(__dirname, '..', 'config.json');

// 缓存插件实例
let wecomInstance = null;

// 配置状态（用于交互式配置）
let configState = {
  step: 0,           // 0: 未开始, 1: corpId, 2: corpSecret, 3: agentId, 4: token, 5: encodingAESKey, 6: 完成
  pending: {},       // 临时存储配置
  channel: null      // 配置来源渠道
};

/**
 * 获取插件实例
 */
function getWecom(config = null) {
  const userConfig = config || loadConfig();
  if (!wecomInstance || wecomInstance.config.corpId !== userConfig.corpId) {
    wecomInstance = new WeComPlugin(userConfig);
  }
  return wecomInstance;
}

/**
 * 加载配置文件
 */
function loadConfig() {
  if (fs.existsSync(CONFIG_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    } catch (e) {
      return {};
    }
  }
  return {};
}

/**
 * 保存配置文件
 */
function saveConfig(config) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
}

/**
 * 开始交互式配置
 */
function startConfig(channel = 'cli') {
  configState = {
    step: 1,
    pending: {},
    channel
  };
  
  return {
    message: '📝 **企业微信配置向导**\n\n请输入您的 **企业ID (corpId)**：\n\n获取方式：企业微信后台 → 我的企业 → 企业信息 → 企业ID',
    action: 'await_input'
  };
}

/**
 * 处理配置输入
 */
function handleConfigInput(input, channel = 'cli') {
  const trimmed = input.trim();
  
  switch (configState.step) {
    case 1: // corpId
      if (!trimmed) {
        return { message: '❌ 企业ID不能为空，请重新输入：' };
      }
      configState.pending.corpId = trimmed;
      configState.step = 2;
      return {
        message: '✅ 企业ID已保存\n\n请输入您的 **应用Secret (corpSecret)**：\n\n获取方式：企业微信后台 → 应用管理 → 自建应用 → 查看详情 → Secret'
      };
    
    case 2: // corpSecret
      if (!trimmed) {
        return { message: '❌ Secret不能为空，请重新输入：' };
      }
      configState.pending.corpSecret = trimmed;
      configState.step = 3;
      return {
        message: '✅ Secret已保存\n\n请输入您的 **应用AgentID**：\n\n获取方式：企业微信后台 → 应用管理 → 自建应用 → 查看详情 → AgentId'
      };
    
    case 3: // agentId
      if (!trimmed) {
        return { message: '❌ AgentID不能为空，请重新输入：' };
      }
      configState.pending.agentId = trimmed;
      configState.step = 4;
      return {
        message: '✅ AgentID已保存\n\n请输入您的 **回调Token**（可选，直接回车跳过）：\n\n用于接收企业微信回调事件，如不需要回调功能可跳过'
      };
    
    case 4: // token
      configState.pending.token = trimmed || '';
      configState.step = 5;
      return {
        message: '✅ Token已保存\n\n请输入您的 **回调EncodingAESKey**（可选，直接回车跳过）：\n\n回调消息加解密密钥，如不需要回调功能可跳过'
      };
    
    case 5: // encodingAESKey
      configState.pending.encodingAESKey = trimmed || '';
      configState.step = 6;
      
      // 保存配置
      const finalConfig = {
        ...loadConfig(),
        ...configState.pending
      };
      saveConfig(finalConfig);
      
      // 重置实例
      wecomInstance = null;
      
      return {
        message: `✅ 配置完成！\n\n已保存配置：\n- 企业ID: ${finalConfig.corpId}\n- AgentID: ${finalConfig.agentId}\n- Token: ${finalConfig.token ? '已设置' : '未设置'}\n\n现在可以测试连接：/skill wecom test_connection`
      };
    
    default:
      return { message: '❌ 配置已结束，请重新开始：/skill wecom config' };
  }
}

/**
 * 显示当前配置状态
 */
function showConfig() {
  const config = loadConfig();
  
  if (!config.corpId || config.corpId === 'YOUR_CORP_ID') {
    return {
      message: '⚠️ 企业微信尚未配置\n\n请运行：/skill wecom config\n或说"配置企业微信"开始配置'
    };
  }
  
  return {
    message: `📋 **当前配置**\n\n- 企业ID: ${config.corpId}\n- AgentID: ${config.agentId}\n- Token: ${config.token ? '✅ 已设置' : '❌ 未设置'}\n- EncodingAESKey: ${config.encodingAESKey ? '✅ 已设置' : '❌ 未设置'}\n\n如需修改配置，请运行：/skill wecom config`
  };
}

/**
 * 测试连接
 */
async function testConnection() {
  try {
    const wecom = getWecom();
    const result = await wecom.testConnection();
    
    if (result.success) {
      return {
        message: `✅ **连接成功！**\n\n- 企业ID: ${wecom.config.corpId}\n- Token: ${result.token.substring(0, 20)}...`
      };
    } else {
      return {
        message: `❌ **连接失败**\n\n${result.message}\n\n请检查配置是否正确，或重新配置：/skill wecom config`
      };
    }
  } catch (e) {
    return {
      message: `❌ **错误**\n\n${e.message}\n\n请先配置：/skill wecom config`
    };
  }
}

/**
 * Skill 主入口
 */
async function wecomSkill(params) {
  const { action, text, _channel } = params;
  
  // 检测是否触发配置
  const configKeywords = ['config', '配置', '设置', 'setup'];
  const isConfigRequest = configKeywords.some(kw => 
    (action && action.toLowerCase().includes(kw)) || 
    (text && text.toLowerCase().includes(kw))
  );
  
  // 配置模式
  if (isConfigRequest || configState.step > 0) {
    // 如果有文本输入，处理配置
    if (text && configState.step > 0) {
      return handleConfigInput(text, _channel);
    }
    // 开始新配置
    if (configState.step === 0 || configState.step === 6) {
      return startConfig(_channel);
    }
  }
  
  // 查看配置
  if (action === 'show_config' || action === 'status') {
    return showConfig();
  }
  
  // 测试连接
  if (action === 'test_connection') {
    return await testConnection();
  }
  
  // 其他操作需要先配置
  const config = loadConfig();
  if (!config.corpId || config.corpId === 'YOUR_CORP_ID') {
    return {
      message: '⚠️ 请先配置企业微信\n\n运行：/skill wecom config\n或说"配置企业微信"开始配置'
    };
  }
  
  // 执行具体操作
  return await executeAction(action, params);
}

/**
 * 执行具体操作
 */
async function executeAction(action, params) {
  const wecom = getWecom();
  const args = { ...params };
  delete args.action;
  
  try {
    switch (action) {
      case 'send_message':
        return await wecom.message.sendText(args.userId, args.content, args.agentId);
      
      case 'get_customer_list':
        return await wecom.contact.getCustomerList(args.userId);
      
      case 'get_customer_detail':
        return await wecom.contact.getCustomerDetail(args.userId, args.externalUserId);
      
      case 'get_approval_list':
        return await wecom.approval.getApprovalIds(args.startTime, args.endTime);
      
      case 'get_approval_detail':
        return await wecom.approval.getApprovalDetail(args.spNo);
      
      case 'create_meeting':
        return await wecom.meeting.createMeeting({
          topic: args.topic,
          startTime: args.startTime,
          endTime: args.endTime,
          organizers: [args.userId]
        });
      
      case 'get_user_list':
        return await wecom.addressbook.getDepartmentUsers(args.departmentId || 1, args.fetchChild || false);
      
      case 'get_department_list':
        return await wecom.addressbook.getDepartmentList(args.departmentId);
      
      case 'get_checkin_records':
        return await wecom.checkin.getCheckInRecords(args.startTime, args.endTime, args.userId);
      
      case 'get_corp_tags':
        return await wecom.contact.getCorpTags();
      
      case 'get_groupchat_list':
        return await wecom.contact.getGroupChatList(args.cursor, args.size);
      
      case 'get_agent_list':
        return await wecom.app.getAgentList();
      
      case 'get_token':
        return await wecom.approval.getAccessToken();
      
      default:
        return { message: `未知的操作: ${action}` };
    }
  } catch (e) {
    return { message: `❌ 执行失败: ${e.message}` };
  }
}

module.exports = { wecomSkill };
