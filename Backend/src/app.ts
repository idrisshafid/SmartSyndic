import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import { generalLimiter } from "./middleware/rateLimit.middleware";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


// Security middleware FIRST
//app.use(helmet());
//app.use(generalLimiter);

app.use(cors());
app.use(express.json());

export default app;

app.get("/", (req, res) => {
  res.send("API running with TypeScript  🚀");
});


//===================================================
//.................ROUTES...........................
//=================================================== 

import dashboardroutes from "./routes/dashboard.routes";
app.use("/api/dashboard", dashboardroutes);

import adminroutes from "./routes/admin.routes";
app.use("/api/admin", adminroutes);

import authRoutes from "./routes/auth.routes";
app.use("/api/auth", authRoutes);

import apartmentroutes from "./routes/apartment.routes";
app.use("/api/apartment",apartmentroutes);

import ownerroutes from "./routes/owner.routes";
app.use("/api/owner",ownerroutes);

import residenceroutes from "./routes/residence.routes"
app.use("/api/residence",residenceroutes);

import chargeroutes from "./routes/charge.routes"
app.use("/api/charges",chargeroutes);

import paymentroutes from "./routes/payment.routes"
app.use("/api/payment",paymentroutes);

import incidentroutes from"./routes/incident.routes"
app.use("/api/incidents",incidentroutes);

import reservationroutes from "./routes/reservation.routes"
app.use("/api/reservations",reservationroutes);

import announcementroutes from "./routes/announcement.routes"
app.use("/api/announcements",announcementroutes);

import notificationsroutes from "./routes/notifications.routes"
app.use("/api/notifications",notificationsroutes);

import chatbotroutes from "./routes/chatbot.routes"
app.use("/api/chatbot",chatbotroutes);


//===================================================
//.................Middlewares...........................
//=================================================== 

import {verifyToken} from "./middleware/auth.middleware";
app.use(verifyToken); 

import {errorHandler} from "./middleware/error.middleware"; 
app.use(errorHandler);

import {authorize } from "./middleware/role.middleware"; 
app.use(authorize());


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 

