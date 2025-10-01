const express = require('express');
const router = express.Router();

// 导入统一的项目处理器
const {
  getAllProjects,
  getProjectById,
  getProjectByCode,
  createProject,
  updateProjectSubscription
} = require('./route_handler/unifiedProjectRouter_Handler');

// ===========================================
// 项目路由 - 统一管理所有项目相关API
// ===========================================

// 获取所有项目列表 - 支持多种路径
router.get('/project', getAllProjects);        // 新的主要路径
router.get('/projects', getAllProjects);       // 标准RESTful路径
router.get('/loans', getAllProjects);          // 向后兼容路径

// 根据项目ID获取项目详情
router.get('/projects/:projectId', getProjectById);

// 根据项目ID获取项目详情（用于前端路由）
router.get('/project/:id', getProjectById);

// 根据项目代码获取项目详情
router.get('/loans/:code', getProjectByCode);
router.get('/project/:code', getProjectByCode);        // 新的project路径

// 创建新项目（管理员功能）
router.post('/projects', createProject);
router.post('/project', createProject);                // 新的project路径

// 更新项目订阅信息
router.put('/loans/:code/subscription', updateProjectSubscription);
router.put('/project/:code/subscription', updateProjectSubscription);  // 新的project路径

module.exports = router;
