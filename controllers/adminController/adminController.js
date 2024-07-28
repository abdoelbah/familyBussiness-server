const clientModel = require('../../model/clientModel/clientModel')


exports.addClient = async (req ,res) => {
const {name} = req.body;

if(!name){
    return res.status(400).json({
        msg : 'تأكد من ملئ جميع الحقول',
        state : 0,
        data : []
    })
}
try {
const client = await clientModel.findOne({name})

    if(client){
        return res.status(401).json({
            msg : 'هذا العميل موجود بالفعل',
            state : 0,
            data : []
        })

    }
    await clientModel.create({name}).then(()=>{
        return res.status(200).json({
            msg : 'تم اضافة العميل بنجاح',
            state : 1,
            data : []
        })
    }).catch((err) => {
        console.log(err)
        return res.status(501).json({
            msg : 'خطأ اثناء اضافة العميل',
            state : 0,
            data : err.message
        })
    })
} catch (error) {
    console.log(error)
}
}