import request from 'supertest';
import { App } from '../app';

describe('Verification Service Integration Tests', () => {
  let app: App;
  let server: any;

  beforeAll(async () => {
    app = new App();
    await app.initialize();
    server = app.getApp();
  });

  afterAll(async () => {
    // Cleanup if needed
  });

  describe('POST /verify', () => {
    it('should return invalid for non-existing credential', async () => {
      const credential = { id: 'non-existing-cred' };

      const response = await request(server)
        .post('/verify')
        .send(credential)
        .expect(200);

      expect(response.body).toEqual({
        valid: false
      });
    });

    it('should return error for invalid credential format', async () => {
      const response = await request(server)
        .post('/verify')
        .send(undefined)
        .expect(200);

      expect(response.body).toEqual({
        valid: false,
        message: 'Invalid credential format'
      });
    });

    it('should return invalid for empty object', async () => {
      const response = await request(server)
        .post('/verify')
        .send({})
        .expect(200);

      expect(response.body).toEqual({
        valid: false,
        message: 'Invalid credential format'
      });
    });
  });

  describe('POST /sync-credential', () => {
    it('should sync credential successfully', async () => {
      const syncData = {
        id: 'sync-test-123',
        data: '{"id":"sync-test-123","name":"Sync Test"}',
        issuedAt: '2025-10-07T04:37:13.744Z',
        worker: 'worker-local'
      };

      const response = await request(server)
        .post('/sync-credential')
        .send(syncData)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'Credential synced successfully'
      });
    });

    it('should return error for invalid sync data', async () => {
      const response = await request(server)
        .post('/sync-credential')
        .send({})
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        message: 'Invalid sync data'
      });
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(server)
        .get('/health')
        .expect(200);

      expect(response.body).toEqual({
        status: 'ok',
        worker: expect.stringContaining('worker-')
      });
    });
  });
});
