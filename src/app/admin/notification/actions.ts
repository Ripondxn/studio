
'use server';

import { z } from 'zod';
import { promises as fs } from 'fs';
import path from 'path';

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
    
    // Filter out recipients without a valid email
    return recipientList.filter(r => r.value);
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

    // In a real app, this is where you'd call the SendGrid/Twilio API.
    // We will simulate a successful send after a short delay.
    console.log('--- SIMULATING EMAIL SEND ---');
    console.log('To:', validation.data.recipient);
    console.log('Subject:', validation.data.subject);
    console.log('Body:', validation.data.body);
    console.log('-----------------------------');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if communication settings are configured
    try {
        const settingsPath = path.join(process.cwd(), 'src/app/admin/communication/settings.json');
        const settingsData = await fs.readFile(settingsPath, 'utf-8');
        const settings = JSON.parse(settingsData);
        if (!settings.sendgridApiKey) {
            return { success: false, error: 'SendGrid API key is not configured. Please add it in Communication Settings.' };
        }

        // Placeholder for actual SendGrid API call
        // const sgMail = require('@sendgrid/mail');
        // sgMail.setApiKey(settings.sendgridApiKey);
        // const msg = {
        //   to: validation.data.recipient,
        //   from: 'no-reply@yourdomain.com', // This should be a verified sender in SendGrid
        //   subject: validation.data.subject,
        //   html: validation.data.body.replace(/\n/g, '<br>'),
        // };
        // await sgMail.send(msg);

        return { success: true };

    } catch (error) {
        console.error("Email sending simulation failed:", error);
        return { success: false, error: (error as Error).message || 'Failed to send email.' };
    }
}
