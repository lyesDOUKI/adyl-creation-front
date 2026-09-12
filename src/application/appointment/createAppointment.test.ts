import { describe, it, expect } from 'vitest';
import { createAppointment } from './createAppointment';
import { CreateAppointmentData } from '@/domain/appointment/AppointmentRepository';
import { InMemoryAppointmentRepository } from '@/infrastructure/appointment/InMemoryAppointmentRepository';

const buildSlot = () => ({
    start: new Date('2026-08-15T14:00:00.000Z'),
    end: new Date('2026-08-15T15:00:00.000Z'),
});

describe('createAppointment', () => {
    it('crée un rendez-vous avec le statut "SUBMITTED" et les informations fournies', async () => {
        const repository = new InMemoryAppointmentRepository();
        const slot = buildSlot();

        const data: CreateAppointmentData = {
            slot,
            customerName: 'Camille Martin',
            customerPhone: '0612345678',
            notes: 'Amigurumi personnalisé, taille M',
        };

        const appointment = await createAppointment(repository, data);

        expect(appointment.status).toBe('SUBMITTED');
        expect(appointment.notes).toBe('Amigurumi personnalisé, taille M');
        expect(appointment.slot.start).toEqual(slot.start);
        expect(appointment.slot.end).toEqual(slot.end);
    });

    it('génère un identifiant unique pour chaque rendez-vous créé', async () => {
        const repository = new InMemoryAppointmentRepository();
        const slot = buildSlot();

        const data: CreateAppointmentData = {
            slot,
            customerName: 'Camille Martin',
            customerPhone: '0612345678',
            notes: '',
        };

        const first = await createAppointment(repository, data);
        const second = await createAppointment(repository, data);

        expect(first.id).not.toBe(second.id);
    });
});