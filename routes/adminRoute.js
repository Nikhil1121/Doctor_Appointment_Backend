import express from 'express'
import { addDoctor, loginAdmin, allDoctors, deletedDoctors, appointmentsAdmin, appointmentCancel, appointmentConfirm, adminDashboard, removeDoctor, restoreDoctor, allPatients } from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js'
import { changeAvailability } from '../controllers/doctorController.js'

const adminRouter = express.Router()

adminRouter.post('/login', loginAdmin)
adminRouter.post('/add-doctor', authAdmin, upload.single("image"), addDoctor)
adminRouter.get('/all-doctors', authAdmin, allDoctors)
adminRouter.get('/deleted-doctors', authAdmin, deletedDoctors)
adminRouter.post('/change-availability', authAdmin, changeAvailability)
adminRouter.get('/appointments', authAdmin, appointmentsAdmin)
adminRouter.post('/cancel-appointment', authAdmin, appointmentCancel)
adminRouter.post('/confirm-appointment', authAdmin, appointmentConfirm)
adminRouter.get('/dashboard', authAdmin, adminDashboard)
adminRouter.post('/remove-doctor', authAdmin, removeDoctor)
adminRouter.post('/restore-doctor', authAdmin, restoreDoctor)
adminRouter.get('/all-patients', authAdmin, allPatients)

export default adminRouter
