import notifee, { TriggerType, TimestampTrigger, IntervalTrigger, TimeUnit } from '@notifee/react-native';
import i18n from '../i18n';

export const NotificationService = {
    checkPermissions: async () => {
        const settings = await notifee.getNotificationSettings();
        return settings.authorizationStatus >= 1;
    },
    requestPermissions: async () => {
        const settings = await notifee.requestPermission();
        return settings.authorizationStatus >= 1;
    },
    cancelAllNotifications: async () => {
        await notifee.cancelAllNotifications();
    },
    scheduleStreakReminder: async (currentStreak: number, lastActiveDate: string | null) => {
        try {
            // 1. Request permissions (required for iOS and Android 13+)
            await notifee.requestPermission();

            // 2. Create a channel (required for Android)
            const channelId = await notifee.createChannel({
                id: 'streak-reminders',
                name: i18n.t('notificationService.channelName'),
                sound: 'default'
            });

            // 3. Cancel any existing streak reminders scheduled previously
            await notifee.cancelTriggerNotifications([
                'streak-reminder-18',
                'streak-reminder-23',
                'practice-reminder-4h',
                'practice-reminder-21',
                'practice-reminder-8h'
            ]);

            const getRandomMsg = (arr: { title: string, body: string }[]) => arr[Math.floor(Math.random() * arr.length)];

            // Get translated generic practice messages
            const messages8h = i18n.t('notificationService.practice', { returnObjects: true }) as { title: string, body: string }[];

            // 3.5 Schedule 8-hour repeating generic reminder independent of streaks
            const trigger8h: IntervalTrigger = {
                type: TriggerType.INTERVAL,
                interval: 8,
                timeUnit: TimeUnit.HOURS,
            };

            const msg8h = getRandomMsg(messages8h);

            await notifee.createTriggerNotification(
                {
                    id: 'practice-reminder-8h',
                    title: msg8h.title,
                    body: msg8h.body,
                    android: {
                        channelId,
                        smallIcon: 'ic_launcher',
                        pressAction: {
                            id: 'default',
                        },
                    },
                },
                trigger8h,
            );

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

            // Message banks from translations interpolating variables
            const messages18 = i18n.t('notificationService.risk', { streak: currentStreak, returnObjects: true }) as { title: string, body: string }[];
            const messages23 = i18n.t('notificationService.danger', { returnObjects: true }) as { title: string, body: string }[];



            // 5. Schedule 18:00 Notification if it's in the future
            if (now.getTime() < targetDate18.getTime()) {
                const trigger18: TimestampTrigger = {
                    type: TriggerType.TIMESTAMP,
                    timestamp: targetDate18.getTime(),
                };

                const msg18 = getRandomMsg(messages18);

                await notifee.createTriggerNotification(
                    {
                        id: 'streak-reminder-18',
                        title: msg18.title,
                        body: msg18.body,
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

                const msg23 = getRandomMsg(messages23);

                await notifee.createTriggerNotification(
                    {
                        id: 'streak-reminder-23',
                        title: msg23.title,
                        body: msg23.body,
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
