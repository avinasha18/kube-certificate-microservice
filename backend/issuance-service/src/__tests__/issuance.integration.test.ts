import request from 'supertest';
import { App } from '../app';

describe('Issuance Service Integration Tests', () => {
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

  describe('POST /issue', () => {
    it('should issue a new credential successfully', async () => {
      const credential = {
        id: `test-cred-${Date.now()}`,
        name: 'John Doe',
        email: 'john@example.com'
      };

      const response = await request(server)
        .post('/issue')
        .send(credential)
        .expect(201);

      expect(response.body).toEqual({
        success: true,
        message: expect.stringContaining('Credential issued by worker-'),
        worker: expect.stringContaining('worker-'),
        issuedAt: expect.any(String)
      });
    });

    it('should return error if credential already exists', async () => {
      const credential = {
        id: 'test-cred-123',
        name: 'John Doe',
        email: 'john@example.com'
      };

      const response = await request(server)
        .post('/issue')
        .send(credential)
        .expect(200);

      expect(response.body).toEqual({
        success: false,
        message: 'Credential already issued'
      });
    });

    it('should return error if id is missing', async () => {
      const credential = {
        name: 'John Doe',
        email: 'john@example.com'
      };

      const response = await request(server)
        .post('/issue')
        .send(credential)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        message: expect.stringContaining('Invalid credential data')
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
