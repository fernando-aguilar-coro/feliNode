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

            // 3. Cancel any existing streak reminders scheduled previously
            await notifee.cancelTriggerNotifications(['streak-reminder-18', 'streak-reminder-23']);

            if (currentStreak === 0 || !lastActiveDate) {
                return; // Nothing to protect, so no need for a reminder
            }

            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const todayStr = `${year}-${month}-${day}`;

            // 4. Set the trigger times to 18:00 (6 PM) and 23:00 (11 PM)
            const targetDate18 = new Date();
            targetDate18.setHours(18, 0, 0, 0);

            const targetDate23 = new Date();
            targetDate23.setHours(23, 0, 0, 0);

            if (lastActiveDate === todayStr) {
                // They already played today, so their streak is safe for today.
                // The next risk is tomorrow, so we warn them tomorrow.
                targetDate18.setDate(targetDate18.getDate() + 1);
                targetDate23.setDate(targetDate23.getDate() + 1);
            } else {
                // They haven't played today, so they need to play by tonight.
            }

            // 5. Schedule 18:00 Notification if it's in the future
            if (now.getTime() < targetDate18.getTime()) {
                const trigger18: TimestampTrigger = {
                    type: TriggerType.TIMESTAMP,
                    timestamp: targetDate18.getTime(),
                };

                await notifee.createTriggerNotification(
                    {
                        id: 'streak-reminder-18',
                        title: '¡Es hora de practicar! 📚',
                        body: `Tienes una racha de ${currentStreak} días. ¡Haz una lección ahora para que no afecte a tus protectores!`,
                        android: {
                            channelId,
                            smallIcon: 'ic_launcher', // Usa el ícono de la app
                            pressAction: {
                                id: 'default',
                            },
                        },
                    },
                    trigger18,
                );

            }

            // 6. Schedule 23:00 Warning Notification if it's in the future
            if (now.getTime() < targetDate23.getTime()) {
                const midnightDate = new Date(targetDate23);
                midnightDate.setHours(24, 0, 0, 0); // Midnight of the same day

                const trigger23: TimestampTrigger = {
                    type: TriggerType.TIMESTAMP,
                    timestamp: targetDate23.getTime(),
                };

                await notifee.createTriggerNotification(
                    {
                        id: 'streak-reminder-23',
                        title: '¡No pierdas tu racha! 🔥',
                        body: 'Solo queda una hora para medianoche. ¡Completa una lección ahora mismo!',
                        android: {
                            channelId,
                            smallIcon: 'ic_launcher', // Usa el ícono de la app
                            showChronometer: true,
                            chronometerDirection: 'down',
                            timestamp: midnightDate.getTime(),
                            pressAction: {
                                id: 'default',
                            },
                        },
                    },
                    trigger23,
                );

            }
        } catch (error) {
            console.error('[NotificationService] Error scheduling notification:', error);
        }
    }
};
