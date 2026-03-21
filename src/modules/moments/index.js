/**
 * 客户朋友圈模块
 * API 章节：十三 - 客户朋友圈
 * 包含：发表朋友圈、停止发表、获取记录等
 */

const WeComSDK = require('../sdk');

class Moments extends WeComSDK {
  constructor(config) {
    super(config);
  }

  // ========== 朋友圈内容管理 ==========

  /**
   * 企业发表内容到客户的朋友圈
   * @param {string} userId 成员 ID
   * @param {object} content 朋友圈内容
   */
  async createMoment(userId, content) {
    const { text, imageIds, videoId, link, location } = content;
    return this.post('/externalcontact/add_moment_task', {
      userid: userId,
      moment_type: 1,
      moment_content: {
        text,
        image: imageIds || [],
        video: videoId,
        link: link,
        location: location
      }
    });
  }

  /**
   * 获取客户朋友圈全部的发表记录
   * @param {string} userId 成员 ID
   * @param {number} startTime 开始时间戳
   * @param {number} endTime 结束时间戳
   * @param {number} cursor 分页游标
   * @param {number} size 每页数量
   */
  async getMomentList(userId, startTime, endTime, cursor = '', size = 100) {
    return this.post('/externalcontact/get_moment_list', {
      userid: userId,
      start_time: startTime,
      end_time: endTime,
      cursor,
      limit: size
    });
  }

  /**
   * 获取客户朋友圈发表结果
   * @param {string} momentId 朋友圈 ID
   * @param {string} userId 成员 ID
   */
  async getMomentTaskResult(momentId, userId) {
    return this.post('/externalcontact/get_moment_task_result', {
      moment_id: momentId,
      userid: userId
    });
  }

  /**
   * 获取朋友圈互动数据
   * @param {string} momentId 朋友圈 ID
   * @param {string} userId 成员 ID
   */
  async getMomentComments(momentId, userId) {
    return this.post('/externalcontact/get_moment_comments', {
      moment_id: momentId,
      userid: userId
    });
  }

  /**
   * 删除朋友圈
   * @param {string} momentId 朋友圈 ID
   * @param {string} userId 成员 ID
   */
  async deleteMoment(momentId, userId) {
    return this.post('/externalcontact/del_moment', {
      moment_id: momentId,
      userid: userId
    });
  }

  // ========== 朋友圈规则管理 ==========

  /**
   * 获取朋友圈规则组列表
   */
  async getMomentRuleList() {
    return this.post('/externalcontact/get_moment_rule_list', {});
  }

  /**
   * 获取朋友圈规则组详情
   * @param {string} ruleId 规则组 ID
   */
  async getMomentRuleDetail(ruleId) {
    return this.post('/externalcontact/get_moment_rule', { rule_id: ruleId });
  }

  /**
   * 创建朋友圈规则组
   * @param {object} rule 规则配置
   */
  async createMomentRule(rule) {
    return this.post('/externalcontact/add_moment_rule', rule);
  }

  /**
   * 更新朋友圈规则组
   * @param {string} ruleId 规则组 ID
   * @param {object} rule 规则配置
   */
  async updateMomentRule(ruleId, rule) {
    return this.post('/externalcontact/update_moment_rule', {
      rule_id: ruleId,
      ...rule
    });
  }

  /**
   * 删除朋友圈规则组
   * @param {string} ruleId 规则组 ID
   */
  async deleteMomentRule(ruleId) {
    return this.post('/externalcontact/del_moment_rule', { rule_id: ruleId });
  }

  // ========== 朋友圈素材管理 ==========

  /**
   * 获取朋友圈素材列表
   * @param {string} type 素材类型: image, video
   * @param {number} offset 偏移量
   * @param {number} size 每页数量
   */
  async getMomentMediaList(type = 'image', offset = 0, size = 100) {
    return this.post('/externalcontact/get_moment_media_list', {
      type,
      offset,
      limit: size
    });
  }

  /**
   * 上传朋友圈素材
   * @param {string} filePath 文件路径
   * @param {string} type 素材类型: image, video
   */
  async uploadMomentMedia(filePath, type = 'image') {
    return this.uploadFile(filePath, 'media', { type });
  }
}

module.exports = Moments;
