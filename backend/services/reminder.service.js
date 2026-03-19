const moment = require('moment');
const { medicationModel, emailModel, immunizationModel } = require('../model/staffform.model');
const { childModel } = require('../model/childform.model');
const { adultModel } = require('../model/adultform.model');

const checkMedicationReminders = async () => {
    try {
        const now = moment();
        const currentTime24 = now.format("HH:mm");
        const currentTime12 = now.format("hh:mm A");

        // Fetch all medications to check time
        // In a large system, we'd use a more optimized query or a job queue.
        const medications = await medicationModel.find({});

        for (const med of medications) {
            // Normalize med.time to compare
            // Assuming med.time is stored as "HH:mm" or "hh:mm A"
            const medTime = med.time;

            if (medTime === currentTime24 || medTime === currentTime12) {
                console.log(`[Medication Reminder] Time reached for: ${med.name} at ${medTime}`);

                // 1. Determine the Ward (Child or Adult)
                let wardId = med.childId || med.adultId;
                if (!wardId) continue;

                let wardName = "Member";
                let parentId = null;
                let isChild = !!med.childId;

                if (isChild) {
                    const child = await childModel.findById(med.childId);
                    if (child) {
                        wardName = child.childname;
                        parentId = child.parentId;
                    }
                } else {
                    const adult = await adultModel.findById(med.adultId);
                    if (adult) {
                        wardName = adult.adultname;
                        parentId = adult.parentId;
                    }
                }

                // 2. Notify the Ward (Child/Adult)
                // Find their Validation account
                const wardAccount = await emailModel.findOne({ regid: wardId });
                if (wardAccount) {
                    const alreadyNotified = wardAccount.notifications?.some(n =>
                        n.type === 'medication_reminder' &&
                        moment(n.date).format('YYYY-MM-DD HH:mm') === now.format('YYYY-MM-DD HH:mm')
                    );

                    if (!alreadyNotified) {
                        await emailModel.findByIdAndUpdate(wardAccount._id, {
                            $push: {
                                notifications: {
                                    type: "medication_reminder",
                                    message: `Time to take your medication: ${med.name} (${med.dosage}). Instructions: ${med.instructions || 'Follow prescribed routine.'}`,
                                    date: new Date()
                                }
                            }
                        });
                    }
                }

                // 3. Notify the Guardian
                if (parentId) {
                    const parentAccount = await emailModel.findOne({ regid: parentId });
                    if (parentAccount) {
                        const alreadyNotifiedParent = parentAccount.notifications?.some(n =>
                            n.type === 'guardian_med_reminder' &&
                            moment(n.date).format('YYYY-MM-DD HH:mm') === now.format('YYYY-MM-DD HH:mm')
                        );

                        if (!alreadyNotifiedParent) {
                            await emailModel.findByIdAndUpdate(parentAccount._id, {
                                $push: {
                                    notifications: {
                                        type: "guardian_med_reminder",
                                        message: `Reminder: It is time for ${wardName} to take ${med.name} (${med.dosage}).`,
                                        date: new Date()
                                    }
                                }
                            });
                        }
                    }
                }
            }
        }
    } catch (err) {
        console.error("Error in medication reminder service:", err);
    }
};

const checkImmunizationReminders = async () => {
    try {
        const today = moment().startOf('day');
        const tomorrow = moment().add(1, 'days').startOf('day');

        // Fetch pending immunizations where nextDueDate is today or tomorrow
        const immunizations = await immunizationModel.find({
            status: { $ne: 'completed' },
            nextDueDate: {
                $gte: today.toDate(),
                $lte: tomorrow.endOf('day').toDate()
            }
        });

        for (const record of immunizations) {
            let wardId = record.childId || record.adultId;
            if (!wardId) continue;

            let wardName = "Member";
            let parentId = null;
            let isChild = !!record.childId;

            if (isChild) {
                const child = await childModel.findById(record.childId);
                if (child) {
                    wardName = child.childname;
                    parentId = child.parentId;
                }
            } else {
                const adult = await adultModel.findById(record.adultId);
                if (adult) {
                    wardName = adult.adultname;
                    parentId = adult.parentId;
                }
            }

            const isToday = moment(record.nextDueDate).isSame(today, 'day');
            const dueText = isToday ? "TODAY" : "TOMORROW";

            // 1. Notify the Recipient (Child/Adult)
            const wardAccount = await emailModel.findOne({ regid: wardId });
            if (wardAccount) {
                const alreadyNotifiedWard = wardAccount.notifications?.some(n =>
                    n.type === 'immunization_alert' &&
                    n.message.includes(record.vaccineName) &&
                    moment(n.date).isSame(moment(), 'day')
                );

                if (!alreadyNotifiedWard) {
                    await emailModel.findByIdAndUpdate(wardAccount._id, {
                        $push: {
                            notifications: {
                                type: "immunization_alert",
                                message: `🛡️ DEFENSE ALERT: Your ${record.vaccineName} dose is due ${dueText}!`,
                                date: new Date()
                            }
                        }
                    });
                }
            }

            // 2. Notify the Guardian
            if (parentId) {
                const parentAccount = await emailModel.findOne({ regid: parentId });
                if (parentAccount) {
                    const alreadyNotifiedParent = parentAccount.notifications?.some(n =>
                        n.type === 'immunization_alert' &&
                        n.message.includes(record.vaccineName) &&
                        n.message.includes(wardName) &&
                        moment(n.date).isSame(moment(), 'day')
                    );

                    if (!alreadyNotifiedParent) {
                        await emailModel.findByIdAndUpdate(parentAccount._id, {
                            $push: {
                                notifications: {
                                    type: "immunization_alert",
                                    message: `🛡️ IMMUNIZATION DUE ${dueText}: ${record.vaccineName} for ${wardName}. Target Date: ${moment(record.nextDueDate).format('MMM DD, YYYY')}`,
                                    date: new Date()
                                }
                            }
                        });
                    }
                }
            }
        }
    } catch (err) {
        console.error("Error in immunization reminder service:", err);
    }
};

// Run every minute (for meds) and every hour (for immunizations)
const startMedicationReminders = () => {
    console.log("Health Reminder Service Started...");

    // Check medications every minute
    setInterval(checkMedicationReminders, 60000);

    // Check immunizations every hour (less critical frequency)
    setInterval(checkImmunizationReminders, 3600000);

    // Run once immediately on start
    checkMedicationReminders();
    checkImmunizationReminders();
};

module.exports = { startMedicationReminders };
