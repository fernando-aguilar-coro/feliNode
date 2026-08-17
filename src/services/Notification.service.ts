import notifee, { TriggerType, TimestampTrigger } from '@notifee/react-native';
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
            await notifee.requestPermission();

            await notifee.cancelTriggerNotifications(['streak-reminder-23']);

            if (currentStreak === 0 || !lastActiveDate) return;

            const now = new Date();
            const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

            // Solo notificar si NO jugaron hoy (streak en riesgo esta noche)
            if (lastActiveDate === todayStr) return;

            const target = new Date();
            target.setHours(23, 0, 0, 0);

            if (now.getTime() >= target.getTime()) return;

            const channelId = await notifee.createChannel({
                id: 'streak-reminders',
                name: i18n.t('notificationService.channelName'),
                sound: 'default',
            });

            const messages = i18n.t('notificationService.danger', { returnObjects: true }) as { title: string; body: string }[];
            const msg = messages[Math.floor(Math.random() * messages.length)];

            const midnight = new Date(target);
            midnight.setHours(24, 0, 0, 0);

            const trigger: TimestampTrigger = {
                type: TriggerType.TIMESTAMP,
                timestamp: target.getTime(),
            };

            await notifee.createTriggerNotification(
                {
                    id: 'streak-reminder-23',
                    title: msg.title,
                    body: msg.body,
                    android: {
                        channelId,
                        smallIcon: 'ic_launcher',
                        showChronometer: true,
                        chronometerDirection: 'down',
                        timestamp: midnight.getTime(),
                        pressAction: { id: 'default' },
                    },
                },
                trigger,
            );
        } catch (error) {
            console.error('[NotificationService] Error scheduling notification:', error);
        }
    },
};