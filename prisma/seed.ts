import { randomUUID } from "crypto";
import { PrismaClient,Role, PlanType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("Staring database seeding...");

    // Create default admin user 
    const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
if (!adminEmail || !adminPassword) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD before running the seed");
}

    // Check if admin already exists 
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail},
    });

    if (existingAdmin) {
        console.log("Admin user already exists");
    } else {
        // Hash the password 
        const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Create admin user 
    const admin = await prisma.user.create({
        data: {
            email: adminEmail,
            password: hashedPassword,
            name: "Admin User",
            role: Role.ADMIN,
            image: "/default-avatar.png",
            subscription: {
                create: {
                    planType: PlanType.PRO,
                    isActive: true,
                },
            },
            usage: {
                create: {
                    month: new Date().getMonth() + 1,
                    year: new Date().getFullYear(),
                    validationCount: 0,
                },
            },
        },
    });
    console.log("Admin user created successfully");

    }

 // Create default User   
    const userEmail = process.env.TEST_USER_EMAIL ?? "demo-user@example.com";
const userPassword = process.env.TEST_USER_PASSWORD ?? randomUUID();

    // Check if User already exists 
    const existingUser = await prisma.user.findUnique({
        where: { email: userEmail},
    });

    if (existingUser) {
        console.log("User already exists");
    } else {
        // Hash the password 
        const hashedPassword = await bcrypt.hash(userPassword, 12);

    // Create admin user 
       await prisma.user.create({
        data: {
            email: userEmail,
            password: hashedPassword,
            name: "User",
            role: Role.USER,
            image: "/default-avatar.png",
            subscription: {
                create: {
                    planType: PlanType.FREE,
                    isActive: true,
                }, 
            },
            usage: {
                create: {
                    month: new Date().getMonth() + 1,
                    year: new Date().getFullYear(),
                    validationCount: 0,
                },
            },
        },
    });
    console.log("Test user created successfully");
    
   }
   
   console.log("\n Database seeding completed");

}


 main()
        .then(async () => {
            await prisma.$disconnect();
        })
        .catch(async (e) => {
            console.error("Error seeding database", e);
            await prisma.$disconnect();
            process.exit(1);
        });
