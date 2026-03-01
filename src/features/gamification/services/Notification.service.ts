import notifee, { TriggerType, TimestampTrigger } from '@notifee/react-native';

export const NotificationService = {
    scheduleStreakReminder: async (currentStreak: number, lastActiveDate: string | null) => {
        try {
            // 1. Request permissions (required for iOS and Android 13+)
            await notifee.requestPermission();

            // 2. Create a channel (required for Android)
            const channelId = await notifee.createChannel({
                id: 'streak-reminders',
                name: 'Recordatorios de Racha',
                sound: 'default'
            });

            // 3. Cancel any existing streak reminder scheduled previously
            await notifee.cancelTriggerNotifications(['streak-reminder']);

            if (currentStreak === 0 || !lastActiveDate) {
                return; // Nothing to protect, so no need for a reminder
            }

            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const todayStr = `${year}-${month}-${day}`;

            // 4. Set the trigger time to 23:00 (11 PM)
            const targetDate = new Date();
            targetDate.setHours(19, 0, 0, 0);

            if (lastActiveDate === todayStr) {
                // They already played today, so their streak is safe for today.
                // The next risk is tomorrow at midnight, so we warn them tomorrow at 23:00.
                targetDate.setDate(targetDate.getDate() + 1);
            } else {
                // They haven't played today, so they need to play by tonight.
                if (now.getTime() > targetDate.getTime()) {
                    // It's already past 23:00 today. Trying to schedule in the past will just fire immediately or fail.
                    // Let's just skip it because they only have less than an hour anyway.
                    return;
                }
            }

            // 5. Create a time-based trigger
            const trigger: TimestampTrigger = {
                type: TriggerType.TIMESTAMP,
                timestamp: targetDate.getTime(),
            };

            // 6. Schedule the notification
            await notifee.createTriggerNotification(
                {
                    id: 'streak-reminder',
                    title: '¡No pierdas tu racha! 🔥',
                    body: 'Solo queda una hora para medianoche. ¡Completa una lección para mantener tu racha viva!',
                    android: {
                        channelId,
                        pressAction: {
                            id: 'default',
                        },
                    },
                },
                trigger,
            );
            console.log('[NotificationService] Scheduled streak reminder for', targetDate.toLocaleString());
        } catch (error) {
            console.error('[NotificationService] Error scheduling notification:', error);
        }
    }
};
