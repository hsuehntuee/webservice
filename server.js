// 引入所需的模組
const express = require('express');
const { Client } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

// 初始化 Express 應用
const app = express();
const port = process.env.PORT || 3000;

// 配置 CORS（處理跨域請求）
app.use(cors());

// 解析 JSON 請求
app.use(bodyParser.json());

// PostgreSQL 連接字串（請填寫您的資料庫 URL）
const DB_URL = 'postgresql://test_zij7_user:cXCq0Km71u7ODlDgwYH94sXP0mVrMnJz@dpg-ctp93gij1k6c739h5nbg-a.oregon-postgres.render.com/test_zij7';

// 創建 PostgreSQL 客戶端並連接到資料庫
const client = new Client({
  connectionString: DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect()
  .then(() => {
    console.log('成功連接到 PostgreSQL 數據庫');
  })
  .catch((err) => {
    console.error('無法連接到數據庫', err.stack);
  });

// 提交表單資料 API
app.post('/api/submitSurvey', (req, res) => {
  const { name, date, restaurant } = req.body;

  // 確保表單資料完整
  if (!name || !date || !restaurant) {
    return res.status(400).json({ error: '缺少必要的表單資料' });
  }

  // 插入資料庫
  const query = 'INSERT INTO surveys (name, date, restaurant) VALUES ($1, $2, $3)';
  const values = [name, date, restaurant];

  client.query(query, values)
    .then(() => {
      res.status(200).json({ message: '表單資料成功提交到數據庫！' });
    })
    .catch((err) => {
      console.error('資料庫錯誤:', err.stack);
      res.status(500).json({ error: '提交資料時發生錯誤，請稍後再試' });
    });
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`伺服器正在 http://localhost:${port} 上運行`);
});
