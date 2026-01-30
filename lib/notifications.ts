// Notification system for events and other app notifications
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { sendBatchEmails } from "./emailService"
import {
    generateEventInvitationEmail,
    generateEventInvitationEmailText
} from "./emailTemplates"

interface EventData {
    id: string
    title: string
    description: string
    date: any
    location: string
    invitees: string[]
}

export async function sendEventInvitations(event: EventData): Promise<{ sent: number; failed: number }> {
    try {
        // Fetch invitee details
        const inviteeEmails: Array<{ email: string; name: string; userId: string }> = []

        for (const userId of event.invitees) {
            const userQuery = query(collection(db, "users"), where("uid", "==", userId))
            const userSnapshot = await getDocs(userQuery)

            if (!userSnapshot.empty) {
                const userData = userSnapshot.docs[0].data()
                inviteeEmails.push({
                    email: userData.email,
                    name: userData.displayName || "User",
                    userId: userId
                })
            }
        }

        // Format event date
        const eventDate = event.date.toDate ? event.date.toDate() : new Date(event.date)
        const formattedDate = eventDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })

        const eventLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/events/${event.id}`

        // Prepare emails
        const emails = inviteeEmails.map(invitee => ({
            to: invitee.email,
            subject: `You're invited: ${event.title}`,
            html: generateEventInvitationEmail(
                invitee.name,
                event.title,
                formattedDate,
                event.location,
                event.description,
                eventLink
            ),
            text: generateEventInvitationEmailText(
                invitee.name,
                event.title,
                formattedDate,
                event.location,
                event.description,
                eventLink
            )
        }))

        // Send batch emails
        const result = await sendBatchEmails(emails)

        // Create in-app notifications for all invitees
        const notificationPromises = inviteeEmails.map(invitee =>
            addDoc(collection(db, "notifications"), {
                userId: invitee.userId,
                type: "event_invitation",
                title: `You're invited: ${event.title}`,
                message: `${event.title} on ${formattedDate} at ${event.location}`,
                eventId: event.id,
                read: false,
                createdAt: serverTimestamp()
            })
        )

        await Promise.all(notificationPromises)

        console.log(`Event invitations sent: ${result.sent} successful, ${result.failed} failed`)
        return result
    } catch (error) {
        console.error("Error sending event invitations:", error)
        return { sent: 0, failed: event.invitees.length }
    }
}

// Create in-app notification
export async function createNotification(
    userId: string,
    type: string,
    title: string,
    message: string,
    metadata?: Record<string, any>
): Promise<boolean> {
    try {
        await addDoc(collection(db, "notifications"), {
            userId,
            type,
            title,
            message,
            ...metadata,
            read: false,
            createdAt: serverTimestamp()
        })
        return true
    } catch (error) {
        console.error("Error creating notification:", error)
        return false
    }
}
