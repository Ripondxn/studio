
'use server';

import { z } from 'zod';
import { promises as fs } from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

// This file contains a placeholder for email sending logic.
// In a real application, you would integrate a service like SendGrid, AWS SES, or similar.

async function readData(filePath: string) {
    try {
        await fs.access(filePath);
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

export async function getRecipients(): Promise<{ value: string, label: string }[]> {
    const tenants = await readData(path.join(process.cwd(), 'src/app/tenancy/tenants/tenants-data.json'));
    const landlords = await readData(path.join(process.cwd(), 'src/app/landlord/landlords-data.json'));
    const customers = await readData(path.join(process.cwd(), 'src/app/tenancy/customer/customers-data.json'));
    const vendors = await readData(path.join(process.cwd(), 'src/app/vendors/vendors-data.json'));

    const recipientList = [
        ...tenants.map((t: any) => ({ value: t.tenantData.email, label: `${t.tenantData.name} (Tenant)` })),
        ...landlords.map((l: any) => ({ value: l.landlordData.email, label: `${l.landlordData.name} (Landlord)` })),
        ...customers.map((c: any) => ({ value: c.customerData.email, label: `${c.customerData.name} (Customer)` })),
        ...vendors.map((v: any) => ({ value: v.vendorData.email, label: `${v.vendorData.name} (Vendor)` })),
    ];
    
    // Filter out recipients without a valid email and remove duplicates
    const uniqueRecipients = Array.from(new Map(recipientList.filter(r => r.value).map(item => [item.value, item])).values());

    return uniqueRecipients;
}


const formSchema = z.object({
  recipient: z.string().email(),
  subject: z.string(),
  body: z.string(),
});


export async function sendNotificationEmail(data: z.infer<typeof formSchema>) {
    const validation = formSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, error: 'Invalid data provided.' };
    }

    // In a real app, this is where you'd call the email service API.
    // We will simulate a successful send after a short delay.
    console.log('--- SIMULATING EMAIL SEND VIA GMAIL ---');
    console.log('To:', validation.data.recipient);
    console.log('Subject:', validation.data.subject);
    console.log('Body:', validation.data.body);
    console.log('------------------------------------');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if communication settings are configured
    try {
        const settingsPath = path.join(process.cwd(), 'src/app/admin/communication/settings.json');
        const settingsData = await fs.readFile(settingsPath, 'utf-8');
        const settings = JSON.parse(settingsData);
        if (!settings.gmailUser || !settings.gmailAppPassword) {
            return { success: false, error: 'Gmail user and App Password are not configured. Please add them in Communication Settings.' };
        }

        // Placeholder for actual Nodemailer API call
        // const transporter = nodemailer.createTransport({
        //   service: 'gmail',
        //   auth: {
        //     user: settings.gmailUser,
        //     pass: settings.gmailAppPassword,
        //   },
        // });
        // const mailOptions = {
        //   from: settings.gmailUser,
        //   to: validation.data.recipient,
        //   subject: validation.data.subject,
        //   html: validation.data.body.replace(/\\n/g, '<br>'),
        // };
        // await transporter.sendMail(mailOptions);

        return { success: true };

    } catch (error) {
        console.error("Email sending simulation failed:", error);
        return { success: false, error: (error as Error).message || 'Failed to send email.' };
    }
}
