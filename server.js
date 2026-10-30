import express from "express";

const app = express();
const PORT = 3000;

const equipment = [
    {id: 1, name: 'คอมพิวเตอร์', category: 'computer'},
    {id: 2, name: 'ปริ้นเตอร์', category: 'printer'},
    {id: 3, name: 'คีย์บอร์ด', category: 'accessory'},
];

app.get("/api/equipment", (req, res) => {
    res.status(200).json(equipment);
});


app.get("/api/equipment/getNum", (req, res) => {
    res.status(200).json({
    num: equipment.length
    });
});





app.get("/", (req,res)=> {
    res.send("kuy");
})


app.get("/Myfriend", (req, res) => {
    res.json([
        { ชื่อเล่น: "นาย", แม่: "แม่เลี้ยง" },
        { ชื่อเล่น: "ภู", แม่: "แม่บี", พ่อ: "วัด" },
        { ชื่อเล่น: "เตเต้", แม่: "จืด", พ่อ: "ด๊อก" },
        { ชื่อเล่น: "เก้า", แม่: "อ้อม", พ่อ: "โจ" },
        { ชื่อเล่น: "องศา", อา: "บี" }
    ]);
});

app.listen(PORT, () => {
    console.log(`Server is running
        on http://localhost:${PORT}`);
})