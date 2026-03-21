/**
 * 敏感词管理模块
 * API 章节：十三 - 聊天敏感词
 * 包含：敏感词管理、敏感行为管理
 */

const WeComSDK = require('../../sdk');

class Sensitive extends WeComSDK {
  constructor(config) {
    super(config);
  }

  // ========== 敏感词管理 ==========

  /**
   * 获取敏感词列表
   * @param {number} offset 偏移量
   * @param {number} size 每页数量
   */
  async getSensitiveWordList(offset = 0, size = 100) {
    return this.post('/externalcontact/get_sensitive_word_list', {
      offset,
      limit: size
    });
  }

  /**
   * 获取敏感词详情
   * @param {string} wordId 敏感词 ID
   */
  async getSensitiveWordDetail(wordId) {
    return this.post('/externalcontact/get_sensitive_word', {
      word_id: wordId
    });
  }

  /**
   * 添加敏感词
   * @param {string} word 敏感词
   * @param {string} wordType 敏感词类型
   * @param {string} ruleId 规则 ID
   */
  async addSensitiveWord(word, wordType = 'keyword', ruleId = '') {
    return this.post('/externalcontact/add_sensitive_word', {
      word,
      word_type: wordType,
      rule_id: ruleId
    });
  }

  /**
   * 编辑敏感词
   * @param {string} wordId 敏感词 ID
   * @param {string} word 敏感词
   */
  async updateSensitiveWord(wordId, word) {
    return this.post('/externalcontact/update_sensitive_word', {
      word_id: wordId,
      word
    });
  }

  /**
   * 删除敏感词
   * @param {string} wordId 敏感词 ID
   */
  async deleteSensitiveWord(wordId) {
    return this.post('/externalcontact/del_sensitive_word', {
      word_id: wordId
    });
  }

  // ========== 敏感词规则管理 ==========

  /**
   * 获取敏感词规则列表
   */
  async getSensitiveRuleList() {
    return this.post('/externalcontact/get_sensitive_rule_list', {});
  }

  /**
   * 获取敏感词规则详情
   * @param {string} ruleId 规则 ID
   */
  async getSensitiveRuleDetail(ruleId) {
    return this.post('/externalcontact/get_sensitive_rule', {
      rule_id: ruleId
    });
  }

  /**
   * 添加敏感词规则
   * @param {object} rule 规则配置
   */
  async addSensitiveRule(rule) {
    return this.post('/externalcontact/add_sensitive_rule', rule);
  }

  /**
   * 编辑敏感词规则
   * @param {string} ruleId 规则 ID
   * @param {object} rule 规则配置
   */
  async updateSensitiveRule(ruleId, rule) {
    return this.post('/externalcontact/update_sensitive_rule', {
      rule_id: ruleId,
      ...rule
    });
  }

  /**
   * 删除敏感词规则
   * @param {string} ruleId 规则 ID
   */
  async deleteSensitiveRule(ruleId) {
    return this.post('/externalcontact/del_sensitive_rule', {
      rule_id: ruleId
    });
  }

  // ========== 敏感操作管理 ==========

  /**
   * 获取成员敏感行为列表
   * @param {number} startTime 开始时间戳
   * @param {number} endTime 结束时间戳
   * @param {string} userId 成员 ID
   * @param {string} type 行为类型
   * @param {number} offset 偏移量
   * @param {number} size 每页数量
   */
  async getSensitiveActionList(startTime, endTime, userId = '', type = '', offset = 0, size = 100) {
    return this.post('/externalcontact/get_sensitive_action_list', {
      start_time: startTime,
      end_time: endTime,
      userid: userId,
      type,
      offset,
      limit: size
    });
  }

  // ========== 敏感成员配置 ==========

  /**
   * 获取使用敏感词的成员列表
   * @param {string} wordId 敏感词 ID
   */
  async getSensitiveWordUsers(wordId) {
    return this.post('/externalcontact/get_sensitive_word_users', {
      word_id: wordId
    });
  }

  /**
   * 配置敏感词成员例外
   * @param {string} wordId 敏感词 ID
   * @param {string[]} userIds 例外成员 ID
   */
  async setSensitiveWordExusers(wordId, userIds) {
    return this.post('/externalcontact/set_sensitive_word_exusers', {
      word_id: wordId,
      user_ids: userIds
    });
  }
}

module.exports = Sensitive;
