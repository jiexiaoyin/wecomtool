/**
 * 消息推送模块
 * API 章节：十三 - 消息推送（企业群发）
 * 包含：企业群发、欢迎语、提醒成员等
 */

const WeComSDK = require('../sdk');

class Messenger extends WeComSDK {
  constructor(config) {
    super(config);
  }

  // ========== 企业群发 ==========

  /**
   * 创建企业群发
   * @param {string} userId 成员 ID
   * @param {object} content 消息内容
   * @param {string} chatId 群聊 ID（可选）
   */
  async createMassMessage(userId, content, chatId = '') {
    const { text, image, video, file, link, miniprogram, msgType } = content;
    
    const params = {
      userid: userId,
      msgtype: msgType || 'text'
    };

    if (chatId) params.chatid = chatId;
    
    switch (params.msgtype) {
      case 'text':
        params.text = { content: text };
        break;
      case 'image':
        params.image = { media_id: image };
        break;
      case 'video':
        params.video = { media_id: video };
        break;
      case 'file':
        params.file = { media_id: file };
        break;
      case 'link':
        params.link = link;
        break;
      case 'miniprogram':
        params.miniprogram = miniprogram;
        break;
    }

    return this.post('/externalcontact/add_msg_template', params);
  }

  /**
   * 获取企业的全部群发记录
   * @param {number} startTime 开始时间戳
   * @param {number} endTime 结束时间戳
   * @param {string} userId 成员 ID（可选）
   * @param {number} cursor 分页游标
   * @param {number} size 每页数量
   */
  async getMassMessageList(startTime, endTime, userId = '', cursor = '', size = 100) {
    return this.post('/externalcontact/get_moment_list', {
      start_time: startTime,
      end_time: endTime,
      userid: userId,
      cursor,
      limit: size
    });
  }

  /**
   * 获取群发消息发送结果
   * @param {string} msgId 消息 ID
   */
  async getMassMessageResult(msgId) {
    return this.post('/externalcontact/get_moment_task_result', {
      msg_id: msgId
    });
  }

  /**
   * 停止企业群发
   * @param {string} msgId 消息 ID
   */
  async cancelMassMessage(msgId) {
    return this.post('/externalcontact/cancel_moment_task', {
      msg_id: msgId
    });
  }

  // ========== 提醒成员群发 ==========

  /**
   * 提醒成员群发
   * @param {string} userId 成员 ID
   * @param {string} msgId 消息 ID
   */
  async remindMassMessage(userId, msgId) {
    return this.post('/externalcontact/remind_moment_task', {
      userid: userId,
      msg_id: msgId
    });
  }

  // ========== 欢迎语管理 ==========

  /**
   * 发送新客户欢迎语
   * @param {string} userId 成员 ID
   * @param {string} externalUserId 外部客户 ID
   * @param {object} content 欢迎语内容
   */
  async sendWelcomeMessage(userId, externalUserId, content) {
    const { text, image, video, file, link, miniprogram, msgType } = content;
    
    const params = {
      userid: userId,
      external_userid: externalUserId,
      msgtype: msgType || 'text'
    };

    switch (params.msgtype) {
      case 'text':
        params.text = { content: text };
        break;
      case 'image':
        params.image = { media_id: image };
        break;
      case 'video':
        params.video = { media_id: video };
        break;
      case 'file':
        params.file = { media_id: file };
        break;
      case 'link':
        params.link = link;
        break;
      case 'miniprogram':
        params.miniprogram = miniprogram;
        break;
    }

    return this.post('/externalcontact/send_welcome_msg', params);
  }

  /**
   * 获取欢迎语素材列表
   */
  async getWelcomeMediaList() {
    return this.post('/externalcontact/get_welcome_media', {});
  }

  /**
   * 添加入群欢迎语素材
   * @param {string} filePath 文件路径
   * @param {string} type 素材类型
   */
  async uploadWelcomeMedia(filePath, type = 'image') {
    return this.uploadFile(filePath, 'media', { type });
  }

  // ========== 入群欢迎语素材管理 ==========

  /**
   * 获取入群欢迎语素材
   * @param {string} sceneId 场景 ID
   */
  async getGroupWelcomeMedia(sceneId) {
    return this.post('/externalcontact/get_group_welcome_media', {
      scene_id: sceneId
    });
  }

  /**
   * 配置入群欢迎语素材
   * @param {object} params 欢迎语参数
   */
  async setGroupWelcomeMedia(params) {
    return this.post('/externalcontact/set_group_welcome_media', params);
  }

  /**
   * 删除入群欢迎语素材
   * @param {string} sceneId 场景 ID
   */
  async deleteGroupWelcomeMedia(sceneId) {
    return this.post('/externalcontact/del_group_welcome_media', {
      scene_id: sceneId
    });
  }

  // ========== 消息存档 ==========

  /**
   * 获取群发消息发送成员列表
   * @param {string} msgId 消息 ID
   */
  async getMassMessageUsers(msgId) {
    return this.post('/externalcontact/get_moment_task_detail', {
      msg_id: msgId
    });
  }
}

module.exports = Messenger;
