
import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

// ข้อมูลนักศึกษาเริ่มต้น
const students = [
  { stdID: "69319010007", stdName: "นาย กฤษดา บุญเหลือ" },
  { stdID: "69319010008", stdName: "นาย ญาณวุฒิ จันเพ็ง" },
  { stdID: "69319010009", stdName: "นาย ณภัทร โสธรรมมงคล" },
  { stdID: "69319010010", stdName: "นาย ธนดล คล้ายรัศมี" },
  { stdID: "69319010011", stdName: "นาย ธีทัต จันทร์สว่าง" },
  { stdID: "69319010012", stdName: "นาย นัฐพนธ์ ใจเย็น" },
  { stdID: "69319010013", stdName: "นาย ปกรณ์เกียรติ อยู่พิทักษ์สกุล" },
  { stdID: "69319010014", stdName: "นาย ปฏิพล เรืองชัย" },
  { stdID: "69319010015", stdName: "นาย ปิยะพงษ์ เหล่าประชาวิทย์" },
  { stdID: "69319010018", stdName: "นางสาว ภัทราวรินทร์ ศรีน้อย  " },
  { stdID: "69319010019", stdName: "นาย ภูริพัฒน์ สุธรรมมา" },
  { stdID: "69319010020", stdName: "นาย ภูวดล พลจารย์" },
  { stdID: "69319010022", stdName: "นาย ศาศวัต แสงคําฉาย" },
  { stdID: "69319010023", stdName: "นาย อภิรักษ ศรีวัดทานัง" },
];

// ตรวจสอบข้อความ
function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim() !== '';
}

// ตรวจสอบ JSON Object
function isPlainObject(value) {
  return value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value);
}

// หน้าแรก
app.get('/', (req, res) => {
  res.send('Hello Student API!');
});

// ตรวจสอบสถานะ Server
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// READ: แสดงข้อมูลนักศึกษาทั้งหมด
app.get('/api/students', (req, res) => {
  res.json(students);
});

// READ: ค้นหาข้อมูลนักศึกษาตามรหัส
app.get('/api/students/:stdID', (req, res) => {
  const stdID = req.params.stdID;

  const student = students.find(
    s => s.stdID === stdID
  );

  if (!student) {
    return res.status(404).json({
      message: 'ไม่พบข้อมูลนักศึกษา'
    });
  }

  res.json(student);
});

// CREATE: เพิ่มข้อมูลนักศึกษา
app.post('/api/students', (req, res) => {
  const body = req.body;

  if (!isPlainObject(body)) {
    return res.status(400).json({
      message: 'Body ต้องเป็น JSON Object'
    });
  }

  const { stdID, stdName } = body;

  if (!isNonEmptyString(stdID)) {
    return res.status(400).json({
      message: 'กรุณาระบุรหัสนักศึกษา'
    });
  }

  if (!isNonEmptyString(stdName)) {
    return res.status(400).json({
      message: 'กรุณาระบุชื่อนักศึกษา'
    });
  }

  // ตรวจสอบรหัสนักศึกษาซ้ำ
  const duplicate = students.find(
    s => s.stdID === stdID.trim()
  );

  if (duplicate) {
    return res.status(409).json({
      message: 'รหัสนักศึกษานี้มีอยู่แล้ว'
    });
  }

  const newStudent = {
    stdID: stdID.trim(),
    stdName: stdName.trim()
  };

  students.push(newStudent);

  res.status(201).json({
    message: 'เพิ่มข้อมูลนักศึกษาเรียบร้อย',
    data: newStudent
  });
});

// UPDATE: แก้ไขข้อมูลนักศึกษา
app.put('/api/students/:stdID', (req, res) => {
  const stdID = req.params.stdID;

  const student = students.find(
    s => s.stdID === stdID
  );

  if (!student) {
    return res.status(404).json({
      message: 'ไม่พบข้อมูลนักศึกษาที่ต้องการแก้ไข'
    });
  }

  const body = req.body;

  if (!isPlainObject(body)) {
    return res.status(400).json({
      message: 'Body ต้องเป็น JSON Object'
    });
  }

  if (!isNonEmptyString(body.stdName)) {
    return res.status(400).json({
      message: 'กรุณาระบุชื่อนักศึกษา'
    });
  }

  student.stdName = body.stdName.trim();

  res.status(200).json({
    message: 'แก้ไขข้อมูลนักศึกษาเรียบร้อย',
    data: student
  });
});

// DELETE: ลบข้อมูลนักศึกษา
app.delete('/api/students/:stdID', (req, res) => {
  const stdID = req.params.stdID;

  const index = students.findIndex(
    s => s.stdID === stdID
  );

  if (index === -1) {
    return res.status(404).json({
      message: 'ไม่พบข้อมูลนักศึกษาที่ต้องการลบ'
    });
  }

  const [deleted] = students.splice(index, 1);

  res.status(200).json({
    message: 'ลบข้อมูลนักศึกษาเรียบร้อย',
    data: deleted
  });
});

// จัดการข้อผิดพลาด JSON
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      message: 'รูปแบบ JSON ไม่ถูกต้อง'
    });
  }

  console.error(err);

  res.status(500).json({
    message: 'เกิดข้อผิดพลาดที่ Server'
  });
});

// เริ่มต้น Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
