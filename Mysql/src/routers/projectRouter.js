const express = require('express');
const router = express.Router();

// 导入项目处理器
const {
  getAllProjects,
  getProjectById,
  getProjectByProjectId,
  createProject
} = require('./route_handler/projectRouter_Handler');

// 获取所有项目列表
router.get('/projects', getAllProjects);

// 根据项目ID获取项目详情
router.get('/projects/:projectId', getProjectById);

// 根据项目ID获取项目详情（用于前端路由）
router.get('/project/:id', getProjectByProjectId);

// 创建新项目（管理员功能）
router.post('/projects', createProject);

module.exports = router;