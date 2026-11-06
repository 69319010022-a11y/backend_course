// Server2.js
import express from 'express';

const app = express();
const PORT = 5000;

// 1. ตรวจสอบการทำงานของเซิร์ฟเวอร์
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running', time: new Date().toISOString() });
});

// 2. query: คำนวณ BMI
// ตัวอย่าง: /api/formula1?weight=65&height=170
app.get('/api/formula1', (req, res) => {
  const weight = parseFloat(req.query.weight);
  const height = parseFloat(req.query.height);

  if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
    return res.status(400).json({ error: 'ต้องส่ง weight (กก.) และ height (ซม.) เป็นตัวเลขมากกว่า 0' });
  }

  const m = height / 100;
  const bmi = weight / (m * m);

  // เกณฑ์สำหรับคนเอเชีย (WHO Asia-Pacific)
  let category;
  if (bmi < 18.5) category = 'น้ำหนักต่ำกว่าเกณฑ์';
  else if (bmi < 23) category = 'ปกติ';
  else if (bmi < 25) category = 'น้ำหนักเกิน';
  else if (bmi < 30) category = 'อ้วนระดับ 1';
  else category = 'อ้วนระดับ 2';

  res.json({
    formula: 'BMI = weight / (height_m)^2',
    result: { bmi: Number(bmi.toFixed(2)), category }
  });
});

// 3. query: น้ำหนักเป้าหมายจาก BMI ที่ต้องการ
// ตัวอย่าง: /api/formula2?weight=80&height=170&targetBmi=22
// weight (กก.), height (ซม.), targetBmi (ไม่ส่งจะใช้ 22)
app.get('/api/formula2', (req, res) => {
  const weight = parseFloat(req.query.weight);
  const height = parseFloat(req.query.height);
  const targetBmi = req.query.targetBmi !== undefined ? parseFloat(req.query.targetBmi) : 22;

  if ([weight, height, targetBmi].some(isNaN) || weight <= 0 || height <= 0 || targetBmi <= 0) {
    return res.status(400).json({ error: 'ต้องส่ง weight (กก.), height (ซม.) และ targetBmi (ถ้าส่ง) เป็นตัวเลขมากกว่า 0' });
  }

  const m = height / 100;
  const currentBmi = weight / (m * m);
  const targetWeight = targetBmi * m * m;
  const diff = targetWeight - weight;

  let advice;
  if (Math.abs(diff) < 0.05) advice = 'น้ำหนักตรงตามเป้าหมายแล้ว';
  else if (diff < 0) advice = `ต้องลดน้ำหนัก ${Math.abs(diff).toFixed(2)} กก.`;
  else advice = `ต้องเพิ่มน้ำหนัก ${diff.toFixed(2)} กก.`;

  res.json({
    formula: 'targetWeight = targetBMI * (height_m)^2',
    result: {
      currentBmi: Number(currentBmi.toFixed(2)),
      targetBmi,
      targetWeight: Number(targetWeight.toFixed(2)),
      difference: Number(diff.toFixed(2)),
      advice,
      normalWeightRange: {
        min: Number((18.5 * m * m).toFixed(2)),
        max: Number((22.9 * m * m).toFixed(2))
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});