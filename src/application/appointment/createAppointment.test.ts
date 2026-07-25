import { describe, it, expect } from 'vitest';
import { createAppointment } from './createAppointment';
import { CreateAppointmentData } from '@/domain/appointment/AppointmentRepository';
import { InMemoryAppointmentRepository } from '@/infrastructure/appointment/InMemoryAppointmentRepository';

describe('createAppointment', () => {
    it('crée un rendez-vous avec le statut "pending" et les informations fournies', async () => {
        const repository = new InMemoryAppointmentRepository();
        const data: CreateAppointmentData = {
            date: new Date('2026-08-15'),
            time: '14:00',
            customerName: 'Camille Martin',
            customerPhone: '0612345678',
            notes: 'Amigurumi personnalisé, taille M',
        };

        const appointment = await createAppointment(repository, data);

        expect(appointment.status).toBe('pending');
        expect(appointment.customerName).toBe('Camille Martin');
        expect(appointment.customerPhone).toBe('0612345678');
        expect(appointment.notes).toBe('Amigurumi personnalisé, taille M');
        expect(appointment.date).toEqual(data.date);
        expect(appointment.time).toBe('14:00');
    });

    it('génère un identifiant unique pour chaque rendez-vous créé', async () => {
        const repository = new InMemoryAppointmentRepository();
        const data: CreateAppointmentData = {
            date: new Date('2026-08-15'),
            time: '14:00',
            customerName: 'Camille Martin',
            customerPhone: '0612345678',
            notes: '',
        };

        const first = await createAppointment(repository, data);
        const second = await createAppointment(repository, data);

        expect(first.id).not.toBe(second.id);
    });
});