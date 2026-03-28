import notifee, { TriggerType, TimestampTrigger, IntervalTrigger, TimeUnit } from '@notifee/react-native';

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
            await notifee.cancelTriggerNotifications([
                'streak-reminder-18',
                'streak-reminder-23',
                'practice-reminder-4h',
                'practice-reminder-21',
                'practice-reminder-8h'
            ]);

            const getRandomMsg = (arr: { title: string, body: string }[]) => arr[Math.floor(Math.random() * arr.length)];

            const messages8h = [
                { title: '¡Momento de practicar! 📚', body: 'Solo unos minutos hoy pueden mejorar mucho tu inglés.' },
                { title: 'Pequeños pasos, gran progreso 🌟', body: 'Practica un poco ahora y sigue avanzando.' },
                { title: '¿Listo para tu inglés de hoy? 🤔', body: 'Nunca es tarde para aprender algo nuevo. ¡Empieza!' },
                { title: 'Tu meta está cerca 🗣️', body: 'Cada práctica te acerca a hablar con fluidez.' },
                { title: 'Constancia es la clave 🧠', body: 'Un poco cada día hace la diferencia. ¡Vamos!' },
                { title: 'No rompas la racha 🔥', body: 'Llevas buen progreso, ¡continúa hoy!' },
                { title: 'Un minuto cuenta ⏱️', body: 'Incluso una práctica corta suma. ¡Inténtalo ahora!' },
                { title: 'Tu futuro te lo agradecerá 💼', body: 'Aprender inglés abre muchas puertas. ¡Sigue practicando!' },
                { title: 'Hazlo parte de tu día 🌅', body: 'Convierte el inglés en un hábito diario.' },
                { title: 'Sigue avanzando 🚀', body: 'No importa si es poco, lo importante es no parar.' },
                { title: 'Hoy es buen día para aprender 📖', body: 'Tu próxima mejora en inglés empieza ahora.' },
                { title: 'Entrena tu mente 🧩', body: 'Practicar inglés también fortalece tu memoria.' },
                { title: 'Un paso más 💪', body: 'Cada sesión te hace mejor que ayer.' },
                { title: 'No lo dejes para mañana ⏳', body: 'Aprovecha este momento para practicar.' },
                { title: 'Hazlo divertido 🎯', body: 'Aprender inglés también puede ser entretenido.' },
                { title: '¿5 minutos? Eso basta ⌛', body: 'Un poco de práctica hoy es mejor que nada.' },
                { title: 'Tu inglés está creciendo 🌱', body: 'Sigue practicando para verlo florecer.' },
                { title: 'Desafío del día ⚡', body: 'Entra y completa tu práctica diaria.' },
                { title: 'Sigue construyendo tu habilidad 🏗️', body: 'Cada palabra nueva cuenta.' },
                { title: 'Tu versión bilingüe te espera 🌍', body: 'Da otro paso hoy.' },
                { title: '¡Hora de un repaso rápido! 🚀', body: 'Unos minutos de inglés hacen la diferencia.' },
                { title: 'Mantén tu mente fresca 🧠', body: '¿Qué te parece practicar un poco de inglés ahora?' },
                { title: 'Pequeños pasos, grandes logros 🌟', body: 'Es un buen momento para una lección corta.' },
                { title: '¡El inglés te espera! 🇬🇧', body: 'Sigue mejorando tus habilidades en este momento.' },
                { title: '¿Tienes un rato libre? ☕', body: 'Aprovecha para aprender algo nuevo en inglés.' }
            ];

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

            // Message banks
            const messages18 = [
                { title: '¡Es hora de practicar! 📚', body: `Tienes una racha de ${currentStreak} días. ¡Haz una lección ahora para que no afecte a tus protectores!` },
                { title: '¡Tu racha está en riesgo! 🚨', body: `Protege tu racha de ${currentStreak} días dedicando unos minutos al inglés.` },
                { title: 'El tiempo vuela ⏰', body: `Conserva tu racha de ${currentStreak} días practicando ahora.` },
                { title: '¡No te rindas! 💪', body: `Asegura tu racha de ${currentStreak} días con una lección corta.` },
            ];

            const messages23 = [
                { title: '¡No pierdas tu racha! 🔥', body: 'Solo queda una hora para medianoche. ¡Completa una lección ahora mismo!' },
                { title: 'Última oportunidad ⏳', body: 'Tu racha está a punto de reiniciarse. ¡Practica ya!' },
                { title: '¡Actúa rápido! ⚡', body: 'Queda muy poco para que termine el día. ¡Salva tu racha!' },
                { title: '¡Es ahora o nunca! 🏃', body: 'No dejes que el reloj te gane sin practicar hoy.' },
            ];



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
    },

    triggerTestNotification: async () => {
        try {
            await notifee.requestPermission();
            const channelId = await notifee.createChannel({
                id: 'streak-reminders',
                name: 'Recordatorios de Racha',
                sound: 'default'
            });

            const showDelayed = (title: string, body: string, id: string, delay: number) => {
                setTimeout(async () => {
                    await notifee.displayNotification({
                        id,
                        title,
                        body,
                        android: {
                            channelId,
                            smallIcon: 'ic_launcher',
                            pressAction: {
                                id: 'default',
                            },
                        },
                    });
                }, delay);
            };

            // Test notifications simulating the real ones
            showDelayed('¡Momento de practicar! 📚', 'Solo unos minutos hoy pueden mejorar mucho tu inglés.', 'test-8h', 100);
            showDelayed('¡Tu racha está en riesgo! 🚨', 'Protege tu racha de 7 días dedicando unos minutos al inglés.', 'test-18h', 2000); // 2s later
            showDelayed('Última oportunidad ⏳', 'Tu racha está a punto de reiniciarse. ¡Practica ya!', 'test-23h', 4000); // 4s later

        } catch (error) {
            console.error('[NotificationService] Error triggering test notification:', error);
        }
    }
};
