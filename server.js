import express from "express";

const app = express();
const PORT = 3000;

const equipment = [
    {id: 1, name: 'คอมพิวเตอร์', category: 'computer'},
    {id: 2, name: 'ปริ้นเตอร์', category: 'printer'},
    {id: 3, name: 'คีย์บอร์ด', category: 'accessory'},
    {id: 4, name: 'เมาส์', category: 'accessory'},
];


app.get("/api/equipment/:id", (req, res) => {
    const id = Number(req.params.id);
    const result = equipment.find(e=>e.id==id);
    if (result){
        res.status(200).json(result)
    
    }else{ res.status(404).json({message: "ไม่เจอ"})

    }
});



app.get("/api/equipment/getNum", (req, res) => {
    res.status(200).json({
    num: equipment.length
    });
});



app.get("/api/equipment",(req, res)=>{
    const cat = req.query.category;
    const result = cat?equipment.filter(e=>e.category === cat):equipment;
    res.status(200).json(result);
});
   


app.get("/api/equipment/getNum", (req, res) => {
    res.status(200).json({
    num: equipment.length
    });
});



app.get("/health",(req,res)=>{
    res.status(200).json(
        {
            status: "OK",
            message: "Server is running"
        }
    )})















    app.listen(PORT, () => {
    console.log(`Server is running
        on http://localhost:${PORT}`);
})