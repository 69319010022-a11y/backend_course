import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

const equipment = [
  { id: 101, name: 'Notebook', category: 'computer', quantity: 5 },
  { id: 102, name: 'Projector', category: 'display', quantity: 2 },
  { id: 103, name: 'PC', category: 'computer', quantity: 10 }
];

let nextId = 104;

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim() !== '';
}

function parseId(value) {
  if (!/^\d+$/.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function isValidQuantity(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

app.get('/', (req, res) => {
  res.send('Hello, Backend!');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/equipment', (req, res) => {
  const { category } = req.query;

  if (category === undefined) {
    return res.json(equipment);
  }

  if (!isNonEmptyString(category)) {
    return res.status(400).json({ message: 'category ต้องเป็นข้อความที่ไม่ว่าง' });
  }

  const keyword = category.trim().toLowerCase();
  const result = equipment.filter(item => item.category.toLowerCase() === keyword);
  res.json(result);
});

app.get('/api/equipment/count', (req, res) => {
  res.json({ total: equipment.length });
});

app.get('/api/equipment/:id', (req, res) => {
  const id = parseId(req.params.id);

  if (id === null) {
    return res.status(400).json({ message: 'ID ต้องเป็นจำนวนเต็มบวก' });
  }

  const item = equipment.find(e => e.id === id);

  if (!item) {
    return res.status(404).json({ message: `ไม่พบอุปกรณ์ ID ${id}` });
  }

  res.json(item);
});

app.post('/api/equipment', (req, res) => {
  const body = req.body;

  if (!isPlainObject(body)) {
    return res.status(400).json({ message: 'Body ต้องเป็น JSON Object' });
  }

  const { name, category, quantity } = body;

  if (!isNonEmptyString(name)) {
    return res.status(400).json({ message: 'name ต้องเป็นข้อความที่ไม่ว่าง' });
  }
  if (!isNonEmptyString(category)) {
    return res.status(400).json({ message: 'category ต้องเป็นข้อความที่ไม่ว่าง' });
  }
  if (!isValidQuantity(quantity)) {
    return res.status(400).json({ message: 'quantity ต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป' });
  }

  const newItem = {
    id: nextId++,
    name: name.trim(),
    category: category.trim(),
    quantity
  };

  equipment.push(newItem);
  res.status(201).json(newItem);
});

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'รูปแบบ JSON ไม่ถูกต้อง' });
  }
  console.error(err);
  res.status(500).json({ message: 'เกิดข้อผิดพลาดที่ Server' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});