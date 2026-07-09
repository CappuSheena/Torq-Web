// Mock bike data for the Profile screen.
// There is no bikes API yet (see Docs/CLAUDE.md build order, step 3 — bike
// CRUD hasn't been built), so this stands in for `GET /api/bikes` until that
// exists. Shape mirrors the `bikes` table columns so swapping in real data
// later should just mean replacing this import with a fetch call.
export const mockBikes = [
  {
    id: 1,
    make: 'Triumph',
    model: 'Street Triple 765 R',
    year: 2020,
    mileage: 8342,
    lastServiceDate: '2026-03-14',
    // Dates picked relative to "today" (2026-07-09 at time of writing) so the
    // due-soon colouring in BikeCard has something to actually demonstrate.
    motDate: '2026-08-02', // ~3 weeks out — should show as due soon
    taxDate: '2026-12-01',
    insuranceDate: '2027-01-15',
    lastSyncedAt: '2026-06-20T10:00:00Z',
    specs: { engine: '765cc inline-3', power: '118 bhp', torque: '77 Nm', kerbWeight: '188 kg' },
  },
  {
    id: 2,
    make: 'Honda',
    model: 'CB650R',
    year: 2019,
    mileage: 15200,
    lastServiceDate: '2025-11-02',
    motDate: '2027-02-02',
    taxDate: '2026-07-20', // ~11 days out — should show as due soon
    insuranceDate: '2026-12-05',
    lastSyncedAt: '2026-05-02T09:30:00Z',
    specs: { engine: '649cc inline-4', power: '94 bhp', torque: '64 Nm', kerbWeight: '202 kg' },
  },
];
