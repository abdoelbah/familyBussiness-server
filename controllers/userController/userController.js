const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../../model/userModel/userModel');
const cashModel = require('../../model/cashModel/cashModel');
const PackageModel = require('../../model/packageModel/packageModel');
const clientModel = require('../../model/clientModel/clientModel');

exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            msg: 'تأكد من ملئ جميع الحقول',
            state: 0,
            data: []
        });
    }

    try {
        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(404).json({
                msg: 'هذا الاسم غير موجود',
                state: 0,
                data: []
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                msg: 'كلمة المرور غير صحيحة',
                state: 0,
                data: []
            });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            msg: 'تم تسجيل الدخول بنجاح',
            state: 1,
            data: { user, token }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            msg: 'خطأ في الخادم الداخلي',
            state: 0,
            data: []
        });
    }
};

exports.signup = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            msg: 'تأكد من ملئ جميع الحقول',
            state: 0,
            data: []
        });
    }

    try {
        const existingUser = await userModel.findOne({ username });
        if (existingUser) {
            return res.status(409).json({
                msg: 'اسم المستخدم موجود بالفعل',
                state: 0,
                data: []
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            username,
            password: hashedPassword
        });

        await newUser.save();

        const token = jwt.sign(
            { id: newUser._id, username: newUser.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            msg: 'تم التسجيل بنجاح',
            state: 1,
            data: { user: newUser, token }
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({
            msg: 'خطأ في الخادم الداخلي',
            state: 0,
            data: []
        });
    }
};

exports.addPackage = async (req, res) => {
    const { registererID, clientID, deliverer, packages } = req.body;

    if (!registererID || !clientID || !deliverer || !packages || !Array.isArray(packages)) {
        return res.status(400).json({
            msg: "تأكد من ملئ جميع الحقول",
            state: 0,
            data: []
        });
    }

    try {
        let client = await PackageModel.findOne({ clientID });

        const packageData = {
            registererID: registererID,
            deliverer: deliverer,
            pack: packages.map(pkg => ({
                quantity: pkg.quantity,
                type: pkg.type,
                price: pkg.price || 0
            }))
        };

        if (!client) {
            client = new PackageModel({
                clientID,
                package: [packageData]
            });

            await client.save();
            return res.status(201).json({
                msg: 'تمت الاضافة بنجاح',
                state: 1,
                data: client
            });
        } else {
            client.package.push(packageData);
            await client.save();
            return res.status(200).json({
                msg: 'تم تحديث البيانات بنجاح',
                state: 1,
                data: client
            });
        }
    } catch (error) {
        console.error("Error adding package:", error);
        return res.status(500).json({
            msg: 'خطأ في الخادم الداخلي',
            state: 0,
            data: []
        });
    }
};

exports.addCash = async (req, res) => {
    const { clientID, patches } = req.body;

    if (!clientID || !Array.isArray(patches)) {
        return res.status(400).json({
            msg: 'تأكد من ملئ جميع الحقول',
            state: 0,
            data: []
        });
    }

    try {
        let client = await cashModel.findOne({ clientID });

        const patchData = patches.map(ptch => ({
            amount: ptch.amount,
            counter: ptch.counter,
            reciever: ptch.reciever
        }));

        if (!client) {
            client = new cashModel({
                clientID,
                patches: patchData,
                
            });

            await client.save();
            return res.status(201).json({
                msg: 'تمت الاضافة بنجاح',
                state: 1,
                data: client
            });
        } else {
            client.patches.push(...patchData);
            await client.save();
            return res.status(200).json({
                msg: 'تم تحديث البيانات بنجاح',
                state: 1,
                data: client
            });
        }
    } catch (error) {
        console.error("Error adding cash:", error);
        return res.status(500).json({
            msg: 'خطأ في الخادم الداخلي',
            state: 0,
            data: []
        });
    }
};

exports.getAvailableClients = async (req, res) => {
    try {
      const clients = await clientModel.find();
  
      if (!clients || clients.length === 0) {
        return res.status(404).json({ msg: 'لا يوجد زبائن',state : 0, data : [] });
      }
  
      return res.status(200).json({msg : 'success',state : 1,data : clients});
    } catch (error) {
  
      return res.status(500).json({ msg: 'خطأ في النظام الداخلي',state : 0, data : [] });
    }
  };

exports.getAvailablePackages = async (req, res) => {
    try {
       
        const packages = await PackageModel.find().populate('clientID');
       
    
        if (!packages || packages.length === 0) {
            return res.status(404).json({
                msg: 'لا توجد حزم متاحة',
                state: 0,
                data: []
            });
        }

        res.status(200).json({
            msg: 'تم استرجاع الحزم بنجاح',
            state: 1,
            data: packages
        });
    } catch (error) {
        console.error("Error fetching packages:", error);
        res.status(500).json({
            msg: 'خطأ في الخادم الداخلي',
            state: 0,
            data: []
        });
    }
};

exports.getAvailableCash = async (req, res) => {
    try {
        const cashRecords = await cashModel.find().populate('clientID');
        if (!cashRecords || cashRecords.length === 0) {
            return res.status(404).json({
                msg: 'لا توجد سجلات نقدية متاحة',
                state: 0,
                data: []
            });
        }

        res.status(200).json({
            msg: 'تم استرجاع السجلات النقدية بنجاح',
            state: 1,
            data: cashRecords
        });
    } catch (error) {
        console.error("Error fetching cash records:", error);
        res.status(500).json({
            msg: 'خطأ في الخادم الداخلي',
            state: 0,
            data: []
        });
    }
};
