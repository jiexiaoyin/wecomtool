/**
 * 文档管理模块
 * API 章节：十五 - 文档
 * 包含：文档管理、收集表、素材管理
 */

const WeComSDK = require('../sdk');

class Document extends WeComSDK {
  constructor(config) {
    super(config);
  }

  // ========== 文档管理 ==========

  /**
   * 创建文档
   * @param {string} spaceId 空间 ID
   * @param {string} folderId 文件夹 ID
   * @param {string} title 文档标题
   * @param {string} docType 文档类型: doc, sheet, mindmap, docx, ppt, bitable
   */
  async createDocument(spaceId, folderId, title, docType = 'doc') {
    return this.post('/doc/create', {
      spaceid: spaceId,
      folderid: folderId,
      title,
      doc_type: docType
    });
  }

  /**
   * 重命名文档
   * @param {string} spaceId 空间 ID
   * @param {string} objId 文档或文件夹 ID
   * @param {string} title 新标题
   */
  async renameDocument(spaceId, objId, title) {
    return this.post('/doc/rename', {
      spaceid: spaceId,
      obj_id: objId,
      title
    });
  }

  /**
   * 删除文档
   * @param {string} spaceId 空间 ID
   * @param {string} objId 文档或文件夹 ID
   */
  async deleteDocument(spaceId, objId) {
    return this.post('/doc/delete', {
      spaceid: spaceId,
      obj_id: objId
    });
  }

  /**
   * 获取文档信息
   * @param {string} spaceId 空间 ID
   * @param {string} objId 文档 ID
   */
  async getDocumentInfo(spaceId, objId) {
    return this.post('/doc/get', {
      spaceid: spaceId,
      obj_id: objId
    });
  }

  /**
   * 获取文档权限信息
   * @param {string} spaceId 空间 ID
   * @param {string} objId 文档或文件夹 ID
   */
  async getDocumentAuth(spaceId, objId) {
    return this.post('/doc/get_auth', {
      spaceid: spaceId,
      obj_id: objId
    });
  }

  /**
   * 修改文档安全设置
   * @param {string} spaceId 空间 ID
   * @param {string} objId 文档 ID
   * @param {object} security 安全设置
   */
  async updateDocumentSecurity(spaceId, objId, security) {
    return this.post('/doc/set_security', {
      spaceid: spaceId,
      obj_id: objId,
      security
    });
  }

  // ========== 管理收集表 ==========

  /**
   * 创建收集表
   * @param {string} spaceId 空间 ID
   * @param {string} title 收集表标题
   * @param {string} description 描述
   * @param {object[]} questions 问题列表
   */
  async createSurvey(spaceId, title, description = '', questions = []) {
    return this.post('/doc/survey/create', {
      spaceid: spaceId,
      title,
      description,
      questions
    });
  }

  /**
   * 编辑收集表
   * @param {string} surveyId 收集表 ID
   * @param {object} params 更新参数
   */
  async updateSurvey(surveyId, { title, description, questions, status }) {
    return this.post('/doc/survey/update', {
      survey_id: surveyId,
      title,
      description,
      questions,
      status
    });
  }

  /**
   * 获取收集表信息
   * @param {string} surveyId 收集表 ID
   */
  async getSurveyInfo(surveyId) {
    return this.post('/doc/survey/get', { survey_id: surveyId });
  }

  /**
   * 获取收集表的统计信息
   * @param {string} surveyId 收集表 ID
   */
  async getSurveyStats(surveyId) {
    return this.post('/doc/survey/stats', { survey_id: surveyId });
  }

  /**
   * 读取收集表答案
   * @param {string} surveyId 收集表 ID
   * @param {string} token 答案 token
   */
  async getSurveyAnswer(surveyId, token) {
    return this.post('/doc/survey/get_answer', {
      survey_id: surveyId,
      token
    });
  }

  /**
   * 获取收集表答案列表
   * @param {string} surveyId 收集表 ID
   * @param {number} offset 偏移量
   * @param {number} size 每页数量
   */
  async listSurveyAnswers(surveyId, offset = 0, size = 100) {
    return this.post('/doc/survey/list_answer', {
      survey_id: surveyId,
      offset,
      limit: size
    });
  }

  // ========== 接收外部数据到智能表格 ==========

  /**
   * 添加记录
   * @param {string} spaceId 空间 ID
   * @param {string} tableId 表格 ID
   * @param {object[]} records 记录列表
   */
  async addBitableRecords(spaceId, tableId, records) {
    return this.post('/doc/bitable/record/add', {
      spaceid: spaceId,
      table_id: tableId,
      records
    });
  }

  /**
   * 更新记录
   * @param {string} spaceId 空间 ID
   * @param {string} tableId 表格 ID
   * @param {object[]} records 记录列表
   */
  async updateBitableRecords(spaceId, tableId, records) {
    return this.post('/doc/bitable/record/update', {
      spaceid: spaceId,
      table_id: tableId,
      records
    });
  }

  /**
   * 删除记录
   * @param {string} spaceId 空间 ID
   * @param {string} tableId 表格 ID
   * @param {string[]} recordIds 记录 ID 列表
   */
  async deleteBitableRecords(spaceId, tableId, recordIds) {
    return this.post('/doc/bitable/record/delete', {
      spaceid: spaceId,
      table_id: tableId,
      record_ids: recordIds
    });
  }

  // ========== 素材管理 ==========

  /**
   * 上传文档图片
   * @param {string} spaceId 空间 ID
   * @param {string} filePath 文件路径
   */
  async uploadDocImage(spaceId, filePath) {
    const fs = require('fs');
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const fileName = require('path').basename(filePath);
    const fileBuffer = fs.readFileSync(filePath);

    const formData = {
      media: {
        value: fileBuffer,
        options: {
          filename: fileName,
          contentType: 'image/jpeg'
        }
      }
    };

    return this.post('/doc/media/upload_image', { media: formData }, {
      spaceid: spaceId,
      apiType: 'upload'
    });
  }

  // ========== 高级功能账号管理 ==========

  /**
   * 分配高级功能账号
   * @param {string} userId 成员 userid
   * @param {string} type 高级功能类型
   */
  async assignAdvancedAccount(userId, type) {
    return this.post('/doc/advanced_account/assign', {
      userid: userId,
      type
    });
  }

  /**
   * 取消高级功能账号
   * @param {string} userId 成员 userid
   * @param {string} type 高级功能类型
   */
  async cancelAdvancedAccount(userId, type) {
    return this.post('/doc/advanced_account/cancel', {
      userid: userId,
      type
    });
  }

  /**
   * 获取高级功能账号列表
   * @param {string} type 高级功能类型
   */
  async getAdvancedAccountList(type) {
    return this.post('/doc/advanced_account/list', { type });
  }
}

module.exports = Document;
