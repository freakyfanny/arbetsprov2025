import request from 'supertest';
import app from './index';

// Mocking `import.meta` for Jest tests
beforeAll(() => {
  (globalThis as any).import = {
    meta: {
      url: `file://${process.cwd()}/src/server/index.ts`,
    },
  };
});

describe('Application API', () => {
  it('should create a new application', async () => {
    const newApplication = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      activities: ['Football', 'Swimming', 'Basketball'],
    };

    const response = await request(app).post('/applications/create').send(newApplication);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Ansökan sparad!');
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.name).toBe(newApplication.name);
  });

  it('should fetch all applications', async () => {
    const response = await request(app).get('/applications/get');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    if (response.body.length > 0) {
      expect(response.body[0]).toHaveProperty('name');
    }
  });

  it('should fetch a specific application by ID', async () => {
    const newApplication = {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      activities: ['Running', 'Cycling', 'Reading'],
    };

    const createResponse = await request(app).post('/applications/create').send(newApplication);

    const createdAppId = createResponse.body.data.id;

    const response = await request(app).get(`/application/${createdAppId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', createdAppId);
    expect(response.body.activities).toEqual(expect.arrayContaining(newApplication.activities));
  });

  it('should return 404 if application is not found by ID', async () => {
    const invalidId = 'nonexistent-id';

    const response = await request(app).get(`/application/${invalidId}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Ansökan hittades inte');
  });

  it('should return an error if the application data is invalid', async () => {
    const invalidApplication = {
      name: '',
      email: 'notanemail',
      activities: ['Football'],
    };

    const response = await request(app).post('/applications/create').send(invalidApplication);

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors.name).toBeDefined();
    expect(response.body.errors.email).toBeDefined();
    expect(response.body.errors.activities).toBeDefined();
  });
});
